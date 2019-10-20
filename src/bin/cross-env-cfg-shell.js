#!/usr/bin/env node

const configEnv = require('..');

configEnv(process.argv.slice(2), {shell: true});