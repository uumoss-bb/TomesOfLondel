import CoinCalls from "./db/CoinCalls"
import * as response from "../../../../libs/response-lib"
import createId from "../../../../libs/create_id"
import * as Sanitizer from "../../../../libs/sanitizer-lib"
import * as date from "../../../../libs/date"

import {
  buildMakeCoin,
  buildMakeGroup
} from "../entities"

import {} from "../useCases"

import buildAcceptChannelInviteRequest from "./requests/acceptChannelInviteRequest"

const makeCoin = buildMakeCoin( createId, Sanitizer, date ),
makeGroup = buildMakeGroup( createId, Sanitizer ) 

const acceptChannelInvite = buildAcceptChannelInvite(CoinCalls),
acceptChannelInviteRequest = buildAcceptChannelInviteRequest(response, acceptChannelInvite)

export {
  acceptChannelInviteRequest
}