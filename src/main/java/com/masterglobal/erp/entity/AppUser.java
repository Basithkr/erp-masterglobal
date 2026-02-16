package com.masterglobal.erp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    private String password; // store encoded later
    private String role; // ADMIN, USER
}

