package com.ville.connecte.controller.dto.response;
import java.time.LocalDate;


public record UtilisateurResponse(String firstname,String lastname,String email,LocalDate dateDeNaissance,String lieuDeNaissance ) {

}
