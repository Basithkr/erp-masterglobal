package com.masterglobal.erp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderDetailDto {
    private String billOfLadingNo;
    private String marks;
    private String description;
    private Integer qty;
    private Double weight;
    private Double volume;
}
