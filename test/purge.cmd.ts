import { testDynamoClient, testS3Client, testSqsClient } from './awsTestClients'

const purge = async () =>
  Promise.all([
    testS3Client.rmdir(),
    testDynamoClient.truncateTable('images', 'id'),
    testSqsClient.purgeQueue('http://localhost:4566/queue/test'),
    testSqsClient.purgeQueue('http://localhost:4566/queue/imports')
  ])

purge()
  .then(() => process.exit(0))
  .catch(err => {
    console.log(err)
    process.exit(1)
  })
