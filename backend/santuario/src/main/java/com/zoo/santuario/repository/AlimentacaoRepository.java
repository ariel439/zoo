package com.zoo.santuario.repository;

import com.zoo.santuario.model.Alimentacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlimentacaoRepository extends JpaRepository<Alimentacao, Long> {
    List<Alimentacao> findByFoodType(String foodType);
    List<Alimentacao> findByAnimals_Id(Long animalId); 
    List<Alimentacao> findByFoodTypeAndAnimals_Id(String foodType, Long animalId);
}