import { Vpc } from "@aws-cdk/aws-ec2";
import {
  ContainerImage,
  Ec2TaskDefinition,
  LogDrivers,
  NetworkMode,
  Protocol,
  TaskDefinition,
} from "@aws-cdk/aws-ecs";
import { Construct, Stack, StackProps } from "@aws-cdk/core";

export abstract class Demo extends Stack {
  protected vpc: Vpc;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.vpc = this.createVpc();
  }

  private createVpc(): Vpc {
    return new Vpc(this, "vpc", {
      cidr: "10.1.0.0/16",
      maxAzs: 3,
    });
  }

  protected addWebContainer(td: TaskDefinition) {
    const webContainer = td.addContainer("container-flask-hello-world", {
      image: ContainerImage.fromRegistry(
        "stefanfreitag/flask-hello-world:0.0.2"
      ),
      essential: true,
      memoryLimitMiB: 512,
      logging: LogDrivers.awsLogs({ streamPrefix: "flask-hello-world" }),
    });

    webContainer.addPortMappings({
      containerPort: 5000,
      protocol: Protocol.TCP,
    });
  }
}
