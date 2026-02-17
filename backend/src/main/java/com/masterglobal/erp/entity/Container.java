package com.masterglobal.erp.entity;

import jakarta.persistence.*;

@Entity
public class Container {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String billNumber;
    private String containerNumber;
    private String sealNumber;
    private Double weight;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
}
