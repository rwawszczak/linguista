package linguista.webserver.controller;

import linguista.webserver.exception.AppException;
import linguista.webserver.model.User;
import linguista.webserver.payload.JwtAuthenticationResponse;
import linguista.webserver.payload.LoginRequest;
import linguista.webserver.payload.PasswordChangeRequest;
import linguista.webserver.repository.UserRepository;
import linguista.webserver.security.JwtTokenProvider;
import linguista.webserver.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        JwtAuthenticationResponse response = new JwtAuthenticationResponse(jwt);
        response.setAuthorities(((UserPrincipal) authentication.getPrincipal()).getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
        response.setTemporary(((UserPrincipal) authentication.getPrincipal()).isTemporary());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/changePassword")
    public ResponseEntity<?> changePassword(@Valid @RequestBody PasswordChangeRequest passwordChangeRequest) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        User user = userRepository.findByUid(userPrincipal.getUid()).orElseThrow(() -> {
            logger.error("Could not find the user with email: " + userPrincipal.getEmail() + " by uid: " + userPrincipal.getUid());
            return new AppException("No user found by uid");
        });

        if (isOldPasswordCorrect(passwordChangeRequest, user)) {
            changePasswordAndActivate(passwordChangeRequest, user);
            return ResponseEntity.ok(HttpStatus.OK);
        } else {
            return ResponseEntity.badRequest().body("Old password is incorrect.");
        }
    }

    private boolean isOldPasswordCorrect(@RequestBody @Valid PasswordChangeRequest passwordChangeRequest, User user) {
        return passwordEncoder.matches(passwordChangeRequest.getOldPassword(), user.getPassword());
    }

    private void changePasswordAndActivate(@RequestBody @Valid PasswordChangeRequest passwordChangeRequest, User user) {
        user.setPassword(passwordEncoder.encode(passwordChangeRequest.getNewPassword()));
        user.setTemporary(false);
        user.setTemporaryPassword(null);
        userRepository.save(user);
    }
}