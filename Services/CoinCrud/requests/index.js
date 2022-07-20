import { OuzelCalls, CollectionCalls, UserCalls, NetterKeyCalls, AppCalls } from "../../../../Controllers/DataBase"
import { CollectionFileStorageCalls } from "../../../../Controllers/FileStorage"
import UserServiceCalls from "../../../../Controllers/UserService"
import EmailServiceCalls from "../../../../Controllers/Email"

import isUserAllowedToDoThis from "../util/channelsUserPermissions"
import buildUpdateTotalUsers from "../util/UpdateTotalUsers"
import buildCheckChannelsUserLimit from "../util/checkChannelsUserLimit"

import * as response from "../../../../libs/response-lib"
import createId from "../../../../libs/create_id"
import * as Sanitizer from "../../../../libs/sanitizer-lib"
import * as Crypto from "../../../../libs/crypto"
import GetSecrects from "../../../../libs/aws-secrets"
import CustomError from "../../../../libs/custom-error"

import { 
  buildMakeChannel,
  buildMakeChannelBundle,
  buildMakeChannelUser,
  buildMakeUser,
  buildMakeChannelCollection,
  buildMakeChannelApp
} from "../entities"

import {
  buildAcceptChannelInvite,
  buildAddBundleToChannel,
  buildAddCollectionToChannel,
  buildCognitoUserCheck,
  buildCreateChannel,
  buildDeleteChannel,
  buildDenyChannelInvite,
  buildGetAllChannels,
  buildGetAllUsersInAChannel,
  buildGetChannel,
  buildGetChannelOwnerInfo,
  buildGetChannelResources,
  buildGetMyChannels,
  buildInviteUserToChannel,
  buildJoinChannelWithCode,
  buildLeaveChannel,
  buildRemoveResource,
  buildRemoveUser,
  buildRequestChannel,
  buildRequestNewUserLimit,
  buildUpdateChannel,
  buildUpdateChanUserRole,
  buildUpdateJoinCode,
  buildAddAppToChannel,
  buildDeleteChannelApp
} from "../use_cases"

import buildAcceptChannelInviteRequest from "./acceptChannelInviteRequest"
import buildAddBundleToChannelRequest from "./addBundleToChannelRequest"
import buildAddCollectionToChannelRequest from "./addCollectionToChannelRequest"
import buildCognitoUserCheckRequest from "./cognitoUserCheckRequest"
import buildCreateChannelRequest from "./createChannelRequest"
import buildDeleteChannelRequest from "./deleteChannelRequest"
import buildDenyChannelInviteRequest from "./denyChannelInviteRequest"
import buildGetAllChannelsRequest from "./getAllChannelsRequest"
import buildGetAllUsersInAChannelRequest from './getAllUsersInAChannelRequest'
import buildGetChannelRequest from './getChannelRequest'
import buildGetChannelOwnerInfoRequest from './getChannelOwnerInfoRequest'
import buildGetChannelResourcesRequest from './getChannelResourcesRequest'
import buildGetMyChannelsRequest from './getMyChannelsRequest'
import buildInviteUserToChannelRequest from './inviteUserToChannelRequest'
import buildJoinChannelWithCodeRequest from "./joinChannelWithCodeRequest"
import buildLeaveChannelRequest from "./leaveChannelRequest"
import buildRemoveResourceRequest from "./removeResourceRequest"
import buildRemoveUserRequest from "./removeUserRequest"
import buildRequestChannelRequest from "./requestChannelRequest"
import buildRequestNewUserLimitRequest from "./requestNewUserLimitRequest"
import buildUpdateChannelRequest from "./updateChannelRequest"
import buildUpdateChanUserRoleRequest from "./updateChanUserRoleRequest"
import buildUpdateJoinCodeRequest from "./updateJoinCodeRequest"
import buildAddAppToChannelRequest from "./addAppToChannelRequest"
import buildDeleteChannelAppRequest from "./deleteChannelAppRequest"

const UpdateTotalUsers = buildUpdateTotalUsers(OuzelCalls),
CheckChannelsUserLimit = buildCheckChannelsUserLimit(OuzelCalls)

const makeChannel = buildMakeChannel(CustomError, createId, Sanitizer),
makeChannelBundle = buildMakeChannelBundle(CustomError),
makeChannelApp= buildMakeChannelApp(CustomError),
makeChannelUser = buildMakeChannelUser(CustomError, Sanitizer),
makeUser = buildMakeUser(CustomError, Crypto, GetSecrects),
makeChannelCollection = buildMakeChannelCollection(CustomError, Sanitizer)

const acceptChannelInvite = buildAcceptChannelInvite(OuzelCalls),
acceptChannelInviteRequest = buildAcceptChannelInviteRequest(response, acceptChannelInvite)

const addBundleToChannel = buildAddBundleToChannel(makeChannelBundle, OuzelCalls, CollectionCalls),
addBundleToChannelRequest = buildAddBundleToChannelRequest(response, addBundleToChannel)

const addCollectionToChannel = buildAddCollectionToChannel(OuzelCalls, CollectionCalls, makeChannelCollection),
addCollectionToChannelRequest = buildAddCollectionToChannelRequest(response, addCollectionToChannel)

const cognitoUserCheck = buildCognitoUserCheck(UserServiceCalls, UserCalls, makeUser, GetSecrects, Crypto),
cognitoUserCheckRequest = buildCognitoUserCheckRequest(response, cognitoUserCheck)

const createChannel = buildCreateChannel(OuzelCalls, makeChannel, makeChannelUser, CollectionFileStorageCalls),
createChannelRequest = buildCreateChannelRequest(response, createChannel)

const deleteChannel = buildDeleteChannel(OuzelCalls, isUserAllowedToDoThis, CollectionFileStorageCalls),
deleteChannelRequest = buildDeleteChannelRequest(response, deleteChannel)

const denyChannelInvite = buildDenyChannelInvite(OuzelCalls, UpdateTotalUsers),
denyChannelInviteRequest = buildDenyChannelInviteRequest(response, denyChannelInvite)

const getAllChannels = buildGetAllChannels(OuzelCalls),
getAllChannelsRequest = buildGetAllChannelsRequest(response, getAllChannels)

const getAllUsersInAChannel = buildGetAllUsersInAChannel(CustomError, OuzelCalls, isUserAllowedToDoThis, UserCalls, GetSecrects, Crypto),
getAllUsersInAChannelRequest = buildGetAllUsersInAChannelRequest(response, getAllUsersInAChannel)

const getChannel = buildGetChannel(OuzelCalls),
getChannelRequest = buildGetChannelRequest(response, getChannel)

const getChannelOwnerInfo = buildGetChannelOwnerInfo(OuzelCalls, UserCalls, GetSecrects, Crypto),
getChannelOwnerInfoRequest = buildGetChannelOwnerInfoRequest(response, getChannelOwnerInfo)

const getChannelResources = buildGetChannelResources(OuzelCalls, CollectionCalls),
getChannelResourcesRequest = buildGetChannelResourcesRequest(response, getChannelResources)

const getMyChannels = buildGetMyChannels(OuzelCalls, UserServiceCalls),
getMyChannelsRequest = buildGetMyChannelsRequest(response, getMyChannels)

const inviteUserToChannel = buildInviteUserToChannel(CustomError, OuzelCalls, isUserAllowedToDoThis, UserServiceCalls, EmailServiceCalls, CheckChannelsUserLimit, UpdateTotalUsers, makeChannelUser),
inviteUserToChannelRequest = buildInviteUserToChannelRequest(response, inviteUserToChannel)

const joinChannelWithCode = buildJoinChannelWithCode(OuzelCalls, NetterKeyCalls, makeChannelUser),
joinChannelWithCodeRequest = buildJoinChannelWithCodeRequest(response, joinChannelWithCode)

const leaveChannel = buildLeaveChannel(OuzelCalls, UpdateTotalUsers),
leaveChannelRequest = buildLeaveChannelRequest(response, leaveChannel)

const removeResource = buildRemoveResource(CustomError, OuzelCalls, isUserAllowedToDoThis),
removeResourceRequest = buildRemoveResourceRequest(response, removeResource)

const removeUser = buildRemoveUser(CustomError, OuzelCalls, isUserAllowedToDoThis, UpdateTotalUsers),
removeUserRequest = buildRemoveUserRequest(response, removeUser)

const requestChannel = buildRequestChannel(EmailServiceCalls),
requestChannelRequest = buildRequestChannelRequest(response, requestChannel)

const requestNewUserLimit = buildRequestNewUserLimit(CustomError, OuzelCalls, isUserAllowedToDoThis, UserServiceCalls, EmailServiceCalls),
requestNewUserLimitRequest = buildRequestNewUserLimitRequest(response, requestNewUserLimit)

const updateChannel = buildUpdateChannel(CustomError, OuzelCalls, isUserAllowedToDoThis, CollectionFileStorageCalls, Sanitizer),
updateChannelRequest = buildUpdateChannelRequest(response, updateChannel)

const updateChanUserRole = buildUpdateChanUserRole(CustomError, OuzelCalls, isUserAllowedToDoThis, EmailServiceCalls, UserServiceCalls),
updateChanUserRoleRequest = buildUpdateChanUserRoleRequest(response, updateChanUserRole)

const updateJoinCode = buildUpdateJoinCode(CustomError, OuzelCalls, isUserAllowedToDoThis, createId),
updateJoinCodeRequest = buildUpdateJoinCodeRequest(response, updateJoinCode)

const addAppToChannel = buildAddAppToChannel(AppCalls, OuzelCalls, makeChannelApp),
addAppToChannelRequest = buildAddAppToChannelRequest(response, addAppToChannel)

const deleteChannelApp = buildDeleteChannelApp(OuzelCalls),
deleteChannelAppRequest = buildDeleteChannelAppRequest(response, deleteChannelApp)

export {
  acceptChannelInviteRequest,
  addBundleToChannelRequest,
  addCollectionToChannelRequest,
  cognitoUserCheckRequest,
  createChannelRequest,
  deleteChannelRequest,
  denyChannelInviteRequest,
  getAllChannelsRequest,
  getAllUsersInAChannelRequest,
  getChannelRequest,
  getChannelOwnerInfoRequest,
  getChannelResourcesRequest,
  getMyChannelsRequest,
  inviteUserToChannelRequest,
  joinChannelWithCodeRequest,
  leaveChannelRequest,
  removeResourceRequest,
  removeUserRequest,
  requestChannelRequest,
  requestNewUserLimitRequest,
  updateChannelRequest,
  updateChanUserRoleRequest,
  updateJoinCodeRequest,
  addAppToChannelRequest,
  deleteChannelAppRequest
}