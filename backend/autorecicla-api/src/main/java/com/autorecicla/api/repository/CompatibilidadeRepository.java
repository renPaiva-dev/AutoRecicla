package com.autorecicla.api.repository;
import com.autorecicla.api.model.Compatibilidade;
import com.autorecicla.api.model.Modelo;
import com.autorecicla.api.model.Peca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompatibilidadeRepository extends JpaRepository<Compatibilidade, Long> {
    List<Compatibilidade> findByPeca(Peca peca);
    List<Compatibilidade> findByModelo(Modelo modelo);
}

