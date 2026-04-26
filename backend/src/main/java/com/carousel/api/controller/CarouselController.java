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

    @PostMapping("/generate-audio")
    public org.springframework.http.ResponseEntity<byte[]> generateAudio(@RequestBody Map<String, String> body) {
        try {
            byte[] audio = carouselService.generateAudio(body.getOrDefault("text", ""));
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("Content-Type", "audio/mpeg");
            headers.set("Access-Control-Allow-Origin", "*");
            return new org.springframework.http.ResponseEntity<>(audio, headers, org.springframework.http.HttpStatus.OK);
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/generate-oneshot")
    public ResponseEntity<?> generateOneShot(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(Map.of("data", carouselService.generateOneShot(
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

    @PostMapping("/basket/citations")
    public ResponseEntity<?> basketCitations(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(Map.of("data", carouselService.basketCitations(
                body.getOrDefault("joueur", "LeBron James"),
                body.getOrDefault("style", "sombre"))));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/basket/stats")
    public ResponseEntity<?> basketStats(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(Map.of("data", carouselService.basketStats(
                body.getOrDefault("joueur", "LeBron James"),
                body.getOrDefault("style", "sombre"))));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/basket/mentalite")
    public ResponseEntity<?> basketMentalite(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(Map.of("data", carouselService.basketMentalite(
                body.getOrDefault("joueur", "LeBron James"),
                body.getOrDefault("style", "sombre"))));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/genz/nostalgie")
    public ResponseEntity<?> genzNostalgie(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(Map.of("data", carouselService.genzNostalgie(
                body.getOrDefault("ere", "2015 - 2018"),
                body.getOrDefault("style", "sombre"))));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/genz/pensees")
    public ResponseEntity<?> genzPensees(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(Map.of("data", carouselService.genzPensees(
                body.getOrDefault("style", "sombre"))));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/genz/cinema")
    public ResponseEntity<?> genzCinema(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(Map.of("data", carouselService.genzCinema(
                body.getOrDefault("style", "sombre"))));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/basket/vie")
    public ResponseEntity<?> basketVie(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(Map.of("data", carouselService.basketVie(
                body.getOrDefault("style", "sombre"))));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/basket/motivation")
    public ResponseEntity<?> basketMotivation(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(Map.of("data", carouselService.basketMotivation(
                body.getOrDefault("style", "sombre"))));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/basket/film")
    public ResponseEntity<?> basketFilm(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(Map.of("data", carouselService.basketFilm(
                body.getOrDefault("film", "Coach Carter"),
                body.getOrDefault("style", "sombre"))));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/basket/action")
    public ResponseEntity<?> basketAction(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(Map.of("data", carouselService.basketAction(
                body.getOrDefault("joueur", "LeBron James"),
                body.getOrDefault("action", "dunk en contre-attaque"),
                body.getOrDefault("style", "sombre"))));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/proxy-image")
    public ResponseEntity<?> proxyImage(@RequestParam String url) {
        try {
            byte[] imageData = carouselService.proxyImage(url);
            String contentType = url.contains(".png") ? "image/png" : "image/jpeg";
            return ResponseEntity.ok()
                .header("Content-Type", contentType)
                .body(imageData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/images")
    public ResponseEntity<?> getImages(@RequestParam String query, @RequestParam(defaultValue = "5") int count, @RequestParam(defaultValue = "0") int start) {
        try {
            String result = carouselService.fetchImages(query, count, start);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
