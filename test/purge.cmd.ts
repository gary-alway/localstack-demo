import { purgeAll } from './awsTestClients'

purgeAll()
  .then(() => process.exit(0))
  .catch(err => {
    console.log(err)
    process.exit(1)
  })
