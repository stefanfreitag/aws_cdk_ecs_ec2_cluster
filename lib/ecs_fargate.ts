import {
  Cluster,
  FargateService,
  FargateTaskDefinition,
} from "@aws-cdk/aws-ecs";
import { CfnOutput, Construct, StackProps } from "@aws-cdk/core";
import { ApplicationLoadBalancer } from "@aws-cdk/aws-elasticloadbalancingv2";
import { Demo } from "./demo";

export class FargateDemo extends Demo {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //Create cluster in the VPC
    const cluster = new Cluster(this, "EcsCluster", {
      vpc: this.vpc,
      clusterName: "DemoEcsCluster",
    });

    //Create Task Definition
    const taskDefinition = new FargateTaskDefinition(
      this,
      "td-flask-hello-word",
      {
        memoryLimitMiB: 2048,
        cpu: 256,
      }
    );
    this.addWebContainer(taskDefinition);

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
      vpc: this.vpc,
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

  

}
