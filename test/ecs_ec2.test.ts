import {
  expect as expectCDK,
  haveResource,
  haveResourceLike,
} from "@aws-cdk/assert";
import { App } from "@aws-cdk/core";
import { Ec2Demo } from "../lib/ecs_ec2";

test("Stack contains a VPC ", () => {
  const app = new App();
  const stack = new Ec2Demo(app, "id", {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  });

  expectCDK(stack).to(
    haveResource("AWS::EC2::VPC", {
      CidrBlock: "10.1.0.0/16",
    })
  );
});

test("Stack contains ECS cluster ", () => {
  const app = new App();

  const stack = new Ec2Demo(app, "id", {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  });

  expectCDK(stack).to(haveResource("AWS::ECS::Cluster", {}));
});

test("Stack contains Task Definition ", () => {
  const app = new App();

  const stack = new Ec2Demo(app, "id", {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  });

  expectCDK(stack).to(
    haveResourceLike("AWS::ECS::TaskDefinition", {
      ContainerDefinitions: [
        {
          Essential: true,
          LogConfiguration: {
            LogDriver: "awslogs",
            Options: {
              "awslogs-stream-prefix": "flask-hello-world",
            },
          },
        },
      ],
    })
  );
});
