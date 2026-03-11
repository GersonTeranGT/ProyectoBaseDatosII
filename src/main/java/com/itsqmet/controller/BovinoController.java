package com.itsqmet.controller;

import com.itsqmet.entity.Bovino;
import com.itsqmet.service.BovinoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/bovinos")
public class BovinoController {

    @Autowired
    private BovinoService bovinoService;

    @GetMapping
    public String listarBovinos(Model model) {

        // Cargar todos los bovinos inicialmente
        List<Bovino> listaBovinos = bovinoService.listarTodos();

        // Calcular estadísticas
        long totalMachos = bovinoService.contarMachos();
        long totalHembras = bovinoService.contarHembras();
        long totalSaludables = bovinoService.contarSaludables();
        double pesoPromedio = bovinoService.obtenerPesoPromedio();

        model.addAttribute("titulo", "Gestión de Bovinos");
        model.addAttribute("currentPage", "bovinos");
        model.addAttribute("bovinos", listaBovinos);
        model.addAttribute("totalBovinos", listaBovinos.size());
        model.addAttribute("totalMachos", totalMachos);
        model.addAttribute("totalHembras", totalHembras);
        model.addAttribute("totalSaludables", totalSaludables);
        model.addAttribute("pesoPromedio", String.format("%.1f", pesoPromedio));

        return "pages/bovinos";
    }

    @GetMapping("/nuevo")
    public String nuevoBovino(Model model) {
        model.addAttribute("titulo", "Agregar Nuevo Bovino");
        model.addAttribute("currentPage", "nuevo-bovino");
        model.addAttribute("bovino", new Bovino());
        return "pages/formBovinos";
    }

    @PostMapping("/guardar")
    public String guardarBovino(@ModelAttribute Bovino bovino,
                                RedirectAttributes redirectAttributes) {
        try {
            bovinoService.guardarBovino(bovino);
            redirectAttributes.addFlashAttribute("mensaje", "Bovino guardado exitosamente");
            redirectAttributes.addFlashAttribute("tipoMensaje", "exito");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("mensaje", "Error al guardar el bovino: " + e.getMessage());
            redirectAttributes.addFlashAttribute("tipoMensaje", "error");
        }
        return "redirect:/bovinos";
    }

    @GetMapping("/editar/{id}")
    public String editarBovino(@PathVariable Integer id, Model model,
                               RedirectAttributes redirectAttributes) {
        Optional<Bovino> bovinoOpt = bovinoService.buscarPorId(id);

        if (bovinoOpt.isPresent()) {
            model.addAttribute("titulo", "Editar Bovino");
            model.addAttribute("currentPage", "editar-bovino");
            model.addAttribute("bovino", bovinoOpt.get());
            return "pages/formBovinos";
        } else {
            redirectAttributes.addFlashAttribute("mensaje", "Bovino no encontrado");
            redirectAttributes.addFlashAttribute("tipoMensaje", "error");
            return "redirect:/bovinos";
        }
    }

    @GetMapping("/ver/{id}")
    public String verBovino(@PathVariable Integer id, Model model,
                            RedirectAttributes redirectAttributes) {
        Optional<Bovino> bovinoOpt = bovinoService.buscarPorId(id);

        if (bovinoOpt.isPresent()) {
            model.addAttribute("titulo", "Detalles del Bovino");
            model.addAttribute("currentPage", "ver-bovino");
            model.addAttribute("bovino", bovinoOpt.get());
            return "bovinos/detalle";
        } else {
            redirectAttributes.addFlashAttribute("mensaje", "Bovino no encontrado");
            redirectAttributes.addFlashAttribute("tipoMensaje", "error");
            return "redirect:/bovinos";
        }
    }

    @GetMapping("/eliminar/{id}")
    public String eliminarBovino(@PathVariable Integer id,
                                 RedirectAttributes redirectAttributes) {
        try {
            bovinoService.eliminarBovino(id);
            redirectAttributes.addFlashAttribute("mensaje", "Bovino eliminado exitosamente");
            redirectAttributes.addFlashAttribute("tipoMensaje", "exito");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("mensaje", "Error al eliminar el bovino");
            redirectAttributes.addFlashAttribute("tipoMensaje", "error");
        }
        return "redirect:/bovinos";
    }

    @GetMapping("/filtrar")
    @ResponseBody
    public List<Bovino> filtrarBovinos(@RequestParam(required = false) String search,
                                       @RequestParam(required = false) String sexo,
                                       @RequestParam(required = false) String estadoSalud) {

        System.out.println("Filtrando - search: '" + search + "', sexo: '" + sexo + "', estado: '" + estadoSalud + "'");

        try {
            List<Bovino> resultados;

            // Si hay búsqueda por texto, priorizar ese filtro
            if (search != null && !search.trim().isEmpty()) {
                resultados = bovinoService.buscarPorNombreOCodigo(search.trim());
            }
            // Si hay filtros de sexo y/o estado
            else if ((sexo != null && !sexo.isEmpty()) || (estadoSalud != null && !estadoSalud.isEmpty())) {
                resultados = bovinoService.buscarConFiltros(null, sexo, estadoSalud);
            }
            // Si no hay filtros, mostrar todos
            else {
                resultados = bovinoService.listarTodos();
            }

            System.out.println("Resultados encontrados: " + resultados.size());
            return resultados;

        } catch (Exception e) {
            System.err.println("Error al filtrar: " + e.getMessage());
            e.printStackTrace();
            return List.of(); // Retornar lista vacía en caso de error
        }
    }

    @GetMapping("/estadisticas")
    @ResponseBody
    public Map<String, Object> obtenerEstadisticas() {
        Map<String, Object> estadisticas = new HashMap<>();

        long totalMachos = bovinoService.contarMachos();
        long totalHembras = bovinoService.contarHembras();
        long totalSaludables = bovinoService.contarSaludables();
        double pesoPromedio = bovinoService.obtenerPesoPromedio();
        long totalBovinos = bovinoService.listarTodos().size();

        estadisticas.put("totalBovinos", totalBovinos);
        estadisticas.put("totalMachos", totalMachos);
        estadisticas.put("totalHembras", totalHembras);
        estadisticas.put("totalSaludables", totalSaludables);
        estadisticas.put("pesoPromedio", String.format("%.1f", pesoPromedio));

        return estadisticas;
    }
}