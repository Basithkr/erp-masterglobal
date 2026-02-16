package com.masterglobal.erp.repository;

import com.masterglobal.erp.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    boolean existsByCode(String code);
    boolean existsByName(String name);
}

