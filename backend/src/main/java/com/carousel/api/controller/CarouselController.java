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
        try {
            return ResponseEntity.ok(Map.of("data", carouselService.generate(
                body.getOrDefault("theme", "philosophie stoïcienne"),
                body.getOrDefault("style", "sombre et épuré"))));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/generate-devine")
    public ResponseEntity<?> generateDevine(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(Map.of("data", carouselService.generateDevine(
                body.getOrDefault("theme", "philosophie stoïcienne"),
                body.getOrDefault("style", "sombre et épuré"))));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/generate-philo")
    public ResponseEntity<?> generatePhilo(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(Map.of("data", carouselService.generatePhilo(
                body.getOrDefault("question", "Pourquoi le monde n'a pas de sens"),
                body.getOrDefault("style", "sombre et épuré"))));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/generate-moderne")
    public ResponseEntity<?> generateModerne(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(Map.of("data", carouselService.generateModerne(
                body.getOrDefault("theme", "philosophie stoïcienne"),
                body.getOrDefault("style", "sombre et épuré"))));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/generate-script")
    public ResponseEntity<?> generateScript(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(Map.of("data", carouselService.generateScript(
                body.getOrDefault("transcription", ""),
                body.getOrDefault("style", "sombre"))));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/generate-video")
    public ResponseEntity<?> generateVideo(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(Map.of("data", carouselService.generateVideo(
                body.getOrDefault("transcription", ""),
                body.getOrDefault("style", "sombre"))));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/generate-top3")
    public ResponseEntity<?> generateTop3(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(Map.of("data", carouselService.generateTop3(
                body.getOrDefault("auteur", "Marc Aurèle"),
                body.getOrDefault("style", "sombre et épuré"))));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
