package linguista.webserver.controller;

import linguista.webserver.exception.AppException;
import linguista.webserver.model.Role;
import linguista.webserver.model.User;
import linguista.webserver.payload.ApiResponse;
import linguista.webserver.payload.CreateRequest;
import linguista.webserver.repository.RoleRepository;
import linguista.webserver.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UsersController {
    private static final Logger logger = LoggerFactory.getLogger(UsersController.class);

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getAll")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateRequest createRequest) {
        if (userRepository.existsByEmail(createRequest.getEmail())) {
            return new ResponseEntity<>(new ApiResponse(false, "Email Address already in use!"),
                    HttpStatus.BAD_REQUEST);
        }
        Role role = roleRepository.findById(createRequest.getRoleId())
                .orElseThrow(() -> new AppException("User Role do not exist."));
        if (!role.getName().isAvailable()) {
            return new ResponseEntity<>(new ApiResponse(false, "Selected role is not available for assignment.!"),
                    HttpStatus.BAD_REQUEST);
        }

        // Creating user's account
        String temporaryPassword = generateTemporaryPassword();
        User user = new User(createRequest.getEmail(), temporaryPassword);
        setTemporary(user, temporaryPassword);
        user.setRoles(Collections.singleton(role));
        user.setUid(UUID.randomUUID().toString());
        User result = userRepository.save(user);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/users/{username}")
                .buildAndExpand(result.getEmail()).toUri(); //TODO: what it does?

        return ResponseEntity.created(location).body(new ApiResponse(true, "User created successfully"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/resetPassword")
    public ResponseEntity<User> resetPassword(@RequestParam String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            logger.error("Could not find the user with email: " + email);
            return new AppException("No user found by email");
        });
        setTemporary(user, generateTemporaryPassword());
        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }

    private void setTemporary(User user, String temporaryPassword) {
        user.setTemporaryPassword(temporaryPassword);
        user.setTemporary(true);
        user.setPassword(passwordEncoder.encode(temporaryPassword));
    }

    private String generateTemporaryPassword() {
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            int charIndex = new Random().nextInt(125 - 33) + 33;
            password.append((char) charIndex);

        }
        return password.toString();
    }

}