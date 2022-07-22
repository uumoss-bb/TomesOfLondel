import CoinCalls from "./db/CoinCalls"
import * as response from "../../libs/response-lib"
import createId from "../../libs/create_id"
import * as Sanitizer from "../../libs/sanitizer-lib"
import * as date from "../../libs/date"

import {
  buildMakeCoin,
  buildMakeGroup
} from "./entities"

import {
  buildCreateCoin,
  buildGetCoin
} from "./useCases"

import {
  buildCreateCoinRequest,
  buildGetCoinRequest
} from "./requests"

const makeCoin = buildMakeCoin( createId, Sanitizer, date ),
makeGroup = buildMakeGroup( createId, Sanitizer ) 

const createCoin = buildCreateCoin(CoinCalls, makeCoin),
createCoinRequest = buildCreateCoinRequest(response, createCoin)

const getCoin = buildGetCoin(CoinCalls),
getCoinRequest = buildGetCoinRequest(response, getCoin)

export {
  createCoinRequest,
  getCoinRequest
}