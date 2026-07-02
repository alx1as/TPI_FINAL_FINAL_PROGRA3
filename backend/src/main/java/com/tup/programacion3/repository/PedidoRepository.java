package com.tup.programacion3.repository;

import com.tup.programacion3.entities.Pedido;
import com.tup.programacion3.enums.Estado;
import com.tup.programacion3.util.JPAUtil;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.List;

public class PedidoRepository extends BaseRepository<Pedido> {

    public PedidoRepository() {
        super(Pedido.class);
    }

    public List<Pedido> buscarPorUsuario(Long idUsuario) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();

        try {
            // Consulta JPQL: retorna los pedidos activos asociados a un usuario.
            String jpql = "SELECT p FROM Pedido p " +
                    "WHERE p.usuario.id = :idUsuario AND p.eliminado = false";

            TypedQuery<Pedido> query = em.createQuery(jpql, Pedido.class);
            query.setParameter("idUsuario", idUsuario);

            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public List<Pedido> buscarPorEstado(Estado estado) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();

        try {
            // Consulta JPQL: retorna los pedidos activos filtrados por estado.
            String jpql = "SELECT p FROM Pedido p " +
                    "WHERE p.estado = :estado AND p.eliminado = false";

            TypedQuery<Pedido> query = em.createQuery(jpql, Pedido.class);
            query.setParameter("estado", estado);

            return query.getResultList();
        } finally {
            em.close();
        }
    }
}
