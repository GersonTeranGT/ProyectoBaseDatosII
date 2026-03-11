package com.itsqmet.controller;

import com.itsqmet.entity.Bovino;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/bovinos")
public class BovinoController {

    // Lista estática de datos de prueba
    private static List<Bovino> listaBovinos = new ArrayList<>();

    // Inicializar datos de prueba
    static {
        listaBovinos.add(new Bovino(1, "HOL-001", "Lola", "Hembra", 580.5, "Saludable"));
        listaBovinos.add(new Bovino(2, "JER-002", "Manchas", "Hembra", 520.0, "En tratamiento"));
        listaBovinos.add(new Bovino(3, "ANG-003", "Torito", "Macho", 720.3, "Saludable"));
        listaBovinos.add(new Bovino(4, "HER-004", "Blanquita", "Hembra", 610.8, "Observación"));
        listaBovinos.add(new Bovino(5, "HOL-005", "Claridad", "Hembra", 495.2, "Saludable"));
        listaBovinos.add(new Bovino(6, "JER-006", "Canela", "Hembra", 510.7, "Saludable"));
        listaBovinos.add(new Bovino(7, "BRA-007", "Rayo", "Macho", 850.0, "Crítico"));
        listaBovinos.add(new Bovino(8, "ANG-008", "Estrella", "Hembra", 380.4, "Saludable"));
    }

    @GetMapping
    public String listarBovinos(Model model) {
        // Calcular estadísticas
        long totalMachos = listaBovinos.stream().filter(b -> "Macho".equals(b.getSexo())).count();
        long totalHembras = listaBovinos.stream().filter(b -> "Hembra".equals(b.getSexo())).count();
        long totalSaludables = listaBovinos.stream().filter(b -> "Saludable".equals(b.getEstadoSalud())).count();
        double pesoPromedio = listaBovinos.stream().mapToDouble(Bovino::getPeso).average().orElse(0);

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
        // No necesitas pasar un objeto bovino
        return "pages/formBovinos";
    }

    @GetMapping("/editar/{id}")
    public String editarBovino(@PathVariable Integer id, Model model) {
        Optional<Bovino> bovinoOpt = listaBovinos.stream()
                .filter(b -> b.getId().equals(id))
                .findFirst();

        if (bovinoOpt.isPresent()) {
            model.addAttribute("titulo", "Editar Bovino");
            model.addAttribute("currentPage", "editar-bovino");
            model.addAttribute("bovino", bovinoOpt.get());
            return "bovinos/form";
        }
        return "redirect:/bovinos";
    }

    @GetMapping("/ver/{id}")
    public String verBovino(@PathVariable Integer id, Model model) {
        Optional<Bovino> bovinoOpt = listaBovinos.stream()
                .filter(b -> b.getId().equals(id))
                .findFirst();

        if (bovinoOpt.isPresent()) {
            model.addAttribute("titulo", "Detalles del Bovino");
            model.addAttribute("currentPage", "ver-bovino");
            model.addAttribute("bovino", bovinoOpt.get());
            return "bovinos/detalle";
        }
        return "redirect:/bovinos";
    }

    @GetMapping("/eliminar/{id}")
    public String eliminarBovino(@PathVariable Integer id) {
        listaBovinos.removeIf(b -> b.getId().equals(id));
        return "redirect:/bovinos";
    }
}
