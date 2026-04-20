#!/usr/bin/env bun
import * as cdk from 'aws-cdk-lib';
import { StaticSiteStack } from '../lib/static-site-stack';
import { GitHubOidcStack } from '../lib/github-oidc-stack';

const app = new cdk.App();

// ACM certificates for CloudFront must be in us-east-1
const env = { region: 'us-east-1' };

const site = new StaticSiteStack(app, 'JossDevSiteStack', { env });

new GitHubOidcStack(app, 'JossDevOidcStack', {
  env,
  bucket: site.bucket,
  distribution: site.distribution,
});
