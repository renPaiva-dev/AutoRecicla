package com.autorecicla.api.repository;


import com.autorecicla.api.model.Nota;
import com.autorecicla.api.model.NotaPeca;
import com.autorecicla.api.model.NotaPecaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotaPecaRepository extends JpaRepository<NotaPeca, NotaPecaId> {
        List<NotaPeca> findByNota(Nota nota);

}
