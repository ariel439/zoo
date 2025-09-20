package com.zoo.santuario.repository;

import com.zoo.santuario.model.Alimentacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlimentacaoRepository extends JpaRepository<Alimentacao, Long> {
}
