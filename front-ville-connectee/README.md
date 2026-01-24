# Front — Ville Connectée (React + Leaflet)

## Prérequis
- Node.js 18+
- Backend Spring Boot lancé (Swagger sur http://localhost:8082/swagger-ui/index.html)

## Installation
```bash
npm install
npm run dev
```

## Configuration API
Crée un fichier `.env` à la racine (ou copie `.env.example`) :
```
VITE_API_BASE_URL=http://localhost:8082
```

## Endpoints utilisés (selon Swagger)
- POST `/api/utilisateur/login`
- POST `/api/utilisateur/register`
- GET  `/api/utilisateur/validate`
- GET  `/api/utilisateur/all`
- GET  `/api/type-alerte`
- POST `/api/type-alerte`
- DELETE `/api/type-alerte/{id}`
- GET  `/api/municipal`
- POST `/api/municipal`
- GET  `/api/alertes`
- POST `/api/alertes` (multipart)
- PUT  `/api/alertes/{alerteId}/assign/{agentId}`
- GET  `/api/download/{fileName}`

## Upload média (IMPORTANT)
Le front crée une alerte en `multipart/form-data` avec :
- message
- latitude
- longitude
- typeAlerteId
- files (multi)

Si ton backend attend **d'autres noms** (ex: `file` au lieu de `files`),
modifie uniquement : `src/api/alertes.api.ts` (fonction `createAlerteMultipart`).

## UI
L’UI est conçue pour coller à la maquette :
- Header bleu
- Cards blanches arrondies, shadow douce
- Badges statuts
- Dashboard Citoyen / Agent / Admin
- Leaflet (OpenStreetMap)
