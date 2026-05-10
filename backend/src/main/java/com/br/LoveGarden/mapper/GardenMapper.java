package com.br.LoveGarden.mapper;

import com.br.LoveGarden.dto.GardenDto;
import com.br.LoveGarden.model.Garden;
import org.mapstruct.Mapper;

@Mapper(componentModel ="spring")
public interface GardenMapper {

    Garden toEntity(GardenDto dto);
}
