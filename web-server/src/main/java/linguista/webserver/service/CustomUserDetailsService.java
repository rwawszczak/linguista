package linguista.webserver.service;

import linguista.webserver.model.User;
import linguista.webserver.repository.UserRepository;
import linguista.webserver.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email : " + email)
                );
        return UserPrincipal.create(user);
    }

    public UserDetails loadUserByUid(String userUid) {
        User user = userRepository.findByUid(userUid)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with username or email : " + userUid)
                );
        return UserPrincipal.create(user);
    }
}
