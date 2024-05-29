import prompts from "prompts";
import { BuildJson } from "../../types/file-types";
import path from "path";
import fs from "fs";
import chalk from "chalk";

async function generateBuildFile() {
    const response = await prompts({
        type: 'select',
        name: 'language',
        message: 'Which programming language are you using',
        choices: [
            {title: 'JavaScript', value: 'JavaScript'},
            {title: 'Java', value: 'Java'},
            {title: 'Python', value: 'Python'}
        ],
        initial: 0
    }); 

    const kube_response = await prompts({
        type: 'select',
        name: 'isKubernetes',
        message: 'Do you want kubernetes deployment and service files?',
        choices: [
            { title: "Yes", value: true },
            { title: "No", value: false }
        ],
        initial: 0
    });

    const currentWorkingDir = process.cwd();

    let bodyJson: BuildJson;

    if (response.language === "Java") {
        bodyJson = {
            Dockerfile: {
                PreInstalledCommands: [],
                InstallCommands: [],
                PostInstalledCommands: []
            },
            JavaVersion: "21",
            JarAddress: "/main",
            Port: 8080,
            Kube: kube_response.isKubernetes,
            Language: response.language
        } as BuildJson;
    } else if (response.language === "JavaScript") {
        bodyJson = {
            Dockerfile: {
                PreInstalledCommands: [],
                InstallCommands: [],
                PostInstalledCommands: []
            },
            Port: 8081,
            StartCommand: ["start"],
            Kube: kube_response.isKubernetes,
            Language: response.language
        };
    } else {
        bodyJson = {
            Dockerfile: {
                PreInstalledCommands: [],
                InstallCommands: ["--no-cache-dir Flask"],
                PostInstalledCommands: []
            },
            Port: 8090,
            Filename: "app.py",
            Kube: kube_response.isKubernetes,
            Language: response.language
        };
    }
    
    if (kube_response.isKubernetes) {
        const boilerResponse = await prompts({
            name: "BoilerPlate",
            type: "select",
            message: 'Do you want to add boilerplate?',
            choices: [
                { title: "Yes", value: true },
                { title: "No", value: false }
            ]
        })

        bodyJson = {
            ...bodyJson,
            KubeServiceType: "ClusterIP",
            Replicas: 1
        }

        if (boilerResponse.BoilerPlate) {
            bodyJson = {
                ...bodyJson,
                KubeResources: {
                    Requests: {
                        Memory: "512Mi",
                        CPU: "500m"
                    },
                    Limits: {
                        Memory: "1Gi",
                        CPU: "1"
                    }
                },
                TargetPort: 9000,
            }
        }
    }
    
    const buildJsonPath = path.join(currentWorkingDir, "build.json");

    fs.writeFileSync(buildJsonPath, JSON.stringify(bodyJson, null, 2));

    console.log();
    console.log(chalk.greenBright("Successfully created the build.json file"));
    console.log(chalk.cyanBright("Now you can use docker-automation gen build.json to create dockerfile")); 
    console.log(chalk.cyanBright("Please check build.json file and change port numbers accordingly or add preinstall or post install commands")); 
}


export default generateBuildFile;