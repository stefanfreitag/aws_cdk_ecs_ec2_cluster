# Simple ECS Demo Application

## Application

The application consists of a Python web server rendering basic information and offering this
at the root path of the server.

The container image used is available at [Docker Hub](https://hub.docker.com/).

## ECS setup using Cloud Development Kit (CDK)

The ECS cluster will run in the default [VPC](https://aws.amazon.com/vpc/) of the region. 

## Troubleshooting

- [Can not pull image](https://aws.amazon.com/de/premiumsupport/knowledge-center/ecs-pull-container-error/)<brS>
  I stumbled upon this during tests with Fargate and EC2 based Elastic Container service. For Fargate I updated the
  task definition by setting `assignPublicIp` to `true`.

## Links

- [Flask Hello World](https://hub.docker.com/r/stefanfreitag/flask-hello-world)
- [AWS Cloud Development Kit](https://github.com/aws/aws-cdk)
