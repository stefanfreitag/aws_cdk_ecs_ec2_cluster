import cdk = require("@aws-cdk/cdk");

import { Cluster, EcsOptimizedAmi } from "@aws-cdk/aws-ecs";
import { InstanceType, Vpc } from "@aws-cdk/aws-ec2";
import { AutoScalingGroup, UpdateType } from "@aws-cdk/aws-autoscaling";

export class EcsEc2Cluster2Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, "MyDemoVpc", { maxAZs: 2 });

    const asg = new AutoScalingGroup(this, "MyFleet", {
      instanceType: new InstanceType("t2.xlarge"),
      machineImage: new EcsOptimizedAmi(),
      updateType: UpdateType.ReplacingUpdate,
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
