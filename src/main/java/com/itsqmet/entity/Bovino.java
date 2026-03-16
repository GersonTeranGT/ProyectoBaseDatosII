package com.itsqmet.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "bovino")
@Data
@AllArgsConstructor
@JsonIgnoreProperties({"raza", "potrero", "empleado"})
public class Bovino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_bovino")
    private Integer id;

    @Column(name = "codigo_arete", nullable = false, unique = true, length = 20)
    private String codigoArete;

    @Column(name = "nombre", length = 45)
    private String nombreBovino;

    @Column(name = "sexo", length = 10)
    private String sexo;

    // CORREGIDO: Usar columnDefinition en lugar de precision y scale
    @Column(name = "peso", columnDefinition = "DECIMAL(6,2)")
    private Double peso;

    @Column(name = "estado_salud", length = 45)
    private String estadoSalud;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    // Relación con Raza
    @ManyToOne
    @JoinColumn(name = "id_raza")
    private Raza raza;

    // Relación con Potrero
    @ManyToOne
    @JoinColumn(name = "id_potrero")
    private Potrero potrero;

    // Relación con Empleado
    @ManyToOne
    @JoinColumn(name = "id_empleado")
    private Empleado empleado;

    // Constructores
    public Bovino() {}

    public Bovino(String codigoArete, String nombreBovino, String sexo, Double peso,
                  String estadoSalud, LocalDate fechaNacimiento) {
        this.codigoArete = codigoArete;
        this.nombreBovino = nombreBovino;
        this.sexo = sexo;
        this.peso = peso;
        this.estadoSalud = estadoSalud;
        this.fechaNacimiento = fechaNacimiento;
    }

    // Getters y Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCodigoArete() {
        return codigoArete;
    }

    public void setCodigoArete(String codigoArete) {
        this.codigoArete = codigoArete;
    }

    public String getNombreBovino() {
        return nombreBovino;
    }

    public void setNombreBovino(String nombreBovino) {
        this.nombreBovino = nombreBovino;
    }

    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    public Double getPeso() {
        return peso;
    }

    public void setPeso(Double peso) {
        this.peso = peso;
    }

    public String getEstadoSalud() {
        return estadoSalud;
    }

    public void setEstadoSalud(String estadoSalud) {
        this.estadoSalud = estadoSalud;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public Raza getRaza() {
        return raza;
    }

    public void setRaza(Raza raza) {
        this.raza = raza;
    }

    public Potrero getPotrero() {
        return potrero;
    }

    public void setPotrero(Potrero potrero) {
        this.potrero = potrero;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }
}