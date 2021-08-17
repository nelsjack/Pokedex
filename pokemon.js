const pokeContainer = document.getElementById('poke_container');

const fetchPokemon = async () => {
    for (let i = 1; i <=150; i++) {
        await getPokemon(i);
    }
}

const getPokemon = async id => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const result = await fetch(url);
    const pokemon = await result.json();
    createPokemonEl(pokemon)
}

fetchPokemon();

function createPokemonEl(pokemon) {
    pokeSprite(pokemon);
    pokeName(pokemon);
    
}

function pokeName (pokemon) {
    const pokemonEl = document.createElement('div');
    pokemonEl.classList.add('pokemon');
    const pokemonName = pokemon.name;
    pokemonEl.innerHTML = capitalizeFirstLetter(pokemonName);
    pokeContainer.appendChild(pokemonEl);
}

function pokeSprite(pokemon) {
    const sprite = document.createElement('img');
    sprite.classList.add('sprite');
    sprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
    pokeContainer.appendChild(sprite);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
