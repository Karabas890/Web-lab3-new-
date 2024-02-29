package web.twillice.lab3.repository;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import web.twillice.lab3.model.Dot;

import java.io.Serializable;
import java.util.List;

@Stateless
public class DotRepository implements Serializable {
    @PersistenceContext
    private EntityManager db;

    public Dot create(Dot dot) {
        Dot newDot = new Dot(dot);
        db.persist(newDot);
        return newDot;
    }

    public List<Dot> findAll() {
        return db.createQuery("from Dot", Dot.class).getResultList();
    }
}
