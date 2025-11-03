const fs = require('fs');
const path = require('path');

// Liste des modules DEPRECATED que Metro cherche
const deprecatedModules = [
  'NativeDevMenu',
  'NativeDialogManagerAndroid',
  // ajoute d'autres si besoin
];

// Chemin racine vers react-native
const rnRoot = path.join(
  __dirname,
  'node_modules',
  'react-native',
  'src',
  'private',
  'specs_DEPRECATED',
  'modules',
);

// Crée le dossier si nécessaire
if (!fs.existsSync(rnRoot)) {
  fs.mkdirSync(rnRoot, {recursive: true});
  console.log(`Créé le dossier : ${rnRoot}`);
}

// Crée des fichiers JS vides pour chaque module DEPRECATED
deprecatedModules.forEach(moduleName => {
  const modulePath = path.join(rnRoot, `${moduleName}.js`);
  if (!fs.existsSync(modulePath)) {
    fs.writeFileSync(modulePath, 'export default {};');
    console.log(`Créé shim vide pour : ${moduleName}`);
  } else {
    console.log(`Shim déjà existant pour : ${moduleName}`);
  }
});

console.log('✅ Tous les modules DEPRECATED sont patchés !');
