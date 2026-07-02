package com.tup.programacion3.entities;
//base común
import java.time.LocalDateTime;
import java.util.Objects;

import lombok.*;
import lombok.experimental.SuperBuilder;

import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.MappedSuperclass;


@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@MappedSuperclass // indica no independencia en la bdd


//aporta atributos
public abstract class Base {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    protected boolean eliminado;     //baja lógica    
    protected LocalDateTime createdAt;

    public Base(Long id) {
        this.id = id;
        this.eliminado = false;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public boolean isEliminado() {
        return eliminado;
    }
    
    public void setEliminado(boolean eliminado) {
    this.eliminado = eliminado;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @Override
    public String toString() {
        return "id=" + id +
                ", eliminado=" + eliminado +
                ", createdAt=" + createdAt;
    }

    @Override
    public boolean equals(Object obj) {

        if (this == obj) return true;

        if (!(obj instanceof Base)) return false;

        Base base = (Base) obj;

        return Objects.equals(id, base.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}