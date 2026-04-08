package com.carousel.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class CarouselService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    public String generate(String theme, String style) throws Exception {
        String prompt = buildPrompt(theme, style);

        String requestBody = """
            {
              "contents": [{"parts": [{"text": "%s"}]}],
              "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 1024,
                "responseMimeType": "application/json"
              }
            }
            """.formatted(escapeJson(prompt));

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(GEMINI_URL + "?key=" + apiKey))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Gemini API error: " + response.statusCode() + " - " + response.body());
        }

        return extractContent(response.body());
    }

    private String buildPrompt(String theme, String style) {
        return """
            Tu es un expert en carrousels TikTok viraux sur les citations du monde.
            Crée un carrousel TikTok de 5 slides sur le thème : %s. Style visuel : %s.
            Retourne UNIQUEMENT ce JSON sans rien d'autre, sans backticks :
            {"citation":"citation courte percutante","auteur":"Nom, contexte","slides":[{"type":"cover","titre":"titre max 6 mots","soustitre":"sous-titre max 8 mots"},{"type":"quote","texte":"citation complète","auteur":"auteur"},{"type":"context","titre":"titre court","corps":"2-3 phrases contexte historique"},{"type":"lesson","titre":"titre court","corps":"2-3 phrases applicables aujourd'hui"},{"type":"cta","texte":"phrase d'accroche finale","sub":"question courte pour engager"}],"hashtags":["tag1","tag2","tag3","tag4","tag5","tag6"]}
            """.formatted(theme, style);
    }

    private String extractContent(String responseBody) {
        int firstBrace = responseBody.indexOf("\"text\": \"{");
        if (firstBrace == -1) firstBrace = responseBody.indexOf("\"text\":\"{");
        
        if (firstBrace != -1) {
            int jsonStart = responseBody.indexOf('{', firstBrace + 7);
            int depth = 0;
            int jsonEnd = -1;
            for (int i = jsonStart; i < responseBody.length(); i++) {
                char c = responseBody.charAt(i);
                if (c == '{') depth++;
                else if (c == '}') {
                    depth--;
                    if (depth == 0) { jsonEnd = i; break; }
                }
            }
            if (jsonEnd != -1) {
                String escaped = responseBody.substring(jsonStart, jsonEnd + 1);
                return escaped.replace("\\\"", "\"").replace("\\n", " ").replace("\\\\", "\\");
            }
        }

        int jsonStart = responseBody.indexOf('{');
        int depth = 0;
        int jsonEnd = -1;
        boolean inString = false;
        boolean escape = false;
        for (int i = jsonStart; i < responseBody.length(); i++) {
            char c = responseBody.charAt(i);
            if (escape) { escape = false; continue; }
            if (c == '\\') { escape = true; continue; }
            if (c == '"') { inString = !inString; continue; }
            if (!inString) {
                if (c == '{') depth++;
                else if (c == '}') {
                    depth--;
                    if (depth == 0) { jsonEnd = i; break; }
                }
            }
        }
        if (jsonEnd == -1) throw new RuntimeException("JSON introuvable dans: " + responseBody.substring(0, Math.min(300, responseBody.length())));
        return responseBody.substring(jsonStart, jsonEnd + 1);
    }

    private String escapeJson(String text) {
        return text.replace("\\", "\\\\")
                   .replace("\"", "\\\"")
                   .replace("\n", "\\n")
                   .replace("\r", "\\r")
                   .replace("\t", "\\t");
    }
}
