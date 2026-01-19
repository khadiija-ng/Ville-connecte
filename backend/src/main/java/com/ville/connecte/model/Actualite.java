package com.ville.connecte.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Actualite {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int actualiteId;
    private String actualiteImage;
    private String actualiteTitle;
    private String actualiteDescription;
    private LocalDate actualiteDate;

}
