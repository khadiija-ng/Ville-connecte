package com.ville.connecte.service;

import org.springframework.stereotype.Service;

import com.ville.connecte.controller.dto.request.MunicipalRequest;
import com.ville.connecte.controller.dto.response.MunicipalResponse;
import com.ville.connecte.model.Municipal;
import com.ville.connecte.repository.MunicipalRepository;

@Service
public class MunicipalService {

    private final MunicipalRepository municipalRepository;

    public MunicipalService(MunicipalRepository municipalRepository) {
        this.municipalRepository = municipalRepository;
    }

    public MunicipalResponse create(MunicipalRequest request) {

        Municipal municipal = new Municipal();
        municipal.setName(request.name());
        municipal.setAddress(request.address());

        Municipal saved = municipalRepository.save(municipal);

        return new MunicipalResponse(
                saved.getId(),
                saved.getName(),
                saved.getAddress()
        );
    }

    public MunicipalResponse getById(Long id) {
        Municipal municipal = municipalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Municipalité introuvable"));

        return new MunicipalResponse(
                municipal.getId(),
                municipal.getName(),
                municipal.getAddress()
        );
    }
}