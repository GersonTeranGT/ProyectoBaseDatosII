package com.itsqmet.repository;

import com.itsqmet.entity.Raza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RazaRepository extends JpaRepository<Raza, Integer> {
    // Buscar por nombre (exacto)
    Optional<Raza> findByNombre(String nombre);

    // Buscar por nombre que contenga (ignorando mayúsculas)
    List<Raza> findByNombreContainingIgnoreCase(String nombre);

    // Buscar por origen
    List<Raza> findByOrigen(String origen);

    // Contar razas por origen
    long countByOrigen(String origen);

    // Buscar razas con descripción no nula
    @Query("SELECT r FROM Raza r WHERE r.descripcion IS NOT NULL")
    List<Raza> findRazasConDescripcion();

    // Buscar razas que tengan bovinos asociados
    @Query("SELECT DISTINCT r FROM Raza r JOIN r.bovinos b")
    List<Raza> findRazasConBovinos();

    // Buscar razas con más de X bovinos
    @Query("SELECT r FROM Raza r WHERE SIZE(r.bovinos) > :cantidad")
    List<Raza> findRazasConMasDeXBovinos(@Param("cantidad") int cantidad);
}
