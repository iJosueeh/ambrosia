package com.ambrosia.ambrosia.repository;

import com.ambrosia.ambrosia.models.Foro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForoRepository extends JpaRepository<Foro, Long> {
    List<Foro> findByTituloContaining(String titulo);
}