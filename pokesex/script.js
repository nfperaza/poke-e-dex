const getPokemonUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`;
 
const generatePokemonPromises = (limit = 151 ) =>
  Array.from({ length: limit }, (_, index) => {
    const url = getPokemonUrl(index + 1);
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error fetching Pokémon: ${response.status}`);
        }
        return response.json();
      });
  });
 
const generateHTML = pokemons => {
  return pokemons.reduce((accumulator, { name, id, types }) => {
    const elementTypes = types.map(typeInfo => typeInfo.type.name);
    const cardClass = elementTypes.length > 1 ? 'double-type ' : '';
 
    accumulator += `
      <li class="card ${cardClass}${elementTypes[0]}">
        <img class="card-image" alt="${name}" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png">
        <h2 class="card-title">${id}. ${name}</h2>
        <p class="card-subtitle">${elementTypes.join(" | ")}</p>
      </li>
    `;
    return accumulator;
  }, "");
};
 
const insertPokemonsIntoPage = pokemons => {
  const ul = document.querySelector('[data-js="pokedex"]');
  ul.innerHTML = pokemons;
};
 
const showLoadingIndicator = () => {
  const ul = document.querySelector('[data-js="pokedex"]');
  ul.innerHTML = '<li>Loading...</li>';
};
 
showLoadingIndicator();
 
Promise.all(generatePokemonPromises())
  .then(generateHTML)
  .then(insertPokemonsIntoPage)
  .catch(error => {
    console.error('Error loading Pokémon:', error);
    insertPokemonsIntoPage(`<li>Error loading Pokémon: ${error.message}</li>`);
  });