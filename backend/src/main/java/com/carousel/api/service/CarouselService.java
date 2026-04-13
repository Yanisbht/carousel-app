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

    public String basketCitations(String joueur, String style) throws Exception {
        String prompt = "Tu crees des carousels TikTok viraux pour un compte basket aesthetic. Format : citations inspirantes du joueur. REGLE ABSOLUE : MAX 8 MOTS par champ. Joueur : " + joueur + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"basketball\",\"nba\",\"citation\",\"motivation\",\"aesthetic\",\"mindset\"],\"slides\":[{\"type\":\"basket_hook\",\"accroche\":\"accroche choc MAX 8 MOTS\",\"joueur\":\"Prenom Nom\"},{\"type\":\"basket_citation\",\"citation\":\"citation connue MAX 10 MOTS\",\"joueur\":\"Prenom Nom\"},{\"type\":\"basket_citation\",\"citation\":\"deuxieme citation MAX 10 MOTS\",\"joueur\":\"Prenom Nom\"},{\"type\":\"basket_lecon\",\"lecon\":\"lecon de vie MAX 8 MOTS\",\"application\":\"comment appliquer MAX 8 MOTS\"},{\"type\":\"basket_cta\",\"question\":\"question MAX 8 MOTS ?\"}]}";
        return callGemini(prompt);
    }

    public String basketStats(String joueur, String style) throws Exception {
        String prompt = "Tu crees des carousels TikTok viraux pour un compte basket aesthetic. Format : stats choc sur un joueur. REGLE ABSOLUE : MAX 8 MOTS par champ. Joueur : " + joueur + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"basketball\",\"nba\",\"stats\",\"aesthetic\",\"goat\",\"mindset\"],\"slides\":[{\"type\":\"basket_hook\",\"accroche\":\"stat choc MAX 8 MOTS\",\"joueur\":\"Prenom Nom\"},{\"type\":\"basket_stat\",\"stat\":\"stat impressionnante MAX 8 MOTS\",\"contexte\":\"contexte MAX 8 MOTS\"},{\"type\":\"basket_stat\",\"stat\":\"deuxieme stat MAX 8 MOTS\",\"contexte\":\"contexte MAX 8 MOTS\"},{\"type\":\"basket_stat\",\"stat\":\"troisieme stat MAX 8 MOTS\",\"contexte\":\"contexte MAX 8 MOTS\"},{\"type\":\"basket_cta\",\"question\":\"question debat MAX 8 MOTS ?\"}]}";
        return callGemini(prompt);
    }

    public String basketMentalite(String joueur, String style) throws Exception {
        String prompt = "Tu crees des carousels TikTok viraux pour un compte basket aesthetic. Format : mentalite de champion. REGLE ABSOLUE : MAX 8 MOTS par champ. Joueur : " + joueur + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"basketball\",\"mentalite\",\"champion\",\"motivation\",\"aesthetic\",\"mindset\"],\"slides\":[{\"type\":\"basket_hook\",\"accroche\":\"ce que ce joueur t'apprend MAX 8 MOTS\",\"joueur\":\"Prenom Nom\"},{\"type\":\"basket_lecon\",\"lecon\":\"premiere lecon MAX 8 MOTS\",\"application\":\"comment appliquer MAX 8 MOTS\"},{\"type\":\"basket_lecon\",\"lecon\":\"deuxieme lecon MAX 8 MOTS\",\"application\":\"comment appliquer MAX 8 MOTS\"},{\"type\":\"basket_citation\",\"citation\":\"citation qui resume sa mentalite MAX 10 MOTS\",\"joueur\":\"Prenom Nom\"},{\"type\":\"basket_cta\",\"question\":\"question inspirante MAX 8 MOTS ?\"}]}";
        return callGemini(prompt);
    }

    public String basketAction(String joueur, String action, String style) throws Exception {
        String prompt = "Tu crees des carousels TikTok anime pour un compte basket. Decompose cette action en 5 moments image par image, chaque slide a un prompt Kling AI en anglais style anime japonais 2D. Style fixe : anime style, 2D japanese animation, basketball player, cinematic lighting, dynamic pose, portrait 9:16, no text. REGLE ABSOLUE : MAX 5 MOTS par texte. Joueur : " + joueur + ". Action : " + action + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"basketball\",\"anime\",\"aesthetic\",\"nba\",\"japaneseanime\",\"highlight\"],\"joueur\":\"Prenom Nom\",\"action\":\"nom action\",\"slides\":[{\"type\":\"basket_action\",\"moment\":\"1\",\"texte\":\"debut action MAX 5 MOTS\",\"prompt_kling\":\"anime basketball player receiving ball, cinematic pose, 2D japanese animation, cinematic lighting, portrait 9:16\"},{\"type\":\"basket_action\",\"moment\":\"2\",\"texte\":\"MAX 5 MOTS\",\"prompt_kling\":\"Kling prompt in english\"},{\"type\":\"basket_action\",\"moment\":\"3\",\"texte\":\"MAX 5 MOTS\",\"prompt_kling\":\"Kling prompt in english\"},{\"type\":\"basket_action\",\"moment\":\"4\",\"texte\":\"MAX 5 MOTS\",\"prompt_kling\":\"Kling prompt in english\"},{\"type\":\"basket_action\",\"moment\":\"5\",\"texte\":\"PANIER !\",\"prompt_kling\":\"anime basketball player scoring triumphant, cinematic lighting, 2D japanese animation, portrait 9:16\"}]}";
        return callGemini(prompt);
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
        return "Tu crees des carousels TikTok viraux sur les citations du monde. Ton style : fond philosophique serieux, forme simple et naturelle. Pas de jargon. Court, direct, percutant. REGLE ABSOLUE : MAX 8 MOTS par champ. Theme : " + theme + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"citation\",\"philosophie\",\"sagesse\",\"mindset\",\"tag5\",\"tag6\"],\"slides\":[{\"type\":\"hook\",\"citation\":\"citation percutante MAX 8 MOTS\",\"auteur\":\"Prenom Nom\",\"origine\":\"pays ou epoque\"},{\"type\":\"intrigue\",\"question\":\"question simple MAX 6 MOTS ?\"},{\"type\":\"context\",\"titre\":\"2 MOTS\",\"corps\":\"info surprenante MAX 8 MOTS\"},{\"type\":\"lesson\",\"titre\":\"2 MOTS\",\"corps\":\"lecon concrete MAX 8 MOTS\"},{\"type\":\"cta\",\"question\":\"question qui divise MAX 8 MOTS ?\"}]}";
    }

    private String buildPromptDevine(String theme, String style) {
        return "Tu crees des carousels TikTok viraux. Format Devine l'auteur. REGLE ABSOLUE : MAX 10 MOTS par champ. Theme : " + theme + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"citation\",\"philosophie\",\"sagesse\",\"mindset\",\"tag5\",\"tag6\"],\"slides\":[{\"type\":\"devine_question\",\"intro\":\"MAX 5 MOTS\",\"question\":\"MAX 6 MOTS ?\"},{\"type\":\"devine_citation\",\"citation\":\"MAX 10 MOTS\",\"indice\":\"indice MAX 6 MOTS\"},{\"type\":\"devine_revelation\",\"auteur\":\"Prenom Nom\",\"bio\":\"fait surprenant MAX 12 MOTS\"}]}";
    }

    private String buildPromptPhilo(String question, String style) {
        return "Tu vulgarises la philosophie pour TikTok comme un ami qui explique. REGLE ABSOLUE : MAX 10 MOTS par champ. Pas de jargon. Question : " + question + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"philosophie\",\"citation\",\"sagesse\",\"mindset\",\"tag5\",\"tag6\"],\"slides\":[{\"type\":\"philo_question\",\"question\":\"question naturelle MAX 7 MOTS ?\"},{\"type\":\"philo_reponse\",\"penseur\":\"Prenom Nom\",\"reponse\":\"reponse simple MAX 10 MOTS\",\"citation\":\"citation courte MAX 8 MOTS\"},{\"type\":\"philo_qui\",\"penseur\":\"Prenom Nom\",\"epoque\":\"epoque courte\",\"fait\":\"fait etonnant MAX 10 MOTS\"},{\"type\":\"philo_conclusion\",\"lecon\":\"lecon de vie MAX 8 MOTS\",\"question_cta\":\"question simple MAX 7 MOTS ?\"}]}";
    }

    private String buildPromptModerne(String theme, String style) {
        return "Tu crees des carousels TikTok viraux. Format citation moderne en argot gen Z. REGLE ABSOLUE : MAX 10 MOTS par champ. Theme : " + theme + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"citation\",\"philosophie\",\"sagesse\",\"mindset\",\"tag5\",\"tag6\"],\"slides\":[{\"type\":\"moderne_original\",\"auteur\":\"Prenom Nom\",\"citation\":\"MAX 10 MOTS\"},{\"type\":\"moderne_traduction\",\"moderne\":\"argot gen Z MAX 10 MOTS\",\"contexte\":\"MAX 6 MOTS\"},{\"type\":\"moderne_cta\",\"texte\":\"MAX 7 MOTS\",\"question\":\"MAX 7 MOTS ?\"}]}";
    }

    private String buildPromptScript(String transcription, String style) {
        String excerpt = transcription.length() > 1500 ? transcription.substring(0, 1500) : transcription;
        return "Tu crees des scripts de videos animees TikTok style anime japonais de 10 secondes. 3 moments de 3-4 secondes. Ultra visuel et emotionnel. Style fixe Kling : anime style, 2D japanese animation, cinematic lighting, beautiful atmosphere, smooth motion, portrait 9:16, no text. REGLE ABSOLUE : MAX 8 MOTS par champ texte. Transcription : " + excerpt + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"anime\",\"philosophie\",\"citation\",\"aesthetic\",\"japaneseanime\",\"mindset\"],\"citation_principale\":\"citation extraite MAX 8 MOTS\",\"auteur\":\"Prenom Nom\",\"scenes\":[{\"moment\":\"1\",\"duree\":\"3s\",\"citation\":\"MAX 5 MOTS\",\"scene\":\"anime scene in english MAX 25 words\",\"action\":\"character action in english MAX 10 words\",\"ambiance\":\"colors and light MAX 8 words\",\"prompt_kling\":\"full Kling AI prompt in english\"},{\"moment\":\"2\",\"duree\":\"4s\",\"citation\":\"MAX 5 MOTS\",\"scene\":\"anime scene in english MAX 25 words\",\"action\":\"character action in english MAX 10 words\",\"ambiance\":\"colors and light MAX 8 words\",\"prompt_kling\":\"full Kling AI prompt in english\"},{\"moment\":\"3\",\"duree\":\"3s\",\"citation\":\"MAX 5 MOTS\",\"scene\":\"anime scene in english MAX 25 words\",\"action\":\"character action in english MAX 10 words\",\"ambiance\":\"colors and light MAX 8 words\",\"prompt_kling\":\"full Kling AI prompt in english\"}]}";
    }

    private String buildPromptVideo(String transcription, String style) {
        String excerpt = transcription.length() > 1500 ? transcription.substring(0, 1500) : transcription;
        return "Tu crees des carousels TikTok viraux a partir de transcriptions YouTube. Meme energie que la video : naturel, accessible. REGLE ABSOLUE : MAX 8 MOTS par champ. Transcription : " + excerpt + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"philosophie\",\"citation\",\"sagesse\",\"mindset\",\"tag5\",\"tag6\"],\"slides\":[{\"type\":\"video_hook\",\"concept\":\"sujet en 2 mots\",\"accroche\":\"accroche MAX 8 MOTS\"},{\"type\":\"video_explication\",\"titre\":\"2 MOTS\",\"corps\":\"idee vulgarisee MAX 8 MOTS\"},{\"type\":\"video_explication\",\"titre\":\"2 MOTS\",\"corps\":\"idee vulgarisee MAX 8 MOTS\"},{\"type\":\"video_exemple\",\"exemple\":\"exemple concret MAX 8 MOTS\"},{\"type\":\"video_cta\",\"texte\":\"phrase fun MAX 6 MOTS\",\"question\":\"question MAX 7 MOTS ?\"}]}";
    }

    private String buildPromptTop3(String auteur, String style) {
        return "Tu crees des carousels TikTok viraux. Format Top 3 citations. REGLE ABSOLUE : MAX 10 MOTS par champ. Auteur : " + auteur + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"citation\",\"philosophie\",\"sagesse\",\"mindset\",\"tag5\",\"tag6\"],\"slides\":[{\"type\":\"top3_intro\",\"auteur\":\"" + auteur + "\",\"description\":\"fait surprenant MAX 10 MOTS\"},{\"type\":\"top3_citation\",\"numero\":\"1\",\"citation\":\"MAX 10 MOTS\",\"explication\":\"MAX 6 MOTS\"},{\"type\":\"top3_citation\",\"numero\":\"2\",\"citation\":\"MAX 10 MOTS\",\"explication\":\"MAX 6 MOTS\"},{\"type\":\"top3_citation\",\"numero\":\"3\",\"citation\":\"MAX 10 MOTS\",\"explication\":\"MAX 6 MOTS\"},{\"type\":\"top3_cta\",\"texte\":\"MAX 6 MOTS\",\"question\":\"laquelle te parle le plus ?\"}]}";
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
