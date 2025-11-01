import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as iam from 'aws-cdk-lib/aws-iam';

export class WebsiteZahdrComStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
            bucketName: 'zahdr.com',
            websiteIndexDocument: 'index.html',
            publicReadAccess: false,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });

        cdk.Tags.of(websiteBucket).add('Project', 'website-zahdr-com');

        const cloudflareIps = [
            '173.245.48.0/20',
            '103.21.244.0/22',
            '103.22.200.0/22',
            '103.31.4.0/22',
            '141.101.64.0/18',
            '108.162.192.0/18',
            '190.93.240.0/20',
            '188.114.96.0/20',
            '197.234.240.0/22',
            '198.41.128.0/17',
            '162.158.0.0/15',
            '104.16.0.0/13',
            '104.24.0.0/14',
            '172.64.0.0/13',
            '131.0.72.0/22',
        ];

        websiteBucket.addToResourcePolicy(new iam.PolicyStatement({
            principals: [new iam.AnyPrincipal()],
            actions: ['s3:GetObject'],
            resources: [`${websiteBucket.bucketArn}/*`],
            conditions: {
                IpAddress: { 'aws:SourceIp': cloudflareIps, },
            },
        }));

        new s3deploy.BucketDeployment(this, 'DeployWebsite', {
            sources: [s3deploy.Source.asset('../website')],
            destinationBucket: websiteBucket,
        });
  }
}
