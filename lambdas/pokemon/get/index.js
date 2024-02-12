async function getPokemonList() {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10&offset=0");
    const data = await res.json();
    return data;
  } catch (error) {
    return [];
  }
}

export async function handler () {
  const pokemons = await getPokemonList();
  
  return {
    statusCode: 200,
    body: JSON.stringify(pokemons)
  }
}