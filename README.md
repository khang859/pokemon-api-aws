# Pokemon API AWS

### Usage

* Example calling pokemon endpoint

```shell
CLIENT_ID=
CLIENT_SECRET=
POKEMON_ENDPOINT=

# Get the token and parse out the access_token property
token=$(curl -X POST \
  "https://pokemon-api-auth.auth.us-east-2.amazoncognito.com/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "grant_type=client_credentials" \
  --data-urlencode "client_id=${CLIENT_ID}" \
  --data-urlencode "client_secret=${CLIENT_SECRET}" \
  --data-urlencode "scope=pokemon/read" | jq ".access_token" | tr -d '"')

# Call the pokemon endpoint with name query
curl --location "$POKEMON_ENDPOINT?name=charizard" -H "Authorization: Bearer $token" > name_param_result.json

# Give it a nice display on the terminal
jq "." name_param_result.json
```

## Deploy to your own AWS

1. Clone this repo
2. Add in the AWS creds for your aws account, for github actions, its via the Secrets settings.
  1. AWS_ACCESS_KEY_ID
  2. AWS_SECRET_ACCESS_KEY
  3. AWS_REGION
3. Push to the `main` branch, this should trigger the github action and provision your stack.
4. There is a manual step, you need to attach role to write logs to cloudwatch to your API Gate settings under the `/apigateway/main/settings/` path. (Could possibly automate with aws cli in the future)
5. Enjoy your new Pokemon API.