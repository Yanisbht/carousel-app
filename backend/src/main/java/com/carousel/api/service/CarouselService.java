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

    public byte[] proxyImage(String url) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .header("User-Agent", "Mozilla/5.0")
            .GET()
            .build();
        HttpResponse<byte[]> response = client.send(request, HttpResponse.BodyHandlers.ofByteArray());
        if (response.statusCode() != 200) throw new RuntimeException("Image fetch error: " + response.statusCode());
        return response.body();
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
        String prompt = "Tu crees des carousels TikTok viraux pour un compte basket aesthetic. Format : 3 slides. Slide 1 = stat choc reelle et verifiable sur ce joueur, formulee comme un fait brut sans commentaire (ex: '81 points. Une seule nuit.' ou '50% de tirs a 3 points. Toute une saison.') MAX 8 MOTS. Slide 2 = citation reelle du joueur sur ce sujet ou sur sa mentalite, tiree d'une vraie interview, MAX 12 MOTS. Slide 3 = explication courte et simple de pourquoi cette stat est folle ou ce qu'elle dit sur lui, MAX 10 MOTS. REGLE ABSOLUE : MAX 12 MOTS par champ. Joueur : " + joueur + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"basketball\",\"nba\",\"stats\",\"motivation\",\"aesthetic\",\"mindset\"],\"slides\":[{\"type\":\"basket_hook\",\"accroche\":\"stat choc MAX 8 MOTS\",\"joueur\":\"Prenom Nom\"},{\"type\":\"basket_citation\",\"citation\":\"citation interview MAX 12 MOTS\",\"joueur\":\"Prenom Nom\"},{\"type\":\"basket_stat\",\"stat\":\"explication pourquoi c'est fou MAX 10 MOTS\",\"contexte\":\"\"}]}";
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

    public String genzNostalgie(String ere, String style) throws Exception {
        String prompt = "Tu crees des carrousels TikTok viraux style nostalgie gen Z francaise. Format POV. Ere : " + ere + ". 3 slides. Slide 1 = accroche POV courte et precise qui pose l'ere (ex: 'pov t'avais 14 ans en 2016'). Slide 2 = liste de 5-6 references culturelles ultra precises de cette periode : musiques, series, jeux, applis, moments (ex: Nkfeu, Naruto, PS4, Snapchat streaks, PNL, les soirees FIFA). Slide 3 = emotion nostalgique courte qui resonne (ex: 'cette epoque reviendra jamais', 'vous comprendrez pas si vous y ettiez pas'). REGLE : direct, familier, gen Z francais. MAX 15 MOTS par slide. Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"nostalgie\",\"genz\",\"pov\",\"2010s\",\"ado\",\"souvenir\"],\"slides\":[{\"type\":\"nostalgie_hook\",\"texte\":\"accroche POV MAX 10 MOTS\"},{\"type\":\"nostalgie_refs\",\"texte\":\"liste refs separees par virgules MAX 15 MOTS\"},{\"type\":\"nostalgie_feeling\",\"texte\":\"emotion finale MAX 10 MOTS\"}]}";
        return callGemini(prompt);
    }

    public String genzPensees(String style) throws Exception {
        String prompt = "Tu crees des carrousels TikTok viraux. Style pensees de jeune adulte gen Z francais entre cinema, rap et verite de vie. 3 slides. Chaque slide = une pensee courte, directe, vraie. Mi-philosophique mi-quotidien. Style des sous-titres de films ou des paroles de rap. Exemples : 'on grandit en realisant que tout le monde fait semblant', 'y'a des gens qui restent et des gens qui apprennent', 'le silence est la seule reponse honnete parfois'. MAX 12 MOTS. Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"pensee\",\"genz\",\"vrai\",\"rap\",\"cinema\",\"vie\"],\"slides\":[{\"type\":\"pensee_slide\",\"texte\":\"pensee directe MAX 12 MOTS\"},{\"type\":\"pensee_slide\",\"texte\":\"pensee directe MAX 12 MOTS\"},{\"type\":\"pensee_slide\",\"texte\":\"pensee directe MAX 12 MOTS\"}]}";
        return callGemini(prompt);
    }

    public String genzCinema(String style) throws Exception {
        String prompt = "Tu crees des carrousels TikTok viraux. Style repliques de films ou paroles de rap qui parlent a la gen Z francaise. 3 slides. Slide 1 = replique de film ou parole de rap connue qui touche. Slide 2 = ce que ca dit sur la vraie vie en 1 phrase. Slide 3 = question ou pensee qui resonne. Films : Intouchables, La Haine, Les Profs, Grave, Bande de Filles. Rap : PNL, Nekfeu, Orelsan, Hamza, SCH. MAX 12 MOTS par slide. Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"cinema\",\"rap\",\"genz\",\"france\",\"replique\",\"vrai\"],\"slides\":[{\"type\":\"cinema_slide\",\"texte\":\"replique ou parole MAX 12 MOTS\"},{\"type\":\"cinema_slide\",\"texte\":\"ce que ca dit MAX 12 MOTS\"},{\"type\":\"cinema_slide\",\"texte\":\"pensee finale MAX 12 MOTS\"}]}";
        return callGemini(prompt);
    }

    public String basketVie(String style) throws Exception {
        String prompt = "Tu crees des carrousels TikTok viraux qui font des millions de vues. 3 slides. Chaque slide = UNE phrase tres courte, directe, vraie, qui parle a tout le monde. Style parle, familier, comme un ami qui dit une verite. PAS de style litteraire ou poetique. PAS de metaphores compliquees. Exemples EXACTEMENT ce style : 'on ignore pas quelqu'un pour qui on ressent rien', 't'as pas perdu du temps, t'as appris qui restait', 'certaines personnes savent exactement ce qu'elles font', 'le silence repond mieux que les excuses', 'on grandit pas en vieillissant, on grandit en perdant'. MAX 12 MOTS. Simple. Direct. Vrai. Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"vie\",\"vrai\",\"emotion\",\"tiktok\",\"aesthetic\",\"basketball\"],\"slides\":[{\"type\":\"vie_slide\",\"texte\":\"phrase directe MAX 12 MOTS\"},{\"type\":\"vie_slide\",\"texte\":\"phrase directe MAX 12 MOTS\"},{\"type\":\"vie_slide\",\"texte\":\"phrase directe MAX 12 MOTS\"}]}";
        return callGemini(prompt);
    }

    public String basketMotivation(String style) throws Exception {
        String prompt = "Tu crees des carrousels TikTok basket emotion style edit cinematique. 3 slides. REGLE ABSOLUE : MAX 5 MOTS par champ. Tres court, tres fort, tres emotionnel. Slide 1 = phrase choc ultra courte style 'Le sacrifice. La gloire.' ou 'Personne ne voit les larmes.' MAX 5 MOTS. Slide 2 = citation reelle d'un joueur NBA tres courte sur la douleur ou la grandeur MAX 6 MOTS + nom joueur. Slide 3 = question qui touche au coeur MAX 5 MOTS. Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"basketball\",\"motivation\",\"nba\",\"mindset\",\"aesthetic\",\"emotion\"],\"slides\":[{\"type\":\"motiv_hook\",\"texte\":\"MAX 5 MOTS\"},{\"type\":\"motiv_citation\",\"citation\":\"MAX 6 MOTS\",\"auteur\":\"Prenom Nom\"},{\"type\":\"motiv_cta\",\"question\":\"MAX 5 MOTS ?\"}]}";
        return callGemini(prompt);
    }

    public String basketFilm(String film, String style) throws Exception {
        String prompt = "Tu crees des carousels TikTok emotionnels pour un compte basket aesthetic. Film : " + film + ". Format : 3 slides qui donnent des frissons. Slide 1 = replique iconique du film qui donne des frissons, MAX 10 MOTS. Slide 2 = contexte de la scene en 1 phrase percutante, MAX 10 MOTS. Slide 3 = lecon de vie universelle tiree de cette scene, MAX 10 MOTS. Style : emotionnel, inspire, cinematique. REGLE ABSOLUE : MAX 10 MOTS par champ. Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"basketball\",\"film\",\"motivation\",\"inspiration\",\"aesthetic\",\"mindset\"],\"slides\":[{\"type\":\"film_hook\",\"replique\":\"replique iconique MAX 10 MOTS\",\"film\":\"" + film + "\"},{\"type\":\"film_contexte\",\"contexte\":\"contexte de la scene MAX 10 MOTS\"},{\"type\":\"film_lecon\",\"lecon\":\"lecon de vie MAX 10 MOTS\"}]}";
        return callGemini(prompt);
    }

    public String basketAction(String joueur, String action, String style) throws Exception {
        String prompt = "Tu es expert en creation de prompts Kling AI pour des carrousels TikTok basket style anime vintage. Decompose cette action de basket en 5 moments cles image par image. Chaque moment = un prompt Kling AI tres detaille en anglais. Style visuel : anime japonais 2D, grain de film vintage, eclairage dramatique cinematique, palette chaude sepia, portrait 9:16, pas de texte dans limage. Le joueur doit etre reconnaissable par son style de jeu et sa silhouette. Moment 1 = reception/preparation. Moment 2 = premier mouvement. Moment 3 = pic de laction. Moment 4 = execution. Moment 5 = resultat/celebration. Joueur : " + joueur + ". Action : " + action + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"basketball\",\"anime\",\"aesthetic\",\"nba\",\"90sbasketball\",\"highlight\"],\"joueur\":\"" + joueur + "\",\"action\":\"" + action + "\",\"slides\":[{\"type\":\"basket_action\",\"moment\":\"1\",\"texte\":\"MAX 4 MOTS\",\"prompt_kling\":\"detailed anime scene prompt in english, vintage film aesthetic, 2D japanese animation style, dramatic cinematic lighting, warm sepia tones, portrait 9:16, no text, dynamic basketball pose\"},{\"type\":\"basket_action\",\"moment\":\"2\",\"texte\":\"MAX 4 MOTS\",\"prompt_kling\":\"detailed anime scene prompt\"},{\"type\":\"basket_action\",\"moment\":\"3\",\"texte\":\"MAX 4 MOTS\",\"prompt_kling\":\"detailed anime scene prompt\"},{\"type\":\"basket_action\",\"moment\":\"4\",\"texte\":\"MAX 4 MOTS\",\"prompt_kling\":\"detailed anime scene prompt\"},{\"type\":\"basket_action\",\"moment\":\"5\",\"texte\":\"MAX 4 MOTS\",\"prompt_kling\":\"detailed anime scene prompt, triumphant moment\"}]}";
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
        return "Tu crees des carousels TikTok viraux sur la philosophie. Format : 3 slides SEULEMENT. Objectif : resumer une idee philosophique de facon divertissante et percutante. Chaque slide = 1 idee cle en MAX 6 MOTS, style grande typographie. SLIDE 1 : hook qui arrete le scroll — formule virale comme 'Tout le monde se trompe sur X', 'On t'a menti sur X', 'Personne parle de ca', 'Ca va te choquer' — MAX 6 MOTS. SLIDE 2 : l'idee philosophique principale vulgarisee simplement — MAX 6 MOTS. SLIDE 3 : la lecon de vie concrete ou la question qui fait reflechir — MAX 6 MOTS. Pas de jargon. Direct. Fun. Comme si tu expliquais a un ami en 3 phrases. Theme : " + theme + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"philosophie\",\"citation\",\"sagesse\",\"tiktok\",\"fyp\",\"mindset\"],\"slides\":[{\"type\":\"hook\",\"citation\":\"hook MAX 6 MOTS\",\"auteur\":\"\",\"origine\":\"\"},{\"type\":\"intrigue\",\"question\":\"idee principale MAX 6 MOTS\"},{\"type\":\"lesson\",\"titre\":\"\",\"corps\":\"lecon ou question MAX 6 MOTS\"}]}";
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
        return "Tu crees des carousels TikTok viraux a partir de transcriptions YouTube. OBJECTIF : hook slide 1 qui ARRETE le scroll. Formats prouvés viraux : 'Tout le monde se trompe sur ca', 'On t'a menti sur ca', 'Personne ne parle de ca', 'Ca va te choquer', 'J'aurais aime savoir ca plus tot', 'Le secret que personne ne dit', 'Tu fais ca mal'. JAMAIS donner l'idee principale en slide 1. Accessible, comme un ami. MAX 8 MOTS par champ. Transcription : " + excerpt + ". Retourne UNIQUEMENT ce JSON sans backticks : {\"hashtags\":[\"philosophie\",\"citation\",\"sagesse\",\"mindset\",\"tiktok\",\"fyp\"],\"slides\":[{\"type\":\"video_hook\",\"concept\":\"sujet 2 mots\",\"accroche\":\"hook viral MAX 8 MOTS\"},{\"type\":\"video_explication\",\"titre\":\"2 MOTS\",\"corps\":\"idee cle MAX 8 MOTS\"},{\"type\":\"video_explication\",\"titre\":\"2 MOTS\",\"corps\":\"idee cle MAX 8 MOTS\"},{\"type\":\"video_exemple\",\"exemple\":\"exemple concret MAX 8 MOTS\"},{\"type\":\"video_cta\",\"texte\":\"MAX 6 MOTS\",\"question\":\"question MAX 7 MOTS ?\"}]}";
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
