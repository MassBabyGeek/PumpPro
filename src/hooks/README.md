# Custom Hooks Documentation

Ce dossier contient tous les hooks personnalisés de l'application PompeurPro.

## 📚 Table des matières

- [useAuth](#useauth) - Authentification
- [useModal](#usemodal) - Gestion des modales
- [useError](#useerror) - Gestion des erreurs
- [useWorkoutPrograms](#useworkoutprograms) - Programmes d'entraînement
- [useToast](#usetoast) - Notifications toast
- [useDebounce](#usedebounce) - Debouncing de valeurs
- [useForm](#useform) - Gestion de formulaires
- [useTimer](#usetimer) - Timer personnalisé
- [useWorkoutStats](#useworkoutstats) - Statistiques d'entraînement
- [useImagePicker](#useimagepicker) - Sélection d'images

---

## useAuth

Hook pour gérer l'authentification utilisateur.

### Usage

```typescript
import {useAuth} from '../hooks/useAuth';

const MyComponent = () => {
  const {user, isAuthenticated, login, logout} = useAuth();

  const handleLogin = async () => {
    try {
      await login('email@example.com', 'password');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      {isAuthenticated ? (
        <>
          <Text>Bonjour {user?.name}</Text>
          <Button onPress={logout} title="Déconnexion" />
        </>
      ) : (
        <Button onPress={handleLogin} title="Connexion" />
      )}
    </View>
  );
};
```

### API

- `user: User | null` - Utilisateur connecté
- `isAuthenticated: boolean` - État d'authentification
- `isLoading: boolean` - Chargement en cours
- `login(email, password): Promise<void>` - Connexion
- `register(email, password, name): Promise<void>` - Inscription
- `logout(): Promise<void>` - Déconnexion
- `updateUser(updates): Promise<void>` - Mise à jour du profil

---

## useModal

Hook pour gérer l'état d'une modale.

### Usage

```typescript
import {useModal} from '../hooks/useModal';

const MyComponent = () => {
  const modal = useModal();

  return (
    <>
      <Button onPress={modal.open} title="Ouvrir" />
      <Modal visible={modal.isVisible} onClose={modal.close}>
        <Text>Contenu de la modale</Text>
      </Modal>
    </>
  );
};
```

### API

- `isVisible: boolean` - État de visibilité
- `open(): void` - Ouvrir la modale
- `close(): void` - Fermer la modale
- `toggle(): void` - Basculer l'état

### useModalWithData

Variante du hook permettant de passer des données à la modale.

```typescript
const modal = useModalWithData<{id: string; name: string}>();

modal.open({id: '123', name: 'Test'});
console.log(modal.data); // {id: '123', name: 'Test'}
```

---

## useError

Hook pour gérer les erreurs de manière centralisée.

### Usage

```typescript
import {useError} from '../hooks/useError';

const MyComponent = () => {
  const {error, hasError, setError, clearError, handleError} = useError();

  const fetchData = async () => {
    try {
      const data = await api.getData();
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <View>
      {hasError && (
        <View>
          <Text>{error?.message}</Text>
          <Button onPress={clearError} title="Effacer" />
        </View>
      )}
    </View>
  );
};
```

### API

- `error: ErrorState | null` - Erreur actuelle
- `hasError: boolean` - Présence d'une erreur
- `setError(error): void` - Définir une erreur
- `clearError(): void` - Effacer l'erreur
- `handleError(unknown): void` - Gérer une erreur inconnue

### useAsyncError

Variante pour gérer les erreurs dans les opérations asynchrones.

```typescript
const {data, isLoading, error, execute} = useAsyncError<User[]>();

await execute(() => fetchUsers());
```

---

## useWorkoutPrograms

Hook pour charger et gérer les programmes d'entraînement.

### Usage

```typescript
import {useWorkoutPrograms} from '../hooks/useWorkoutPrograms';

const MyComponent = () => {
  const {programs, isLoading, error, refreshPrograms} = useWorkoutPrograms();

  return (
    <View>
      {isLoading && <ActivityIndicator />}
      {error && <Text>{error}</Text>}
      {programs.map(program => (
        <Text key={program.id}>{program.name}</Text>
      ))}
      <Button onPress={refreshPrograms} title="Rafraîchir" />
    </View>
  );
};
```

### API

- `programs: WorkoutProgram[]` - Liste des programmes
- `isLoading: boolean` - Chargement en cours
- `error: string | null` - Erreur éventuelle
- `refreshPrograms(): Promise<void>` - Recharger les programmes
- `getProgramById(id): Promise<WorkoutProgram | null>` - Récupérer un programme
- `createProgram(program): Promise<WorkoutProgram>` - Créer un programme

---

## useToast

Hook pour afficher des notifications toast.

### Usage

```typescript
import {useToast} from '../hooks/useToast';

const MyComponent = () => {
  const {showSuccess, showError, showInfo, showWarning} = useToast();

  return (
    <>
      <Button onPress={() => showSuccess('Succès !')} title="Succès" />
      <Button onPress={() => showError('Erreur !')} title="Erreur" />
      <Button onPress={() => showInfo('Info')} title="Info" />
      <Button onPress={() => showWarning('Attention')} title="Warning" />
    </>
  );
};
```

### API

- `toasts: Toast[]` - Liste des toasts actifs
- `showToast(message, type?, duration?): void` - Afficher un toast
- `showSuccess(message): void` - Toast de succès
- `showError(message): void` - Toast d'erreur
- `showInfo(message): void` - Toast d'information
- `showWarning(message): void` - Toast d'avertissement
- `hideToast(id): void` - Masquer un toast
- `clearAll(): void` - Effacer tous les toasts

---

## useDebounce

Hook pour debouncer une valeur.

### Usage

```typescript
import {useDebounce} from '../hooks/useDebounce';

const MyComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Effectuer la recherche
      searchApi(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return <TextInput value={searchTerm} onChangeText={setSearchTerm} />;
};
```

### API

- `useDebounce<T>(value: T, delay?: number): T`

---

## useForm

Hook complet pour la gestion de formulaires avec validation.

### Usage

```typescript
import {useForm, validators} from '../hooks/useForm';

const LoginForm = () => {
  const form = useForm({
    email: {
      initialValue: '',
      validators: [validators.required(), validators.email()],
    },
    password: {
      initialValue: '',
      validators: [validators.required(), validators.minLength(6)],
    },
  });

  const handleSubmit = form.handleSubmit(async values => {
    await login(values.email, values.password);
  });

  return (
    <View>
      <TextInput
        value={form.values.email}
        onChangeText={val => form.handleChange('email', val)}
        onBlur={() => form.handleBlur('email')}
      />
      {form.touched.email && form.errors.email && (
        <Text>{form.errors.email}</Text>
      )}

      <TextInput
        value={form.values.password}
        onChangeText={val => form.handleChange('password', val)}
        onBlur={() => form.handleBlur('password')}
        secureTextEntry
      />
      {form.touched.password && form.errors.password && (
        <Text>{form.errors.password}</Text>
      )}

      <Button onPress={handleSubmit} title="Connexion" disabled={!form.isValid} />
    </View>
  );
};
```

### API

- `values: T` - Valeurs du formulaire
- `errors: Partial<Record<keyof T, string>>` - Erreurs de validation
- `touched: Partial<Record<keyof T, boolean>>` - Champs touchés
- `isValid: boolean` - Formulaire valide
- `isDirty: boolean` - Formulaire modifié
- `handleChange(field, value): void` - Changer une valeur
- `handleBlur(field): void` - Marquer un champ comme touché
- `handleSubmit(onSubmit): Promise<void>` - Soumettre le formulaire
- `reset(): void` - Réinitialiser le formulaire
- `setFieldValue(field, value): void` - Définir une valeur
- `setFieldError(field, error): void` - Définir une erreur
- `validateField(field): boolean` - Valider un champ
- `validateAll(): boolean` - Valider tout le formulaire

### Validators disponibles

- `validators.required(message?)` - Champ requis
- `validators.email(message?)` - Email valide
- `validators.minLength(min, message?)` - Longueur minimale
- `validators.maxLength(max, message?)` - Longueur maximale
- `validators.min(min, message?)` - Valeur minimale (nombre)
- `validators.max(max, message?)` - Valeur maximale (nombre)
- `validators.pattern(regex, message)` - Pattern regex

---

## useTimer

Hook pour gérer un timer.

```typescript
const {elapsedTime, isActive, toggle, reset} = useTimer();
```

---

## useWorkoutStats

Hook pour gérer les statistiques d'entraînement.

```typescript
const {pushUpCount, setPushUpCount, calculateCalories} = useWorkoutStats();
```

---

## useImagePicker

Hook pour sélectionner et uploader des images.

```typescript
const {pickAndUploadImage, isUploading} = useImagePicker();

const handlePick = async () => {
  const imageUrl = await pickAndUploadImage();
  console.log('Image uploaded:', imageUrl);
};
```

---

## 🎯 Bonnes pratiques

1. **Toujours utiliser les hooks au top level** - Ne jamais appeler un hook dans une condition ou une boucle
2. **Utiliser le destructuring** - `const {user, logout} = useAuth()` plutôt que `const auth = useAuth()`
3. **Gérer les erreurs** - Toujours wrapper les appels async dans des try/catch
4. **Cleanup** - Utiliser `useEffect` cleanup pour éviter les memory leaks
5. **Types** - Toujours typer les hooks avec TypeScript

## 📝 Créer un nouveau hook

Template de base :

```typescript
/**
 * useMy CustomHook
 *
 * Description du hook
 */

import {useState, useCallback} from 'react';

interface UseMyHookReturn {
  value: string;
  setValue: (newValue: string) => void;
}

export const useMyHook = (initialValue = ''): UseMyHookReturn => {
  const [value, setValue] = useState(initialValue);

  const updateValue = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  return {
    value,
    setValue: updateValue,
  };
};
```
