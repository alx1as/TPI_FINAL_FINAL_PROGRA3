package com.tup.programacion3.repository;

import com.tup.programacion3.entities.Producto;
import com.tup.programacion3.util.JPAUtil;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.List;

public class ProductoRepository extends BaseRepository<Producto> {

    public ProductoRepository() {
        super(Producto.class);
    }

    public List<Producto> buscarPorCategoria(Long categoriaId) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();

        try {
            /*
            * Consulta JPQL que obtiene los productos activos asociados a una categoria
            * especifica, filtrando por el ID de la categoria y por eliminado = false.
            */
            String jpql = "SELECT p FROM Producto p " +
                    "WHERE p.categoria.id = :categoriaId " +
                    "AND p.eliminado = false";

            TypedQuery<Producto> query = em.createQuery(jpql, Producto.class);
            query.setParameter("categoriaId", categoriaId);

            return query.getResultList();

        } finally {
            em.close();
        }
    }
}