package com.ville.connecte.model;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Alerter {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private LocalDate dateDesFaits;
    private Double latitude;
    private Double longitude;

    @ManyToOne
    private Utilisateur utilisateur;
    private String message;
    
    @OneToMany(mappedBy = "alerte", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Media> medias = new HashSet<>();
    @ManyToOne
    private Utilisateur agentAssigne;

    @Enumerated(EnumType.STRING)
    private Status status;
    @ManyToOne
    @JoinColumn(name = "type_alerte_id")
    private TypeAlerte typeAlerte;

}
