clear

echo "Welcome!"
sleep 1
clear

SERVICES=()
OUZEL="API_Services/VLP_API_Microservices"
for service in "$OUZEL"/*
do
  SERVICES+=(${service#"API_Services/"})
done

COLLECTIONS="API_Services/Collections_API_Microservices"
for service in "$COLLECTIONS"/*
do
  SERVICES+=(${service#"API_Services/"})
done

AWS_CONFIG="API_Services/Config_Microservices"
for service in "$AWS_CONFIG"/*
do
  SERVICES+=(${service#"API_Services/"})
done

PS3="Enter number of the service: "
select service in "${SERVICES[@]}"
do
  SERVICE="$service"
  clear
  echo You have choosen "$service"
  sleep 2
  clear
  break
done

getConfirmation() {
  echo "Write CONFIRM to continue with a PRODUCTION deployment"
  read confirmation
  if [[ "$confirmation" == "CONFIRM" ]]; then
    # this equals true for some reason
    return 0 
  else 
  # this equals false
    return -1
  fi
}

ENVS=("prod" "staging" "dev")
PS3="Enter number of the deployment stage: "
select env in "${ENVS[@]}"
do
  ENV="$env"
  clear
  if [[ "$ENV" == "prod" ]]; then

    echo "You have choosen $env"
    if getConfirmation; then
      echo "thank you"
      sleep 1
      break
    else
      echo "EXITING NOW... bye bye"
      sleep 2
      exit
    fi

  else  
    echo "You have choosen $env"
    sleep 1
    break
  fi
done
clear

echo "SETTING UP ENVIROMENT"
npm install
cp package.json "API_Services/$SERVICE"
cd "API_Services/$SERVICE"
clear

echo "DEPLOYMENT PROCESS BEGINS NOW"
sleep 2
clear 

echo "Installing Packages"
npm install
echo "--------- DONE ---------"
sleep 3

clear
echo "Deploying to AWS"
sls deploy --stage "$ENV"
echo "--------- DONE ---------"
sleep 3

rm *.json 
rm -rf node_modules
rm -rf .serverless

clear
echo "You have successfully deployed to $ENV in $SERVICE"

exit