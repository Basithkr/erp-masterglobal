package com.masterglobal.erp.repository;

import com.masterglobal.erp.entity.CustomerDocument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerDocumentRepository extends JpaRepository<CustomerDocument, Long> {
}
