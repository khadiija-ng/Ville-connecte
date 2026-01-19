package com.ville.connecte.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ville.connecte.controller.dto.request.AlerteRequest;
import com.ville.connecte.controller.dto.request.TypeAlerteRequest;
import com.ville.connecte.controller.dto.response.AlerteResponse;
import com.ville.connecte.controller.dto.response.MediaResponse;
import com.ville.connecte.controller.dto.response.TypeAlerteResponse;
import com.ville.connecte.model.Alerter;
import com.ville.connecte.model.Media;
import com.ville.connecte.model.Status;
import com.ville.connecte.model.TypeAlerte;
import com.ville.connecte.model.Utilisateur;
import com.ville.connecte.repository.AlerteRepository;
import com.ville.connecte.repository.TypeAlerteRepository;
import com.ville.connecte.repository.UtilisateurRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AlerteService {

    private final String uploadDir = "uploads";
    private final UtilisateurRepository utilisateurRepository;
    private final AlerteRepository alerteRepository;
    private final TypeAlerteRepository repository;

    public AlerteService(TypeAlerteRepository repository, UtilisateurRepository utilisateurRepository, AlerteRepository alerteRepository) {
        this.repository = repository;
        this.utilisateurRepository = utilisateurRepository;
        this.alerteRepository = alerteRepository;

    }

    public TypeAlerteResponse save(TypeAlerteRequest request) {

        TypeAlerte type = new TypeAlerte();
        type.setTypeAlerteName(request.typeAlerteName());
        type.setTypeAlerteDescription(request.typeAlerteDescription());

        TypeAlerte saved = repository.save(type);

        return new TypeAlerteResponse(
                saved.getId(),
                saved.getTypeAlerteName(),
                saved.getTypeAlerteDescription()
        );
    }

    public List<TypeAlerteResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(type -> new TypeAlerteResponse(
                type.getId(),
                type.getTypeAlerteName(),
                type.getTypeAlerteDescription()
        ))
                .toList();
    }

    public TypeAlerteResponse getById(Long id) {

        TypeAlerte type = repository.findById(id)
                .orElseThrow(()
                        -> new EntityNotFoundException("Type alerte introuvable"));

        return new TypeAlerteResponse(
                type.getId(),
                type.getTypeAlerteName(),
                type.getTypeAlerteDescription()
        );
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    //=============================Alerte========================
    public AlerteResponse save(
            AlerteRequest request,
            List<MultipartFile> files
    ) throws IOException {

        Utilisateur user = utilisateurRepository
                .findById(request.utilisateurId())
                .orElseThrow(()
                        -> new RuntimeException("Utilisateur introuvable"));

        TypeAlerte type = repository
                .findById(request.typeAlerteId())
                .orElseThrow(()
                        -> new RuntimeException("Type alerte introuvable"));

        Alerter alerte = Alerter.builder()
                .dateDesFaits(request.dateDesFaits())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .message(request.message())
                .status(Status.NOUVEAU)
                .utilisateur(user)
                .typeAlerte(type)
                .build();

        if (files != null) {
            for (MultipartFile file : files) {

                String fileName = System.currentTimeMillis()
                        + "_" + file.getOriginalFilename();

                Path path = Paths.get(uploadDir, fileName);
                Files.write(path, file.getBytes());

                Media media = Media.builder()
                        .fileName(fileName)
                        .fileType(file.getContentType())
                        .filePath(path.toString())
                        .alerte(alerte)
                        .build();

                alerte.getMedias().add(media);
            }
        }

        return mapToResponse(
                alerteRepository.save(alerte)
        );
    }

//     public AlerteResponse save(AlerteRequest request) {
//         Utilisateur user = utilisateurRepository.findById(
//                 request.utilisateurId()
//         ).orElseThrow(()
//                 -> new EntityNotFoundException("Utilisateur introuvable"));
//         TypeAlerte type = repository.findById(request.typeAlerteId()
//         ).orElseThrow(()
//                 -> new EntityNotFoundException("Type alerte introuvable"));
//         Alerter alerte = new Alerter();
//         alerte.setDateDesFaits(request.dateDesFaits());
//         alerte.setLatitude(request.latitude());
//         alerte.setLongitude(request.longitude());
//         alerte.setMessage(request.message());
//         alerte.setPreuves(request.preuves());
//         alerte.setUtilisateur(user);
//         alerte.setTypeAlerte(type);
//         alerte.setStatus(Status.NOUVEAU);
//         Alerter saved = alerteRepository.save(alerte);
//         return mapToResponse(saved);
//     }
    public List<AlerteResponse> getAllAlerte() {

        return alerteRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public AlerteResponse assignAgent(
            Long alerteId,
            Long agentId
    ) {

        Alerter alerte = alerteRepository.findById(alerteId)
                .orElseThrow(()
                        -> new EntityNotFoundException("Alerte introuvable"));

        Utilisateur agent;
        agent = utilisateurRepository.findById(agentId)
                .orElseThrow(()
                        -> new EntityNotFoundException("Agent introuvable"));

        alerte.setAgentAssigne(agent);
        alerte.setStatus(Status.EN_COURS);

        return mapToResponse(
                alerteRepository.save(alerte)
        );
    }

    public Resource downloadFile(String fileName) throws IOException {

        Path path = Paths.get(uploadDir).resolve(fileName);

        Resource resource = new UrlResource(path.toUri());

        if (!resource.exists()) {
            throw new RuntimeException("Fichier introuvable");
        }

        return resource;
    }

    private AlerteResponse mapToResponse(Alerter a) {

        Set<MediaResponse> medias = a.getMedias()
                .stream()
                .map(m -> new MediaResponse(
                m.getId(),
                m.getFileName(),
                m.getFileType()
        ))
                .collect(Collectors.toSet());

        return new AlerteResponse(
                a.getId(),
                a.getDateDesFaits(),
                a.getLatitude(),
                a.getLongitude(),
                a.getMessage(),
                medias,
                a.getStatus(),
                a.getUtilisateur().getId(),
                a.getUtilisateur().getFirstname(),
                a.getAgentAssigne() != null
                ? a.getAgentAssigne().getId() : null,
                a.getAgentAssigne() != null
                ? a.getAgentAssigne().getFirstname() : null,
                a.getTypeAlerte().getId(),
                a.getTypeAlerte().getTypeAlerteName()
        );
    }

}
