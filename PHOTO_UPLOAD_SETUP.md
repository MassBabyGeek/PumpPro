# 📸 Configuration Upload Photo de Profil

## ✅ Ce qui a été fait

1. **Hook `useImagePicker`** créé dans [src/hooks/useImagePicker.ts](src/hooks/useImagePicker.ts)
   - Sélection d'image depuis la galerie
   - Upload automatique avec loader
   - Gestion des erreurs

2. **Service API Mock** dans [src/services/api.service.ts](src/services/api.service.ts)
   - `uploadProfileImage()` : Simule l'upload (2s de délai)
   - `updateUserProfile()` : Simule la mise à jour du profil
   - `deleteUserAccount()` : Simule la suppression
   - `logout()` : Simule la déconnexion
   - Console logs pour debug

3. **ProfileScreen mis à jour**
   - Bouton caméra sur l'avatar fonctionnel
   - Loader pendant l'upload
   - Avatar s'affiche après upload

## 🔧 Configuration requise

### iOS (obligatoire)

1. **Ouvrir `ios/pompeurpro/Info.plist`** et ajouter :

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>PompeurPro a besoin d'accéder à vos photos pour changer votre photo de profil</string>
<key>NSCameraUsageDescription</key>
<string>PompeurPro a besoin d'accéder à votre caméra pour prendre une photo de profil</string>
```

2. **Dans Xcode** :
   - Clean Build Folder (Cmd+Shift+K)
   - Rebuild l'app

### Android (obligatoire)

1. **Ouvrir `android/app/src/main/AndroidManifest.xml`** et ajouter (avant `<application>`) :

```xml
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.CAMERA" />
```

2. **Rebuild** :
```bash
npm run android
```

## 🧪 Fonctionnement du bouchon

### Upload simulé
```typescript
// Dans api.service.ts
uploadProfileImage(imageUri: string)
  - Délai: 2 secondes
  - Succès: 90% des cas
  - Échec: 10% des cas (erreur réseau simulée)
  - Retourne: l'URI locale (en prod ce serait une URL backend)
```

### Logs de debug
Quand tu cliques sur le bouton caméra, tu verras dans la console :
```
📷 Image sélectionnée: file:///path/to/image.jpg
📤 [API MOCK] Upload de l'image: file:///path/to/image.jpg
✅ [API MOCK] Upload réussi
```

## 🔄 Pour connecter au vrai backend plus tard

1. **Remplacer dans `api.service.ts`** :

```typescript
// Remplacer
const API_DELAY = 1500;
const simulateDelay = ...

// Par
const API_BASE_URL = 'https://api.pompeurpro.com';

export const uploadProfileImage = async (imageUri: string) => {
  const formData = new FormData();
  formData.append('avatar', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'avatar.jpg',
  });

  const response = await fetch(`${API_BASE_URL}/users/avatar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
};
```

2. **Ajouter le token d'authentification** (via Context ou AsyncStorage)

## 📝 Notes

- L'image est stockée localement (pas encore uploadée à un serveur)
- Le bouchon simule un délai réseau réaliste
- Les logs `[API MOCK]` permettent de suivre les appels
- Prêt pour l'intégration backend sans changer le code du ProfileScreen

## 🐛 Troubleshooting

**Erreur: "Permission denied"**
→ Vérifier que les permissions sont bien dans Info.plist (iOS) ou AndroidManifest.xml (Android)

**Erreur: "unimplemented component"**
→ Rebuild l'app après avoir installé react-native-image-picker

**L'image ne s'affiche pas**
→ Vérifier les logs console pour voir l'URI retournée
