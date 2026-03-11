package com.itsqmet.service;

import com.itsqmet.entity.Bovino;
import com.itsqmet.repository.BovinoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BovinoService {

    @Autowired
    private BovinoRepository bovinoRepository;

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
        // Manejar cadenas vacías como null para la consulta
        String nombreParam = (nombre != null && !nombre.trim().isEmpty()) ? nombre.trim() : null;
        String sexoParam = (sexo != null && !sexo.trim().isEmpty()) ? sexo.trim() : null;
        String estadoParam = (estadoSalud != null && !estadoSalud.trim().isEmpty()) ? estadoSalud.trim() : null;

        return bovinoRepository.buscarConFiltros(nombreParam, sexoParam, estadoParam);
    }
}