import UniversalCalls from "./UniversalCalls"

class MakeCoinCalls extends UniversalCalls {
  constructor() {
    this.tableName = process.env.DBNAME
    super(process.env.DBNAME)
  }
}

const CoinCalls = new MakeCoinCalls()

export default CoinCalls

const error_no_data = "no data"
const error_no_info = "no info"
export { CoinCalls, error_no_data, error_no_info }
