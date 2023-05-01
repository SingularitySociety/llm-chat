#/bin/sh

cp configs/dev.ts src/config/project.ts
yarn run build
firebase deploy



