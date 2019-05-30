#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/cdk');
import { EcsEc2Cluster2Stack } from '../lib/ecs_ec2_cluster2-stack';

const app = new cdk.App();
new EcsEc2Cluster2Stack(app, 'EcsEc2Cluster2Stack');
