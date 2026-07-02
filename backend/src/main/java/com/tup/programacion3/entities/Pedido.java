package com.tup.programacion3.entities;

import com.tup.programacion3.enums.Estado;
import com.tup.programacion3.enums.FormaPago;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import lombok.*;
import lombok.experimental.SuperBuilder;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.CascadeType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
@Entity
@Table(name = "pedidos")

public class Pedido extends Base implements Calculable {

    private LocalDate fecha;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    private Double total;

    @Enumerated(EnumType.STRING)
    private FormaPago formaPago;
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    
    @OneToMany(cascade = CascadeType.ALL)
    @Builder.Default
    private Set<DetallePedido> detalles = new HashSet<>();

    public Pedido(Long id, LocalDate fecha, Estado estado, FormaPago formaPago) {
        super(id);
        this.fecha = fecha;
        this.estado = estado;
        this.formaPago = formaPago;
        this.total = 0.0;
        this.detalles = new HashSet<>();
    }

    public void addDetallePedido(int cantidad, Producto producto) {
    DetallePedido detallePedido = DetallePedido.builder()
            .eliminado(false)
            .createdAt(java.time.LocalDateTime.now())
            .cantidad(cantidad)
            .producto(producto)
            .subtotal(cantidad * producto.getPrecio())
            .build();

    detalles.add(detallePedido);
    calcularTotal();
}

    public DetallePedido findDetallePedidoByProducto(Producto producto) {
        for (DetallePedido detalle : detalles) {
            if (detalle.getProducto().equals(producto)) {
                return detalle;
            }
        }

        return null;
    }

    public void deleteDetallePedidoByProducto(Producto producto) {
        DetallePedido detalleEncontrado = findDetallePedidoByProducto(producto);

        if (detalleEncontrado != null) {
            detalles.remove(detalleEncontrado);
            calcularTotal();
        }
    }
    // método para contar items:
    public int contarItems() {
    return detalles.stream()
            .mapToInt(DetallePedido::getCantidad)
            .sum();
}

@Override //cambio para que use Stream.
public void calcularTotal() {
    total = detalles.stream()
            .mapToDouble(DetallePedido::getSubtotal)
            .sum();
}

    //Esto le dice a Lombok: para equals/hashCode, usá el id heredado de Base.
    @EqualsAndHashCode.Include
    public Long getId() {
        return id;
    }

    @Override
    public String toString() {
        return "Pedido{" +
                super.toString() +
                ", fecha=" + fecha +
                ", estado=" + estado +
                ", total=" + total +
                ", formaPago=" + formaPago +
                ", detalles=" + detalles +
                '}';
    }
}