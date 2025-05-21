#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Permet de localiser le chemin du fichier courant même en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lance le serveur
import(path.resolve(__dirname, '../server/index.js'));