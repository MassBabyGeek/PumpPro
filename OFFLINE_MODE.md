# Mode Offline - PompeurPro

## 📱 Vue d'ensemble

Le mode offline permet aux utilisateurs de continuer à utiliser l'application même sans connexion internet. Toutes les données importantes sont mises en cache localement et les actions effectuées hors ligne sont synchronisées automatiquement quand la connexion revient.

## ✨ Fonctionnalités

### 1. **Cache-First Strategy**
- Toutes les données sont chargées depuis le cache en priorité
- Mise à jour automatique depuis l'API quand en ligne
- Durée de cache : **24 heures** (configurable)

### 2. **Queue de Synchronisation**
Les actions suivantes sont mises en file d'attente quand hors ligne :
- ✅ **Sessions d'entraînement** (Priorité 1 - Haute)
- ❤️ **Likes/Unlikes** (Priorité 2 - Moyenne)
- 👤 **Mise à jour du profil** (Priorité 3 - Basse)
- 💬 **Feedbacks** (Priorité 4 - Basse)

### 3. **Synchronisation Automatique**
- Auto-sync quand la connexion revient
- Option pour sync uniquement en WiFi
- Bouton de synchronisation manuelle

### 4. **Gestion des Conflits**
- Détection automatique des conflits
- **Option B** : L'utilisateur choisit entre version locale ou serveur
- Modal de résolution pour chaque conflit

### 5. **Mode Offline Forcé**
- Switch pour activer/désactiver manuellement le mode offline
- Utile pour économiser les données mobiles
- Utile pour tester l'application hors ligne

### 6. **Limite de Stockage Paramétrable**
- Par défaut : **50 sessions** maximum en cache
- Paramétrable pour version premium
- Permet de gérer l'espace de stockage

## 🏗️ Architecture

### Services

#### `StorageService` ([src/services/storage.service.ts](src/services/storage.service.ts))
Gère le cache local avec AsyncStorage :
- Stockage/récupération des données avec métadonnées
- Gestion de l'expiration du cache (24h)
- Nettoyage du cache
- Statistiques du cache

#### `NetworkService` ([src/services/network.service.ts](src/services/network.service.ts))
Détecte l'état de la connexion réseau :
- Monitoring en temps réel via NetInfo
- Détection WiFi vs données mobiles
- Listeners pour changements d'état

#### `SyncService` ([src/services/sync.service.ts](src/services/sync.service.ts))
Gère la queue et la synchronisation :
- File d'attente prioritaire
- Exécution des actions en séquence
- Gestion des erreurs et retry (max 3 fois)
- Détection et résolution des conflits

### Contexts

#### `OfflineContext` ([src/contexts/OfflineContext.tsx](src/contexts/OfflineContext.tsx))
Context principal pour le mode offline :
```typescript
interface OfflineContextType {
  // Network status
  networkStatus: NetworkStatus;
  isOnline: boolean;
  isOffline: boolean;

  // Sync status
  syncStatus: SyncStatus;
  conflicts: ConflictData[];

  // Settings
  settings: OfflineSettings;
  updateSettings: (settings: Partial<OfflineSettings>) => Promise<void>;

  // Actions
  sync: () => Promise<void>;
  resolveConflict: (conflictId: string, resolution: 'keep_local' | 'keep_server') => Promise<void>;
  clearCache: () => Promise<void>;

  // Forced offline mode
  forcedOffline: boolean;
  setForcedOffline: (forced: boolean) => Promise<void>;
}
```

### Hooks

#### `useOffline()` ([src/hooks/useOffline.ts](src/hooks/useOffline.ts))
Hook pour accéder au contexte offline :
```typescript
const {isOnline, isOffline, sync, syncStatus, conflicts} = useOffline();
```

#### `useCache<T>()` ([src/hooks/useCache.ts](src/hooks/useCache.ts))
Hook générique pour data fetching avec cache :
```typescript
const {data, isLoading, error, refresh, isCached} = useCache({
  cacheKey: STORAGE_KEYS.PROGRAMS,
  fetchFn: () => programService.getPrograms(),
  enabled: true,
});
```

### Hooks Modifiés

#### `useWorkoutSession` ✅
- Sauvegarde les sessions en queue si offline
- Toast différent selon le mode (online/offline)
- Fallback automatique en cas d'erreur API

#### `usePrograms` ✅
- Cache-first loading
- Likes/unlikes en queue si offline
- Indicateur `isCached` pour afficher l'état

#### Autres hooks à modifier (TODO)
- `useWorkouts` - Pour les sessions
- `useChallenges` - Pour les challenges
- `useUser` - Pour le profil

## 📦 Composants UI

### `OfflineBanner` ([src/components/OfflineBanner/OfflineBanner.tsx](src/components/OfflineBanner/OfflineBanner.tsx))
Bannière affichée en haut de l'écran quand offline :
- Icône différente selon mode (forcé ou déconnexion)
- Nombre d'actions en attente
- Bouton de sync manuel

### À créer (TODO)
- `SyncIndicator` - Indicateur de progression de sync
- `ConflictResolutionModal` - Modal pour résoudre les conflits
- `OfflineSettingsScreen` - Écran de paramètres offline

## 🔑 Clés de Stockage

Toutes les clés sont définies dans [src/types/offline.types.ts](src/types/offline.types.ts) :

```typescript
export const STORAGE_KEYS = {
  // Cache
  PROGRAMS: '@pompeurpro:cache:programs',
  CHALLENGES: '@pompeurpro:cache:challenges',
  WORKOUTS: '@pompeurpro:cache:workouts',
  LEADERBOARD: '@pompeurpro:cache:leaderboard',
  USER_PROFILE: '@pompeurpro:cache:user_profile',

  // Offline data
  PENDING_SESSIONS: '@pompeurpro:offline:pending_sessions',
  SYNC_QUEUE: '@pompeurpro:offline:sync_queue',
  CONFLICTS: '@pompeurpro:offline:conflicts',

  // Settings
  OFFLINE_SETTINGS: '@pompeurpro:offline:settings',
  LAST_SYNC: '@pompeurpro:offline:last_sync',
};
```

## 🚀 Utilisation

### Initialisation

Le mode offline est automatiquement initialisé au démarrage de l'app via `OfflineProvider` dans [App.tsx](App.tsx).

### Vérifier l'état de connexion

```typescript
import {useOffline} from './hooks/useOffline';

const MyComponent = () => {
  const {isOnline, isOffline, forcedOffline} = useOffline();

  return (
    <Text>
      {isOnline ? 'En ligne' : 'Hors ligne'}
      {forcedOffline && ' (Mode forcé)'}
    </Text>
  );
};
```

### Sauvegarder une action offline

```typescript
import {syncService} from './services/sync.service';

// Ajouter une action à la queue
await syncService.addAction('CREATE_SESSION', sessionData);
```

### Synchroniser manuellement

```typescript
const {sync} = useOffline();

// Trigger sync
await sync();
```

### Gérer les paramètres

```typescript
const {settings, updateSettings} = useOffline();

// Activer le mode offline forcé
await updateSettings({forcedOfflineMode: true});

// Sync uniquement en WiFi
await updateSettings({syncOnWifiOnly: true});

// Changer la limite de sessions (version premium)
await updateSettings({maxStoredSessions: 100});
```

### Résoudre un conflit

```typescript
const {conflicts, resolveConflict} = useOffline();

// Garder la version locale
await resolveConflict(conflictId, 'keep_local');

// Garder la version serveur
await resolveConflict(conflictId, 'keep_server');
```

## 📊 Monitoring

### Statut de synchronisation

```typescript
const {syncStatus} = useOffline();

console.log({
  isSyncing: syncStatus.isSyncing,
  pendingActions: syncStatus.pendingActions,
  lastSyncTime: syncStatus.lastSyncTime,
  conflicts: syncStatus.conflicts,
  progress: syncStatus.progress, // 0-100
});
```

### Taille du cache

```typescript
import {storageService} from './services/storage.service';

const {keys, sizeMB} = await storageService.getCacheSize();
console.log(`Cache: ${keys} clés, ${sizeMB.toFixed(2)} MB`);
```

## ⚙️ Configuration

### Paramètres par défaut

```typescript
export const DEFAULT_OFFLINE_SETTINGS: OfflineSettings = {
  maxStoredSessions: 50, // Version gratuite
  cacheExpiration: 24 * 60 * 60 * 1000, // 24 heures
  autoSync: true,
  syncOnWifiOnly: false,
  forcedOfflineMode: false,
};
```

### Version Premium

Pour la version payante, augmenter `maxStoredSessions` :

```typescript
await updateSettings({
  maxStoredSessions: 200, // Version premium
});
```

## 🧪 Tests

### Tester le mode offline

1. **Via les DevTools** : Désactiver le réseau dans les paramètres du simulateur
2. **Via le switch** : Activer `forcedOfflineMode` dans les paramètres
3. **Via code** :
```typescript
await setForcedOffline(true);
```

### Scénarios de test

1. ✅ **Créer une session offline** → Se reconnecter → Vérifier la synchronisation
2. ✅ **Liker un programme offline** → Se reconnecter → Vérifier le like
3. ✅ **Conflit** : Modifier un programme online ET offline → Résoudre le conflit
4. ✅ **Cache** : Charger des données → Aller offline → Vérifier le cache
5. ✅ **Expiration** : Attendre 24h+ → Vérifier que le cache expire

## 🔮 Améliorations Futures

### À implémenter (TODO)

1. **Modifier les hooks restants** pour cache-first :
   - `useWorkouts`
   - `useChallenges`
   - `useUser`

2. **Créer les composants UI** :
   - `SyncIndicator` - Progress bar de sync
   - `ConflictResolutionModal` - UI pour résoudre les conflits
   - `OfflineSettingsScreen` - Paramètres du mode offline

3. **Préchargement au login** :
   - Charger automatiquement toutes les données essentielles au login
   - Progress indicator pendant le chargement

4. **Optimisations** :
   - Compression des données en cache
   - Background sync avec WorkManager (Android) / Background Tasks (iOS)
   - Delta sync (ne synchroniser que les changements)

5. **Analytics** :
   - Tracker l'utilisation du mode offline
   - Métriques de synchronisation (succès/échecs)
   - Temps moyen de sync

## 📚 Ressources

- [AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)
- [NetInfo Docs](https://github.com/react-native-netinfo/react-native-netinfo)
- [Offline-First Architecture](https://offlinefirst.org/)

## 🐛 Debugging

### Voir les logs

```bash
# iOS
npx react-native log-ios | grep -E "\[StorageService\]|\[NetworkService\]|\[SyncService\]|\[OfflineProvider\]"

# Android
npx react-native log-android | grep -E "\[StorageService\]|\[NetworkService\]|\[SyncService\]|\[OfflineProvider\]"
```

### Vider le cache

```typescript
import {storageService} from './services/storage.service';

await storageService.clearAllCache();
```

### Réinitialiser la queue de sync

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from './types/offline.types';

await AsyncStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
```

## 📞 Support

Pour toute question ou problème avec le mode offline, créer une issue sur le repo GitHub ou contacter l'équipe de développement.
