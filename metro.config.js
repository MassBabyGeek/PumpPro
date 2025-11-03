const {getDefaultConfig} = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

// Extensions supplémentaires pour TypeScript et JSX
config.resolver.sourceExts.push('ts', 'tsx', 'jsx');

console.log('✅ Metro config loaded');

module.exports = config;
