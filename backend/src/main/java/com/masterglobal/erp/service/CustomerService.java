package com.masterglobal.erp.service;

import com.masterglobal.erp.entity.Customer;
import com.masterglobal.erp.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository repo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpService otpService;

    public Customer save(Customer c) {

        if (c.getEmail() == null || c.getEmail().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required for verification");
        }

        // ✅ Check OTP verification
        if (!otpService.isEmailVerified(c.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is not verified via OTP");
        }

        if (repo.existsByCode(c.getCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer code already exists");
        }

        if (repo.existsByName(c.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer name already exists");
        }

        if (c.getAddresses() != null) {
            c.getAddresses().forEach(a -> a.setCustomer(c));
        }
        if (c.getContacts() != null) {
            c.getContacts().forEach(ct -> ct.setCustomer(c));
        }
        if (c.getDocuments() != null) {
            c.getDocuments().forEach(d -> d.setCustomer(c));
        }

        Customer saved = repo.save(c);

        // ✅ Send Gmail API notification
        try {
            emailService.sendCustomerWelcomeMail(saved.getEmail(), saved.getName());
        } catch (Exception e) {
            e.printStackTrace(); // don't fail customer creation because of mail
        }

        return saved;
    }

    public Customer update(Long id, Customer c) {
        Customer existing = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));

        if (!existing.getCode().equals(c.getCode()) && repo.existsByCode(c.getCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer code already exists");
        }

        if (!existing.getName().equals(c.getName()) && repo.existsByName(c.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer name already exists");
        }

        existing.setCode(c.getCode());
        existing.setName(c.getName());
        existing.setPhone(c.getPhone());
        existing.setEmail(c.getEmail());
        existing.setSalesPerson(c.getSalesPerson());

        existing.getAddresses().clear();
        if (c.getAddresses() != null) {
            c.getAddresses().forEach(a -> { a.setCustomer(existing); existing.getAddresses().add(a); });
        }

        existing.getContacts().clear();
        if (c.getContacts() != null) {
            c.getContacts().forEach(ct -> { ct.setCustomer(existing); existing.getContacts().add(ct); });
        }

        existing.getDocuments().clear();
        if (c.getDocuments() != null) {
            c.getDocuments().forEach(d -> { d.setCustomer(existing); existing.getDocuments().add(d); });
        }

        return repo.save(existing);
    }

    public List<Customer> findAll() {
        return repo.findAll();
    }
}
