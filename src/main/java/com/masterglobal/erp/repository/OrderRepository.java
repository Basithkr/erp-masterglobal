package com.masterglobal.erp.repository;

import com.masterglobal.erp.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
