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
    pokeName(pokemon);
    pokeSprite(pokemon);
}

function pokeName (pokemon) {
    const pokemonEl = document.createElement('div');
    pokemonEl.classList.add('pokemon');
    pokemonEl.innerHTML = `${pokemon.name}`
    pokeContainer.appendChild(pokemonEl);
}

function pokeSprite(pokemon) {
    const sprite = document.createElement('img');
    sprite.classList.add('sprite');
    sprite.src = `https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png`;
    pokeContainer.appendChild(sprite);
}



