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
  buildGetCoin,
  buildEditCoinGroup,
  buildCreateGroup,
  buildGetGroup
} from "./useCases"

import {
  buildCreateCoinRequest,
  buildGetCoinRequest,
  buildEditCoinGroupRequest,
  buildCreateGroupRequest,
  buildGetGroupRequest
} from "./requests"

const makeCoin = buildMakeCoin( createId, Sanitizer, date ),
makeGroup = buildMakeGroup( createId, Sanitizer ) 

const createCoin = buildCreateCoin(CoinCalls, makeCoin),
createCoinRequest = buildCreateCoinRequest(response, createCoin)

const getCoin = buildGetCoin(CoinCalls),
getCoinRequest = buildGetCoinRequest(response, getCoin)

const editCoinGroup = buildEditCoinGroup(CoinCalls),
editCoinGroupRequest = buildEditCoinGroupRequest(response, editCoinGroup)

const createGroup = buildCreateGroup(CoinCalls, makeGroup),
createGroupRequest = buildCreateGroupRequest(response, createGroup)

const getGroup = buildGetGroup(CoinCalls),
getGroupRequest = buildGetGroupRequest(response, getGroup)

export {
  createCoinRequest,
  getCoinRequest,
  editCoinGroupRequest,
  createGroupRequest,
  getGroupRequest
}