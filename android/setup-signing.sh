#!/bin/bash

echo "========================================"
echo "Configuration de la signature Android"
echo "========================================"
echo ""
echo "Ce script va créer:"
echo "1. Un keystore pour signer votre APK"
echo "2. Un fichier de configuration keystore.properties"
echo ""

# Créer le répertoire app s'il n'existe pas
mkdir -p app

# Vérifier si le keystore existe déjà
if [ -f "app/pompeurpro-release-key.keystore" ]; then
    echo "⚠️  Un keystore existe déjà dans app/pompeurpro-release-key.keystore"
    read -p "Voulez-vous le remplacer? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Annulé."
        exit 1
    fi
    rm app/pompeurpro-release-key.keystore
fi

echo ""
echo "📝 Création du keystore..."
echo ""
echo "⚠️  IMPORTANT: Notez précieusement ces informations!"
echo "   Si vous perdez ce mot de passe, vous ne pourrez plus"
echo "   mettre à jour votre app sur le Play Store!"
echo ""

# Créer le keystore
keytool -genkeypair -v -storetype PKCS12 \
    -keystore app/pompeurpro-release-key.keystore \
    -alias pompeurpro-key-alias \
    -keyalg RSA -keysize 2048 -validity 10000

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Erreur lors de la création du keystore"
    exit 1
fi

echo ""
echo "✅ Keystore créé avec succès!"
echo ""

# Demander le mot de passe pour le fichier de config
echo "📝 Création du fichier keystore.properties..."
echo ""
read -sp "Entrez le mot de passe du keystore (celui que vous venez de créer): " STORE_PASSWORD
echo ""
read -sp "Confirmez le mot de passe: " STORE_PASSWORD_CONFIRM
echo ""

if [ "$STORE_PASSWORD" != "$STORE_PASSWORD_CONFIRM" ]; then
    echo "❌ Les mots de passe ne correspondent pas"
    exit 1
fi

# Créer le fichier keystore.properties
cat > keystore.properties << EOF
storePassword=$STORE_PASSWORD
keyPassword=$STORE_PASSWORD
keyAlias=pompeurpro-key-alias
storeFile=pompeurpro-release-key.keystore
EOF

echo ""
echo "✅ Fichier keystore.properties créé!"
echo ""
echo "========================================"
echo "✅ Configuration terminée avec succès!"
echo "========================================"
echo ""
echo "📦 Vous pouvez maintenant compiler votre APK de release:"
echo ""
echo "   cd android && ./gradlew assembleRelease"
echo ""
echo "⚠️  IMPORTANT: Sauvegardez ces fichiers dans un endroit sûr:"
echo "   - android/app/pompeurpro-release-key.keystore"
echo "   - android/keystore.properties"
echo ""
echo "⚠️  Ne commitez JAMAIS ces fichiers dans Git!"
echo "   (Ils sont déjà dans .gitignore)"
echo ""
