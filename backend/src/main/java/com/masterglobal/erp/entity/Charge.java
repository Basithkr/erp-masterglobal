package com.masterglobal.erp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Charge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String billNumber;
    private String chargeCode;

    private Integer qty;
    private Double saleRate;
    private Double costRate;

    private Double saleAmount;
    private Double costAmount;

    private Double vatPercent;
    private Double vatSale;
    private Double vatCost;

    private Double totalSale;
    private Double totalCost;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore   // ✅ THIS FIXES THE INFINITE JSON
    private Order order;
}
