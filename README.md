# Carousel Generator — Citations du monde

Stack : Spring Boot 3 (Java 21) + React Vite

## Lancement en local

### Backend
```bash
cd backend
# Crée un fichier .env ou exporte la variable
export ANTHROPIC_API_KEY=sk-ant-...
mvn spring-boot:run
# Tourne sur http://localhost:8080
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
# Tourne sur http://localhost:5173
```

## Déploiement Railway

### Backend
1. Push le dossier `backend/` sur un repo GitHub
2. Sur Railway → New Project → Deploy from GitHub
3. Railway détecte le Dockerfile automatiquement
4. Ajoute la variable d'environnement : `ANTHROPIC_API_KEY=sk-ant-...`
5. Récupère l'URL générée (ex: `https://carousel-api.up.railway.app`)

### Frontend
1. Push le dossier `frontend/` sur un repo GitHub (ou le même repo)
2. Sur Railway → New Service → Deploy from GitHub
3. Build command : `npm run build`
4. Start command : `npx serve dist`
5. Ajoute la variable : `VITE_API_URL=https://carousel-api.up.railway.app`

## Endpoint API

```
POST /api/generate
Content-Type: application/json

{
  "theme": "philosophie stoïcienne",
  "style": "sombre et épuré"
}
```

Réponse :
```json
{
  "data": "{...json du carrousel...}"
}
```
