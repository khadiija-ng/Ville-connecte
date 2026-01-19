package com.ville.connecte.controller.web;

import java.io.IOException;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ville.connecte.controller.dto.request.AlerteRequest;
import com.ville.connecte.controller.dto.request.TypeAlerteRequest;
import com.ville.connecte.controller.dto.response.AlerteResponse;
import com.ville.connecte.controller.dto.response.TypeAlerteResponse;
import com.ville.connecte.service.AlerteService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class AlerteController {

    private final AlerteService service;

    public AlerteController(AlerteService service) {
        this.service = service;
    }

    @PostMapping("/type-alerte")
    public ResponseEntity<TypeAlerteResponse> create(
            @Valid @RequestBody TypeAlerteRequest request) {

        return ResponseEntity.ok(service.save(request));
    }

    @GetMapping("/type-alerte")
    public ResponseEntity<List<TypeAlerteResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/type-alerte/{id}")
    public ResponseEntity<TypeAlerteResponse> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(service.getById(id));
    }

    @DeleteMapping("/type-alerte/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    //-------------------------------alerte--------------------------------------------
    @PostMapping(
            value = "/alertes",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<AlerteResponse> createAlerte(
            @RequestPart("data") AlerteRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) throws IOException {
        return ResponseEntity.ok(
                service.save(request, files)
        );
    }

    @GetMapping("/alertes")
    public ResponseEntity<List<AlerteResponse>> getAllAlerte() {

        return ResponseEntity.ok(service.getAllAlerte());
    }

    @PutMapping("alertes/{alerteId}/assign/{agentId}")
    public ResponseEntity<AlerteResponse> assignAgent(
            @PathVariable Long alerteId,
            @PathVariable Long agentId) {

        return ResponseEntity.ok(
                service.assignAgent(alerteId, agentId)
        );
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> download(
            @PathVariable String fileName
    ) throws IOException {

        Resource resource = service.downloadFile(fileName);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

}
