import MakeOuzelCalls from "./OuzelCalls"
import MakeCollectionCalls from "./CollectionCalls"
import MakeAppCalls from "./AppCalls"
import MakeNetterKeyCalls from "./NetterKeyCalls"
import MakeUserCalls from "./UserCalls"
import MakeAccessDBCalls from "./AccessDBCalls"


import CustomError from "../../libs/custom-error"

const stagingEnviroment = process.env.STAGE ?? "dev",
OuzelCalls = new MakeOuzelCalls(`VivedApi-${stagingEnviroment}-ouzel`),
CollectionCalls = new MakeCollectionCalls(`VivedApi-${stagingEnviroment}-V2collections`),
AppCalls = new MakeAppCalls(`VivedApi-${stagingEnviroment}-apps`),
NetterKeyCalls = new MakeNetterKeyCalls(CustomError),
UserCalls = new MakeUserCalls(`VivedApi-${stagingEnviroment}-users`),
AccessDBCalls = new MakeAccessDBCalls(`VivedApi-${stagingEnviroment}-playeraccess`)



export { 
  OuzelCalls, 
  CollectionCalls, 
  AppCalls, 
  NetterKeyCalls,
  UserCalls,
  AccessDBCalls
}