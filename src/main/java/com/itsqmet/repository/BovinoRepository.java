package com.itsqmet.repository;

import com.itsqmet.entity.Bovino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BovinoRepository extends JpaRepository<Bovino, Integer> {

    // Buscar por nombre o código de arete
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

    // ========== NUEVOS MÉTODOS PARA RELACIONES ==========

    // Buscar bovinos por raza
    List<Bovino> findByRazaIdRaza(Integer idRaza);

    // Buscar bovinos por potrero
    List<Bovino> findByPotreroIdPotrero(Integer idPotrero);

    // Buscar bovinos por empleado
    List<Bovino> findByEmpleadoIdEmpleado(Integer idEmpleado);

    // Contar bovinos por raza
    @Query("SELECT COUNT(b) FROM Bovino b WHERE b.raza.idRaza = :idRaza")
    long countByRaza(@Param("idRaza") Integer idRaza);

    // Contar bovinos por potrero
    @Query("SELECT COUNT(b) FROM Bovino b WHERE b.potrero.idPotrero = :idPotrero")
    long countByPotrero(@Param("idPotrero") Integer idPotrero);

    // Contar bovinos por empleado
    @Query("SELECT COUNT(b) FROM Bovino b WHERE b.empleado.idEmpleado = :idEmpleado")
    long countByEmpleado(@Param("idEmpleado") Integer idEmpleado);

    // ========== MÉTODOS ADICIONALES ÚTILES ==========

    // Buscar por rango de peso
    List<Bovino> findByPesoBetween(Double pesoMin, Double pesoMax);

    // Buscar por fecha de nacimiento
    List<Bovino> findByFechaNacimiento(LocalDate fecha);

    // Buscar por rango de fechas de nacimiento
    List<Bovino> findByFechaNacimientoBetween(LocalDate fechaInicio, LocalDate fechaFin);

    // Obtener peso máximo
    @Query("SELECT MAX(b.peso) FROM Bovino b")
    Double obtenerPesoMaximo();

    // Obtener peso mínimo
    @Query("SELECT MIN(b.peso) FROM Bovino b")
    Double obtenerPesoMinimo();

    // Obtener estadísticas completas
    @Query("SELECT new map(" +
            "COUNT(b) as total, " +
            "SUM(CASE WHEN b.sexo = 'Macho' THEN 1 ELSE 0 END) as totalMachos, " +
            "SUM(CASE WHEN b.sexo = 'Hembra' THEN 1 ELSE 0 END) as totalHembras, " +
            "SUM(CASE WHEN b.estadoSalud = 'Saludable' THEN 1 ELSE 0 END) as totalSaludables, " +
            "AVG(b.peso) as pesoPromedio, " +
            "MAX(b.peso) as pesoMaximo, " +
            "MIN(b.peso) as pesoMinimo) " +
            "FROM Bovino b")
    List<Object[]> obtenerEstadisticasCompletas();
}