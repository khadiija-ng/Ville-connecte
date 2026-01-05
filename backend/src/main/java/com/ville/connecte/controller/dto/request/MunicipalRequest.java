package com.ville.connecte.controller.dto.request;

import jakarta.validation.constraints.NotBlank;

public record MunicipalRequest(@NotBlank String name,@NotBlank String address) {

}
