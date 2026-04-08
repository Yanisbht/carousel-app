package com.carousel.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class CarouselService {

    @Value("${anthropic.api.key}")
    private String apiKey;

    private static final String ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
    private static final String MODEL = "claude-sonnet-4-20250514";

    public String generate(String theme, String style) throws Exception {
        String prompt = buildPrompt(theme, style);

        String requestBody = """
            {
              "model": "%s",
              "max_tokens": 1024,
              "system": "Tu es un expert en carrousels TikTok viraux. Réponds UNIQUEMENT avec un JSON valide, rien d'autre. Pas de backticks, pas de markdown.",
              "messages": [{"role": "user", "content": "%s"}]
            }
            """.formatted(MODEL, escapeJson(prompt));

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(ANTHROPIC_URL))
            .header("Content-Type", "application/json")
            .header("x-api-key", apiKey)
            .header("anthropic-version", "2023-06-01")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Anthropic API error: " + response.statusCode() + " - " + response.body());
        }

        return extractContent(response.body());
    }

    private String buildPrompt(String theme, String style) {
        return """
            Crée un carrousel TikTok de 5 slides sur le thème : %s. Style visuel : %s.
            Retourne UNIQUEMENT ce JSON sans rien d'autre :
            {"citation":"citation courte percutante","auteur":"Nom, contexte","slides":[{"type":"cover","titre":"titre max 6 mots","soustitre":"sous-titre max 8 mots"},{"type":"quote","texte":"citation complète","auteur":"auteur"},{"type":"context","titre":"titre court","corps":"2-3 phrases contexte historique"},{"type":"lesson","titre":"titre court","corps":"2-3 phrases applicables aujourd'hui"},{"type":"cta","texte":"phrase d'accroche finale","sub":"question courte pour engager"}],"hashtags":["tag1","tag2","tag3","tag4","tag5","tag6"]}
            """.formatted(theme, style);
    }

    private String extractContent(String responseBody) {
        int start = responseBody.indexOf("\"text\":\"");
        if (start == -1) throw new RuntimeException("Champ text introuvable dans la réponse");
        start += 8;
        int end = responseBody.lastIndexOf("\"}");
        if (end == -1) throw new RuntimeException("Fin du champ text introuvable");
        String raw = responseBody.substring(start, end + 1);
        raw = raw.replace("\\n", "").replace("\\\"", "\"").replace("\\\\", "\\");
        int firstBrace = raw.indexOf('{');
        int lastBrace = raw.lastIndexOf('}');
        if (firstBrace == -1 || lastBrace == -1) throw new RuntimeException("JSON introuvable");
        return raw.substring(firstBrace, lastBrace + 1);
    }

    private String escapeJson(String text) {
        return text.replace("\\", "\\\\")
                   .replace("\"", "\\\"")
                   .replace("\n", "\\n")
                   .replace("\r", "\\r")
                   .replace("\t", "\\t");
    }
}
