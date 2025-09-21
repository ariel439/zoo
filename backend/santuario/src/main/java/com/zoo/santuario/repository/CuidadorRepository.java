package com.zoo.santuario.repository;

import com.zoo.santuario.model.Cuidador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CuidadorRepository extends JpaRepository<Cuidador, Long> {
    Optional<Cuidador> findByContact(String contact);
    List<Cuidador> findBySpecialty(String specialty);
}