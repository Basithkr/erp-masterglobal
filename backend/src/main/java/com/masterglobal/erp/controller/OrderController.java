package com.masterglobal.erp.controller;

import com.masterglobal.erp.dto.OrderResponseDto;
import com.masterglobal.erp.entity.Order;
import com.masterglobal.erp.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:80")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public Order create(@RequestBody Order order) {
        return orderService.saveOrder(order);
    }

    @GetMapping
    public List<OrderResponseDto> list() {
        return orderService.findAllDto();
    }

    // ✅ NEW: Get single order with full details
    @GetMapping("/{id}")
    public OrderResponseDto getById(@PathVariable Long id) {
        return orderService.findByIdDto(id);
    }

    @GetMapping("/report/summary")
    public List<?> summary() {
        return orderService.getOrderSummaryReport();
    }

    @GetMapping("/report/export/excel")
    public ResponseEntity<ByteArrayResource> exportExcel() {
        ByteArrayResource resource = orderService.exportSummaryToExcel();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=order-summary.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @GetMapping("/report/export/xml")
    public ResponseEntity<String> exportXml() {
        String xml = orderService.exportSummaryToXml();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=order-summary.xml")
                .contentType(MediaType.APPLICATION_XML)
                .body(xml);
    }
}
