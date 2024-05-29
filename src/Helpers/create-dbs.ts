import prompts from "prompts";
import path from "path";
import fs from "fs";

async function generateDB() {
    const response = await prompts(
        {
            name: "Database",
            type: "select",
            message: "pick your database",
            choices: [
                {title: 'MongoDB', value: 'Mongo'},
                {title: 'MySQL', value: 'MySQL'},
                {title: 'Postgres', value: 'Postgres'},
                {title: 'Redis', value: 'Redis'}
            ]
        }
    );

    let database_conf_path = path.join(__dirname, "..", "..", "templates", "Databases");
    let cwd = process.cwd();

    const infraDir = path.join(cwd, "infra");
    const k8sDir = path.join(infraDir, "k8s");
    
    if (!fs.existsSync(infraDir)) {
        fs.mkdirSync(infraDir);
    }

    if (!fs.existsSync(k8sDir)) {
        fs.mkdirSync(k8sDir);
    }

    switch(response.Database) {
        case "Mongo": 
            database_conf_path = path.join(database_conf_path, "mongo.yml");
            const mongo_content = fs.readFileSync(database_conf_path);
            const storage = path.join(k8sDir, "mongo.yml");
            fs.writeFileSync(storage, mongo_content);
            break;
        case "MySQL": 
            database_conf_path = path.join(database_conf_path, "mysql.yml");
            const mysql = fs.readFileSync(database_conf_path);
            const mysql_storage = path.join(k8sDir, "mysql.yml");
            fs.writeFileSync(mysql_storage, mysql);
            break;
        case "Postgres": 
            database_conf_path = path.join(database_conf_path, "postgres.yml");
            const postgres = fs.readFileSync(database_conf_path);
            const postgres_storage = path.join(k8sDir, "postgres.yml");
            fs.writeFileSync(postgres_storage, postgres);
            break;
        case "Redis": 
            database_conf_path = path.join(database_conf_path, "redis.yml");
            const redis = fs.readFileSync(database_conf_path);
            const redis_storage = path.join(k8sDir, "redis.yml");
            fs.writeFileSync(redis_storage, redis);
            break;
        default:
            console.log('something went wrong');
    }

    console.log(`successfully created the file please look at infra/k8s if you need to do any changes`);
}

export default generateDB;