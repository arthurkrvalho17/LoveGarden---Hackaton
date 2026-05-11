package com.br.LoveGarden.model;

import lombok.*;

@Data
public class Theme {

    private String sky;

    private String music;

    private String weatherEffect;

    public String getSky() {
        return sky;
    }

    public void setSky(String sky) {
        this.sky = sky;
    }

    public String getMusic() {
        return music;
    }

    public void setMusic(String music) {
        this.music = music;
    }

    public String getWeatherEffect() {
        return weatherEffect;
    }

    public void setWeatherEffect(String weatherEffect) {
        this.weatherEffect = weatherEffect;
    }
}
