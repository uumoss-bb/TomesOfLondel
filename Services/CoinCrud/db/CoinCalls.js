import UniversalCalls from "../../../Controllers/DataBase/UniversalCalls"

class MakeCoinCalls extends UniversalCalls {
  constructor() {
    const tableName = process.env.DBNAME ? process.env.DBNAME : "TheTomes-dev-coins"
    super(tableName)
    this.tableName = tableName
  }
}

const CoinCalls = new MakeCoinCalls()

export default CoinCalls

const error_no_data = "no data"
const error_no_info = "no info"
export { CoinCalls, error_no_data, error_no_info }
