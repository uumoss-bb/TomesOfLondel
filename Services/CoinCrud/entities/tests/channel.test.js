import {
  buildMakeChannel,
  error_bad_accessPattern,
  error_bad_viewCollections,
  error_bad_embedPermission
} from "../channel"
import createId from "../../../../../libs/create_id"
import * as Sanitizer from "../../../../../libs/sanitizer-lib"
import CustomError from "../../../../../libs/custom-error"
import collectEntity from "../../../../../bashTools/entitiesDocumentation/collectEntity"

test("makeChannel - test throw error with bad access pattern", async () => {
  const makeChannel = buildMakeChannel(CustomError, createId, Sanitizer),
  channelInfo = {
    channel_name: "channel_name",
    image: "image.file",
    banner: "banner.file",
    access_pattern: "bad"
  }

  expect(() => makeChannel(channelInfo)).toThrowError(error_bad_accessPattern)
})

test("makeChannel - test throw error with bad embedPermission", () => {
  const makeChannel = buildMakeChannel(CustomError, createId, Sanitizer),
  channelInfo = {
    channel_name: "channel_name",
    image: "image.file",
    banner: "banner.file",
    access_pattern: "hidden",
    embed_permission: {
      permission: "bad"
    }
  }
  
  expect(() => makeChannel(channelInfo)).toThrow(error_bad_embedPermission)
})

test("makeChannel - test throw error with bad view collections", () => {
  const makeChannel = buildMakeChannel(CustomError, createId, Sanitizer),
  channelInfo = {
    channel_name: "channel_name",
    image: "image.file",
    banner: "banner.file",
    access_pattern: "hidden",
    embed_permission: {
      permission: "anywhere",
      domains_allowed: []
    },
    view_collections: "bad"
  }
  
  expect(() => makeChannel(channelInfo)).toThrow(error_bad_viewCollections)
})

test("makeChannel - test max success", async () => {
  const makeChannel = buildMakeChannel(CustomError, createId, Sanitizer),
  channelInfo = {
    channel_name: "channel_name",
    image: "image.file",
    banner: "banner.file",
    access_pattern: "hidden",
    embed_permission: {
      permission: "anywhere",
      domains_allowed: []
    },
    view_collections: true,
    user_limit: 200
  },
  res = makeChannel(channelInfo)

  expect(res.PK).toBeTruthy()
  expect(res.SK).toBeTruthy()
  expect(res.type).toBe("channel")
  expect(res.join_code).toBeTruthy()
  expect(res.join_code_status).toBe("enabled")
  expect(res.access_pattern).toBe("hidden")
  expect(res.embed_permission).toStrictEqual({ permission: 'anywhere', domains_allowed: [] })
  expect(res.user_limit).toBe(200)
  expect(res.total_users).toBe(1)
  expect(res.channel_name).toBe("channel_name")
  expect(res.view_collections).toBe(true)
  expect(res.image.includes("https")).toBe(true)
  expect(res.banner.includes("https")).toBe(true)

  await collectEntity("channels", res)
})

test("makeChannel - test min success", () => {
  const makeChannel = buildMakeChannel(CustomError, createId, Sanitizer),
  res = makeChannel({})

  expect(res.PK).toBeTruthy()
  expect(res.SK).toBeTruthy()
  expect(res.type).toBe("channel")
  expect(res.join_code).toBeTruthy()
  expect(res.join_code_status).toBe("enabled")
  expect(res.access_pattern).toBe("hidden")
  expect(res.embed_permission).toStrictEqual({ permission: 'anywhere', domains_allowed: [] })
  expect(res.user_limit).toBe(14)
  expect(res.total_users).toBe(1)
  expect(res.view_collections).toBe(false)
})