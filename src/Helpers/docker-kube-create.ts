import { configure, render } from "nunjucks";
import prompts from "prompts"
import { BuildJson } from "../..//types/file-types";
import { execSync } from "child_process";
import chalk from "chalk";
import fs from "fs";
import path from "path";

async function createDockerKubeServices() {   
    let response; 

    const currentWorkingDir = process.cwd();
    const config = fs.readFileSync(path.join(currentWorkingDir, "build.json"), { encoding: "utf-8" });
    let configData = JSON.parse(config) as BuildJson;
    
    configData = { ...configData, ...(configData.KubeServiceType === "NodePort" ? { NodePort: 30002} : {}) }

    console.log(path.join(__dirname, "..", "..", "templates", configData.Language));
    configure(path.join(__dirname, "..", "..","templates", configData.Language), {autoescape: true});

    const dockerfile = render("Dockerfile", configData);

    const dockerfilePath = path.join(currentWorkingDir, "Dockerfile");

    fs.writeFileSync(dockerfilePath, dockerfile);

    if (!configData.Kube) {
        return;
    } 
    
    const infraDir = path.join(currentWorkingDir, "infra");
    const k8sDir = path.join(infraDir, "k8s");
    
    if (!fs.existsSync(infraDir)) {
        fs.mkdirSync(infraDir);
    }

    if (!fs.existsSync(k8sDir)) {
        fs.mkdirSync(k8sDir);
    }

    response = await prompts([
        {
            type: "text",
            name: "DockerImageName",
            message: "Docker Image Name: <your_docker_id>/<image_name>:latest"
        },
        {
            type: "text",
            name: "ServiceName",
            message: "Service Name [Eg: auth-service]:"
        }
    ]);

    const Depl = `${response.ServiceName}-depl`
    const Service = `${response.ServiceName}-srv`
    const data = { ...response, Depl, Service, ...configData };

    console.log(path.join(__dirname, "..", "..","templates", "Kubernetes"));

    configure(path.join(__dirname, "..", "..","templates", "Kubernetes"), {autoescape: true});
    const kubedeplfile = render(`depl.yml`, data);
    const kubesrvfile = render("srv.yml", data);

    const kube_depl_filePath = path.join(currentWorkingDir, "infra", "k8s", `${Depl}.yml`);
    const kube_srv_filepath =  path.join(currentWorkingDir, "infra", "k8s", `${Service}.yml`); 

    fs.writeFileSync(kube_depl_filePath, kubedeplfile);
    
    fs.writeFileSync(kube_srv_filepath, kubesrvfile);
    
    console.log();
    console.log(chalk.cyan("Successfully created Dockerfile and Kubernetes"));
    console.log(chalk.whiteBright(`DockerImage: ${response.DockerImageName}`));

    /** 
    try {
        console.log(chalk.greenBright("Building Docker image..."));
        execSync(`docker build -t ${response.DockerImageName} .`, { stdio: "inherit" });
        console.log(chalk.green("Docker image build completed successfully!"));
    } catch (err) {
        console.error(chalk.red("Error occurred while building Docker image:", err));
    }
    */
}
export default createDockerKubeServices;