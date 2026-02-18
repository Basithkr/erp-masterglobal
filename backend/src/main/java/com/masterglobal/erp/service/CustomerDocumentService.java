package com.masterglobal.erp.service;

import com.masterglobal.erp.entity.Customer;
import com.masterglobal.erp.entity.CustomerDocument;
import com.masterglobal.erp.repository.CustomerDocumentRepository;
import com.masterglobal.erp.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class CustomerDocumentService {

    private static final String UPLOAD_DIR = "uploads/customers/";

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerDocumentRepository documentRepository;

    public CustomerDocument uploadDocument(
            Long customerId,
            String documentType,
            String notes,
            MultipartFile file
    ) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));

        try {
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR + fileName);
            Files.write(path, file.getBytes());

            CustomerDocument doc = new CustomerDocument();
            doc.setDocumentType(documentType);
            doc.setNotes(notes);
            doc.setFileName(file.getOriginalFilename());
            doc.setCustomer(customer);

            return documentRepository.save(doc);

        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File upload failed");
        }
    }
}
