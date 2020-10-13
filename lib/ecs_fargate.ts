import {
  Cluster,
  ContainerImage,
  Protocol,
  LogDrivers,
  FargateService,
  FargateTaskDefinition,
} from "@aws-cdk/aws-ecs";
import { Vpc } from "@aws-cdk/aws-ec2";
import { CfnOutput, Construct, Stack, StackProps } from "@aws-cdk/core";
import { ApplicationLoadBalancer } from "@aws-cdk/aws-elasticloadbalancingv2";

export class FargateDemo extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //Create a dedicated VPC for the cluster
    const vpc = new Vpc(this, "vpc",{
     cidr: '10.1.0.0/16',
     maxAzs: 3
   })

    //Create cluster in the VPC
    const cluster = new Cluster(this, "EcsCluster", {
      vpc,
      clusterName: "DemoEcsCluster",
    });

    //Create Task Definition
    const taskDefinition = this.createTaskDefinition();

    //Create a service responsible for running the task definition on the cluster
    const svc = new FargateService(this, "svc-flask-hello-world", {
      cluster,
      taskDefinition,
      desiredCount: 2,
      //TODO: Remove usage of public ip
      assignPublicIp: true,
    });

    const lb = new ApplicationLoadBalancer(this, "Loadbalancer", {
      internetFacing: true,
      vpc: vpc,
      loadBalancerName: "lb-svc-flask-hello-world",
    });

    const listener = lb.addListener("PublicListener", {
      port: 80,
      open: true,
    });

    listener.addTargets("tg-group-fargate", {
      port: 80,
      targets: [svc],
    });

    new CfnOutput(this, "LoadbalancerDnsName", {
      description: "Load Balancer DNS name",
      value: lb.loadBalancerDnsName,
    });
  }

  private createTaskDefinition() {
    const taskDefinition = new FargateTaskDefinition(
      this,
      "td-flask-hello-word",
      {
        memoryLimitMiB: 2048,
        cpu: 256,
      }
    );

    // Add container to task definition
    const webContainer = taskDefinition.addContainer(
      "container-flask-hello-world",
      {
        image: ContainerImage.fromRegistry(
          "stefanfreitag/flask-hello-world:0.0.2"
        ),
        essential: true,
        memoryLimitMiB: 1024,
        logging: LogDrivers.awsLogs({ streamPrefix: "flask-hello-world" }),
      }
    );

    webContainer.addPortMappings({
      containerPort: 5000,
      protocol: Protocol.TCP,
    });
    return taskDefinition;
  }
}
