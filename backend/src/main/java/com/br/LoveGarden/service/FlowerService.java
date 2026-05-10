package com.br.LoveGarden.service;

import com.br.LoveGarden.model.Flower;
import com.br.LoveGarden.repository.FlowerRepository;
import org.springframework.stereotype.Service;

@Service
public class FlowerService {

    private final FlowerRepository repository;

    public FlowerService(FlowerRepository repository) {
        this.repository = repository;
    }

    public Flower salvar(Flower flower) {
        return repository.save(flower);
    }
}
