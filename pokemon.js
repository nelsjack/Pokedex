const pokeContainer = document.getElementById('poke_container');

const searchBar = document.getElementById('searchbar')

const searchButton = document.getElementById('searchbutton');
searchButton.addEventListener("click", handleSearch);

function createPokemonEl(pokemon) {
    // pkmn name
    const pokemonName = pokemon.name;
    const name = document.createElement("p");
    name.innerHTML = capitalizeFirstLetter(pokemonName);

    // pkmn type
    const pokemonType = pokemon.type;

    const type = document.createElement("p");
    type.innerHTML = capitalizeFirstLetter(pokemonType);
    
    // name and type container
    const nameTypeContainer = document.createElement("div");
    nameTypeContainer.append(name, type);

    // sprite
    const sprite = document.createElement('img');
    sprite.classList.add('sprite');
    sprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
    
    //view button
    const viewButton = document.createElement('button')
    viewButton.setAttribute('id', 'viewbutton')
    viewButton.innerHTML = 'View';
    viewButton.addEventListener("click", handleView)

    // pokemon element
    const pokemonEl = document.createElement('div');
    pokemonEl.setAttribute('id', pokemon.id);
    pokemonEl.setAttribute('class', "pokemon")
    pokemonEl.appendChild(nameTypeContainer);
    pokemonEl.appendChild(sprite);
    pokemonEl.appendChild(viewButton);

    // pokemon container
    pokeContainer.appendChild(pokemonEl);
}

function capitalizeFirstLetter(string) {
    if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

async function handleSearch() {
    const input = searchBar.value;
    pokeContainer.innerHTML = '';

    const getPokemonArray = await fetchPokemon(input);
    const getTypeArray = await fetchType(input);

    if (Array.isArray(getPokemonArray) && Array.isArray(getTypeArray)) {
        // no pokemon found
        pokeContainer.innerHTML = 'No Pokemon Found'
    } else {
    const normPokemonArray = normalizePokeResponse(getPokemonArray);
    const pokemonArray = normPokemonArray.concat(getTypeArray);
    pokemonArray.forEach(pokemon => {
        createPokemonEl(pokemon);
        })
    }
}

async function fetchPokemon(input) {
    const url = `https://pokeapi.co/api/v2/pokemon/${input}`;
    try {
        const result = await fetch(url);
        const response = await result.json();
        return response;
    } catch (error) {
        return []
    }
}

async function fetchType(input) {
    if (isNumeric(input)) {
        return [];
    }    
    const url = `https://pokeapi.co/api/v2/type/${input}`;
    try {
        const result = await fetch(url);
        const response = await result.json();
        const pokeArray = normalizeTypeResponse(response.pokemon, input);
        return pokeArray;
    } catch (error) {
        return [];
    }
}

function normalizeTypeResponse(response, type) {
    const pokemonArray = response.map(pokemon => {
        const name = pokemon.pokemon.name;
        const id = pokemon.pokemon.url.split('/')[6];
        return {
            name,
            type,
            id
        }
    });
        return pokemonArray;
}

function normalizePokeResponse(response) {
    if (Array.isArray(response)) {
        return [];
    } else {
        const name = response.name;
        const id = response.id.toString();
        const type = normalizeTypeArray(response.types)
        const pokemonArray = {
            name,
            type,
            id
        }
        return [pokemonArray];
    }
}  

function normalizeTypeArray(array) {
    return array.map(type => {
        return capitalizeFirstLetter(type.type.name);
    }).join('/');
}

function isNumeric(num) {
    return !isNaN(num);
}

async function handleView() {
    const pokeCard = document.createElement('div');
    pokeCard.classList.add('pokemoncard');
    pokeContainer.innerHTML = '';
    pokeContainer.appendChild(pokeCard);
    
    const pokeId = this.parentNode.id;
    const pokeInfo = await fetchPokemon(pokeId);
    console.log(pokeInfo);
}
