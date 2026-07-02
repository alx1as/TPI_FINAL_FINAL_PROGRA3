package com.tup.programacion3.repository;

import com.tup.programacion3.entities.Categoria;
import com.tup.programacion3.entities.Producto;
import com.tup.programacion3.util.JPAUtil;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.List;

public class CategoriaRepository extends BaseRepository<Categoria> {

    public CategoriaRepository() {
        super(Categoria.class);
    }

    public List<Producto> buscarProductosPorCategoria(Long categoriaId) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();

        try {
            // Consulta JPQL: retorna productos activos de una categoría determinada.
            // Se filtra por el id de la categoría y por eliminado = false.
            String jpql = "SELECT p FROM Producto p " +
                    "WHERE p.categoria.id = :catId AND p.eliminado = false";

            TypedQuery<Producto> query = em.createQuery(jpql, Producto.class);
            query.setParameter("catId", categoriaId);

            return query.getResultList();
        } finally {
            em.close();
        }
    }
}
