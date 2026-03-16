package com.itsqmet.repository;

import com.itsqmet.entity.Potrero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PotreroRepository extends JpaRepository<Potrero, Integer> {
    // Buscar por nombre de potrero
    Optional<Potrero> findByNombrePotrero(String nombrePotrero);

    // Buscar por ubicación
    List<Potrero> findByUbicacion(String ubicacion);

    // Buscar por tipo de pasto
    List<Potrero> findByTipoPasto(String tipoPasto);

    // Buscar potreros con capacidad mayor a X
    List<Potrero> findByCapacidadAnimalesGreaterThan(Integer capacidad);

    // Buscar potreros con capacidad menor a X
    List<Potrero> findByCapacidadAnimalesLessThan(Integer capacidad);

    // Buscar potreros con tamaño de hectáreas específico
    List<Potrero> findByTamanioHectareas(String tamanio);

    // Contar potreros por ubicación
    long countByUbicacion(String ubicacion);

    // Buscar potreros que tengan bovinos asociados
    @Query("SELECT DISTINCT p FROM Potrero p JOIN p.bovinos b")
    List<Potrero> findPotrerosConBovinos();

    // Buscar potreros con capacidad disponible (capacidad > bovinos actuales)
    @Query("SELECT p FROM Potrero p WHERE p.capacidadAnimales > (SELECT COUNT(b) FROM Bovino b WHERE b.potrero = p)")
    List<Potrero> findPotrerosConCapacidadDisponible();
}

