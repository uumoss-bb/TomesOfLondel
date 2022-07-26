import {
  buildMakeCoin,
  invalid_context_error,
  userId_error
} from "../coin"
import createId from "../../../../libs/create_id"
import * as Sanitizer from "../../../../libs/sanitizer-lib"
import collectEntity from "../../../../bashTools/entitiesDocumentation/collectEntity"

const date = {
  now() {
    return "123"
  }
}

test("makeCoin - test throw error no userId", async () => {
  const makeCoin = buildMakeCoin(createId, Sanitizer, date)

  expect(() => makeCoin({})).toThrowError(userId_error)
})

test("makeCoin - test throw error with bad amount", async () => {
  const makeCoin = buildMakeCoin(createId, Sanitizer, date),
  newInfo = {
    userId: "333",
    amount: "100"
  }

  expect(() => makeCoin(newInfo)).toThrowError(Sanitizer.number_error)
})

test("makeCoin - test throw error with bad context", async () => {
  let makeCoin = buildMakeCoin(createId, Sanitizer, date),
  newInfo = {
    userId: "333",
    amount: 100,
    context: "wrong"
  }

  expect(() => makeCoin(newInfo)).toThrowError(invalid_context_error)

  newInfo = {
    userId: "333",
    amount: 100,
    // context: "im missing"
  }

  expect(() => makeCoin(newInfo)).toThrowError(invalid_context_error)
})

test("makeCoin - test throw error with bad group", async () => {
  const makeCoin = buildMakeCoin(createId, Sanitizer, date),
  newInfo = {
    userId: "333",
    amount: 100,
    context: "ADDED",
    group: 123
  }

  expect(() => makeCoin(newInfo)).toThrowError(Sanitizer.string_error)
})

test("makeCoin - test max success", async () => {
  const makeCoin = buildMakeCoin(createId, Sanitizer, date),
  newInfo = {
    userId: "333",
    amount: 100,
    context: "ADDED",
    group: "a group"
  },
  res = makeCoin(newInfo)

  expect(res.PK).toBeTruthy()
  expect(res.SK).toBe("333")
  expect(res.amount).toBe(newInfo.amount)
  expect(res.context).toBe(newInfo.context)
  expect(res.group).toBe(newInfo.group)
  expect(res.date).toBe("123")

  await collectEntity("coin", res)
})

test("makeCoin - test min success", () => {
  const makeCoin = buildMakeCoin(createId, Sanitizer, date),
  res = makeCoin({
    userId: "333",
    context: "SUBTRACTED"
  })

  expect(res.PK).toBeTruthy()
  expect(res.SK).toBe("333")
  expect(res.amount).toBe(0)
  expect(res.context).toBe("SUBTRACTED")
  expect(res.date).toBe("123")
})