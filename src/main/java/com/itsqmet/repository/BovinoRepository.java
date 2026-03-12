package com.itsqmet.repository;

import com.itsqmet.entity.Bovino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BovinoRepository extends JpaRepository<Bovino, Integer> {

    // Buscar por nombre o código de arete (versión simplificada sin funciones de BD)
    List<Bovino> findByNombreBovinoContainingIgnoreCaseOrCodigoAreteContainingIgnoreCase(
            String nombre, String codigoArete);

    // Filtrar por sexo
    List<Bovino> findBySexo(String sexo);

    // Filtrar por estado de salud
    List<Bovino> findByEstadoSalud(String estadoSalud);

    // Contar por sexo
    long countBySexo(String sexo);

    // Contar por estado de salud
    long countByEstadoSalud(String estadoSalud);

    // Obtener peso promedio
    @Query("SELECT AVG(b.peso) FROM Bovino b")
    Double obtenerPesoPromedio();

    // Búsqueda avanzada con múltiples filtros
    @Query("SELECT b FROM Bovino b WHERE " +
            "(:nombre IS NULL OR :nombre = '' OR " +
            "LOWER(b.nombreBovino) LIKE LOWER(CONCAT('%', :nombre, '%')) OR " +
            "LOWER(b.codigoArete) LIKE LOWER(CONCAT('%', :nombre, '%'))) AND " +
            "(:sexo IS NULL OR :sexo = '' OR b.sexo = :sexo) AND " +
            "(:estadoSalud IS NULL OR :estadoSalud = '' OR b.estadoSalud = :estadoSalud)")
    List<Bovino> buscarConFiltros(@Param("nombre") String nombre,
                                  @Param("sexo") String sexo,
                                  @Param("estadoSalud") String estadoSalud);
}