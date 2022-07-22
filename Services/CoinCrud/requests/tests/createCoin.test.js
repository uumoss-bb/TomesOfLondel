// import { acceptChannelInviteRequest } from "../index"
// import buildAcceptChannelInviteRequest from "../acceptChannelInviteRequest"
// import * as response from "../../../../../libs/response-lib"
// import { OuzelCalls } from "../../../../../Controllers/DataBase"

// beforeEach(async () => {
//   return new Promise(async (resolve) => {
//     await OuzelCalls.DeleteAll()
//     resolve();
//   });
// });

// test("acceptChannelInviteRequest - test on fail", async () => {
//   const _acceptChannelInvite = () => {
//     throw new Error("error message")
//   }

//   const _acceptChannelInviteRequest = buildAcceptChannelInviteRequest(response, _acceptChannelInvite),
//   res = await _acceptChannelInviteRequest({isTesting: true})

//   expect(res).toStrictEqual({"body": "{\"message\":\"error message\"}", "headers": {"Access-Control-Allow-Credentials": true, "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE,PATCH", "Access-Control-Allow-Origin": "*"}, "statusCode": 500})
// })

// test("acceptChannelInviteRequest - test on success as owner update", async () => {

//   await OuzelCalls.Create({
//     PK: "channelId",
//     SK: "oldOwnerId",
//     type: "channel-user",
//     role: "owner",
//     timestamp: 1
//   })

//   await OuzelCalls.Create({
//     PK: "channelId",
//     SK: "userId",
//     type: "channel-user",
//     role: "owner",
//     timestamp: 1,
//     status: "pending"
//   })


//   const event = {
//     pathParameters: {
//       id: "channelId"
//     },
//     requestContext: {
//       authorizer: {
//         userId: "userId"
//       }
//     }
//   },
//   res = await acceptChannelInviteRequest(event)

//   expect(res).toStrictEqual({"body": "{\"message\":\"Success\"}", "headers": {"Access-Control-Allow-Credentials": true, "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE,PATCH", "Access-Control-Allow-Origin": "*"}, "statusCode": 200})

//   const oldOwner = await OuzelCalls.Read("channelId", "oldOwnerId")
//   expect(oldOwner.role).toBe('admin')
//   expect(oldOwner.timestamp).not.toBe(1)

//   const newOwner = await OuzelCalls.Read("channelId", "userId")
//   expect(newOwner.role).toBe('owner')
//   expect(newOwner.timestamp).not.toBe(1)
//   expect(newOwner.status).toBe("accepted")

// })

// test("acceptChannelInviteRequest - test on success", async () => {

//   await OuzelCalls.Create({
//     PK: "channelId",
//     SK: "userId",
//     type: "channel-user",
//     role: "admin",
//     timestamp: 1,
//     status: "pending"
//   })


//   const event = {
//     pathParameters: {
//       id: "channelId"
//     },
//     requestContext: {
//       authorizer: {
//         userId: "userId"
//       }
//     }
//   },
//   res = await acceptChannelInviteRequest(event)

//   expect(res).toStrictEqual({"body": "{\"message\":\"Success\"}", "headers": {"Access-Control-Allow-Credentials": true, "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE,PATCH", "Access-Control-Allow-Origin": "*"}, "statusCode": 200})


//   const newOwner = await OuzelCalls.Read("channelId", "userId")
//   expect(newOwner.timestamp).not.toBe(1)
//   expect(newOwner.status).toBe("accepted")

// })