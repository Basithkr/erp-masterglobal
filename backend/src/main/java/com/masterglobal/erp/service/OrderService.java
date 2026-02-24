package com.masterglobal.erp.service;

import com.masterglobal.erp.dto.ChargeDto;
import com.masterglobal.erp.dto.ContainerDto;
import com.masterglobal.erp.dto.OrderDetailDto;
import com.masterglobal.erp.dto.OrderResponseDto;
import com.masterglobal.erp.dto.OrderSummaryReportDto;
import com.masterglobal.erp.entity.Container;
import com.masterglobal.erp.entity.Order;
import com.masterglobal.erp.entity.OrderDetail;
import com.masterglobal.erp.repository.OrderRepository;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepo;

    // =========================
    // SAVE ORDER (BACKEND DOES ALL CALCULATIONS)
    // =========================
    @Transactional
    public Order saveOrder(Order order) {

        if (order.getDetails() != null) {
            order.getDetails().forEach(d -> d.setOrder(order));
        }

        if (order.getContainers() != null) {
            order.getContainers().forEach(c -> c.setOrder(order));
        }

        if (order.getCharges() != null) {
            order.getCharges().forEach(c -> {
                c.setOrder(order);

                // -------- VALIDATIONS --------
                if (c.getQty() == null || c.getQty() <= 0) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be greater than 0");
                }
                if (c.getSaleRate() == null || c.getSaleRate() < 0) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sale rate cannot be negative");
                }
                if (c.getCostRate() == null || c.getCostRate() < 0) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cost rate cannot be negative");
                }
                if (c.getVatPercent() == null || c.getVatPercent() < 0 || c.getVatPercent() > 100) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "VAT % must be between 0 and 100");
                }

                // -------- CALCULATIONS --------
                double saleAmount = c.getQty() * c.getSaleRate();
                double costAmount = c.getQty() * c.getCostRate();

                double vatSale = (saleAmount * c.getVatPercent()) / 100;
                double vatCost = (costAmount * c.getVatPercent()) / 100;

                double totalSale = saleAmount + vatSale;
                double totalCost = costAmount + vatCost;

                c.setSaleAmount(saleAmount);
                c.setCostAmount(costAmount);
                c.setVatSale(vatSale);
                c.setVatCost(vatCost);
                c.setTotalSale(totalSale);
                c.setTotalCost(totalCost);
            });
        }

        return orderRepo.save(order);
    }

    // =========================
    // LIST ORDERS (DTO)
    // =========================
    public List<OrderResponseDto> findAllDto() {
        return orderRepo.findAll().stream().map(this::mapToDto).toList();
    }

    // =========================
    // GET SINGLE ORDER (DTO)
    // =========================
    public OrderResponseDto findByIdDto(Long id) {
        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        return mapToDto(order);
    }

    // =========================
    // COMMON MAPPER
    // =========================
    private OrderResponseDto mapToDto(Order order) {
        OrderResponseDto dto = new OrderResponseDto();

        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setOrderDate(order.getOrderDate());
        dto.setExecutionDate(order.getExecutionDate());
        dto.setCustomerCode(order.getCustomerCode());
        dto.setCustomerName(order.getCustomerName());

        // MAP BL DETAILS
        if (order.getDetails() != null) {
            var detailDtos = order.getDetails().stream().map(d -> {
                OrderDetailDto dd = new OrderDetailDto();
                dd.setBillOfLadingNo(d.getBillOfLadingNo());
                dd.setMarks(d.getMarks());
                dd.setDescription(d.getDescription());
                dd.setQty(d.getQty());
                dd.setWeight(d.getWeight());
                dd.setVolume(d.getVolume());
                return dd;
            }).toList();

            dto.setDetails(detailDtos);
        }

        // MAP CONTAINERS
        if (order.getContainers() != null) {
            var containerDtos = order.getContainers().stream().map(c -> {
                ContainerDto cd = new ContainerDto();
                cd.setBillNumber(c.getBillNumber());
                cd.setContainerNumber(c.getContainerNumber());
                cd.setSealNumber(c.getSealNumber());
                cd.setWeight(c.getWeight());
                return cd;
            }).toList();

            dto.setContainers(containerDtos);
        }

        double totalSale = 0;
        double totalCost = 0;

        // MAP CHARGES
        if (order.getCharges() != null) {
            var chargeDtos = order.getCharges().stream().map(c -> {
                ChargeDto cd = new ChargeDto();
                cd.setBillNumber(c.getBillNumber());
                cd.setChargeCode(c.getChargeCode());
                cd.setQty(c.getQty());
                cd.setSaleRate(c.getSaleRate());
                cd.setCostRate(c.getCostRate());
                cd.setSaleAmount(c.getSaleAmount());
                cd.setCostAmount(c.getCostAmount());
                cd.setVatPercent(c.getVatPercent());
                cd.setVatSale(c.getVatSale());
                cd.setVatCost(c.getVatCost());
                cd.setTotalSale(c.getTotalSale());
                cd.setTotalCost(c.getTotalCost());
                return cd;
            }).toList();

            dto.setCharges(chargeDtos);

            totalSale = order.getCharges().stream().mapToDouble(c -> c.getTotalSale()).sum();
            totalCost = order.getCharges().stream().mapToDouble(c -> c.getTotalCost()).sum();
        }

        dto.setTotalSale(totalSale);
        dto.setTotalCost(totalCost);
        dto.setNetAmount(totalSale - totalCost);

        return dto;
    }


    // =========================
    // SUMMARY REPORT
    // =========================
    public List<OrderSummaryReportDto> getOrderSummaryReport() {
        return orderRepo.findAll().stream().map(order -> {

            OrderSummaryReportDto dto = new OrderSummaryReportDto();
            dto.setOrderNumber(order.getOrderNumber());
            dto.setExecutionDate(order.getExecutionDate());
            dto.setCustomerName(order.getCustomerName());

            double totalSales = 0;
            double totalCost = 0;
            double totalSaleVat = 0;
            double totalCostVat = 0;

            if (order.getCharges() != null) {
                totalSales = order.getCharges().stream().mapToDouble(c -> c.getTotalSale()).sum();
                totalCost = order.getCharges().stream().mapToDouble(c -> c.getTotalCost()).sum();
                totalSaleVat = order.getCharges().stream().mapToDouble(c -> c.getVatSale()).sum();
                totalCostVat = order.getCharges().stream().mapToDouble(c -> c.getVatCost()).sum();
            }

            dto.setTotalSales(totalSales);
            dto.setTotalCost(totalCost);
            dto.setTotalSaleVat(totalSaleVat);
            dto.setTotalCostVat(totalCostVat);
            dto.setNetAmount(totalSales - totalCost);

            return dto;
        }).toList();
    }

    // =========================
    // EXPORT EXCEL
    // =========================
    public ByteArrayResource exportSummaryToExcel() {
        List<OrderSummaryReportDto> data = getOrderSummaryReport();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Order Summary");

            Row header = sheet.createRow(0);
            String[] columns = {
                    "Order Number", "Execution Date", "Customer",
                    "Total Sales", "Total Cost", "Total Sale VAT",
                    "Total Cost VAT", "Net Amount"
            };

            for (int i = 0; i < columns.length; i++) {
                header.createCell(i).setCellValue(columns[i]);
            }

            int rowIdx = 1;
            for (OrderSummaryReportDto r : data) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(r.getOrderNumber());
                row.createCell(1).setCellValue(String.valueOf(r.getExecutionDate()));
                row.createCell(2).setCellValue(r.getCustomerName());
                row.createCell(3).setCellValue(r.getTotalSales());
                row.createCell(4).setCellValue(r.getTotalCost());
                row.createCell(5).setCellValue(r.getTotalSaleVat());
                row.createCell(6).setCellValue(r.getTotalCostVat());
                row.createCell(7).setCellValue(r.getNetAmount());
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);

            return new ByteArrayResource(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to export Excel", e);
        }
    }

    // =========================
    // EXPORT XML
    // =========================
    public String exportSummaryToXml() {
        List<OrderSummaryReportDto> data = getOrderSummaryReport();

        StringBuilder xml = new StringBuilder();
        xml.append("<orders>\n");

        for (OrderSummaryReportDto r : data) {
            xml.append("  <order>\n");
            xml.append("    <orderNumber>").append(r.getOrderNumber()).append("</orderNumber>\n");
            xml.append("    <executionDate>").append(r.getExecutionDate()).append("</executionDate>\n");
            xml.append("    <customer>").append(r.getCustomerName()).append("</customer>\n");
            xml.append("    <totalSales>").append(r.getTotalSales()).append("</totalSales>\n");
            xml.append("    <totalCost>").append(r.getTotalCost()).append("</totalCost>\n");
            xml.append("    <totalSaleVat>").append(r.getTotalSaleVat()).append("</totalSaleVat>\n");
            xml.append("    <totalCostVat>").append(r.getTotalCostVat()).append("</totalCostVat>\n");
            xml.append("    <netAmount>").append(r.getNetAmount()).append("</netAmount>\n");
            xml.append("  </order>\n");
        }

        xml.append("</orders>");
        return xml.toString();
    }
}
