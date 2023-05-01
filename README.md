# llm chat

## Setup

```
yarn run install
```

```
cp configs/dev.ts src/config/project.ts
cp src/utils/prompts.ts functions/src/utils/prompts.ts
cp src/utils/common.ts functions/src/utils/common.ts
```

```
yarn run serve
```

## config functions secret

```
firebase functions:secrets:set  GPT_API_KEY --project=default
```


## service

ja.imprompt.net 


## import data

From https://github.com/snakajima/SlashGPT.git repository, it take json prompt files and generate ts files.

```
npx ts-node scripts/convdata.ts
```

## deploy

for dev

```
./scripts/deploy-dev.sh
```

for prod

```
./scripts/deploy-prod.sh
```
