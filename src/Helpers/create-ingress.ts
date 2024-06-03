import prompts from "prompts";
import path from "path";
import fs from "fs";
import yaml from "yaml";
import { configure, render } from "nunjucks";
import chalk from "chalk";
type Patterns = {
  srv: string;
};

type ServiceInfo = {
  name: string;
  service_name: string;
  port: number;
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

  const serviceInfo: ServiceInfo[] = srvFiles
    .map(extractContent)
    .filter((info) => info !== null) as ServiceInfo[];

  console.log(serviceInfo);
  const template = path.join(
    __dirname,
    "..",
    "..",
    "templates",
    "Ingress",
    "ingress.yml"
  );

  configure(path.join(__dirname, "..", "..", "templates", "Ingress"), {
    autoescape: true,
  });

  const data = render("ingress.yml", { SrvPath: serviceInfo });

  const ingress = path.join(infraDir, "ingress.yml");

  fs.writeFileSync(ingress, data);

  console.log(
    chalk.cyan("Successfully ingress.yml file please change path on it")
  );
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

function extractContent(file: string): ServiceInfo | null {
  let content = fs.readFileSync(file, "utf-8");
  const parsed = yaml.parse(content);

  if (
    parsed.kind === "Service" &&
    parsed.metadata?.name &&
    parsed.spec?.ports.length
  ) {
    const service_name = parsed.metadata.name;
    const port = parsed.spec.ports[0].port;
    const name = service_name.split("-")[0];
    return { name, service_name, port };
  }

  return null;
}

export default handleIngressCreate;
