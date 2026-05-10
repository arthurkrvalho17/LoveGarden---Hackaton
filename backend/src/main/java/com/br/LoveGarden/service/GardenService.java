package com.br.LoveGarden.service;

import com.br.LoveGarden.model.Garden;
import com.br.LoveGarden.repository.GardenRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class GardenService {

    private final GardenRepository repository;

    public GardenService(GardenRepository repository) {
        this.repository = repository;
    }

    public Garden salvar(Garden garden) {
        if (garden.getCreatedAt() == null)
            garden.setCreatedAt(LocalDateTime.now());
        return repository.save(garden);
    }

    public List<Garden> listar() {
        return repository.findAll();
    }

    public Garden atualizar(Garden garden) {
        if (garden.getId() == null) {
            throw new IllegalArgumentException("Para atualizar, é necessário que o jardim já esteja salvo.");
        }
        return repository.save(garden);
    }

    public void deletar(Garden garden) {
        repository.delete(garden);
    }

    public Garden getJardim(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Link inválido! Por favor insira um link válido"));
    }
}
