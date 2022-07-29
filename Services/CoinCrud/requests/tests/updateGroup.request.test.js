import { updateGroupRequest } from "../../crudCalls"
import buildUpdateGroupRequest from "../updateGroup"
import * as response from "../../../../libs/response-lib"
import CoinCalls from "../../db/CoinCalls"

beforeEach(async () => {
  return new Promise(async (resolve) => {
    await CoinCalls.DeleteAll()
    resolve();
  });
});

test("updateGroupRequest - test on fail", async () => {
  const _acceptChannelInvite = () => {
    throw new Error("error message")
  }

  const _updateGroupRequest = buildUpdateGroupRequest(response, _acceptChannelInvite),
  res = await _updateGroupRequest({isTesting: true})

  expect(res).toStrictEqual({"body": "{\"message\":\"error message\"}", "headers": {"Access-Control-Allow-Credentials": true, "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE,PATCH", "Access-Control-Allow-Origin": "*"}, "statusCode": 500})
})

test("updateGroupRequest - test on success", async () => {
  const theGroup = {
    PK: '2678a317',
    SK: '333',
    name: "name"
  }

  await CoinCalls.Create(theGroup)

  const event = {
    pathParameters: { groupId: theGroup.PK },
    body: JSON.stringify({
      name: "newName"
    }),
    requestContext: {
      authorizer: {
        userId: theGroup.SK
      }
    }
  },
  res = await updateGroupRequest(event)

  expect(res.statusCode).toBe(200)

  const group = JSON.parse(res.body)

  const liveCoin = await CoinCalls.Read(group.PK, group.SK)
  expect(liveCoin).toStrictEqual({...theGroup, name: "newName"})
})