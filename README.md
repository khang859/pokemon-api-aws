# Pokemon API AWS

### Usage

* Obtain token with following command, don't forget to add in CLIENT_ID and CLIENT_SECRET

```shell

CLIENT_ID=
CLIENT_SECRET=

curl -X POST \
  "https://pokemon-api-auth.auth.us-east-2.amazoncognito.com/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "grant_type=client_credentials" \
  --data-urlencode "client_id=${CLIENT_ID}" \
  --data-urlencode "client_secret=${CLIENT_SECRET}" \
  --data-urlencode "scope=pokemon/read"
```

* Example calling endpoint

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
  --data-urlencode "scope=pokemon/read" | jq ".access_token")

# Call the pokemon endpoint
curl $POKEMON_ENDPOINT -H "Authorization: $token"
```