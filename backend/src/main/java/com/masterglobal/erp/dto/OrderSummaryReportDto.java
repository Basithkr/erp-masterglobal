package com.masterglobal.erp.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class OrderSummaryReportDto {

    private String orderNumber;
    private LocalDate executionDate;
    private String customerName;

    private Double totalSales;
    private Double totalCost;
    private Double totalSaleVat;
    private Double totalCostVat;
    private Double netAmount;
}
