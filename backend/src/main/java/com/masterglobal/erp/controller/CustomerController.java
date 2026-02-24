package com.masterglobal.erp.controller;

import com.masterglobal.erp.entity.Customer;
import com.masterglobal.erp.entity.CustomerDocument;
import com.masterglobal.erp.service.CustomerDocumentService;
import com.masterglobal.erp.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:80")
public class CustomerController {

    @Autowired
    private CustomerService service;

    @Autowired
    private CustomerDocumentService documentService;

    @PostMapping
    public Customer create(@RequestBody @jakarta.validation.Valid Customer customer) {
        return service.save(customer);
    }

    @PutMapping("/{id}")
    public Customer update(@PathVariable Long id, @RequestBody @jakarta.validation.Valid Customer customer) {
        return service.update(id, customer);
    }

    @GetMapping
    public List<Customer> list() {
        return service.findAll();
    }

    // ===== Upload Document =====
    @PostMapping("/{id}/documents/upload")
    public CustomerDocument uploadDocument(
            @PathVariable Long id,
            @RequestParam("documentType") String documentType,
            @RequestParam("notes") String notes,
            @RequestParam("file") MultipartFile file
    ) {
        return documentService.uploadDocument(id, documentType, notes, file);
    }

    // ===== Download Document =====
    @GetMapping("/documents/download/{storedFileName}")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable String storedFileName) {
        byte[] fileData = documentService.downloadFile(storedFileName);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + storedFileName + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileData);
    }
}