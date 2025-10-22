package com.ambrosia.ambrosia.repository;

import com.ambrosia.ambrosia.models.ResultadoTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResultadoRepository extends JpaRepository<ResultadoTest, Long> {
}