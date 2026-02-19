package com.masterglobal.erp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContainerDto {
    private String billNumber;
    private String containerNumber;
    private String sealNumber;
    private Double weight;
}
