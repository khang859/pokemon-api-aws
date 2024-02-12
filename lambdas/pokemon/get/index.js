async function getPokemonList() {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10&offset=0");
    const data = await res.json();
    return {
      error: null,
      message: "Success",
      data,
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