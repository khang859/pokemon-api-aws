async function parsePokemonListResults (data) {
  if (!data) return [];
  if (!data.results) return [];

  let pokemonPromises = [];
  for (const pokemon of data.results) {
    pokemonPromises.push(fetch(pokemon.url));
  }

  const pokemonResults = await Promise.all(pokemonPromises);

  let results = new Map();
  for (const pokemon of pokemonResults) {
    const pokemonDetails = await pokemon.json();

    const responseObject = {
      id: pokemonDetails.id,
      name: pokemonDetails.name,
      height: pokemonDetails.height,
      weight: pokemonDetails.weight,
      abilities: pokemonDetails.abilities,
      location_area_encounters: pokemonDetails.location_area_encounters,
    }

    results.set(pokemonDetails.id, responseObject);
  }

  return results;
}

async function getPokemonList() {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10&offset=0");
    const data = await res.json();
    
    return {
      error: null,
      message: "Success",
      data: [],
    };
  } catch (error) {
    return {
      error: "Error fetching data",
      message: "Failed to fetch pokemon data",
      data,
    };
  }
}

async function handler () {
  const pokemons = await getPokemonList();
  return {
    statusCode: 200,
    body: JSON.stringify(pokemons)
  }
}

exports.handler = handler;