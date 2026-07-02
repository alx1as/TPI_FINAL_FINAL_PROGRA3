package com.tup.programacion3.repository;

import com.tup.programacion3.entities.Pedido;
import com.tup.programacion3.entities.Usuario;
import com.tup.programacion3.util.JPAUtil;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;

import java.util.List;
import java.util.Optional;

public class UsuarioRepository extends BaseRepository<Usuario> {

    public UsuarioRepository() {
        super(Usuario.class);
    }

    public Optional<Usuario> buscarPorMail(String email) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();

        try {
            // Consulta JPQL: busca un usuario activo por email.
            // Retorna Optional para manejar el caso en que el mail no exista.
            String jpql = "SELECT u FROM Usuario u " +
                    "WHERE u.email = :email AND u.eliminado = false";

            TypedQuery<Usuario> query = em.createQuery(jpql, Usuario.class);
            query.setParameter("email", email);

            return Optional.of(query.getSingleResult());
        } catch (NoResultException e) {
            return Optional.empty();
        } finally {
            em.close();
        }
    }

    public List<Pedido> buscarPedidosPorUsuario(Long idUsuario) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();

        try {
            // Consulta JPQL: retorna los pedidos activos de un usuario determinado.
            String jpql = "SELECT p FROM Pedido p " +
                    "WHERE p.usuario.id = :idUsuario AND p.eliminado = false";

            TypedQuery<Pedido> query = em.createQuery(jpql, Pedido.class);
            query.setParameter("idUsuario", idUsuario);

            return query.getResultList();
        } finally {
            em.close();
        }
    }
}
