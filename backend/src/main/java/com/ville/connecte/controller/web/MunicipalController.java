package com.ville.connecte.controller.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ville.connecte.controller.dto.request.MunicipalRequest;
import com.ville.connecte.controller.dto.response.MunicipalResponse;
import com.ville.connecte.service.MunicipalService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/municipal")
public class MunicipalController {

    private final MunicipalService municipalService;

    public MunicipalController(MunicipalService municipalService) {
        this.municipalService = municipalService;
    }

    @PostMapping
    public ResponseEntity<?> create(
            @Valid @RequestBody MunicipalRequest request
    ) {
        return ResponseEntity.ok(municipalService.create(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MunicipalResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(municipalService.getById(id));
    }
}
