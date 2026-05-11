package com.br.LoveGarden.controller;

import com.br.LoveGarden.dto.GardenDto;
import com.br.LoveGarden.mapper.GardenMapper;
import com.br.LoveGarden.model.Garden;
import com.br.LoveGarden.service.GardenService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/garden")
public class GardenController {

    private final GardenMapper mapper;
    private final GardenService service;

    public GardenController(GardenMapper mapper, GardenService service) {
        this.mapper = mapper;
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Garden salvar(@RequestBody GardenDto gardenDto) {
        Garden entity = mapper.toEntity(gardenDto);
        return service.salvar(entity);
    }

    @PutMapping("/{id}")
    public Garden atualizar(@PathVariable String id, @RequestBody GardenDto gardenDto) {
        Garden entity = mapper.toEntity(gardenDto);
        entity.setId(id);
        return service.atualizar(entity);
    }

    @GetMapping
    public List<Garden> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Garden getJardim(@PathVariable String id) {
        return service.getJardim(id);
    }
}
