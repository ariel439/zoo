package com.zoo.santuario.repository;

import com.zoo.santuario.model.Habitat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HabitatRepository extends JpaRepository<Habitat, Long> {
    List<Habitat> findByType(String type);
}