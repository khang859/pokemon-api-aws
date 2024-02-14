function buildResponseObject(pokemonDetails) {
  return {
    id: pokemonDetails.id,
    name: pokemonDetails.name,
    height: pokemonDetails.height,
    weight: pokemonDetails.weight,
    abilities: pokemonDetails.abilities,
    location_area_encounters: pokemonDetails.location_area_encounters,
  }
}

async function parsePokemonListResults (data) {
  if (!data) return [];
  if (!data.results) return [];

  let pokemonPromises = [];
  for (const pokemon of data.results) {
    pokemonPromises.push(fetch(pokemon.url));
  }

  const pokemonResults = await Promise.all(pokemonPromises);

  let locationAreaEncountersPromises = [];
  let results = new Map();
  for (const pokemon of pokemonResults) {
    const pokemonDetails = await pokemon.json();

    const responseObject = buildResponseObject(pokemonDetails)

    const locationAreaEncounterPromise = new Promise(async (resolve) => {
      try {
        const res = await fetch(pokemonDetails.location_area_encounters);
        const data = await res.json();
        resolve({
          id: pokemonDetails.id,
          location_area_encounters: data,
        });
      } catch (error) {
        resolve(null);
      }
    });

    locationAreaEncountersPromises.push(locationAreaEncounterPromise);
    results.set(pokemonDetails.id, responseObject);
  }

  const locationAreaEncountersResults = await Promise.all(locationAreaEncountersPromises);
  for (const pokemon of locationAreaEncountersResults) {
    if (pokemon) {
      results.set(pokemon.id, {
        ...results.get(pokemon.id),
        location_area_encounters: pokemon.location_area_encounters,
      });
    }
  }

  return Array.from(results.values());
}

async function parsePokemonByNameResult(pokemonDetails) {
  const responseObject = buildResponseObject(pokemonDetails);

  try {
    const locationAreaEncounterRes = await fetch(pokemonDetails.location_area_encounters);
    const locationAreaEncounterData = await locationAreaEncounterRes.json();
    responseObject.location_area_encounters = locationAreaEncounterData;
  } catch (error) {
    console.info(`Unable to fetch location area encounters for ${pokemonDetails.name}`);
  }

  return responseObject;
}

async function getPokemonByName(name) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await res.json();
    
    return {
      error: null,
      message: "Success",
      data: await parsePokemonByNameResult(data),
    };
  } catch (error) {
    return {
      error: "Error fetching data",
      message: `Failed to fetch pokemon ${name} data`,
    };
  }
}

async function getPokemonList() {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10&offset=0");
    const data = await res.json();
    
    return {
      error: null,
      message: "Success",
      data: await parsePokemonListResults(data),
    };
  } catch (error) {
    return {
      error: "Error fetching data",
      message: "Failed to fetch pokemons data",
    };
  }
}

async function handler (event) {
  
  let result;
  if (event && event.queryStringParameters && event.queryStringParameters.name) {
    result = await getPokemonByName(event.queryStringParameters.name);
  } else {
    result = await getPokemonList();
  } 
  
  return {
    statusCode: 200,
    body: JSON.stringify(result)
  }
}

exports.handler = handler;