package com.ville.connecte.controller.dto.request;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AlerteRequest(

        LocalDate dateDesFaits,
        Double latitude,
        Double longitude,
        @NotNull
        Long utilisateurId,
        @NotBlank
        String message,
        List<MultipartFile> fichiers,
        Long typeAlerteId
        ) {

}
