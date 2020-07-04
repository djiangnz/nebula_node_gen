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

const prefix = "NZ";
const startIP = 100;
const endIP = 255;
const NEBULA_IP = process.env.NEBULA_IP;
const PUBLIC_IP = process.env.PUBLIC_IP;
const configPath = "config.yaml";

const nebula_files = () => {
  const nebulas = ["nebula", "ca.crt"];
  const nebula_exe = "nebula.exe";
  if (fs.existsSync(nebula_exe)) nebulas.push(nebula_exe);
  return nebulas;
};

for (let i = startIP; i < endIP; i++) {
  const currentPath = `${prefix}_${i}`;
  const pathExists = fs.existsSync(currentPath);
  const zipExists = fs.existsSync(currentPath + ".zip");

  if (pathExists || zipExists) continue;

  // crt and key
  const ip = `${NEBULA_IP.split(".").slice(0, -1).join(".")}.${i}/24`;
  console.log(ip);
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
  // shell.rm("-rf", currentPath);

  return;
}
