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
        return callGemini(buildPrompt(theme, style));
    }

    public String generateDevine(String theme, String style) throws Exception {
        return callGemini(buildPromptDevine(theme, style));
    }

    public String generatePhilo(String question, String style) throws Exception {
        return callGemini(buildPromptPhilo(question, style));
    }

    public String generateModerne(String theme, String style) throws Exception {
        return callGemini(buildPromptModerne(theme, style));
    }

    public String generateTop3(String auteur, String style) throws Exception {
        return callGemini(buildPromptTop3(auteur, style));
    }

    private String callGemini(String prompt) throws Exception {
        String requestBody = """
            {
              "contents": [{"parts": [{"text": "%s"}]}],
              "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 8192,
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
            Tu crées des carrousels TikTok viraux sur les citations du monde.
            RÈGLE ABSOLUE : chaque champ texte = MAX 6 MOTS. Jamais plus. Compte les mots.
            Slide 1 = citation courte percutante. Slide 2 = question mystère 5 mots max. Slides 3-4 = contexte ultra court. Slide 5 = CTA court.
            Thème : %s.
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["tag1","tag2","tag3","tag4","tag5","tag6"],"slides":[{"type":"hook","citation":"MAX 8 MOTS","auteur":"Prénom Nom","origine":"pays"},{"type":"intrigue","question":"MAX 5 MOTS ?","teaser":"MAX 6 MOTS"},{"type":"context","titre":"2 MOTS MAX","corps":"MAX 8 MOTS"},{"type":"lesson","titre":"2 MOTS MAX","corps":"MAX 8 MOTS"},{"type":"cta","texte":"MAX 6 MOTS","question":"MAX 6 MOTS ?"}]}
            """.formatted(theme);
    }

    private String buildPromptDevine(String theme, String style) {
        return """
            Tu crées des carrousels TikTok viraux sur les citations du monde.
            RÈGLE ABSOLUE : chaque champ texte = MAX 8 MOTS. Jamais plus. Compte les mots.
            Thème : %s.
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["tag1","tag2","tag3","tag4","tag5","tag6"],"slides":[{"type":"devine_question","intro":"MAX 6 MOTS","question":"MAX 5 MOTS ?"},{"type":"devine_citation","citation":"MAX 10 MOTS","indice":"MAX 6 MOTS"},{"type":"devine_revelation","auteur":"Prénom Nom","bio":"MAX 12 MOTS"}]}
            """.formatted(theme);
    }

    private String buildPromptPhilo(String question, String style) {
        return """
            Tu crées des carrousels TikTok viraux sur la philosophie.
            RÈGLE ABSOLUE : chaque champ texte = MAX 8 MOTS. Jamais plus. Compte les mots.
            Question : %s.
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["tag1","tag2","tag3","tag4","tag5","tag6"],"slides":[{"type":"philo_question","question":"MAX 6 MOTS ?","teaser":"MAX 6 MOTS"},{"type":"philo_citation","penseur":"Nom époque","citation":"MAX 10 MOTS","explication":"MAX 8 MOTS"},{"type":"context","titre":"2 MOTS","corps":"MAX 8 MOTS"},{"type":"philo_conclusion","conclusion":"MAX 8 MOTS","question_cta":"MAX 6 MOTS ?"}]}
            """.formatted(question);
    }

    private String buildPromptModerne(String theme, String style) {
        return """
            Tu crées des carrousels TikTok viraux sur les citations du monde.
            RÈGLE ABSOLUE : chaque champ texte = MAX 10 MOTS. Jamais plus. Compte les mots.
            Thème : %s.
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["tag1","tag2","tag3","tag4","tag5","tag6"],"slides":[{"type":"moderne_original","auteur":"Prénom Nom","citation":"MAX 10 MOTS"},{"type":"moderne_traduction","moderne":"MAX 10 MOTS en argot gen Z","contexte":"MAX 6 MOTS"},{"type":"moderne_cta","texte":"MAX 6 MOTS","question":"MAX 6 MOTS ?"}]}
            """.formatted(theme);
    }

    private String buildPromptTop3(String auteur, String style) {
        return """
            Tu crées des carrousels TikTok viraux sur les citations du monde.
            RÈGLE ABSOLUE : chaque champ texte = MAX 10 MOTS. Jamais plus. Compte les mots.
            Auteur : %s.
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["tag1","tag2","tag3","tag4","tag5","tag6"],"slides":[{"type":"top3_intro","auteur":"%s","description":"MAX 8 MOTS"},{"type":"top3_citation","numero":"1","citation":"MAX 10 MOTS","explication":"MAX 6 MOTS"},{"type":"top3_citation","numero":"2","citation":"MAX 10 MOTS","explication":"MAX 6 MOTS"},{"type":"top3_citation","numero":"3","citation":"MAX 10 MOTS","explication":"MAX 6 MOTS"},{"type":"top3_cta","texte":"MAX 6 MOTS","question":"ta citation préférée ?"}]}
            """.formatted(auteur, auteur);
    }

    private String extractContent(String responseBody) {
        int firstBrace = responseBody.indexOf("\"text\": \"{");
        if (firstBrace == -1) firstBrace = responseBody.indexOf("\"text\":\"{");

        if (firstBrace != -1) {
            int jsonStart = responseBody.indexOf('{', firstBrace + 7);
            int depth = 0, jsonEnd = -1;
            for (int i = jsonStart; i < responseBody.length(); i++) {
                char c = responseBody.charAt(i);
                if (c == '{') depth++;
                else if (c == '}') { depth--; if (depth == 0) { jsonEnd = i; break; } }
            }
            if (jsonEnd != -1) {
                return responseBody.substring(jsonStart, jsonEnd + 1)
                    .replace("\\\"", "\"").replace("\\n", " ").replace("\\\\", "\\");
            }
        }

        int jsonStart = responseBody.indexOf('{');
        int depth = 0, jsonEnd = -1;
        boolean inString = false, escape = false;
        for (int i = jsonStart; i < responseBody.length(); i++) {
            char c = responseBody.charAt(i);
            if (escape) { escape = false; continue; }
            if (c == '\\') { escape = true; continue; }
            if (c == '"') { inString = !inString; continue; }
            if (!inString) {
                if (c == '{') depth++;
                else if (c == '}') { depth--; if (depth == 0) { jsonEnd = i; break; } }
            }
        }
        if (jsonEnd == -1) throw new RuntimeException("JSON introuvable dans: " + responseBody.substring(0, Math.min(300, responseBody.length())));
        return responseBody.substring(jsonStart, jsonEnd + 1);
    }

    private String escapeJson(String text) {
        return text.replace("\\", "\\\\").replace("\"", "\\\"")
                   .replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t");
    }
}
