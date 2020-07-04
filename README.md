```shell
tree -a -L 1
.
├── .env
├── .example.yaml
├── .git
├── .gitignore
├── README.md
├── [ca.crt]
├── ca.key
├── config.yaml
├── index.js
├── nebula
├── nebula-cert
├── [nebula.exe]
├── package-lock.json
└── package.json
```

## Run

1. `npm i`
1. `touch .env` (see example below)
1. `node index.js`

```patch
# .env
+ NEBULA_IP=192.168.100.1
+ PUBLIC_IP=10.10.10.10
+ PREFIX=NZ
+ START_IP=100
+ END_IP=255
+ BATCH_SIZE=1
+ CONTAINS_EXEC_FILES=1
```
