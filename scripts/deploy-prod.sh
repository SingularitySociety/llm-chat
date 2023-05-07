#/bin/sh

cp configs/prod.ts src/config/project.ts
yarn run build
firebase deploy --project=release

cp configs/dev.ts src/config/project.ts
cp configs/dev.ts functions/src/utils/project.ts



