# Dockerfile Automation

**dockerfile-automation** is a powerful CLI tool designed to streamline the creation of Dockerfiles, Kubernetes Services and Deployments, and Github Actions workflows, simplifying the containerization and deployment processes for Node.js, Python, and Java projects.

## Key Features

- **Effortless Setup**: Install with a single command via npm to start automating Dockerfile and Kubernetes manifest generation.
  
- **Versatile Support**: Supports Node.js, Python, and Java projects out of the box, with plans to expand support for additional languages in future updates.

- **Customization**: While the tool generates initial configurations, it emphasizes the importance of reviewing and adjusting generated Dockerfiles and Kubernetes files to suit specific project requirements.

## Installation Guide

To get started, simply install the tool globally using npm:

```sh
npm install -g dockerfile-automation
```

## Commands

build.json file is used to generate kubernetes and dockerfiles. To generate build.json file we need to use the following command

**gen-build-file**: It generates a build file. It's highly recommended to go through this file and modify it according to your needs.

```sh
dockerfile-automation gen-build-file
```

**gen**: It generates Dockerfile and Kubernetes Deployment and Service file. Please change the port number and type of service in your service and deployment files.

```sh
dockerfile-automation gen
```

**gen-db**: It generates db config yml file. We currently support mongo, mysql, redis and postgres

```sh
dockerfile-automation gen-db
```

**gen-actions**: It generates github actions file for Node.js project. Please run it on github root directory.

```sh
dockerfile-automation gen-actions
```
