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