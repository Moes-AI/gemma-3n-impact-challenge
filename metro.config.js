// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add 'task' to the asset extensions so Metro bundles the model file
config.resolver.assetExts.push('task');

module.exports = config;
