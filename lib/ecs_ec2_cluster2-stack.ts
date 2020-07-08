import {
  Cluster,
  EcsOptimizedAmi,
  Ec2TaskDefinition,
  ContainerImage,
  Protocol,
  Ec2Service,
  AmiHardwareType,
} from "@aws-cdk/aws-ecs";
import {
  InstanceType,
  Vpc,
  InstanceSize,
  InstanceClass,
  Port,
  Peer,
  AmazonLinuxGeneration,
} from "@aws-cdk/aws-ec2";
import { AutoScalingGroup, UpdateType } from "@aws-cdk/aws-autoscaling";
import { Construct, Stack, StackProps, CfnOutput } from "@aws-cdk/core";
import { ApplicationLoadBalancer } from "@aws-cdk/aws-elasticloadbalancingv2";

export class EcsEc2Cluster2Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, "MyDemoVpc", { maxAzs: 2 });

    const asg = new AutoScalingGroup(this, "ECS_EC2_ASG", {
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MEDIUM),
      machineImage: new EcsOptimizedAmi({
        generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
        hardwareType: AmiHardwareType.STANDARD,
      }),
      updateType: UpdateType.ROLLING_UPDATE,
      desiredCapacity: 1,
      vpc,
    });

    const taskDefinition = new Ec2TaskDefinition(this, "td-nginx ", {});

    const webContainer = taskDefinition.addContainer("container-nginx", {
      image: ContainerImage.fromRegistry("nginx:latest"),
      cpu: 100,
      memoryLimitMiB: 256,
      essential: true,
    });

    webContainer.addPortMappings({
      containerPort: 80,
      protocol: Protocol.TCP,
      hostPort: 8080,
    });

    const cluster = new Cluster(this, "EcsCluster", { vpc });
    cluster.addAutoScalingGroup(asg);

    const loadbalancer = new ApplicationLoadBalancer(this, "ecs-alb", {
      internetFacing: true,
      vpc: vpc,
    });

    const service = new Ec2Service(this, "awsvpc-ecs-demo-service", {
      cluster,
      taskDefinition,
    });

    const listener = loadbalancer.addListener("Public Listener", {
      port: 80,
      open: true,
    });

    listener.addTargets("listener-ecs.target", {
      port: 80,
      targets: [service],
    });

  }
}
