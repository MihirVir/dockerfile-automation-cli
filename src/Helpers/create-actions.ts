import prompts from "prompts"
import path from "path"
import fs from "fs";
import { configure, render } from "nunjucks";
import chalk from "chalk"

async function createGithubActions ()  {
    const response = await prompts([
        {
            name: "isGithubActions",
            type: "select",
            message: "We only support nodejs for github actions right now if thats okay with you press yes to continue",
            choices: [
                { title: 'Yes', value: false },
                { title: 'No', value: true },
            ]
        },
    ]);


    
    // getting current working dir
    const cwd = process.cwd();
    
    // checking if the .github/workflows exist in users dir 
    const github = path.join(cwd, ".github");
    const workflows = path.join(github, "workflows");

    if (!fs.existsSync(github)) {
        fs.mkdirSync(github);
    }
    
    if (!fs.existsSync(workflows)) {
        fs.mkdirSync(workflows);
    }

    configure(path.join(__dirname, "..", "..","templates", "Actions"), {autoescape: true});

    
    const data = render('action.yml', response);

    const actions =  path.join(cwd, ".github", "workflows", `action.yml`); 

    console.log(actions);

    fs.writeFileSync(actions, data);

    console.log();
    console.log(chalk.cyan("Successfully created Dockerfile and Kubernetes"));
    console.log(chalk.red("Check .github/workflows/actions.yml file if any changes are required"))
}

export default createGithubActions;