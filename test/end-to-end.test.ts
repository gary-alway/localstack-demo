import request from 'superagent'
import {
  purgeAll,
  testDynamoClient,
  testS3Client,
  testSqsClient
} from './awsTestClients'
import waitForExpect from 'wait-for-expect'
import { API, DDB_TABLE, S3_BUCKET } from '../src/constants'
import stringHash from 'string-hash'

const TOWER_BRIDGE =
  'https://theboutiqueadventurer.com/wp-content/uploads/2021/02/London-Tower-Bridge-at-Sunset.jpg.webp'
const MILLENIUM_BRIDGE =
  'https://www.thepiccadillywestend.co.uk/blog/wp-content/uploads/2018/11/London-Millennium-bridge-sunset.jpg'

const TOWER_BRIDGE_HASH = stringHash(TOWER_BRIDGE)
const MILLENIUM_BRIDGE_HASH = stringHash(MILLENIUM_BRIDGE)

const images = ['', TOWER_BRIDGE, MILLENIUM_BRIDGE, '', undefined, '']

const postImages = () => request.post(API).send({ images })

describe('image importer', () => {
  beforeAll(async () => {
    await purgeAll()
  })

  it('imports images into S3 and DynamoDB whilst broadcasting details via SNS', async () => {
    await postImages()
    const testQueue = await testSqsClient.findQueue('test')

    await waitForExpect(
      async () => {
        const ddb_items = await testDynamoClient.scan(DDB_TABLE)
        expect(ddb_items).toEqual({
          Items: [
            {
              id: TOWER_BRIDGE_HASH,
              originalUrl: TOWER_BRIDGE
            },
            {
              id: MILLENIUM_BRIDGE_HASH,
              originalUrl: MILLENIUM_BRIDGE
            }
          ],
          Count: 2,
          ScannedCount: 2
        })
      },
      8000,
      200
    )

    await waitForExpect(
      async () => {
        const messages = await testSqsClient.receiveMessage(testQueue!, 2)

        const createdTowerBridge = messages.find(
          m => JSON.parse(m.Body!).id === TOWER_BRIDGE_HASH
        )

        expect(JSON.parse(createdTowerBridge?.Body || '{}')).toEqual({
          id: TOWER_BRIDGE_HASH,
          originalUrl: TOWER_BRIDGE,
          exists: false
        })

        const createdMilleniumBridge = messages.find(
          m => JSON.parse(m.Body!).id === MILLENIUM_BRIDGE_HASH
        )

        expect(JSON.parse(createdMilleniumBridge?.Body || '{}')).toEqual({
          id: MILLENIUM_BRIDGE_HASH,
          originalUrl: MILLENIUM_BRIDGE,
          exists: false
        })
      },
      8000,
      200
    )

    await waitForExpect(
      async () => {
        const assets = await testS3Client.ls()
        expect(assets.map(Number)).toEqual([
          TOWER_BRIDGE_HASH,
          MILLENIUM_BRIDGE_HASH
        ])
      },
      8000,
      200
    )

    await postImages()

    let count = 0

    await waitForExpect(
      async () => {
        const messages = await testSqsClient.receiveMessage(testQueue!, 10)

        count += messages.length
        expect(messages.length).toBeGreaterThan(0)
        messages.map(m => expect(JSON.parse(m.Body!).exists).toBe(true))
        expect(count).toBe(2)
      },
      8000,
      200
    )

    const ddb_items = await testDynamoClient.scan(DDB_TABLE)
    expect(ddb_items.Count).toBe(2)

    const res = await request.get(API)
    expect(res.body).toEqual({
      status: 'ok',
      data: [
        {
          originalUrl: TOWER_BRIDGE,
          id: TOWER_BRIDGE_HASH,
          url: `${S3_BUCKET}/${TOWER_BRIDGE_HASH}`
        },
        {
          originalUrl: MILLENIUM_BRIDGE,
          id: MILLENIUM_BRIDGE_HASH,
          url: `${S3_BUCKET}/${MILLENIUM_BRIDGE_HASH}`
        }
      ]
    })
  })
})
