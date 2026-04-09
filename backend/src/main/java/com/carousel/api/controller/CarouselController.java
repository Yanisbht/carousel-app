package com.carousel.api.controller;

import com.carousel.api.service.CarouselService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CarouselController {

    private final CarouselService carouselService;

    public CarouselController(CarouselService carouselService) {
        this.carouselService = carouselService;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generate(@RequestBody Map<String, String> body) {
        String theme = body.getOrDefault("theme", "philosophie stoïcienne");
        String style = body.getOrDefault("style", "sombre et épuré");
        try {
            String result = carouselService.generate(theme, style);
            return ResponseEntity.ok(Map.of("data", result));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/generate-devine")
    public ResponseEntity<?> generateDevine(@RequestBody Map<String, String> body) {
        String theme = body.getOrDefault("theme", "philosophie stoïcienne");
        String style = body.getOrDefault("style", "sombre et épuré");
        try {
            String result = carouselService.generateDevine(theme, style);
            return ResponseEntity.ok(Map.of("data", result));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/generate-philo")
    public ResponseEntity<?> generatePhilo(@RequestBody Map<String, String> body) {
        String question = body.getOrDefault("question", "Pourquoi le monde n'a pas de sens");
        String style = body.getOrDefault("style", "sombre et épuré");
        try {
            String result = carouselService.generatePhilo(question, style);
            return ResponseEntity.ok(Map.of("data", result));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
