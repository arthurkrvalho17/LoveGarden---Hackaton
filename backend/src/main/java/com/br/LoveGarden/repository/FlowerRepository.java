package com.br.LoveGarden.repository;

import com.br.LoveGarden.model.Flower;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FlowerRepository extends MongoRepository<Flower, String> {
}
