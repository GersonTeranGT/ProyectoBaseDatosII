package com.itsqmet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "bovinos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bovino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "codigo_arete", nullable = false, unique = true, length = 20)
    private String codigoArete;

    @Column(name = "nombre_bovino", nullable = false, length = 100)
    private String nombreBovino;

    @Column(nullable = false, length = 10)
    private String sexo;

    @Column(nullable = false)
    private Double peso;

    @Column(name = "estado_salud", nullable = false, length = 20)
    private String estadoSalud;

    // Campos opcionales (si los agregas a la base de datos)
    @Column(length = 50)
    private String raza;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(length = 30)
    private String color;

    @Column(length = 500)
    private String observaciones;
}