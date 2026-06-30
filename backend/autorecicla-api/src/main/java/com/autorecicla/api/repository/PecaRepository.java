package com.autorecicla.api.repository;

import com.autorecicla.api.model.Filial;
import com.autorecicla.api.model.Peca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PecaRepository extends JpaRepository<Peca, Long> {
    List<Peca> findByFilial(Filial filial);
}
