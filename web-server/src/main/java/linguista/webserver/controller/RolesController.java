package linguista.webserver.controller;

import linguista.webserver.model.Role;
import linguista.webserver.model.RoleName;
import linguista.webserver.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/api/roles")
public class RolesController {
    @Autowired
    private RoleRepository roleRepository;

    @GetMapping("/getAvailable")
    public ResponseEntity<?> getRoles() {
        Iterable<Role> allRoles = roleRepository.findAll();
        List<Role> availableRoles = StreamSupport.stream(allRoles.spliterator(), false)
                .filter(role -> role.getName().isAvailable()).collect(Collectors.toList());

        return ResponseEntity.ok(availableRoles);
    }

}