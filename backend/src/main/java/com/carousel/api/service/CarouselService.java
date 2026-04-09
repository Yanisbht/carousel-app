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
            Tu es un expert en croissance TikTok et carrousels viraux sur les citations du monde.
            Règle 1 : slide 1 = citation directe percutante, accroche en 1 seconde.
            Règle 2 : slide 2 = question mystère pour forcer le scroll.
            Règle 3 : slides 3-4 = valeur et contexte.
            Règle 4 : slide 5 = CTA avec question pour provoquer les commentaires.
            Crée un carrousel TikTok de 5 slides sur le thème : %s. Style visuel : %s.
            Retourne UNIQUEMENT ce JSON sans rien d'autre, sans backticks, sans markdown :
            {"hashtags":["tag1","tag2","tag3","tag4","tag5","tag6"],"slides":[{"type":"hook","citation":"citation courte et percutante max 15 mots","auteur":"Prénom Nom","origine":"pays ou culture"},{"type":"intrigue","question":"question mystérieuse max 8 mots","teaser":"1 phrase qui donne envie d'en savoir plus"},{"type":"context","titre":"contexte","corps":"2 phrases courtes sur le contexte historique"},{"type":"lesson","titre":"aujourd'hui","corps":"2 phrases sur comment appliquer maintenant"},{"type":"cta","texte":"phrase finale impactante max 8 mots","question":"question courte pour provoquer des commentaires"}]}
            """.formatted(theme, style);
    }

    private String buildPromptDevine(String theme, String style) {
        return """
            Tu es un expert en carrousels TikTok viraux sur les citations du monde.
            Format "Devine l'auteur" : slide 1 = accroche engageante, slide 2 = citation sans révéler l'auteur avec un indice, slide 3 = révélation auteur + mini bio.
            Crée un carrousel "Devine l'auteur" sur le thème : %s. Style visuel : %s.
            Retourne UNIQUEMENT ce JSON sans rien d'autre, sans backticks, sans markdown :
            {"hashtags":["tag1","tag2","tag3","tag4","tag5","tag6"],"slides":[{"type":"devine_question","intro":"phrase d'accroche courte","question":"question engageante max 8 mots"},{"type":"devine_citation","citation":"citation célèbre et percutante","indice":"indice subtil sur l'auteur sans révéler son nom"},{"type":"devine_revelation","auteur":"Prénom Nom","bio":"2-3 phrases sur qui est cet auteur et pourquoi sa pensée est importante"}]}
            """.formatted(theme, style);
    }

    private String buildPromptPhilo(String question, String style) {
        return """
            Tu es un expert en carrousels TikTok viraux sur la philosophie.
            Format "Philo Express" : slide 1 = question universelle percutante, slide 2 = un penseur avec sa citation, slide 3 = développement de sa pensée, slide 4 = conclusion + CTA.
            Crée un carrousel "Philo Express" sur cette question : %s. Style visuel : %s.
            Retourne UNIQUEMENT ce JSON sans rien d'autre, sans backticks, sans markdown :
            {"hashtags":["tag1","tag2","tag3","tag4","tag5","tag6"],"slides":[{"type":"philo_question","question":"la question reformulée de façon percutante","teaser":"phrase mystérieuse qui donne envie de lire la suite"},{"type":"philo_citation","penseur":"Nom du penseur, époque","citation":"citation courte et percutante","explication":"1-2 phrases d'explication simple"},{"type":"context","titre":"sa pensée","corps":"2-3 phrases de développement sur cette philosophie"},{"type":"philo_conclusion","conclusion":"réponse synthèse en 1 phrase forte","question_cta":"question courte pour provoquer des commentaires"}]}
            """.formatted(question, style);
    }

    private String buildPromptModerne(String theme, String style) {
        return """
            Tu es un expert en carrousels TikTok viraux sur les citations du monde.
            Format "Citation en moderne" : slide 1 = citation originale d'un philosophe, slide 2 = traduction en langage moderne/argot actuel, slide 3 = CTA qui demande si les gens kiffent ce format.
            Crée un carrousel "Citation en moderne" sur le thème : %s. Style visuel : %s.
            La traduction doit être drôle, authentique, en langage de la génération Z française (pas vulgaire).
            Retourne UNIQUEMENT ce JSON sans rien d'autre, sans backticks, sans markdown :
            {"hashtags":["tag1","tag2","tag3","tag4","tag5","tag6"],"slides":[{"type":"moderne_original","auteur":"Prénom Nom","citation":"citation originale courte et connue"},{"type":"moderne_traduction","moderne":"la même idée en langage moderne/argot gen Z","contexte":"en 1 phrase pourquoi c'est toujours vrai"},{"type":"moderne_cta","texte":"phrase d'accroche finale fun max 8 mots","question":"question pour les commentaires"}]}
            """.formatted(theme, style);
    }

    private String buildPromptTop3(String auteur, String style) {
        return """
            Tu es un expert en carrousels TikTok viraux sur les citations du monde.
            Format "Top 3 citations" : slide 1 = intro sur l'auteur, slides 2-4 = les 3 meilleures citations avec explication courte, slide 5 = CTA.
            Crée un carrousel "Top 3 citations" pour : %s. Style visuel : %s.
            Retourne UNIQUEMENT ce JSON sans rien d'autre, sans backticks, sans markdown :
            {"hashtags":["tag1","tag2","tag3","tag4","tag5","tag6"],"slides":[{"type":"top3_intro","auteur":"%s","description":"1-2 phrases percutantes sur qui est cet auteur et son impact"},{"type":"top3_citation","numero":"1","citation":"première citation marquante","explication":"1 phrase sur ce qu'elle signifie"},{"type":"top3_citation","numero":"2","citation":"deuxième citation marquante","explication":"1 phrase sur ce qu'elle signifie"},{"type":"top3_citation","numero":"3","citation":"troisième citation marquante","explication":"1 phrase sur ce qu'elle signifie"},{"type":"top3_cta","texte":"phrase finale max 8 mots","question":"ta citation préférée c'est laquelle ?"}]}
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
