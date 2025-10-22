package com.ambrosia.ambrosia.repository;

import com.ambrosia.ambrosia.models.TestEvaluacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestRepository extends JpaRepository<TestEvaluacion, Long> {
}