import { AWSError } from 'aws-sdk'
import { PromiseResult } from 'aws-sdk/lib/request'
import SNS from 'aws-sdk/clients/sns'

export interface SNSClient {
  publish: (
    TopicArn: string,
    Message: string
  ) => Promise<PromiseResult<SNS.PublishResponse, AWSError>>
}

export const createSNSClient = (sns: SNS): SNSClient => {
  const publish = async (
    TopicArn: string,
    Message: string
  ): Promise<PromiseResult<SNS.PublishResponse, AWSError>> =>
    sns.publish({ TopicArn, Message }).promise()

  return {
    publish
  }
}
