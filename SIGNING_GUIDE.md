# 🔐 Guide de Signature de l'APK Android

## 📋 Prérequis

- Java JDK installé (vérifier avec `java -version`)
- Android Studio ou Android SDK configuré

---

## 🚀 Option 1 : Script Automatique (Recommandé)

Exécutez le script de configuration :

```bash
cd android
./setup-signing.sh
```

Le script va :
1. ✅ Créer le keystore `app/pompeurpro-release-key.keystore`
2. ✅ Créer le fichier de configuration `keystore.properties`
3. ✅ Vous guider à travers le processus

**⚠️ IMPORTANT** : Notez précieusement le mot de passe que vous créez !

---

## 🛠️ Option 2 : Configuration Manuelle

### Étape 1 : Créer le keystore

```bash
cd android

keytool -genkeypair -v -storetype PKCS12 \
  -keystore app/pompeurpro-release-key.keystore \
  -alias pompeurpro-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

**Informations demandées** :
- Mot de passe du keystore (min 6 caractères) - **À NOTER !**
- Nom et prénom
- Nom de l'organisation (ex: "PompeurPro")
- Nom de l'unité organisationnelle (ex: "Development")
- Ville, État, Code pays

### Étape 2 : Créer le fichier de configuration

Créez le fichier `android/keystore.properties` :

```properties
storePassword=VOTRE_MOT_DE_PASSE
keyPassword=VOTRE_MOT_DE_PASSE
keyAlias=pompeurpro-key-alias
storeFile=pompeurpro-release-key.keystore
```

**⚠️ Remplacez `VOTRE_MOT_DE_PASSE` par le mot de passe que vous avez créé !**

---

## 📦 Compiler l'APK de Release

Une fois la configuration terminée :

```bash
cd android
./gradlew assembleRelease
```

L'APK signé sera dans :
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 🔍 Vérifier la Signature

Pour vérifier que l'APK est bien signé :

```bash
jarsigner -verify -verbose -certs android/app/build/outputs/apk/release/app-release.apk
```

Vous devriez voir : `jar verified.`

---

## 📱 Installer l'APK

### Sur un appareil connecté via USB :

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Via partage de fichier :

1. Copiez l'APK sur votre téléphone
2. Activez "Sources inconnues" dans les paramètres Android
3. Ouvrez le fichier APK et installez

---

## ⚠️ SÉCURITÉ - À NE JAMAIS FAIRE

- ❌ Ne commitez JAMAIS `keystore.properties` dans Git
- ❌ Ne commitez JAMAIS `*.keystore` ou `*.jks` dans Git
- ❌ Ne partagez JAMAIS votre keystore ou mot de passe publiquement

Ces fichiers sont déjà dans `.gitignore` pour votre sécurité.

---

## 💾 Sauvegarde

**IMPORTANT** : Sauvegardez ces fichiers dans un endroit sûr :

1. `android/app/pompeurpro-release-key.keystore`
2. `android/keystore.properties`
3. Le mot de passe (dans un gestionnaire de mots de passe)

**Si vous perdez ces fichiers, vous ne pourrez PLUS mettre à jour votre app sur le Play Store !**

Suggestions de sauvegarde :
- Gestionnaire de mots de passe (1Password, LastPass, Bitwarden)
- Coffre-fort cloud chiffré
- Disque dur externe sécurisé
- NAS personnel

---

## 🔄 Générer un APK de Debug (pour tester)

Pour tester rapidement sans configuration de signing :

```bash
cd android
./gradlew assembleDebug
```

L'APK de debug sera dans :
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📝 Notes

- **Version actuelle** : Consultez `android/app/build.gradle` pour `versionCode` et `versionName`
- **Taille de l'APK** : ~108 MB (avec toutes les architectures)
- **Architectures supportées** : armeabi-v7a, arm64-v8a, x86, x86_64

---

## 🐛 Dépannage

### Erreur "keystore password was incorrect"

- Vérifiez que le mot de passe dans `keystore.properties` est correct
- Le mot de passe doit être identique pour `storePassword` et `keyPassword`

### Erreur "Keystore file does not exist"

- Vérifiez que le fichier `app/pompeurpro-release-key.keystore` existe
- Vérifiez que `storeFile` dans `keystore.properties` pointe vers le bon fichier

### L'APK ne s'installe pas

- Vérifiez que l'APK est bien signé avec `jarsigner -verify`
- Essayez d'abord l'APK de debug pour tester

---

## 📞 Support

Pour plus d'informations sur la signature Android :
- [Documentation officielle Android](https://developer.android.com/studio/publish/app-signing)
- [Guide React Native](https://reactnative.dev/docs/signed-apk-android)
