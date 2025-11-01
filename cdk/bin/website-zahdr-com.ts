#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { WebsiteZahdrComStack } from '../lib/website-zahdr-com-stack';

const app = new cdk.App();
new WebsiteZahdrComStack(app, 'WebsiteZahdrComStack', {
    env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
