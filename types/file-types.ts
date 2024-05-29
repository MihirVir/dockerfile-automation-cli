type BuildJsonDockerFile = {
    PreInstalledCommands?: string[];
    InstallCommands?: string[];
    PostInstalledCommands?: string[]
};

type KubeResources = {
    Requests: {
        Memory: string;
        CPU: string;
    };
    Limits: {
        Memory: string;
        CPU: string;
    };
}

type KubeAnnotations = {
    author: string;
    description: string;
}

type KubeSecrets = {
    [secretName: string]: {
        [key: string]: string;
    };
};

export type BuildJson = {
    Dockerfile?: BuildJsonDockerFile;
    Port?: number;
    Version?: string;
    JarAddress?: string;
    StartCommand?: string[];
    Filename?: string;
    Language: string;
    Kube: boolean;
    KubeResources?: KubeResources;
    KubeAnnotations?: KubeAnnotations;
    TargetPort?: number;
    KubeSecrets?: KubeSecrets; 
    KubeServiceType?: string;
    Replicas?: number;
}
