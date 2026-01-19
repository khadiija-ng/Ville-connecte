package com.ville.connecte.service;

import java.util.List;
import java.util.stream.StreamSupport;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ville.connecte.controller.dto.request.UtilisateurRequest;
import com.ville.connecte.controller.dto.response.UtilisateurResponse;
import com.ville.connecte.model.FonctionUser;
import com.ville.connecte.model.Role;
import com.ville.connecte.model.Utilisateur;
import com.ville.connecte.repository.UtilisateurRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UtilisateurService {

    public final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurService(UtilisateurRepository utilisateurRepository, PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder= passwordEncoder;
    }

    public UtilisateurResponse save(UtilisateurRequest dto) {
        Utilisateur utilisateur;
        utilisateur = Utilisateur.builder()
                .firstname(dto.firstname())
                .lastname(dto.lastname())
                .email(dto.email())
                .lieuDeNaissance(dto.lieuDeNaissance())
                .dateDeNaissance(dto.dateDeNaissance())
                .role(Role.USER)
                .fonction(FonctionUser.CITOYEN)
                .password(passwordEncoder.encode(dto.password()))
                .build();

        Utilisateur saved = utilisateurRepository.save(utilisateur);

        return new UtilisateurResponse(
                saved.getFirstname(),
                saved.getLastname(),
                saved.getEmail(),
                saved.getDateDeNaissance(),
                saved.getLieuDeNaissance()
        );
    }

    public UtilisateurResponse findById(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));

        return new UtilisateurResponse(
                utilisateur.getFirstname(),
                utilisateur.getLastname(),
                utilisateur.getEmail(),
                utilisateur.getDateDeNaissance(),
                utilisateur.getLieuDeNaissance()
        );
    }

    public List<UtilisateurResponse> findAll() {
        return StreamSupport
                .stream(utilisateurRepository.findAll().spliterator(), false)
                .map(utilisateur -> new UtilisateurResponse(
                utilisateur.getFirstname(),
                utilisateur.getLastname(),
                utilisateur.getEmail(),
                utilisateur.getDateDeNaissance(),
                utilisateur.getLieuDeNaissance()
        ))
                .toList();
    }

    public UtilisateurResponse update(Long id, UtilisateurRequest dto) {

        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));

        utilisateur.setFirstname(dto.firstname());
        utilisateur.setLastname(dto.lastname());
        utilisateur.setEmail(dto.email());
        utilisateur.setLieuDeNaissance(dto.lieuDeNaissance());
        utilisateur.setDateDeNaissance(dto.dateDeNaissance());

        Utilisateur updated = utilisateurRepository.save(utilisateur);

        return new UtilisateurResponse(
                updated.getFirstname(),
                updated.getLastname(),
                updated.getEmail(),
                updated.getDateDeNaissance(),
                updated.getLieuDeNaissance()
        );
    }

    public void delete(Long id) {
        if (!utilisateurRepository.existsById(id)) {
            throw new EntityNotFoundException("Utilisateur non trouvé");
        }
        utilisateurRepository.deleteById(id);
    }

}
