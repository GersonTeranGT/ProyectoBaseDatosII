package com.itsqmet.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "raza")
public class Raza {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_raza")
    private Integer idRaza;

    @Column(name = "nombre", nullable = false, length = 45)
    private String nombre;

    @Column(name = "descripcion", length = 45)
    private String descripcion;

    @Column(name = "origen", length = 45)
    private String origen;

    @OneToMany(mappedBy = "raza")
    private List<Bovino> bovinos;

    // Constructores
    public Raza() {}

    public Raza(String nombre, String descripcion, String origen) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.origen = origen;
    }

    // Getters y Setters
    public Integer getIdRaza() {
        return idRaza;
    }

    public void setIdRaza(Integer idRaza) {
        this.idRaza = idRaza;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getOrigen() {
        return origen;
    }

    public void setOrigen(String origen) {
        this.origen = origen;
    }

    public List<Bovino> getBovinos() {
        return bovinos;
    }

    public void setBovinos(List<Bovino> bovinos) {
        this.bovinos = bovinos;
    }
}
