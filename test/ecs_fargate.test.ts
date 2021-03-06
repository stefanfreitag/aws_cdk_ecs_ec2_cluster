import {
  expect as expectCDK,
  haveResource,
  haveResourceLike,
} from "@aws-cdk/assert";
import { App } from "@aws-cdk/core";
import { FargateDemo } from "../lib/ecs_fargate";

test("Stack contains a VPC ", () => {
  const app = new App();
  const stack = new FargateDemo(app, "id", {
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

  const stack = new FargateDemo(app, "id", {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  });

  expectCDK(stack).to(haveResourceLike("AWS::ECS::Cluster", {
    ClusterName: "DemoEcsCluster"
  }));
});

test("Stack contains Task Definition ", () => {
  const app = new App();

  const stack = new FargateDemo(app, "id", {
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
          Image: "stefanfreitag/flask-hello-world:0.0.2",
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
