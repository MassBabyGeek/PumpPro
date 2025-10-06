# Backend API Specification - PompeurPro

## Vue d'ensemble

Ce document spécifie l'API backend pour l'application PompeurPro. Le système permet de gérer des programmes d'entraînement personnalisables que le frontend peut interpréter et exécuter.

## Types de Programmes Supportés

### 1. FREE_MODE - Mode Libre
Mode sans limite, l'utilisateur fait autant de pompes qu'il veut.

```json
{
  "id": "free-mode-standard",
  "name": "Mode Libre",
  "description": "Fais autant de pompes que tu veux, à ton rythme",
  "type": "FREE_MODE",
  "variant": "STANDARD",
  "restBetweenSets": null
}
```

### 2. TARGET_REPS - Objectif de Répétitions
L'utilisateur doit atteindre un nombre spécifique de répétitions.

```json
{
  "id": "target-50",
  "name": "Objectif 50",
  "description": "Atteins 50 pompes en une seule série",
  "type": "TARGET_REPS",
  "variant": "STANDARD",
  "targetReps": 50,
  "timeLimit": 600
}
```

**Champs requis:**
- `targetReps` (number): Nombre de répétitions à atteindre
- `timeLimit` (number, optionnel): Temps limite en secondes

### 3. MAX_TIME - Maximum en Temps Limité
L'utilisateur fait le maximum de répétitions dans un temps donné.

```json
{
  "id": "max-2min",
  "name": "Max en 2 minutes",
  "description": "Fais le maximum de pompes en 2 minutes",
  "type": "MAX_TIME",
  "variant": "STANDARD",
  "duration": 120,
  "allowRest": true
}
```

**Champs requis:**
- `duration` (number): Durée en secondes
- `allowRest` (boolean): Si la pause est permise pendant l'exercice

### 4. SETS_REPS - Séries x Répétitions
Programme classique par séries et répétitions (ex: 3x8).

```json
{
  "id": "beginner-3x8",
  "name": "Débutant - 3x8",
  "description": "3 séries de 8 répétitions",
  "type": "SETS_REPS",
  "variant": "INCLINE",
  "sets": 3,
  "repsPerSet": 8,
  "restBetweenSets": 60
}
```

**Champs requis:**
- `sets` (number): Nombre de séries
- `repsPerSet` (number): Répétitions par série
- `restBetweenSets` (number): Temps de repos entre séries en secondes

### 5. PYRAMID - Pyramide
Séries avec répétitions variables (ex: 5-10-15-10-5).

```json
{
  "id": "pyramid-classic",
  "name": "Pyramide Classique",
  "description": "Monte puis descend : 5-10-15-10-5",
  "type": "PYRAMID",
  "variant": "STANDARD",
  "repsSequence": [5, 10, 15, 10, 5],
  "restBetweenSets": 45
}
```

**Champs requis:**
- `repsSequence` (number[]): Tableau de répétitions pour chaque série
- `restBetweenSets` (number): Temps de repos entre séries en secondes

### 6. EMOM - Every Minute On the Minute
Répétitions fixes à faire au début de chaque minute.

```json
{
  "id": "emom-10",
  "name": "EMOM 10 minutes",
  "description": "10 pompes au début de chaque minute pendant 10 minutes",
  "type": "EMOM",
  "variant": "STANDARD",
  "repsPerMinute": 10,
  "totalMinutes": 10
}
```

**Champs requis:**
- `repsPerMinute` (number): Répétitions à faire chaque minute
- `totalMinutes` (number): Nombre total de minutes

### 7. AMRAP - As Many Reps As Possible
Maximum de répétitions dans le temps imparti.

```json
{
  "id": "amrap-5",
  "name": "AMRAP 5 minutes",
  "description": "Maximum de répétitions en 5 minutes",
  "type": "AMRAP",
  "variant": "STANDARD",
  "duration": 300
}
```

**Champs requis:**
- `duration` (number): Durée en secondes

## Variantes de Pompes

Le champ `variant` peut prendre les valeurs suivantes:

| Variant | Description | Difficulté |
|---------|-------------|-----------|
| `STANDARD` | Pompes classiques | Intermédiaire |
| `INCLINE` | Mains surélevées | Débutant |
| `DECLINE` | Pieds surélevés | Avancé |
| `DIAMOND` | Mains en diamant (triceps) | Avancé |
| `WIDE` | Mains écartées | Intermédiaire |
| `PIKE` | Position V inversé (épaules) | Avancé |
| `ARCHER` | Bras alternés | Expert |

## Endpoints API

### GET /api/programs
Récupère tous les programmes disponibles.

**Response:**
```json
{
  "programs": [
    {
      "id": "free-mode-standard",
      "name": "Mode Libre",
      "type": "FREE_MODE",
      "variant": "STANDARD"
    }
  ]
}
```

### GET /api/programs/:id
Récupère un programme spécifique.

**Response:**
```json
{
  "id": "beginner-3x8",
  "name": "Débutant - 3x8",
  "description": "3 séries de 8 répétitions",
  "type": "SETS_REPS",
  "variant": "INCLINE",
  "sets": 3,
  "repsPerSet": 8,
  "restBetweenSets": 60
}
```

### GET /api/programs/recommended
Récupère les programmes recommandés pour l'utilisateur.

**Query Parameters:**
- `difficulty` (optional): `beginner` | `intermediate` | `advanced`
- `variant` (optional): Type de pompes souhaité

**Response:**
```json
{
  "programs": [...]
}
```

### POST /api/programs/custom
Créer un programme personnalisé.

**Request Body:**
```json
{
  "name": "Mon Programme",
  "description": "Description",
  "type": "SETS_REPS",
  "variant": "STANDARD",
  "sets": 4,
  "repsPerSet": 12,
  "restBetweenSets": 60
}
```

**Response:**
```json
{
  "success": true,
  "program": {
    "id": "custom-xyz123",
    "isCustom": true,
    ...
  }
}
```

### POST /api/workouts/session
Enregistrer une session d'entraînement complétée.

**Request Body:**
```json
{
  "sessionId": "session-1234567890",
  "programId": "beginner-3x8",
  "startTime": "2025-10-06T10:00:00Z",
  "endTime": "2025-10-06T10:15:00Z",
  "sets": [
    {
      "setNumber": 1,
      "targetReps": 8,
      "completedReps": 8,
      "duration": 25,
      "timestamp": "2025-10-06T10:01:00Z"
    }
  ],
  "totalReps": 24,
  "totalDuration": 300,
  "completed": true,
  "notes": "Bon entraînement!"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "session-1234567890",
  "savedAt": "2025-10-06T10:15:30Z"
}
```

### GET /api/workouts/history
Récupère l'historique des sessions.

**Query Parameters:**
- `limit` (optional): Nombre de sessions à retourner (défaut: 20)
- `offset` (optional): Offset pour la pagination
- `from` (optional): Date de début (ISO 8601)
- `to` (optional): Date de fin (ISO 8601)

**Response:**
```json
{
  "sessions": [...],
  "total": 42,
  "hasMore": true
}
```

### GET /api/workouts/stats
Récupère les statistiques de l'utilisateur.

**Response:**
```json
{
  "totalWorkouts": 42,
  "totalPushUps": 3420,
  "totalCalories": 2850,
  "totalTime": 12600,
  "bestSession": 62,
  "averagePushUps": 41,
  "currentStreak": 12,
  "personalBests": {
    "STANDARD": 62,
    "DIAMOND": 35,
    "DECLINE": 45
  }
}
```

## Format de Réponse d'Erreur

```json
{
  "success": false,
  "error": {
    "code": "INVALID_PROGRAM",
    "message": "Le programme spécifié est invalide",
    "details": {
      "field": "sets",
      "reason": "Le nombre de séries doit être supérieur à 0"
    }
  }
}
```

## Codes d'Erreur

| Code | Description |
|------|-------------|
| `INVALID_PROGRAM` | Programme invalide ou malformé |
| `PROGRAM_NOT_FOUND` | Programme non trouvé |
| `INVALID_SESSION` | Session invalide |
| `UNAUTHORIZED` | Utilisateur non authentifié |
| `VALIDATION_ERROR` | Erreur de validation des données |

## Notes d'Implémentation

### Validation Côté Backend

Le backend DOIT valider:
1. Tous les champs requis sont présents
2. Les valeurs numériques sont > 0 (sauf si null est permis)
3. Les types et variants sont valides
4. Pour PYRAMID: `repsSequence` doit contenir au moins 1 élément
5. Pour les sessions: les timestamps sont cohérents

### Sécurité

- Toutes les routes nécessitent une authentification (sauf GET /api/programs)
- Les programmes personnalisés sont liés à l'utilisateur
- Les sessions sont liées à l'utilisateur
- Rate limiting recommandé: 60 requêtes/minute

### Performance

- Cache recommandé pour GET /api/programs (10 minutes)
- Pagination pour l'historique (max 100 par page)
- Index sur `userId`, `programId`, `startTime`

## Exemple d'Utilisation Frontend

```typescript
import { WorkoutEngine } from './services/workoutEngine.service';
import { fetchProgramById } from './api/programs';

// 1. Récupérer un programme
const program = await fetchProgramById('beginner-3x8');

// 2. Créer une instance du moteur
const engine = new WorkoutEngine(program);

// 3. Démarrer l'entraînement
engine.start();

// 4. S'abonner aux changements d'état
engine.subscribe((state) => {
  console.log('Reps:', state.currentReps);
  console.log('Set:', state.currentSet, '/', state.totalSets);
  console.log('Temps:', state.elapsedTime);
});

// 5. Incrémenter quand une pompe est détectée
engine.incrementRep();

// 6. Compléter la série courante
if (engine.isCurrentSetComplete()) {
  engine.completeCurrentSet();
}

// 7. À la fin, sauvegarder la session
const session = engine.getSession();
await saveWorkoutSession(session);
```

## Migration depuis l'Ancien Système

L'ancien système utilisait `WorkoutType = 'libre' | 'timer' | 'serie'`.

**Mapping:**
- `'libre'` → `FREE_MODE`
- `'timer'` → `MAX_TIME`
- `'serie'` → `SETS_REPS`

Les anciens types sont maintenus pour la compatibilité mais les nouveaux endpoints utilisent le nouveau système.
