import { createGroupRequest } from "../../crudCalls"
import buildCreateGroupRequest from "../createGroup"
import * as response from "../../../../libs/response-lib"
import CoinCalls from "../../db/CoinCalls"

beforeEach(async () => {
  return new Promise(async (resolve) => {
    await CoinCalls.DeleteAll()
    resolve();
  });
});

test("createGroupRequest - test on fail", async () => {
  const _acceptChannelInvite = () => {
    throw new Error("error message")
  }

  const _createGroupRequest = buildCreateGroupRequest(response, _acceptChannelInvite),
  res = await _createGroupRequest({isTesting: true})

  expect(res).toStrictEqual({"body": "{\"message\":\"error message\"}", "headers": {"Access-Control-Allow-Credentials": true, "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE,PATCH", "Access-Control-Allow-Origin": "*"}, "statusCode": 500})
})

test("createGroupRequest - test on success", async () => {

  const event = {
    body: JSON.stringify({
      name: "groupName"
    }),
    requestContext: {
      authorizer: {
        userId: "userId"
      }
    }
  },
  res = await createGroupRequest(event)

  expect(res.statusCode).toBe(200)

  const group = JSON.parse(res.body)

  const liveGroup = await CoinCalls.Read(group.PK, group.SK)
  expect(liveGroup.PK).toBeTruthy()
  expect(liveGroup.SK).toBe("userId")
  expect(liveGroup.name).toBe("groupName")
})