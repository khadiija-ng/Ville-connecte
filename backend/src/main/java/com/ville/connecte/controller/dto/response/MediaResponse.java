package com.ville.connecte.controller.dto.response;

public record MediaResponse(
        Long id,
        String fileName,
        String fileType
) {}