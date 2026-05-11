package com.br.LoveGarden.repository;

import com.br.LoveGarden.model.Garden;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GardenRepository extends MongoRepository<Garden, String> {
}
