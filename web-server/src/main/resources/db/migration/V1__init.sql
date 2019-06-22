CREATE TABLE user(
uid VARCHAR(255) UNIQUE,
name VARCHAR(255) UNIQUE,
phone_number VARCHAR(255) UNIQUE,
email VARCHAR(255) UNIQUE,
password  VARCHAR(255),
temporary_password  VARCHAR(255),
temporary BOOLEAN,
created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (uid));

CREATE TABLE role(
id BIGINT(20) NOT NULL AUTO_INCREMENT,
name VARCHAR(255),
PRIMARY KEY (id));

CREATE TABLE user_roles (
  user_uid VARCHAR(255) NOT NULL,
  role_id BIGINT(20) NOT NULL,
  PRIMARY KEY (user_uid, role_id),
  KEY fk_user_roles_role_id (role_id),
  CONSTRAINT fk_user_roles_role_id FOREIGN KEY (role_id) REFERENCES role (id),
  CONSTRAINT fk_user_roles_user_id FOREIGN KEY (user_uid) REFERENCES user (uid)
);
INSERT INTO role(name) VALUES ('ROLE_STUDENT');
INSERT INTO role(name) VALUES ('ROLE_LECTURER');
INSERT INTO role(name) VALUES ('ROLE_ADMIN');