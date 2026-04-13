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

    public String fetchImages(String query, int count) throws Exception {
        String safeQuery = query.replace("\"", "\\\"");
        String requestBody = "{\"q\": \"" + safeQuery + "\", \"num\": 20}";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://google.serper.dev/images"))
            .header("Content-Type", "application/json")
            .header("X-API-KEY", "a9ee318fe702c37999db0251e75160c2800994ec")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) throw new RuntimeException("Serper error: " + response.statusCode());

        String body = response.body();
        java.util.List<String> urls = new java.util.ArrayList<>();
        int idx = 0;
        while (urls.size() < count) {
            int start = body.indexOf("\"imageUrl\":\"", idx);
            if (start == -1) break;
            start += 12;
            int end = body.indexOf("\"", start);
            if (end == -1) break;
            String url = body.substring(start, end);
            if (!url.contains(".gif")) urls.add(url);
            idx = end + 1;
        }
        StringBuilder json = new StringBuilder("{\"images\":[");
        for (int i = 0; i < urls.size(); i++) {
            if (i > 0) json.append(",");
            json.append("\"").append(urls.get(i)).append("\"");
        }
        json.append("]}");
        return json.toString();
    }

    public String generateScript(String transcription, String style) throws Exception {
        return callGemini(buildPromptScript(transcription, style));
    }

    public String generateVideo(String transcription, String style) throws Exception {
        return callGemini(buildPromptVideo(transcription, style));
    }

    public String generateTop3(String auteur, String style) throws Exception {
        return callGemini(buildPromptTop3(auteur, style));
    }

    private String callGemini(String prompt) throws Exception {
        String requestBody = """
            {
              "contents": [{"parts": [{"text": "%s"}]}],
              "generationConfig": {
                "temperature": 0.9,
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
            Ton style : fond philosophique sérieux, forme simple et naturelle comme si un ami t'expliquait.
            Pas de jargon. Pas académique. Court, direct, percutant.
            STRUCTURE :
            - Slide 1 (HOOK) : citation courte et percutante qui claque. MAX 8 MOTS.
            - Slide 2 (SUSPENSE) : question courte qui donne envie de scroller. MAX 6 MOTS.
            - Slide 3 (VALEUR) : contexte historique surprenant. Simple. MAX 8 MOTS.
            - Slide 4 (LECON) : comment appliquer ca aujourd'hui. Concret. MAX 8 MOTS.
            - Slide 5 (CTA) : question simple qui divise les opinions. MAX 8 MOTS.
            - HASHTAGS : 2 gros + 2 moyens + 2 niche.
            REGLE ABSOLUE : MAX 8 MOTS par champ. Langage simple et naturel.
            Theme : %s.
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["citation","philosophie","sagesse","mindset","tag5","tag6"],"slides":[{"type":"hook","citation":"citation percutante MAX 8 MOTS","auteur":"Prenom Nom","origine":"pays ou epoque"},{"type":"intrigue","question":"question simple MAX 6 MOTS ?"},{"type":"context","titre":"2 MOTS","corps":"info surprenante MAX 8 MOTS"},{"type":"lesson","titre":"2 MOTS","corps":"lecon concrete MAX 8 MOTS"},{"type":"cta","question":"question qui divise MAX 8 MOTS ?"}]}
            """.formatted(theme);
    }

    private String buildPromptDevine(String theme, String style) {
        return """
            Tu crees des carousels TikTok viraux sur les citations du monde.
            Format Devine l'auteur : slide 1 = question courte, slide 2 = citation sans auteur, slide 3 = revelation auteur + bio courte.
            REGLE ABSOLUE : MAX 10 MOTS par champ.
            Theme : %s.
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["citation","philosophie","sagesse","mindset","tag5","tag6"],"slides":[{"type":"devine_question","intro":"MAX 5 MOTS","question":"MAX 6 MOTS ?"},{"type":"devine_citation","citation":"MAX 10 MOTS","indice":"indice MAX 6 MOTS"},{"type":"devine_revelation","auteur":"Prenom Nom","bio":"fait surprenant MAX 12 MOTS"}]}
            """.formatted(theme);
    }

    private String buildPromptPhilo(String question, String style) {
        return """
            Tu vulgarises la philosophie pour TikTok. Comme un ami qui explique, pas un prof.
            REGLE ABSOLUE : MAX 10 MOTS par champ. Pas de jargon philosophique.
            Question : %s.
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["philosophie","citation","sagesse","mindset","tag5","tag6"],"slides":[{"type":"philo_question","question":"question naturelle MAX 7 MOTS ?","teaser":"accroche simple MAX 6 MOTS"},{"type":"philo_reponse","penseur":"Prenom Nom","reponse":"reponse simple MAX 10 MOTS","citation":"citation courte MAX 8 MOTS"},{"type":"philo_qui","penseur":"Prenom Nom","epoque":"epoque courte","fait":"fait etonnant MAX 10 MOTS"},{"type":"philo_conclusion","lecon":"lecon de vie MAX 8 MOTS","question_cta":"question simple MAX 7 MOTS ?"}]}
            """.formatted(question);
    }

    private String buildPromptModerne(String theme, String style) {
        return """
            Tu crees des carousels TikTok viraux. Format citation moderne.
            REGLE ABSOLUE : MAX 10 MOTS par champ.
            Theme : %s.
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["citation","philosophie","sagesse","mindset","tag5","tag6"],"slides":[{"type":"moderne_original","auteur":"Prenom Nom","citation":"MAX 10 MOTS"},{"type":"moderne_traduction","moderne":"argot gen Z MAX 10 MOTS","contexte":"MAX 6 MOTS"},{"type":"moderne_cta","texte":"MAX 7 MOTS","question":"MAX 7 MOTS ?"}]}
            """.formatted(theme);
    }

    private String buildPromptScript(String transcription, String style) {
        String excerpt = transcription.length() > 1500 ? transcription.substring(0, 1500) : transcription;
        return """
            Tu crees des scripts de videos animees TikTok style anime japonais de 10 secondes.
            3 moments de 3-4 secondes chacun. Ultra visuel et emotionnel.
            Style fixe Kling AI : anime style, 2D japanese animation, cinematic lighting, beautiful atmosphere, smooth motion, portrait 9:16, no text
            REGLE ABSOLUE : MAX 8 MOTS par champ texte. Descriptions en anglais pour Kling.
            Transcription : %s
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["anime","philosophie","citation","aesthetic","japaneseanime","mindset"],"citation_principale":"citation extraite MAX 8 MOTS","auteur":"Prenom Nom","scenes":[{"moment":"1","duree":"3s","citation":"MAX 5 MOTS","scene":"anime scene in english MAX 25 words","action":"character action in english MAX 10 words","ambiance":"colors and light MAX 8 words","prompt_kling":"full Kling AI prompt in english"},{"moment":"2","duree":"4s","citation":"MAX 5 MOTS","scene":"anime scene in english MAX 25 words","action":"character action in english MAX 10 words","ambiance":"colors and light MAX 8 words","prompt_kling":"full Kling AI prompt in english"},{"moment":"3","duree":"3s","citation":"MAX 5 MOTS","scene":"anime scene in english MAX 25 words","action":"character action in english MAX 10 words","ambiance":"colors and light MAX 8 words","prompt_kling":"full Kling AI prompt in english"}]}
            """.formatted(excerpt);
    }

    private String buildPromptVideo(String transcription, String style) {
        String excerpt = transcription.length() > 1500 ? transcription.substring(0, 1500) : transcription;
        return """
            Tu crees des carousels TikTok viraux a partir de transcriptions YouTube.
            Meme energie que la video : naturel, accessible, comme un ami qui explique.
            REGLE ABSOLUE : MAX 8 MOTS par champ.
            Transcription : %s
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["philosophie","citation","sagesse","mindset","tag5","tag6"],"slides":[{"type":"video_hook","concept":"sujet en 2 mots","accroche":"accroche MAX 8 MOTS"},{"type":"video_explication","titre":"2 MOTS","corps":"idee vulgarisee MAX 8 MOTS"},{"type":"video_explication","titre":"2 MOTS","corps":"idee vulgarisee MAX 8 MOTS"},{"type":"video_exemple","exemple":"exemple concret MAX 8 MOTS"},{"type":"video_cta","texte":"phrase fun MAX 6 MOTS","question":"question MAX 7 MOTS ?"}]}
            """.formatted(excerpt);
    }

    private String buildPromptTop3(String auteur, String style) {
        return """
            Tu crees des carousels TikTok viraux. Format Top 3 citations.
            REGLE ABSOLUE : MAX 10 MOTS par champ.
            Auteur : %s.
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["citation","philosophie","sagesse","mindset","tag5","tag6"],"slides":[{"type":"top3_intro","auteur":"%s","description":"fait surprenant MAX 10 MOTS"},{"type":"top3_citation","numero":"1","citation":"MAX 10 MOTS","explication":"MAX 6 MOTS"},{"type":"top3_citation","numero":"2","citation":"MAX 10 MOTS","explication":"MAX 6 MOTS"},{"type":"top3_citation","numero":"3","citation":"MAX 10 MOTS","explication":"MAX 6 MOTS"},{"type":"top3_cta","texte":"MAX 6 MOTS","question":"laquelle te parle le plus ?"}]}
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
        if (jsonEnd == -1) throw new RuntimeException("JSON introuvable: " + responseBody.substring(0, Math.min(300, responseBody.length())));
        return responseBody.substring(jsonStart, jsonEnd + 1);
    }

    private String escapeJson(String text) {
        return text.replace("\\", "\\\\").replace("\"", "\\\"")
                   .replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t");
    }
}
