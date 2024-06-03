import prompts from "prompts";
import path from "path";
import fs from "fs";

type Patterns = {
  srv: string;
};

async function handleIngressCreate() {
  const response = await prompts({
    name: "isParent",
    message: "Is infra directory in the parent folder?",
    type: "select",
    choices: [
      { title: "Parent", value: true },
      { title: "Current", value: false },
    ],
  });

  let cwd = process.cwd();
  let infraDir: string;

  if (!response.isParent) {
    infraDir = path.join(cwd, "infra", "k8s");
  } else {
    infraDir = path.join(cwd, "..", "infra", "k8s");
  }

  const patterns: Patterns = {
    srv: "-srv.yml",
  };

  const srvFiles = searchFiles(infraDir, patterns);
}

// searching the entire directory for and -srv files and returning them
function searchFiles(dirpath: string, patterns: Patterns): string[] {
  let matchedSrvFiles: string[] = [];

  const files = fs.readdirSync(dirpath);

  files.forEach((file) => {
    if (file.endsWith(patterns.srv)) {
      matchedSrvFiles.push(path.join(dirpath, file));
    }
  });

  return matchedSrvFiles;
}
