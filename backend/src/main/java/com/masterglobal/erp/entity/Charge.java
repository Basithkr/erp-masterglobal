package com.masterglobal.erp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
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

    @NotNull
    private String chargeCode;

    @NotNull
    @Min(1)
    private Integer qty;

    @NotNull
    @Min(0)
    private Double saleRate;

    @NotNull
    @Min(0)
    private Double costRate;

    // ===== Calculated fields (BACKEND WILL SET) =====
    @Column(nullable = false)
    private Double saleAmount;

    @Column(nullable = false)
    private Double costAmount;

    @NotNull
    @Min(0)
    @Max(100)
    private Double vatPercent;

    @Column(nullable = false)
    private Double vatSale;

    @Column(nullable = false)
    private Double vatCost;

    @Column(nullable = false)
    private Double totalSale;

    @Column(nullable = false)
    private Double totalCost;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Order order;
}
