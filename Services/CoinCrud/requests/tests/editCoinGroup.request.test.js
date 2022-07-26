import { editCoinGroupRequest } from "../../crudCalls"
import buildEditCoinGroupRequest from "../createCoin"
import * as response from "../../../../libs/response-lib"
import CoinCalls from "../../db/CoinCalls"

beforeEach(async () => {
  return new Promise(async (resolve) => {
    await CoinCalls.DeleteAll()
    resolve();
  });
});

test("editCoinGroupRequest - test on fail", async () => {
  const _acceptChannelInvite = () => {
    throw new Error("error message")
  }

  const _editCoinGroupRequest = buildEditCoinGroupRequest(response, _acceptChannelInvite),
  res = await _editCoinGroupRequest({isTesting: true})

  expect(res).toStrictEqual({"body": "{\"message\":\"error message\"}", "headers": {"Access-Control-Allow-Credentials": true, "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE,PATCH", "Access-Control-Allow-Origin": "*"}, "statusCode": 500})
})

test("editCoinGroupRequest - test on success", async () => {
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
    body: JSON.stringify({
      group: "new group"
    }),
    requestContext: {
      authorizer: {
        userId: theCoin.SK
      }
    }
  },
  res = await editCoinGroupRequest(event)

  expect(res.statusCode).toBe(200)

  const coin = JSON.parse(res.body)

  const liveCoin = await CoinCalls.Read(coin.PK, coin.SK)
  expect(liveCoin).toStrictEqual({...theCoin, group: "new group"})
})