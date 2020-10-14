import { Cluster, Ec2Service, Ec2TaskDefinition, EcsOptimizedImage, NetworkMode } from "@aws-cdk/aws-ecs";
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  Vpc,
} from "@aws-cdk/aws-ec2";
import { CfnOutput, Construct, StackProps } from "@aws-cdk/core";
import { ApplicationLoadBalancer } from "@aws-cdk/aws-elasticloadbalancingv2";
import { AutoScalingGroup } from "@aws-cdk/aws-autoscaling";
import { Demo } from "./demo";

export class Ec2Demo extends Demo {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //Create cluster in the VPC
    const cluster = new Cluster(this, "EcsCluster", {
      vpc: this.vpc,
      clusterName: "DemoEc2Cluster",
    });

    //Define autoscaling group for ECS instances
    const autoScalingGroup = new AutoScalingGroup(this, "autoscalingGroup", {
      vpc: this.vpc,
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.SMALL),
      machineImage: EcsOptimizedImage.amazonLinux2(),      
      minCapacity: 1,
      maxCapacity: 3,
    });

    cluster.addAutoScalingGroup(autoScalingGroup);

    //Create Task Definition
    const taskDefinition = new Ec2TaskDefinition(this, "td-flask-hello-word ", {
      networkMode: NetworkMode.BRIDGE,      
    });
    this.addWebContainer(taskDefinition);

    //Create a service responsible for running the task definition on the cluster
    const svc = new Ec2Service(this, "svc-flask-hello-world", {
      cluster,
      taskDefinition,
      desiredCount: 1,
    });

    const lb = new ApplicationLoadBalancer(this, "ecs-alb", {
      internetFacing: true,
      vpc: this.vpc,
      loadBalancerName: "lb-svc-flask-hello-world",
    });

    const listener = lb.addListener("Public Listener", {
      port: 80,
      open: true,
    });

    listener.addTargets("ECS1", {
      port: 80,
      targets: [svc],
    });

    new CfnOutput(this, "LoadbalancerDnsName", {
      description: "Load Balancer DNS name",
      value: lb.loadBalancerDnsName,
    });
  }
}
