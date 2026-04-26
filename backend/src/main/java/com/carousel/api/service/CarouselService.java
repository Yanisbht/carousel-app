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

    public String generate(String theme, String style) throws Exception { return callGemini(buildPrompt(theme, style)); }
    public String generateDevine(String theme, String style) throws Exception { return callGemini(buildPromptDevine(theme, style)); }
    public String generatePhilo(String question, String style) throws Exception { return callGemini(buildPromptPhilo(question, style)); }
    public String generateModerne(String theme, String style) throws Exception { return callGemini(buildPromptModerne(theme, style)); }
    public String generateScript(String transcription, String style) throws Exception { return callGemini(buildPromptScript(transcription, style)); }
    public String generateVideo(String transcription, String style) throws Exception { return callGemini(buildPromptVideo(transcription, style)); }
    public String generateTop3(String auteur, String style) throws Exception { return callGemini(buildPromptTop3(auteur, style)); }

    public byte[] proxyImage(String url) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .header("User-Agent", "Mozilla/5.0")
            .GET().build();
        HttpResponse<byte[]> response = client.send(request, HttpResponse.BodyHandlers.ofByteArray());
        if (response.statusCode() != 200) throw new RuntimeException("Image fetch error: " + response.statusCode());
        return response.body();
    }

    public String fetchImages(String query, int count) throws Exception { return fetchImages(query, count, 0); }

    public String fetchImages(String query, int count, int start) throws Exception {
        String safeQuery = query.replace("\"", "\\\"");
        String requestBody = "{\"q\": \"" + safeQuery + "\", \"num\": 20}";
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://google.serper.dev/images"))
            .header("Content-Type", "application/json")
            .header("X-API-KEY", "a9ee318fe702c37999db0251e75160c2800994ec")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody)).build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) throw new RuntimeException("Serper error: " + response.statusCode());
        String body = response.body();
        java.util.List<String> urls = new java.util.ArrayList<>();
        int idx = 0;
        while (urls.size() < count) {
            int startIdx = body.indexOf("\"imageUrl\":\"", idx);
            if (startIdx == -1) break;
            startIdx += 12;
            int end = body.indexOf("\"", startIdx);
            if (end == -1) break;
            String url = body.substring(startIdx, end);
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

    public byte[] generateAudio(String text) throws Exception {
        String safeText = text.replace("\"", "\\\"").replace("\n", " ");
        String requestBody = "{\"text\": \"" + safeText + "\", \"model_id\": \"eleven_multilingual_v2\", \"voice_settings\": {\"stability\": 0.4, \"similarity_boost\": 0.85, \"style\": 0.5, \"use_speaker_boost\": true}}";
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.elevenlabs.io/v1/text-to-speech/GPAQQPp9dazaB2bl4zg9"))
            .header("Content-Type", "application/json")
            .header("xi-api-key", "sk_06c242de0700d16b65f168fd10913efdeea6f1df8d219c9b")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody)).build();
        HttpResponse<byte[]> response = client.send(request, HttpResponse.BodyHandlers.ofByteArray());
        if (response.statusCode() != 200) throw new RuntimeException("ElevenLabs error: " + response.statusCode() + " - " + new String(response.body()));
        return response.body();
    }

    public String generateOneShot(String style) throws Exception {
        String prompt = "Genere une phrase motivante courte pour TikTok lifestyle. Style : simple, universel, impactant. MAX 15 MOTS. Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"motivation\",\"mindset\",\"lifestyle\",\"fyp\",\"citation\",\"tiktok\"],\"slides\":[{\"type\":\"oneshot\",\"phrase\":\"phrase motivante MAX 15 MOTS\"}]}";
        return callGemini(prompt);
    }

    public String basketCitations(String joueur, String style) throws Exception {
        String prompt = "Tu crees des carousels TikTok viraux basket. 3 slides. Slide 1 = stat choc MAX 8 MOTS. Slide 2 = citation du joueur MAX 12 MOTS. Slide 3 = pourquoi c'est fou MAX 10 MOTS. Joueur : " + joueur + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"basketball\",\"nba\",\"stats\",\"motivation\",\"aesthetic\",\"mindset\"],\"slides\":[{\"type\":\"basket_hook\",\"accroche\":\"stat choc MAX 8 MOTS\",\"joueur\":\"Prenom Nom\"},{\"type\":\"basket_citation\",\"citation\":\"citation MAX 12 MOTS\",\"joueur\":\"Prenom Nom\"},{\"type\":\"basket_stat\",\"stat\":\"explication MAX 10 MOTS\",\"contexte\":\"\"}]}";
        return callGemini(prompt);
    }

    public String basketStats(String joueur, String style) throws Exception {
        String prompt = "Tu crees des carousels TikTok basket stats choc. MAX 8 MOTS par champ. Joueur : " + joueur + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"basketball\",\"nba\",\"stats\",\"aesthetic\",\"goat\",\"mindset\"],\"slides\":[{\"type\":\"basket_hook\",\"accroche\":\"stat choc MAX 8 MOTS\",\"joueur\":\"Prenom Nom\"},{\"type\":\"basket_stat\",\"stat\":\"stat MAX 8 MOTS\",\"contexte\":\"contexte MAX 8 MOTS\"},{\"type\":\"basket_stat\",\"stat\":\"stat MAX 8 MOTS\",\"contexte\":\"contexte MAX 8 MOTS\"},{\"type\":\"basket_stat\",\"stat\":\"stat MAX 8 MOTS\",\"contexte\":\"contexte MAX 8 MOTS\"},{\"type\":\"basket_cta\",\"question\":\"question MAX 8 MOTS ?\"}]}";
        return callGemini(prompt);
    }

    public String basketMentalite(String joueur, String style) throws Exception {
        String prompt = "Tu crees des carousels TikTok basket mentalite. MAX 8 MOTS par champ. Joueur : " + joueur + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"basketball\",\"mentalite\",\"champion\",\"motivation\",\"aesthetic\",\"mindset\"],\"slides\":[{\"type\":\"basket_hook\",\"accroche\":\"MAX 8 MOTS\",\"joueur\":\"Prenom Nom\"},{\"type\":\"basket_lecon\",\"lecon\":\"lecon MAX 8 MOTS\",\"application\":\"MAX 8 MOTS\"},{\"type\":\"basket_lecon\",\"lecon\":\"lecon MAX 8 MOTS\",\"application\":\"MAX 8 MOTS\"},{\"type\":\"basket_citation\",\"citation\":\"citation MAX 10 MOTS\",\"joueur\":\"Prenom Nom\"},{\"type\":\"basket_cta\",\"question\":\"question MAX 8 MOTS ?\"}]}";
        return callGemini(prompt);
    }

    public String genzNostalgie(String ere, String style) throws Exception {
        String prompt = "Carrousel TikTok nostalgie gen Z. Ere : " + ere + ". 3 slides. MAX 15 MOTS par slide. Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"nostalgie\",\"genz\",\"pov\",\"2010s\",\"ado\",\"souvenir\"],\"slides\":[{\"type\":\"nostalgie_hook\",\"texte\":\"accroche POV MAX 10 MOTS\"},{\"type\":\"nostalgie_refs\",\"texte\":\"refs culturelles MAX 15 MOTS\"},{\"type\":\"nostalgie_feeling\",\"texte\":\"emotion finale MAX 10 MOTS\"}]}";
        return callGemini(prompt);
    }

    public String genzPensees(String style) throws Exception {
        String prompt = "Carrousel TikTok pensees gen Z. 3 slides, MAX 12 MOTS. Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"pensee\",\"genz\",\"vrai\",\"rap\",\"cinema\",\"vie\"],\"slides\":[{\"type\":\"pensee_slide\",\"texte\":\"pensee MAX 12 MOTS\"},{\"type\":\"pensee_slide\",\"texte\":\"pensee MAX 12 MOTS\"},{\"type\":\"pensee_slide\",\"texte\":\"pensee MAX 12 MOTS\"}]}";
        return callGemini(prompt);
    }

    public String genzCinema(String style) throws Exception {
        String prompt = "Carrousel TikTok cinema et rap gen Z francais. 3 slides, MAX 12 MOTS. Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"cinema\",\"rap\",\"genz\",\"france\",\"replique\",\"vrai\"],\"slides\":[{\"type\":\"cinema_slide\",\"texte\":\"replique MAX 12 MOTS\"},{\"type\":\"cinema_slide\",\"texte\":\"explication MAX 12 MOTS\"},{\"type\":\"cinema_slide\",\"texte\":\"pensee MAX 12 MOTS\"}]}";
        return callGemini(prompt);
    }

    public String basketVie(String style) throws Exception {
        String prompt = "Carrousel TikTok phrases de vie directes. 3 slides, MAX 12 MOTS chacune. Style familier, vrai. Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"vie\",\"vrai\",\"emotion\",\"tiktok\",\"aesthetic\",\"basketball\"],\"slides\":[{\"type\":\"vie_slide\",\"texte\":\"phrase MAX 12 MOTS\"},{\"type\":\"vie_slide\",\"texte\":\"phrase MAX 12 MOTS\"},{\"type\":\"vie_slide\",\"texte\":\"phrase MAX 12 MOTS\"}]}";
        return callGemini(prompt);
    }

    public String basketMotivation(String style) throws Exception {
        String prompt = "Carrousel TikTok basket motivation. 3 slides, MAX 6 MOTS. Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"basketball\",\"motivation\",\"nba\",\"mindset\",\"aesthetic\",\"emotion\"],\"slides\":[{\"type\":\"motiv_hook\",\"texte\":\"MAX 5 MOTS\"},{\"type\":\"motiv_citation\",\"citation\":\"MAX 6 MOTS\",\"auteur\":\"Prenom Nom\"},{\"type\":\"motiv_cta\",\"question\":\"MAX 5 MOTS ?\"}]}";
        return callGemini(prompt);
    }

    public String basketFilm(String film, String style) throws Exception {
        String prompt = "Carrousel TikTok basket film emotionnel. Film : " + film + ". 3 slides, MAX 10 MOTS. Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"basketball\",\"film\",\"motivation\",\"inspiration\",\"aesthetic\",\"mindset\"],\"slides\":[{\"type\":\"film_hook\",\"replique\":\"replique MAX 10 MOTS\",\"film\":\"" + film + "\"},{\"type\":\"film_contexte\",\"contexte\":\"contexte MAX 10 MOTS\"},{\"type\":\"film_lecon\",\"lecon\":\"lecon MAX 10 MOTS\"}]}";
        return callGemini(prompt);
    }

    public String basketAction(String joueur, String action, String style) throws Exception {
        String prompt = "Decompose cette action basket en 5 moments avec prompts Kling AI anime vintage. Joueur : " + joueur + ". Action : " + action + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"basketball\",\"anime\",\"aesthetic\",\"nba\",\"90sbasketball\",\"highlight\"],\"joueur\":\"" + joueur + "\",\"action\":\"" + action + "\",\"slides\":[{\"type\":\"basket_action\",\"moment\":\"1\",\"texte\":\"MAX 4 MOTS\",\"prompt_kling\":\"anime basketball scene, vintage film, 2D japanese animation, sepia tones, portrait 9:16\"},{\"type\":\"basket_action\",\"moment\":\"2\",\"texte\":\"MAX 4 MOTS\",\"prompt_kling\":\"anime scene prompt\"},{\"type\":\"basket_action\",\"moment\":\"3\",\"texte\":\"MAX 4 MOTS\",\"prompt_kling\":\"anime scene prompt\"},{\"type\":\"basket_action\",\"moment\":\"4\",\"texte\":\"MAX 4 MOTS\",\"prompt_kling\":\"anime scene prompt\"},{\"type\":\"basket_action\",\"moment\":\"5\",\"texte\":\"MAX 4 MOTS\",\"prompt_kling\":\"anime basketball scoring, triumphant, vintage, portrait 9:16\"}]}";
        return callGemini(prompt);
    }

    private String callGemini(String prompt) throws Exception {
        String requestBody = "{\"contents\": [{\"parts\": [{\"text\": \"" + escapeJson(prompt) + "\"}]}], \"generationConfig\": {\"temperature\": 0.9, \"maxOutputTokens\": 8192, \"responseMimeType\": \"application/json\"}}";
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(GEMINI_URL + "?key=" + apiKey))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody)).build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) throw new RuntimeException("Gemini API error: " + response.statusCode() + " - " + response.body());
        return extractContent(response.body());
    }

    private String buildPrompt(String theme, String style) {
        return "Tu crees un carrousel TikTok mini-histoire philosophique avec humour en 3 slides. SLIDE 1 (hook drole, MAX 5 MOTS) : fait reel surprenant sur un philosophe. Ex: 'Socrate s est fait tuer pour ca.' 'Diogene vivait dans un tonneau.' 'Epictete etait esclave, puis libre.' SLIDE 2 (histoire, MAX 6 MOTS) : l anecdote en 1 phrase courte. SLIDE 3 (lecon, MAX 7 MOTS) : lecon actionnable avec humour. Theme : " + theme + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"philosophie\",\"histoire\",\"sagesse\",\"tiktok\",\"fyp\",\"mindset\"],\"slides\":[{\"type\":\"hook\",\"citation\":\"hook MAX 5 MOTS\",\"auteur\":\"\",\"origine\":\"\"},{\"type\":\"intrigue\",\"question\":\"anecdote MAX 6 MOTS\"},{\"type\":\"lesson\",\"titre\":\"\",\"corps\":\"lecon MAX 7 MOTS\"}]}";
    }

    private String buildPromptDevine(String theme, String style) {
        return "Carrousel TikTok Devine l auteur. MAX 10 MOTS par champ. Theme : " + theme + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"citation\",\"philosophie\",\"sagesse\",\"mindset\",\"tag5\",\"tag6\"],\"slides\":[{\"type\":\"devine_question\",\"intro\":\"MAX 5 MOTS\",\"question\":\"MAX 6 MOTS ?\"},{\"type\":\"devine_citation\",\"citation\":\"MAX 10 MOTS\",\"indice\":\"MAX 6 MOTS\"},{\"type\":\"devine_revelation\",\"auteur\":\"Prenom Nom\",\"bio\":\"MAX 12 MOTS\"}]}";
    }

    private String buildPromptPhilo(String question, String style) {
        return "Tu vulgarises la philosophie pour TikTok. MAX 10 MOTS par champ. Question : " + question + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"philosophie\",\"citation\",\"sagesse\",\"mindset\",\"tag5\",\"tag6\"],\"slides\":[{\"type\":\"philo_question\",\"question\":\"MAX 7 MOTS ?\"},{\"type\":\"philo_reponse\",\"penseur\":\"Prenom Nom\",\"reponse\":\"MAX 10 MOTS\",\"citation\":\"MAX 8 MOTS\"},{\"type\":\"philo_qui\",\"penseur\":\"Prenom Nom\",\"epoque\":\"epoque\",\"fait\":\"MAX 10 MOTS\"},{\"type\":\"philo_conclusion\",\"lecon\":\"MAX 8 MOTS\",\"question_cta\":\"MAX 7 MOTS ?\"}]}";
    }

    private String buildPromptModerne(String theme, String style) {
        return "Carrousel TikTok citation moderne gen Z. MAX 10 MOTS par champ. Theme : " + theme + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"citation\",\"philosophie\",\"sagesse\",\"mindset\",\"tag5\",\"tag6\"],\"slides\":[{\"type\":\"moderne_original\",\"auteur\":\"Prenom Nom\",\"citation\":\"MAX 10 MOTS\"},{\"type\":\"moderne_traduction\",\"moderne\":\"MAX 10 MOTS\",\"contexte\":\"MAX 6 MOTS\"},{\"type\":\"moderne_cta\",\"texte\":\"MAX 7 MOTS\",\"question\":\"MAX 7 MOTS ?\"}]}";
    }

    private String buildPromptScript(String transcription, String style) {
        String excerpt = transcription.length() > 1500 ? transcription.substring(0, 1500) : transcription;
        return "Script video anime TikTok 10 secondes. 3 moments. MAX 8 MOTS. Transcription : " + excerpt + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"anime\",\"philosophie\",\"citation\",\"aesthetic\",\"japaneseanime\",\"mindset\"],\"citation_principale\":\"MAX 8 MOTS\",\"auteur\":\"Prenom Nom\",\"scenes\":[{\"moment\":\"1\",\"duree\":\"3s\",\"citation\":\"MAX 5 MOTS\",\"scene\":\"anime scene english MAX 25 words\",\"action\":\"action english MAX 10 words\",\"ambiance\":\"colors MAX 8 words\",\"prompt_kling\":\"full Kling prompt english\"},{\"moment\":\"2\",\"duree\":\"4s\",\"citation\":\"MAX 5 MOTS\",\"scene\":\"anime scene english MAX 25 words\",\"action\":\"action english MAX 10 words\",\"ambiance\":\"colors MAX 8 words\",\"prompt_kling\":\"full Kling prompt english\"},{\"moment\":\"3\",\"duree\":\"3s\",\"citation\":\"MAX 5 MOTS\",\"scene\":\"anime scene english MAX 25 words\",\"action\":\"action english MAX 10 words\",\"ambiance\":\"colors MAX 8 words\",\"prompt_kling\":\"full Kling prompt english\"}]}";
    }

    private String buildPromptVideo(String transcription, String style) {
        String excerpt = transcription.length() > 1500 ? transcription.substring(0, 1500) : transcription;
        return "Carrousel TikTok viral a partir de transcription. TON : humour leger, decale. 3 slides. SLIDE 1 : hook drole MAX 6 MOTS. SLIDE 2 : reponse surprenante MAX 8 MOTS. SLIDE 3 : lecon actionnable MAX 8 MOTS. Transcription : " + excerpt + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"psychologie\",\"developpementperso\",\"mindset\",\"philosophie\",\"tiktok\",\"fyp\"],\"slides\":[{\"type\":\"video_hook\",\"concept\":\"2 mots\",\"accroche\":\"MAX 6 MOTS\"},{\"type\":\"video_explication\",\"titre\":\"2 MOTS\",\"corps\":\"MAX 8 MOTS\"},{\"type\":\"video_cta\",\"texte\":\"MAX 8 MOTS\",\"question\":\"\"}]}";
    }

    private String buildPromptTop3(String auteur, String style) {
        return "Carrousel TikTok Top 3 citations. MAX 10 MOTS par champ. Auteur : " + auteur + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"citation\",\"philosophie\",\"sagesse\",\"mindset\",\"tag5\",\"tag6\"],\"slides\":[{\"type\":\"top3_intro\",\"auteur\":\"" + auteur + "\",\"description\":\"MAX 10 MOTS\"},{\"type\":\"top3_citation\",\"numero\":\"1\",\"citation\":\"MAX 10 MOTS\",\"explication\":\"MAX 6 MOTS\"},{\"type\":\"top3_citation\",\"numero\":\"2\",\"citation\":\"MAX 10 MOTS\",\"explication\":\"MAX 6 MOTS\"},{\"type\":\"top3_citation\",\"numero\":\"3\",\"citation\":\"MAX 10 MOTS\",\"explication\":\"MAX 6 MOTS\"},{\"type\":\"top3_cta\",\"texte\":\"MAX 6 MOTS\",\"question\":\"laquelle te parle le plus ?\"}]}";
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
            if (jsonEnd != -1) return responseBody.substring(jsonStart, jsonEnd + 1).replace("\\\"", "\"").replace("\\n", " ").replace("\\\\", "\\");
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
        if (jsonEnd == -1) throw new RuntimeException("JSON introuvable");
        return responseBody.substring(jsonStart, jsonEnd + 1);
    }

    private String escapeJson(String text) {
        return text.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t");
    }
}
