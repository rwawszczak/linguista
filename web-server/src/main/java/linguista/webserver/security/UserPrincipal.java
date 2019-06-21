package linguista.webserver.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import linguista.webserver.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class UserPrincipal implements UserDetails {
    private String uid;
    @JsonIgnore
    private String email;
    @JsonIgnore
    private String password;
    private boolean isTemporary;
    private Collection<? extends GrantedAuthority> authorities;

    private UserPrincipal(String uid, String email, String password, boolean isTemporary, Collection<? extends GrantedAuthority> authorities) {
        this.uid = uid;
        this.email = email;
        this.password = password;
        this.isTemporary = isTemporary;
        this.authorities = authorities;
    }

    public static UserPrincipal create(User user) {
        List<GrantedAuthority> authorities = user.getRoles().stream().map(role ->
                new SimpleGrantedAuthority(role.getName().name())
        ).collect(Collectors.toList());

        return new UserPrincipal(
                user.getUid(),
                user.getEmail(),
                user.getPassword(),
                user.isTemporary(),
                authorities
        );
    }

    public String getUid() {
        return uid;
    }

    public String getUsername() {
        return email;
    }

    public String getEmail() {
        return email;
    }

    public boolean isTemporary() {
        return isTemporary;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hash(uid);
    }
}
