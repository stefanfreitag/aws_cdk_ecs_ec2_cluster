# Simple ECS Demo Application

## Application

The application consists of a Python web server rendering basic information and offering this
at the root path of the server.

The container image used is available at [Docker Hub](https://hub.docker.com/).

## ECS setup using Cloud Development Kit (CDK)

The ECS cluster will run in a new [VPC](https://aws.amazon.com/vpc/) with CIDR 10.1.0.0/16. To keep the management overhead low it will be powered by Fargate.

A service and a task definition are created:

- The task definition contains the information about the container (e.g. port mappings)
- The service defines e.g. the desired count of running tasks.

After the cluster has been deployed via

```sh
cdk deploy
```

the DNS name of the load balancer is returned/ printed to the console.

## Troubleshooting

- [Can not pull image](https://aws.amazon.com/de/premiumsupport/knowledge-center/ecs-pull-container-error/)<brS>
  I stumbled upon this during tests with Fargate and EC2 based Elastic Container service. For Fargate I updated the
  task definition by setting `assignPublicIp` to `true`.

## Links

- [Flask Hello World](https://hub.docker.com/r/stefanfreitag/flask-hello-world)
- [AWS Cloud Development Kit](https://github.com/aws/aws-cdk)
- [AWS Fargate](https://aws.amazon.com/fargate/)
- [Task cannot pull image](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_cannot_pull_image.html)