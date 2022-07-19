# The Tomes of Londelo

------------------------------------------------------------------------------------------------------------------------

## Documentation for third party frameworks that make up this  project 

- Great resource for best practices for serverless framework: https://serverless-stack.com/

- Serverless Frame Docs for AWS: https://serverless.com/framework/docs/providers/aws/guide/serverless.yml/

- CloudFormation Swagger Templet Docs to build resources in Serverless Frame: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html

- AWS SDK Documentation: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html

------------------------------------------------------------------------------------------------------------------------

## To deploy microservice localy :
- npm run local.deploy

This will have you select a microservice to deploy and a staging env to deploy to. Then is will copy the package.json to that microservice, install everthing and deploy to aws. Once done it will clean up  its mess.

------------------------------------------------------------------------------------------------------------------------

## Create a new release from develop :
- npm run create.release

This will guide you threw updating the apis version, create a new branch called "release_{new version}", then it will create a new pipeline in aws for this new branch.

