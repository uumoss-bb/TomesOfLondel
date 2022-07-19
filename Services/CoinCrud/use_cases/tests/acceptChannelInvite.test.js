import {
  buildAcceptChannelInvite,
  error_no_channelId,
  error_no_userId
} from "../acceptChannelInvite"

test("acceptChannelInvite - test construction", async () => {
  const acceptChannelInvite = buildAcceptChannelInvite()
  expect(acceptChannelInvite).toBeTruthy()
})

test("acceptChannelInvite - test throw error with no channelId", async () => {
  const acceptChannelInvite = buildAcceptChannelInvite(),
  event = {}
  await expect(acceptChannelInvite(event)).rejects.toThrow(error_no_channelId)
})

test("acceptChannelInvite - test throw error with no userId", async () => {
  const acceptChannelInvite = buildAcceptChannelInvite(),
  event = {
    pathParameters: {
      id: "channelId"
    }
  }
  await expect(acceptChannelInvite(event)).rejects.toThrow(error_no_userId)
})

test("acceptChannelInvite - test throw error when getting user", async () => {
  class OuzelCalls {
    async Read(PK, SK) {
      throw new Error("failed read")
    }
  }
  const acceptChannelInvite = buildAcceptChannelInvite(new OuzelCalls()),
  event = {
    pathParameters: {
      id: "channelId"
    },
    requestContext: {
      authorizer: {
        userId: "userID"
      }
    }
  }
  await expect(acceptChannelInvite(event)).rejects.toThrow("failed read")
})

test("acceptChannelInvite - test throw error when getting old owner", async () => {
  class OuzelCalls {
    async Read(PK, SK) {
      return {
        PK,
        SK,
        role: "owner",
        type: "channel-user"
      }
    }

    async GetData_PKandType(data) {
      throw new Error("failed get old owner")
    }
  }
  const acceptChannelInvite = buildAcceptChannelInvite(new OuzelCalls()),
  event = {
    pathParameters: {
      id: "channelId"
    },
    requestContext: {
      authorizer: {
        userId: "userID"
      }
    }
  }
  await expect(acceptChannelInvite(event)).rejects.toThrow("failed get old owner")
})

test("acceptChannelInvite - test throw error when updating old owner", async () => {
  class OuzelCalls {
    async Read(PK, SK) {
      return {
        PK,
        SK,
        role: "owner",
        type: "channel-user"
      }
    }

    async Update(data, newInformation) {
      if(data.SK === "userID-oldOwner") {
        throw new Error("failed to update A")
      }
    }

    async GetData_PKandType(data) {
      return {
        Items: [
          {
            PK: "channelId-1",
            SK: "userID-oldOwner",
            role: "owner",
            type: "channel-user"
          },
          {
            PK: "channelId-2",
            SK: "userID-2",
            role: "member",
            type: "channel-user"
          },
          {
            PK: "channelId",
            SK: "userId",
            role: "owner",
            type: "channel-user"
          }
        ]
      }
    }
  }
  const acceptChannelInvite = buildAcceptChannelInvite(new OuzelCalls()),
  event = {
    pathParameters: {
      id: "channelId"
    },
    requestContext: {
      authorizer: {
        userId: "userID"
      }
    }
  }
  await expect(acceptChannelInvite(event)).rejects.toThrow("failed to update A")
})

test("acceptChannelInvite - test throw error when updating user", async () => {
  class OuzelCalls {
    async Read(PK, SK) {
      return {
        PK,
        SK,
        role: "owner",
        type: "channel-user"
      }
    }

    async Update(data, newInformation) {
      if(data.SK === "userId") {
        throw new Error("failed to update b")
      }

      return data
    }

    async GetData_PKandType(data) {
      return {
        Items: [
          {
            PK: "channelId-1",
            SK: "userID-oldOwner",
            role: "owner",
            type: "channel-user"
          },
          {
            PK: "channelId-2",
            SK: "userID-2",
            role: "member",
            type: "channel-user"
          },
          {
            PK: "channelId",
            SK: "userId",
            role: "owner",
            type: "channel-user"
          }
        ]
      }
    }
  }
  const acceptChannelInvite = buildAcceptChannelInvite(new OuzelCalls()),
  event = {
    pathParameters: {
      id: "channelId"
    },
    requestContext: {
      authorizer: {
        userId: "userId"
      }
    }
  }
  await expect(acceptChannelInvite(event)).rejects.toThrow("failed to update b")
})

test("acceptChannelInvite - test throw error when updating user when its not an owner", async () => {
  class OuzelCalls {
    async Read(PK, SK) {
      return {
        PK,
        SK,
        role: "member",
        type: "channel-user"
      }
    }

    async Update(data, newInformation) {
      if(data.SK === "userId") {
        throw new Error("failed to update c")
      }

      return data
    }

    async GetData_PKandType(data) {
      return [
        {
          PK: "channelId-1",
          SK: "userID-oldOwner",
          role: "owner",
          type: "channel-user"
        },
        {
          PK: "channelId-2",
          SK: "userID-2",
          role: "member",
          type: "channel-user"
        },
        {
          PK: "channelId",
          SK: "userId",
          role: "owner",
          type: "channel-user"
        }
      ]
    }
  }
  const acceptChannelInvite = buildAcceptChannelInvite(new OuzelCalls()),
  event = {
    pathParameters: {
      id: "channelId"
    },
    requestContext: {
      authorizer: {
        userId: "userId"
      }
    }
  }
  await expect(acceptChannelInvite(event)).rejects.toThrow("failed to update c")
})

test("acceptChannelInvite - test on success with not an owner", async () => {
  class OuzelCalls {
    async Read(PK, SK) {
      return {
        PK,
        SK,
        role: "member",
        type: "channel-user"
      }
    }

    async Update(data, newInformation) {

      return data
    }

    async GetData_PKandType(data) {
      return [
        {
          PK: "channelId-1",
          SK: "userID-oldOwner",
          role: "owner",
          type: "channel-user"
        },
        {
          PK: "channelId-2",
          SK: "userID-2",
          role: "member",
          type: "channel-user"
        },
        {
          PK: "channelId",
          SK: "userId",
          role: "owner",
          type: "channel-user"
        }
      ]
    }
  }
  const acceptChannelInvite = buildAcceptChannelInvite(new OuzelCalls()),
  event = {
    pathParameters: {
      id: "channelId"
    },
    requestContext: {
      authorizer: {
        userId: "userId"
      }
    }
  }, res = await acceptChannelInvite(event)
  expect(res).toBe("done")
})

test("acceptChannelInvite - test on success with an owner", async () => {
  class OuzelCalls {
    async Read(PK, SK) {
      return {
        PK,
        SK,
        role: "owner",
        type: "channel-user"
      }
    }

    async Update(data, newInformation) {

      return data
    }

    async GetData_PKandType(data) {
      return {
        Items: [
          {
            PK: "channelId-1",
            SK: "userID-oldOwner",
            role: "owner",
            type: "channel-user"
          },
          {
            PK: "channelId-2",
            SK: "userID-2",
            role: "member",
            type: "channel-user"
          },
          {
            PK: "channelId",
            SK: "userId",
            role: "owner",
            type: "channel-user"
          }
        ]
      }
    }
  }
  const acceptChannelInvite = buildAcceptChannelInvite(new OuzelCalls()),
  event = {
    pathParameters: {
      id: "channelId"
    },
    requestContext: {
      authorizer: {
        userId: "userId"
      }
    }
  }, res = await acceptChannelInvite(event)
  expect(res).toBe("done")
})


