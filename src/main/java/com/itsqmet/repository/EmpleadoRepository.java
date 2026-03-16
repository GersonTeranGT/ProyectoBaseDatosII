package com.itsqmet.repository;

import com.itsqmet.entity.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EmpleadoRepository extends JpaRepository<Empleado, Integer> {
    // Buscar por cédula (único)
    Optional<Empleado> findByCedula(String cedula);

    // Buscar por correo
    Optional<Empleado> findByCorreo(String correo);

    // Buscar por teléfono
    Optional<Empleado> findByTelefono(String telefono);

    // Buscar por nombre y apellido
    List<Empleado> findByNombreAndApellido(String nombre, String apellido);

    // Buscar por nombre que contenga (ignorando mayúsculas)
    List<Empleado> findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(String nombre, String apellido);

    // Buscar por edad
    List<Empleado> findByEdad(Integer edad);

    // Buscar empleados mayores de X edad
    List<Empleado> findByEdadGreaterThan(Integer edad);

    // Buscar empleados menores de X edad
    List<Empleado> findByEdadLessThan(Integer edad);

    // Buscar por rango de edad
    List<Empleado> findByEdadBetween(Integer edadMin, Integer edadMax);

    // Buscar por fecha de registro
    List<Empleado> findByFechaRegistro(LocalDate fecha);

    // Buscar empleados registrados después de una fecha
    List<Empleado> findByFechaRegistroAfter(LocalDate fecha);

    // Buscar empleados registrados antes de una fecha
    List<Empleado> findByFechaRegistroBefore(LocalDate fecha);

    // Buscar empleados que tengan bovinos a cargo
    @Query("SELECT DISTINCT e FROM Empleado e JOIN e.bovinos b")
    List<Empleado> findEmpleadosConBovinos();




}
