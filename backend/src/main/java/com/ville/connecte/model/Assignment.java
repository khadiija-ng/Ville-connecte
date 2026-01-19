package com.ville.connecte.model;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    private Alerter alerte;

    @ManyToOne
    private Utilisateur agent;

    @ManyToOne
    private Utilisateur assignerPar;

    private LocalDate dateAssignation;

    @Enumerated(EnumType.STRING)
    private AssignmentStatus status; // ASSIGNEE, REASSIGNEE, ANNULEE
}