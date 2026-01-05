package com.ville.connecte.controller.dto.request;
import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;


public record UtilisateurRequest(@NotBlank String firstname,@NotBlank String lastname,@NotBlank @Email String email,@NotBlank String lieuDeNaissance,LocalDate  dateDeNaissance,@NotBlank String password ) {

}
