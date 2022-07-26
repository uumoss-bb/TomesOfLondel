import { getGroupRequest } from "../../crudCalls"
import buildGetGroupRequest from "../getGroup"
import * as response from "../../../../libs/response-lib"
import CoinCalls from "../../db/CoinCalls"

beforeEach(async () => {
  return new Promise(async (resolve) => {
    await CoinCalls.DeleteAll()
    resolve();
  });
});

test("getGroupRequest - test on fail", async () => {
  const _acceptChannelInvite = () => {
    throw new Error("error message")
  }

  const _getGroupRequest = buildGetGroupRequest(response, _acceptChannelInvite),
  res = await _getGroupRequest({isTesting: true})

  expect(res).toStrictEqual({"body": "{\"message\":\"error message\"}", "headers": {"Access-Control-Allow-Credentials": true, "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE,PATCH", "Access-Control-Allow-Origin": "*"}, "statusCode": 500})
})

test("getGroupRequest - test on success", async () => {
  const theGroup = {
    PK: '2678a317-5d11-4d57-8eca-2af20589eddd',
    SK: '333',
    name: "groupName"
  }

  await CoinCalls.Create(theGroup)

  const event = {
    pathParameters: { groupId: theGroup.PK },
    requestContext: {
      authorizer: {
        userId: theGroup.SK
      }
    }
  },
  res = await getGroupRequest(event)

  expect(res.statusCode).toBe(200)

  const coin = JSON.parse(res.body)

  const liveCoin = await CoinCalls.Read(coin.PK, coin.SK)
  expect(liveCoin).toStrictEqual(theGroup)
})