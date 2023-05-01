# llm chat

## Setup

```
yarn run install
```

```
cp configs/dev.ts src/config/project.ts
```



```
yarn run serve
```

## config functions secret

```
firebase functions:secrets:set  GPT_API_KEY
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
