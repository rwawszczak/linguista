package linguista.webserver.service;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.hibernate.query.NativeQuery;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.UUID;

@RunWith(SpringJUnit4ClassRunner.class)
public class AdminUserDataLoader {

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Test
    public void loadUser() {
        SessionFactory sessionFactory;
        try {
            Configuration config = new Configuration();
            sessionFactory = config.configure().buildSessionFactory();
        } catch (Throwable e) {
            System.err.println("Error in creating SessionFactory object."
                    + e.getMessage());
            throw new ExceptionInInitializerError(e);
        }

        String uid = UUID.randomUUID().toString();

        Session session = sessionFactory.openSession();
        Transaction transaction = session.beginTransaction();
        NativeQuery query = session.createSQLQuery("INSERT INTO user VALUES (:uid, :name, :phone_number, :email, :password, :temporary_password, :temporary, :created)");
        query.setParameter("uid", uid);
        query.setParameter("name", null);
        query.setParameter("phone_number", null);
        query.setParameter("email", "admin");
        query.setParameter("password", passwordEncoder.encode("admin"));
        query.setParameter("temporary_password", null);
        query.setParameter("temporary", false);
        query.setParameter("created", null);
        query.executeUpdate();

        NativeQuery query2 = session.createSQLQuery("INSERT INTO user_roles VALUES (:uid, :roleId)");
        query2.setParameter("uid", uid);
        query2.setParameter("roleId", "3");
        query2.executeUpdate();
        transaction.commit();

    }
}