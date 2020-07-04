//
// File: index.js
// Generate Nebula Node Files
//

// https://github.com/slackhq/nebula/releases

require("dotenv").config();
const fs = require("fs");
const shell = require("shelljs");

if (!fs.existsSync("nebula-cert")) {
  console.log("nebulas-cert not exists");
  shell.exit(1);
}

const PREFIX = process.env.PREFIX;
const BATCH_SIZE = process.env.BATCH_SIZE;
const NEBULA_IP = process.env.NEBULA_IP;
const PUBLIC_IP = process.env.PUBLIC_IP;
const START_IP = Math.min(Math.max(process.env.START_IP || 2, 2), 254);
const END_IP = Math.min(process.env.END_IP || 255, 255);
const CONTAINS_EXEC_FILES = process.env.CONTAINS_EXEC_FILES == 0 ? false : true;

console.log({ PREFIX, BATCH_SIZE, NEBULA_IP, PUBLIC_IP, START_IP, END_IP, CONTAINS_EXEC_FILES });

const configPath = "config.yaml";

const nebula_files = () => {
  const nebulas = ["ca.crt"];
  if (CONTAINS_EXEC_FILES) {
    const nebula_nix = "nebula";
    const nebula_win = "nebula.exe";
    if (fs.existsSync(nebula_nix)) nebulas.push(nebula_nix);
    if (fs.existsSync(nebula_win)) nebulas.push(nebula_win);
  }
  return nebulas;
};

for (let i = START_IP, j = 0; i < END_IP; i++) {
  const currentPath = `${PREFIX}_${i}`;
  const pathExists = fs.existsSync(currentPath);
  const zipExists = fs.existsSync(currentPath + ".zip");

  if (pathExists || zipExists) continue;

  // crt and key
  const ip = `${NEBULA_IP.split(".").slice(0, -1).join(".")}.${i}/24`;
  const sign_new = `./nebula-cert sign -name "${currentPath}" -ip "${ip}"`;
  if (shell.exec(sign_new).code !== 0) {
    shell.echo("ERROR: " + sign_new);
    shell.exit(1);
  }

  // move the reletive files into folder
  shell.mkdir(currentPath);

  shell.mv(`${currentPath}.*`, currentPath);
  shell.cp(nebula_files(), currentPath);

  // config file
  shell.cd(currentPath);
  shell.cp(`../.example.yaml`, configPath);

  // bat for windows
  const nebulaBat = "nebula.bat";
  const batString = `%~dp0/nebula.exe --config ${configPath}\npause`;
  fs.writeFileSync(nebulaBat, batString);
  shell.sed("-i", "__PH", currentPath, configPath);
  shell.sed("-i", "__NEBULA_IP", NEBULA_IP, configPath);
  shell.sed("-i", "__PUBLIC_IP", PUBLIC_IP, configPath);

  // zip folder and remove
  shell.cd("..");
  shell.exec(`zip -vr ${currentPath}.zip ${currentPath}/ -x "*.DS_Store"`);
  shell.rm("-rf", currentPath);
  console.log(ip);

  if (++j >= BATCH_SIZE) return;
}
