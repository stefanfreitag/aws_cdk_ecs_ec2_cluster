#!/usr/bin/env node
import "source-map-support/register";
import { App } from "@aws-cdk/core";
//import { FargateDemo } from "../lib/ecs_fargate";
import { Ec2Demo } from "../lib/ecs_ec2";
const app = new App();

/**
  new FargateDemo(app, "FargateClusterStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
*/
new Ec2Demo(app, "EC2ClusterStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
