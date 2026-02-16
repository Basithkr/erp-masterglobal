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

    public Customer save(Customer c) {

        if (repo.existsByCode(c.getCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer code already exists");
        }

        if (repo.existsByName(c.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer name already exists");
        }

        Customer saved = repo.save(c);

        // Send email safely
        try {
            if (saved.getEmail() != null && !saved.getEmail().isEmpty()) {
                emailService.sendCustomerWelcomeMail(saved.getEmail(), saved.getName());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return saved;
    }

    public Customer update(Long id, Customer c) {
        Customer existing = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));

        // Check code uniqueness (if changed)
        if (!existing.getCode().equals(c.getCode()) && repo.existsByCode(c.getCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer code already exists");
        }

        // Check name uniqueness (if changed)
        if (!existing.getName().equals(c.getName()) && repo.existsByName(c.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer name already exists");
        }

        existing.setCode(c.getCode());
        existing.setName(c.getName());
        existing.setPhone(c.getPhone());
        existing.setEmail(c.getEmail());
        existing.setCountry(c.getCountry());
        existing.setCity(c.getCity());
        existing.setState(c.getState());
        existing.setSalesPerson(c.getSalesPerson());

        return repo.save(existing);
    }

    public List<Customer> findAll() {
        return repo.findAll();
    }
}
