package org.acme;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "user_names")
public class UserName extends PanacheEntity {

    @NotBlank // Ensures the name is not empty
    public String name;

    public UserName() {
    }

    public UserName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return name;
    }
}
