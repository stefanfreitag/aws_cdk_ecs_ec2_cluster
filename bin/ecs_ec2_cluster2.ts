#!/usr/bin/env node
import 'source-map-support/register';
import { EcsEc2Cluster2Stack } from '../lib/ecs_ec2_cluster2-stack';
import { App } from '@aws-cdk/core';

const app = new App();
new EcsEc2Cluster2Stack(app, 'EcsEc2Cluster2Stack');
