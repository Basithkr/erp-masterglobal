package com.masterglobal.erp.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class OrderResponseDto {

    private Long id;
    private String orderNumber;
    private LocalDate orderDate;
    private LocalDate executionDate;
    private String customerCode;
    private String customerName;

    private Double totalSale;
    private Double totalCost;
    private Double netAmount; // totalSale - totalCost

    private List<ChargeDto> charges;
    private List<OrderDetailDto> details;
    private List<ContainerDto> containers;
}
