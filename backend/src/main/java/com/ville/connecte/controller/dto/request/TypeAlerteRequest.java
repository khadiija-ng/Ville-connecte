package com.ville.connecte.controller.dto.request;
import jakarta.validation.constraints.NotBlank;

public record TypeAlerteRequest(
        Long id,
        @NotBlank String typeAlerteName,
        @NotBlank String typeAlerteDescription
) {}
