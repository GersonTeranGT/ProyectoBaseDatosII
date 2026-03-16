package com.itsqmet.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "potrero")
public class Potrero {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_potrero")
    private Integer idPotrero;

    @Column(name = "nombre_potrero", nullable = false, length = 45)
    private String nombrePotrero;

    @Column(name = "ubicacion", length = 45)
    private String ubicacion;

    @Column(name = "tamanio_hectareas", length = 45)
    private String tamanioHectareas;

    @Column(name = "tipo_pasto", length = 45)
    private String tipoPasto;

    @Column(name = "capacidad_animales")
    private Integer capacidadAnimales;

    @OneToMany(mappedBy = "potrero")
    private List<Bovino> bovinos;

    // Constructores
    public Potrero() {}

    public Potrero(String nombrePotrero, String ubicacion, String tamanioHectareas,
                   String tipoPasto, Integer capacidadAnimales) {
        this.nombrePotrero = nombrePotrero;
        this.ubicacion = ubicacion;
        this.tamanioHectareas = tamanioHectareas;
        this.tipoPasto = tipoPasto;
        this.capacidadAnimales = capacidadAnimales;
    }

    // Getters y Setters
    public Integer getIdPotrero() {
        return idPotrero;
    }

    public void setIdPotrero(Integer idPotrero) {
        this.idPotrero = idPotrero;
    }

    public String getNombrePotrero() {
        return nombrePotrero;
    }

    public void setNombrePotrero(String nombrePotrero) {
        this.nombrePotrero = nombrePotrero;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public String getTamanioHectareas() {
        return tamanioHectareas;
    }

    public void setTamanioHectareas(String tamanioHectareas) {
        this.tamanioHectareas = tamanioHectareas;
    }

    public String getTipoPasto() {
        return tipoPasto;
    }

    public void setTipoPasto(String tipoPasto) {
        this.tipoPasto = tipoPasto;
    }

    public Integer getCapacidadAnimales() {
        return capacidadAnimales;
    }

    public void setCapacidadAnimales(Integer capacidadAnimales) {
        this.capacidadAnimales = capacidadAnimales;
    }

    public List<Bovino> getBovinos() {
        return bovinos;
    }

    public void setBovinos(List<Bovino> bovinos) {
        this.bovinos = bovinos;
    }
}
