import { getCoinRequest } from "../../crudCalls"
import buildGetCoinRequest from "../createCoin"
import * as response from "../../../../libs/response-lib"
import CoinCalls from "../../db/CoinCalls"

beforeEach(async () => {
  return new Promise(async (resolve) => {
    await CoinCalls.DeleteAll()
    resolve();
  });
});

test("getCoinRequest - test on fail", async () => {
  const _acceptChannelInvite = () => {
    throw new Error("error message")
  }

  const _getCoinRequest = buildGetCoinRequest(response, _acceptChannelInvite),
  res = await _getCoinRequest({isTesting: true})

  expect(res).toStrictEqual({"body": "{\"message\":\"error message\"}", "headers": {"Access-Control-Allow-Credentials": true, "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE,PATCH", "Access-Control-Allow-Origin": "*"}, "statusCode": 500})
})

test("getCoinRequest - test on success", async () => {
  const theCoin = {
    PK: '2678a317-5d11-4d57-8eca-2af20589eddd',
    SK: '333',
    amount: 100,
    context: 'STORED',
    date: '123',
    group: 'a group'
  }

  await CoinCalls.Create(theCoin)

  const event = {
    pathParameters: { coinId: theCoin.PK },
    requestContext: {
      authorizer: {
        userId: theCoin.SK
      }
    }
  },
  res = await getCoinRequest(event)

  expect(res.statusCode).toBe(200)

  const coin = JSON.parse(res.body)

  const liveCoin = await CoinCalls.Read(coin.PK, coin.SK)
  expect(liveCoin).toStrictEqual(theCoin)
})