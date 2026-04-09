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
            IMPORTANT : maximum 10 mots par champ texte, phrases très courtes et percutantes.
            Tu es un expert TikTok en carrousels viraux sur les citations du monde.
            Slide 1 = citation directe percutante. Slide 2 = question mystère courte. Slides 3-4 = contexte court. Slide 5 = CTA court.
            Thème : %s. Style : %s.
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["tag1","tag2","tag3","tag4","tag5","tag6"],"slides":[{"type":"hook","citation":"citation max 10 mots","auteur":"Prénom Nom","origine":"pays"},{"type":"intrigue","question":"question max 7 mots","teaser":"phrase max 8 mots"},{"type":"context","titre":"mot ou deux","corps":"max 15 mots"},{"type":"lesson","titre":"mot ou deux","corps":"max 15 mots"},{"type":"cta","texte":"phrase max 7 mots","question":"question max 8 mots"}]}
            """.formatted(theme, style);
    }

    private String buildPromptDevine(String theme, String style) {
        return """
            IMPORTANT : maximum 10 mots par champ texte, phrases très courtes.
            Tu es un expert TikTok en carrousels viraux sur les citations du monde.
            Format Devine l'auteur : slide 1 = accroche courte, slide 2 = citation sans auteur + indice, slide 3 = révélation + bio courte.
            Thème : %s. Style : %s.
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["tag1","tag2","tag3","tag4","tag5","tag6"],"slides":[{"type":"devine_question","intro":"phrase max 8 mots","question":"question max 7 mots"},{"type":"devine_citation","citation":"citation max 12 mots","indice":"indice max 8 mots"},{"type":"devine_revelation","auteur":"Prénom Nom","bio":"max 20 mots sur cet auteur"}]}
            """.formatted(theme, style);
    }

    private String buildPromptPhilo(String question, String style) {
        return """
            IMPORTANT : maximum 10 mots par champ texte, phrases très courtes.
            Tu es un expert TikTok en carrousels viraux sur la philosophie.
            Format Philo Express : slide 1 = question percutante, slide 2 = citation d'un penseur, slide 3 = développement court, slide 4 = conclusion + CTA.
            Question : %s. Style : %s.
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["tag1","tag2","tag3","tag4","tag5","tag6"],"slides":[{"type":"philo_question","question":"question max 8 mots","teaser":"phrase max 8 mots"},{"type":"philo_citation","penseur":"Nom, époque","citation":"citation max 12 mots","explication":"max 12 mots"},{"type":"context","titre":"mot ou deux","corps":"max 15 mots"},{"type":"philo_conclusion","conclusion":"phrase max 10 mots","question_cta":"question max 8 mots"}]}
            """.formatted(question, style);
    }

    private String buildPromptModerne(String theme, String style) {
        return """
            IMPORTANT : maximum 10 mots par champ texte, phrases très courtes.
            Tu es un expert TikTok en carrousels viraux sur les citations du monde.
            Format Citation moderne : slide 1 = citation originale courte, slide 2 = traduction en argot gen Z courte et drôle, slide 3 = CTA.
            Thème : %s. Style : %s.
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["tag1","tag2","tag3","tag4","tag5","tag6"],"slides":[{"type":"moderne_original","auteur":"Prénom Nom","citation":"citation max 10 mots"},{"type":"moderne_traduction","moderne":"traduction argot max 12 mots","contexte":"max 8 mots"},{"type":"moderne_cta","texte":"phrase fun max 7 mots","question":"question max 8 mots"}]}
            """.formatted(theme, style);
    }

    private String buildPromptTop3(String auteur, String style) {
        return """
            IMPORTANT : maximum 10 mots par champ texte, phrases très courtes.
            Tu es un expert TikTok en carrousels viraux sur les citations du monde.
            Format Top 3 : slide 1 = intro auteur, slides 2-4 = top 3 citations avec explication courte, slide 5 = CTA.
            Auteur : %s. Style : %s.
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["tag1","tag2","tag3","tag4","tag5","tag6"],"slides":[{"type":"top3_intro","auteur":"%s","description":"max 15 mots sur cet auteur"},{"type":"top3_citation","numero":"1","citation":"citation max 12 mots","explication":"max 8 mots"},{"type":"top3_citation","numero":"2","citation":"citation max 12 mots","explication":"max 8 mots"},{"type":"top3_citation","numero":"3","citation":"citation max 12 mots","explication":"max 8 mots"},{"type":"top3_cta","texte":"phrase max 7 mots","question":"ta citation préférée ?"}]}
            """.formatted(auteur, style, auteur);
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
