import {
  buildMakeGroup,
  name_error,
  userId_error
} from "../group"
import createId from "../../../../libs/create_id"
import * as Sanitizer from "../../../../libs/sanitizer-lib"
import collectEntity from "../../../../bashTools/entitiesDocumentation/collectEntity"

const date = {
  now() {
    return "123"
  }
}

test("makeGroup - test throw error no userId", async () => {
  const makeGroup = buildMakeGroup(createId, Sanitizer, date)

  expect(() => makeGroup({})).toThrowError(userId_error)
})

test("makeGroup - test throw error with missing name", async () => {
  let makeGroup = buildMakeGroup(createId, Sanitizer, date),
  newInfo = {
    userId: "333"
  }

  expect(() => makeGroup(newInfo)).toThrowError(Sanitizer.string_error)

  newInfo = {
    userId: "333",
    name: ""
  }

  expect(() => makeGroup(newInfo)).toThrowError(name_error)
})

test("makeGroup - test success", async () => {
  const makeGroup = buildMakeGroup(createId, Sanitizer, date),
  newInfo = {
    userId: "333",
    name: "group"
  },
  res = makeGroup(newInfo)

  expect(res.PK).toBeTruthy()
  expect(res.SK).toBe("333")
  expect(res.name).toBe(newInfo.name)

  await collectEntity("group", res)
})