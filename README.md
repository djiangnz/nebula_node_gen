```shell
tree -a -L 1
.
├── .env # LIGHTHOUST_IP=100.100.100.100
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
1. `touch .env`, edit LIGHTHOUST_IP
1. `node index.js`
