package linguista.webserver.model;

public enum RoleName {
    ROLE_STUDENT(true),
    ROLE_LECTURER(true),
    ROLE_ADMIN(false);

    private boolean available;

    RoleName(boolean available) {

        this.available = available;
    }

    public boolean isAvailable() {
        return available;
    }
}