package com.itsqmet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Bovino {
    private Integer id;
    private String codigoArete;
    private String nombreBovino;
    private String sexo;
    private Double peso;
    private String estadoSalud;

    // Constructores
    public Bovino() {}

    public Bovino(Integer id, String codigoArete, String nombreBovino, String sexo, Double peso, String estadoSalud) {
        this.id = id;
        this.codigoArete = codigoArete;
        this.nombreBovino = nombreBovino;
        this.sexo = sexo;
        this.peso = peso;
        this.estadoSalud = estadoSalud;
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

}
