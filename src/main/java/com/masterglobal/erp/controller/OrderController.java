package com.masterglobal.erp.controller;

import com.masterglobal.erp.dto.OrderResponseDto;
import com.masterglobal.erp.dto.OrderSummaryReportDto;
import com.masterglobal.erp.entity.Order;
import com.masterglobal.erp.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;


import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {

    @Autowired
    private OrderService service;

    @PostMapping
    public Order create(@RequestBody Order order) {
        return service.saveOrder(order);
    }

    @GetMapping
    public List<OrderResponseDto> list() {
        return service.findAllDto();
    }

    @GetMapping("/report/summary")
    public List<OrderSummaryReportDto> summaryReport() {
        return service.getOrderSummaryReport();
    }

    @GetMapping("/report/export/excel")
    public ResponseEntity<ByteArrayResource> exportExcel() {
        ByteArrayResource file = service.exportSummaryToExcel();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=order-summary.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(file);
    }

    @GetMapping(value = "/report/export/xml", produces = MediaType.APPLICATION_XML_VALUE)
    public String exportXml() {
        return service.exportSummaryToXml();
    }

}

