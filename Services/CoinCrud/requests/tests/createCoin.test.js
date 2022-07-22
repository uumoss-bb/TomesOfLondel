import { createCoinRequest } from "../../crudCalls"
import buildCreateCoinRequest from "../createCoin"
import * as response from "../../../../libs/response-lib"
import CoinCalls from "../../db/CoinCalls"

beforeEach(async () => {
  return new Promise(async (resolve) => {
    await CoinCalls.DeleteAll()
    resolve();
  });
});

test("createCoinRequest - test on fail", async () => {
  const _acceptChannelInvite = () => {
    throw new Error("error message")
  }

  const _createCoinRequest = buildCreateCoinRequest(response, _acceptChannelInvite),
  res = await _createCoinRequest({isTesting: true})

  expect(res).toStrictEqual({"body": "{\"message\":\"error message\"}", "headers": {"Access-Control-Allow-Credentials": true, "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE,PATCH", "Access-Control-Allow-Origin": "*"}, "statusCode": 500})
})

test("createCoinRequest - test on success", async () => {

  const event = {
    body: JSON.stringify({
      amount: 100,
      context: "STORED",
      group: "a group"
    }),
    requestContext: {
      authorizer: {
        userId: "userId"
      }
    }
  },
  res = await createCoinRequest(event)

  expect(res.statusCode).toBe(200)

  const coin = JSON.parse(res.body)

  const liveCoin = await CoinCalls.Read(coin.PK, coin.SK)
  expect(liveCoin.PK).toBeTruthy()
  expect(liveCoin.SK).toBe("userId")
  expect(liveCoin.amount).toBe(100)
  expect(liveCoin.context).toBe("STORED")
  expect(liveCoin.group).toBe("a group")
  expect(liveCoin.date).toBeTruthy()
})