import { expect as expectCDK, haveResource, haveResourceLike } from "@aws-cdk/assert";
import { Stack } from "@aws-cdk/core";
import { FargateDemo } from "../lib/ecs_fargate";

test("Stack contains ECS cluster ", () => {
  const stack = new Stack();

  const s =new FargateDemo(stack, "id", {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  });

  expectCDK(s).to(
    haveResource("AWS::ECS::Cluster", {
     
    })
  );
});

test("Stack contains Task Definition ", () => {
  const stack = new Stack();

  const s =new FargateDemo(stack, "id", {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  });

  expectCDK(s).to(
    haveResourceLike("AWS::ECS::TaskDefinition", {
      "ContainerDefinitions" : [
        {
          "Essential": true,
          "LogConfiguration": {
            "LogDriver": "awslogs",
            "Options": {
              "awslogs-stream-prefix": "flask-hello-world",
            }
          },
        }
      ]
    })
  );
});
