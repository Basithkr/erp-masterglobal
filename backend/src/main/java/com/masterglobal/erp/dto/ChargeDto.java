package com.masterglobal.erp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChargeDto {

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
}
