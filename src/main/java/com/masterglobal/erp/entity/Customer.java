package com.masterglobal.erp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Data
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Customer code is required")
    @Column(unique = true)
    private String code;

    @NotBlank(message = "Customer name is required")
    private String name;

    private String phone;

    @Email(message = "Invalid email format")
    private String email;

    private String country;
    private String city;
    private String state;
    private String salesPerson;
}
