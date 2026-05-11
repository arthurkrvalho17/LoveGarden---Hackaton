package com.br.LoveGarden.dto;

import com.br.LoveGarden.model.Flower;
import com.br.LoveGarden.model.Theme;

import java.time.LocalDateTime;
import java.util.List;

public record GardenDto(
        String id,
        String nome,
        Theme theme,
        List<Flower> flowers,
        LocalDateTime createdAt
) {
}
