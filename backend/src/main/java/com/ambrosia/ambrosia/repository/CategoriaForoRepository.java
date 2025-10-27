package com.ambrosia.ambrosia.repository;

import com.ambrosia.ambrosia.models.CategoriaForo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaForoRepository extends JpaRepository<CategoriaForo, Long> {
}
