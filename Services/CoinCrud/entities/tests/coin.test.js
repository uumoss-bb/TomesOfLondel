import {
  buildMakeCoin,
  invalid_context_error
} from "../coin"
import createId from "../../../../libs/create_id"
import * as Sanitizer from "../../../../libs/sanitizer-lib"
import collectEntity from "../../../../bashTools/entitiesDocumentation/collectEntity"

const date = {
  now() {
    return "123"
  }
}

test("makeCoin - test throw error with bad amount", async () => {
  const makeCoin = buildMakeCoin(createId, Sanitizer, date),
  newInfo = {
    amount: "100"
  }

  expect(() => makeCoin(newInfo)).toThrowError(Sanitizer.number_error)
})

test("makeCoin - test throw error with bad context", async () => {
  const makeCoin = buildMakeCoin(createId, Sanitizer, date),
  newInfo = {
    amount: 100,
    context: "wrong"
  }

  expect(() => makeCoin(newInfo)).toThrowError(invalid_context_error)
})

test("makeCoin - test throw error with bad group", async () => {
  const makeCoin = buildMakeCoin(createId, Sanitizer, date),
  newInfo = {
    amount: 100,
    context: "STORED",
    group: 123
  }

  expect(() => makeCoin(newInfo)).toThrowError(Sanitizer.string_error)
})

test("makeCoin - test max success", async () => {
  const makeCoin = buildMakeCoin(createId, Sanitizer, date),
  newInfo = {
    amount: 100,
    context: "STORED",
    group: "a group"
  },
  res = makeCoin(newInfo)

  expect(res.PK).toBeTruthy()
  expect(res.SK).toBeTruthy()
  expect(res.amount).toBe(newInfo.amount)
  expect(res.context).toBe(newInfo.context)
  expect(res.group).toBe(newInfo.group)
  expect(res.date).toBe("123")

  await collectEntity("coin", res)
})

test("makeCoin - test min success", () => {
  const makeCoin = buildMakeCoin(createId, Sanitizer, date),
  res = makeCoin({})

  expect(res.PK).toBeTruthy()
  expect(res.SK).toBeTruthy()
  expect(res.amount).toBe(0)
  expect(res.context).toBe('STORED')
  expect(res.date).toBe("123")
})