package com.itsqmet.service;

import com.itsqmet.entity.Bovino;
import com.itsqmet.entity.Empleado;
import com.itsqmet.entity.Potrero;
import com.itsqmet.entity.Raza;
import com.itsqmet.repository.BovinoRepository;
import com.itsqmet.repository.EmpleadoRepository;
import com.itsqmet.repository.PotreroRepository;
import com.itsqmet.repository.RazaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BovinoService {

    @Autowired
    private BovinoRepository bovinoRepository;

    // Repositorios adicionales para las relaciones
    @Autowired
    private RazaRepository razaRepository;

    @Autowired
    private PotreroRepository potreroRepository;

    @Autowired
    private EmpleadoRepository empleadoRepository;

    // ========== MÉTODOS PARA BOVINOS (TUS MÉTODOS ORIGINALES CORREGIDOS) ==========

    // Guardar o actualizar un bovino
    public Bovino guardarBovino(Bovino bovino) {
        return bovinoRepository.save(bovino);
    }

    // Obtener todos los bovinos
    public List<Bovino> listarTodos() {
        return bovinoRepository.findAll();
    }

    // Buscar por ID
    public Optional<Bovino> buscarPorId(Integer id) {
        return bovinoRepository.findById(id);
    }

    // Eliminar por ID
    public void eliminarBovino(Integer id) {
        bovinoRepository.deleteById(id);
    }

    // Buscar por nombre o código de arete
    public List<Bovino> buscarPorNombreOCodigo(String termino) {
        return bovinoRepository.findByNombreBovinoContainingIgnoreCaseOrCodigoAreteContainingIgnoreCase(
                termino, termino);
    }

    // Filtrar por sexo
    public List<Bovino> filtrarPorSexo(String sexo) {
        return bovinoRepository.findBySexo(sexo);
    }

    // Filtrar por estado de salud
    public List<Bovino> filtrarPorEstadoSalud(String estadoSalud) {
        return bovinoRepository.findByEstadoSalud(estadoSalud);
    }

    // Obtener estadísticas
    public long contarMachos() {
        return bovinoRepository.countBySexo("Macho");
    }

    public long contarHembras() {
        return bovinoRepository.countBySexo("Hembra");
    }

    public long contarSaludables() {
        return bovinoRepository.countByEstadoSalud("Saludable");
    }

    public Double obtenerPesoPromedio() {
        Double promedio = bovinoRepository.obtenerPesoPromedio();
        return promedio != null ? promedio : 0.0;
    }

    // Búsqueda avanzada con filtros
    public List<Bovino> buscarConFiltros(String nombre, String sexo, String estadoSalud) {
        String nombreParam = (nombre != null && !nombre.trim().isEmpty()) ? nombre.trim() : null;
        String sexoParam = (sexo != null && !sexo.trim().isEmpty()) ? sexo.trim() : null;
        String estadoParam = (estadoSalud != null && !estadoSalud.trim().isEmpty()) ? estadoSalud.trim() : null;

        System.out.println("Servicio buscarConFiltros - nombre: " + nombreParam +
                ", sexo: " + sexoParam + ", estado: " + estadoParam);

        return bovinoRepository.buscarConFiltros(nombreParam, sexoParam, estadoParam);
    }

    // ========== NUEVOS MÉTODOS PARA LAS RELACIONES ==========

    // Buscar bovinos por raza
    public List<Bovino> buscarPorRaza(Integer idRaza) {
        return bovinoRepository.findByRazaIdRaza(idRaza);
    }

    // Buscar bovinos por potrero
    public List<Bovino> buscarPorPotrero(Integer idPotrero) {
        return bovinoRepository.findByPotreroIdPotrero(idPotrero);
    }

    // Buscar bovinos por empleado
    public List<Bovino> buscarPorEmpleado(Integer idEmpleado) {
        return bovinoRepository.findByEmpleadoIdEmpleado(idEmpleado);
    }

    // Buscar por rango de peso
    public List<Bovino> buscarPorRangoPeso(Double min, Double max) {
        return bovinoRepository.findByPesoBetween(min, max);
    }

    // Buscar por fecha de nacimiento
    public List<Bovino> buscarPorFechaNacimiento(LocalDate fecha) {
        return bovinoRepository.findByFechaNacimiento(fecha);
    }

    // Buscar por rango de fechas
    public List<Bovino> buscarPorRangoFechas(LocalDate inicio, LocalDate fin) {
        return bovinoRepository.findByFechaNacimientoBetween(inicio, fin);
    }

    // Obtener peso máximo
    public Double obtenerPesoMaximo() {
        Double maximo = bovinoRepository.obtenerPesoMaximo();
        return maximo != null ? maximo : 0.0;
    }

    // Obtener peso mínimo
    public Double obtenerPesoMinimo() {
        Double minimo = bovinoRepository.obtenerPesoMinimo();
        return minimo != null ? minimo : 0.0;
    }

    // ========== MÉTODOS PARA OBTENER LISTAS DE LOS SELECTORES ==========

    // Métodos para obtener listas de las tablas relacionadas
    public List<Raza> listarRazas() {
        return razaRepository.findAll();
    }

    public List<Potrero> listarPotreros() {
        return potreroRepository.findAll();
    }

    public List<Empleado> listarEmpleados() {
        return empleadoRepository.findAll();
    }

    // Métodos para buscar entidades relacionadas por ID
    public Optional<Raza> buscarRazaPorId(Integer id) {
        return razaRepository.findById(id);
    }

    public Optional<Potrero> buscarPotreroPorId(Integer id) {
        return potreroRepository.findById(id);
    }

    public Optional<Empleado> buscarEmpleadoPorId(Integer id) {
        return empleadoRepository.findById(id);
    }
}