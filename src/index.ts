import { program } from "commander";
import createDockerKubeServices from "./Helpers/docker-kube-create";
import generateBuildFile from "./Helpers/generate-build";
import generateDB from "./Helpers/create-dbs";
import createGithubActions from "./Helpers/create-actions";
import handleIngressCreate from "./Helpers/create-ingress";

export function main() {
  program
    .name("dockerfile automation")
    .description("CLI to automate creation of Dockerfile");

  program
    .command("gen")
    .description("generates a Dockerfile")
    .action(() => createDockerKubeServices());

  program
    .command("gen-build-file")
    .description(
      "generates a Build.json file for (java, javascript, python) to build a Docker"
    )
    .action(() => generateBuildFile());

  program
    .command("gen-db")
    .description(
      "generates database.yml file (mongodb, redis, mysql, postgres)"
    )
    .action(() => generateDB());

  program
    .command("gen-actions")
    .description("generates github actions workflow files for nodejs")
    .action(() => createGithubActions());

  program
    .command("gen-ingress")
    .description("scans through your /infra/k8s/* to generate ingress.yml file")
    .action(() => handleIngressCreate());

  program.parse(process.argv);
}
