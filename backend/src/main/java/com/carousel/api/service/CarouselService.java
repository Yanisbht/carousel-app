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
            - Slide 1 (HOOK) : citation courte et percutante qui claque. MAX 8 MOTS. Choisir une citation connue.
            - Slide 2 (SUSPENSE) : question courte qui donne envie de scroller. Formulée simplement. MAX 6 MOTS.
            - Slide 3 (VALEUR) : contexte historique surprenant. Simple. MAX 8 MOTS.
            - Slide 4 (LEÇON) : comment appliquer ça aujourd'hui. Concret. MAX 8 MOTS.
            - Slide 5 (CTA) : question simple qui divise les opinions. MAX 8 MOTS.
            - HASHTAGS : 2 gros + 2 moyens + 2 niche.
            
            RÈGLE ABSOLUE : MAX 8 MOTS par champ. Langage simple et naturel.
            
            Thème : %s.
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["citation","philosophie","sagesse","mindset","tag5","tag6"],"slides":[{"type":"hook","citation":"citation percutante MAX 8 MOTS","auteur":"Prénom Nom","origine":"pays ou époque"},{"type":"intrigue","question":"question simple MAX 6 MOTS ?"},{"type":"context","titre":"2 MOTS","corps":"info surprenante MAX 8 MOTS"},{"type":"lesson","titre":"2 MOTS","corps":"leçon concrète MAX 8 MOTS"},{"type":"cta","question":"question qui divise MAX 8 MOTS ?"}]}
            """.formatted(theme);
    }

    private String buildPromptDevine(String theme, String style) {
        return """
            Tu es expert en algorithme TikTok. Objectif : maximiser l'engagement et les commentaires.
            
            RÈGLES ALGO TIKTOK pour "Devine l'auteur" :
            - Slide 1 : accroche courte + question qui donne envie de deviner. MAX 6 MOTS.
            - Slide 2 : citation célèbre SANS l'auteur + indice subtil. MAX 10 MOTS pour la citation.
            - Slide 3 : révélation de l'auteur + fait surprenant sur lui. MAX 12 MOTS pour la bio.
            - HASHTAGS : 2 gros + 2 moyens + 2 niche.
            
            RÈGLE ABSOLUE : MAX 10 MOTS par champ. Compte les mots.
            
            Thème : %s.
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["citation","philosophie","sagesse","mindset","tag5","tag6"],"slides":[{"type":"devine_question","intro":"MAX 5 MOTS","question":"MAX 6 MOTS ?"},{"type":"devine_citation","citation":"MAX 10 MOTS","indice":"indice MAX 6 MOTS"},{"type":"devine_revelation","auteur":"Prénom Nom","bio":"fait surprenant MAX 12 MOTS"}]}
            """.formatted(theme);
    }

    private String buildPromptPhilo(String question, String style) {
        return """
            Tu vulgarises la philosophie pour TikTok. Ton style : comme un ami qui explique, pas un prof.
            Simple, court, naturel. Le fond est sérieux, la forme est accessible à tous.
            
            STRUCTURE :
            - Slide 1 : la question reformulée comme on se la pose vraiment dans la vie. MAX 7 MOTS. Familier et direct.
            - Slide 2 : la réponse du philosophe vulgarisée en langage simple. MAX 10 MOTS. + sa citation courte.
            - Slide 3 : qui est ce philosophe, 1 fait surprenant qui étonne. MAX 10 MOTS. Simple.
            - Slide 4 : ce qu'on peut retenir dans sa vie aujourd'hui. MAX 8 MOTS. + question simple pour les commentaires.
            - HASHTAGS : 2 gros + 2 moyens + 2 niche sur ce philosophe.
            
            RÈGLE ABSOLUE : MAX 10 MOTS par champ. Pas de jargon philosophique. Parle comme à un ami.
            
            Question : %s.
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["philosophie","citation","sagesse","mindset","tag5","tag6"],"slides":[{"type":"philo_question","question":"question naturelle MAX 7 MOTS ?","teaser":"accroche simple MAX 6 MOTS"},{"type":"philo_reponse","penseur":"Prénom Nom","reponse":"réponse simple MAX 10 MOTS","citation":"citation courte MAX 8 MOTS"},{"type":"philo_qui","penseur":"Prénom Nom","epoque":"époque courte","fait":"fait étonnant MAX 10 MOTS"},{"type":"philo_conclusion","lecon":"leçon de vie MAX 8 MOTS","question_cta":"question simple MAX 7 MOTS ?"}]}
            """.formatted(question);
    }

    private String buildPromptModerne(String theme, String style) {
        return """
            Tu es expert en algorithme TikTok. Objectif : viral grâce au côté drôle et inattendu.
            
            RÈGLES ALGO TIKTOK pour "Citation moderne" :
            - Slide 1 : citation originale courte d'un philosophe. MAX 10 MOTS.
            - Slide 2 : traduction en argot gen Z, drôle et authentique. MAX 10 MOTS. Doit faire sourire.
            - Slide 3 : CTA fun qui demande aux gens leur avis. MAX 7 MOTS.
            - HASHTAGS : 2 gros + 2 moyens + 2 niche.
            
            RÈGLE ABSOLUE : MAX 10 MOTS par champ. Compte les mots.
            
            Thème : %s.
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["citation","philosophie","sagesse","mindset","tag5","tag6"],"slides":[{"type":"moderne_original","auteur":"Prénom Nom","citation":"MAX 10 MOTS"},{"type":"moderne_traduction","moderne":"argot gen Z MAX 10 MOTS","contexte":"MAX 6 MOTS"},{"type":"moderne_cta","texte":"MAX 7 MOTS","question":"MAX 7 MOTS ?"}]}
            """.formatted(theme);
    }

    private String buildPromptScript(String transcription, String style) {
        String excerpt = transcription.length() > 1500 ? transcription.substring(0, 1500) : transcription;
        return """
            Tu es expert en création de vidéos animées TikTok virales.
            À partir de cette transcription, crée un script de vidéo animée de 30-45 secondes.
            Style : cartoon 2D simple, fun et accessible, comme Kurzgesagt mais version TikTok.
            Ton : naturel, comme un ami qui explique, pas académique.
            
            STRUCTURE : 4-6 scènes de 5-8 secondes chacune.
            Chaque scène a :
            - Un texte affiché à l'écran (MAX 8 MOTS, percutant)
            - Une narration voix off courte (MAX 15 MOTS)
            - Un prompt visuel pour Kling AI (description de l'animation en anglais, MAX 20 MOTS)
            - La durée en secondes
            - Le type : intro / explication / exemple / conclusion
            
            RÈGLE ABSOLUE : simple, court, visuel. Chaque scène doit être compréhensible en quelques secondes.
            
            Transcription : %s
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["philosophie","animation","citation","mindset","tag5","tag6"],"scenes":[{"type":"intro","duree":"5s","texte":"texte écran MAX 8 MOTS","narration":"voix off MAX 15 MOTS","prompt_visuel":"Kling AI prompt in english MAX 20 words, cartoon 2D style"},{"type":"explication","duree":"8s","texte":"texte écran MAX 8 MOTS","narration":"voix off MAX 15 MOTS","prompt_visuel":"Kling AI prompt in english MAX 20 words"},{"type":"exemple","duree":"8s","texte":"texte écran MAX 8 MOTS","narration":"voix off MAX 15 MOTS","prompt_visuel":"Kling AI prompt in english MAX 20 words"},{"type":"conclusion","duree":"6s","texte":"texte écran MAX 8 MOTS","narration":"voix off MAX 15 MOTS","prompt_visuel":"Kling AI prompt in english MAX 20 words"}]}
            """.formatted(excerpt);
    }

    private String buildPromptVideo(String transcription, String style) {
        String excerpt = transcription.length() > 1500 ? transcription.substring(0, 1500) : transcription;
        return """
            Tu es expert en vulgarisation et carrousels TikTok viraux.
            On t'a donné la transcription d'une vidéo éducative/philosophique.
            Ton job : extraire l'idée principale et créer un carrousel TikTok dans la même vibe — fun, simple, accessible à tous.
            Même énergie que la vidéo : naturel, pas académique, comme un ami qui explique.
            
            STRUCTURE :
            - Slide 1 (HOOK) : accroche qui résume l'idée principale de façon intrigante. MAX 8 MOTS.
            - Slide 2 (EXPLICATION 1) : première idée clé vulgarisée. MAX 8 MOTS.
            - Slide 3 (EXPLICATION 2) : deuxième idée clé vulgarisée. MAX 8 MOTS.
            - Slide 4 (EXEMPLE) : exemple concret tiré de la vidéo. MAX 8 MOTS.
            - Slide 5 (CTA) : question simple qui donne envie de commenter. MAX 8 MOTS.
            - HASHTAGS : 2 gros + 2 moyens + 2 niche sur le sujet.
            
            RÈGLE ABSOLUE : MAX 8 MOTS par champ. Ton naturel et accessible.
            
            Transcription : %s
            Retourne UNIQUEMENT ce JSON sans backticks :
            {"hashtags":["philosophie","citation","sagesse","mindset","tag5","tag6"],"slides":[{"type":"video_hook","concept":"sujet en 2 mots","accroche":"accroche MAX 8 MOTS"},{"type":"video_explication","titre":"2 MOTS","corps":"idée vulgarisée MAX 8 MOTS"},{"type":"video_explication","titre":"2 MOTS","corps":"idée vulgarisée MAX 8 MOTS"},{"type":"video_exemple","exemple":"exemple concret MAX 8 MOTS"},{"type":"video_cta","texte":"phrase fun MAX 6 MOTS","question":"question MAX 7 MOTS ?"}]}
            """.formatted(excerpt);
    }

    private String buildPromptTop3(String auteur, String style) {
        return """
            Tu es expert en algorithme TikTok. Objectif : maximiser le taux de completion.
            
            RÈGLES ALGO TIKTOK pour "Top 3" :
            - Slide 1 : intro auteur avec fait surprenant. MAX 10 MOTS.
            - Slides 2-4 : top 3 citations percutantes + explication ultra courte. MAX 10 MOTS citation, MAX 6 MOTS explication.
            - Slide 5 : question qui force les gens à choisir leur préférée en commentaire. MAX 8 MOTS.
            - HASHTAGS : 2 gros + 2 moyens + 2 niche.
            
            RÈGLE ABSOLUE : MAX 10 MOTS par champ. Compte les mots.
            
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
