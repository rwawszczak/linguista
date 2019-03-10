package linguista.webserver.controller;

import linguista.webserver.exception.AppException;
import linguista.webserver.model.Role;
import linguista.webserver.model.User;
import linguista.webserver.payload.ApiResponse;
import linguista.webserver.payload.CreateRequest;
import linguista.webserver.repository.RoleRepository;
import linguista.webserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.nio.charset.Charset;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UsersController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateRequest createRequest) {
        if(userRepository.existsByEmail(createRequest.getEmail())) {
            return new ResponseEntity(new ApiResponse(false, "Email Address already in use!"),
                    HttpStatus.BAD_REQUEST);
        }
        Role role = roleRepository.findById(createRequest.getRoleId())
                .orElseThrow(() -> new AppException("User Role do not exist."));
        if(!role.getName().isAvailable()) {
            return new ResponseEntity(new ApiResponse(false, "Selected role is not available for assignment.!"),
                    HttpStatus.BAD_REQUEST);
        }

        // Creating user's account
        String temporaryPassword = generateTemporaryPassword();
        User user = new User(createRequest.getEmail(), temporaryPassword);
        user.setTemporaryPassword(temporaryPassword);
        user.setTemporary(true);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Collections.singleton(role));
        user.setUid(UUID.randomUUID().toString());
        User result = userRepository.save(user);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/users/{username}")
                .buildAndExpand(result.getEmail()).toUri(); //TODO: what it does?

        return ResponseEntity.created(location).body(new ApiResponse(true, "User created successfully"));
    }

    private String generateTemporaryPassword() {
        StringBuilder password = new StringBuilder();
        for(int i = 0; i < 10; i++){
            int charIndex = new Random().nextInt(125 - 33) + 33;
            password.append((char) charIndex);

        }
        return password.toString();
    }

}