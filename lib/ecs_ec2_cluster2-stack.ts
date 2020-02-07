import { Cluster, EcsOptimizedAmi } from "@aws-cdk/aws-ecs";
import { InstanceType, Vpc } from "@aws-cdk/aws-ec2";
import { AutoScalingGroup, UpdateType } from "@aws-cdk/aws-autoscaling";
import { Construct, Stack, StackProps } from '@aws-cdk/core';

export class EcsEc2Cluster2Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, "MyDemoVpc", { maxAzs: 2 });

    const asg = new AutoScalingGroup(this, "MyFleet", {
      instanceType: new InstanceType("t2.xlarge"),
      machineImage: new EcsOptimizedAmi(),
      updateType: UpdateType.REPLACING_UPDATE,
      desiredCapacity: 1,
      vpc
    });

    const cluster = new Cluster(this, "EcsCluster", { vpc });
    cluster.addAutoScalingGroup(asg);

    cluster.addCapacity("DefaultAutoScalingGroup", {
      instanceType: new InstanceType("t2.xlarge")
    });

    
  }
}
