package com.masterglobal.erp.controller;

import com.masterglobal.erp.entity.Customer;
import com.masterglobal.erp.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin
public class CustomerController {

    @Autowired
    private CustomerService service;

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
}

