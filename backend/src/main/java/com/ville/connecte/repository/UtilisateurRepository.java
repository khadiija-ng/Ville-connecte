package com.ville.connecte.repository;

import java.util.Optional;

import com.ville.connecte.model.Utilisateur;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByEmail(String username);

}
