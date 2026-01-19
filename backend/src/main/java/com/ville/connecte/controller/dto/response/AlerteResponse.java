package com.ville.connecte.controller.dto.response;

import java.time.LocalDate;
import java.util.Set;

import com.ville.connecte.model.Status;

public record AlerteResponse(
        Long id,
        LocalDate dateDesFaits,
        Double latitude,
        Double longitude,
        String message,
        Set<MediaResponse> medias,
        Status status,
        Long utilisateurId,
        String utilisateurNom,
        Long agentId,
        String agentNom,
        Long typeAlerteId,
        String typeAlerteName
        ) {

}
