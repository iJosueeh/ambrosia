package com.ambrosia.ambrosia.repository;

import com.ambrosia.ambrosia.models.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByProfesionalId(Long profesionalId);
}
