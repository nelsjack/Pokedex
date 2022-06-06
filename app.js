const pokeContainer = document.getElementById('poke_container');
const searchBar = document.getElementById('searchbar')
const searchButton = document.getElementById('searchbutton');
const body = document.querySelector('body');

async function handleSearch() {
  const input = searchBar.value.toLowerCase();
  pokeContainer.innerHTML = '';
  if (input !== '') {
    const getPokemonArray = await fetchPokemon(input);
    const getTypeArray = await fetchType(input);
    if (getPokemonArray.length === 0 && getTypeArray.length === 0) {
    // no pokemon found
      pokeContainer.innerHTML = 'No Pokemon Found'
    } else {
      const normPokemonArray = normalizePokeResponse(getPokemonArray);
      const pokemonArray = normPokemonArray.concat(getTypeArray);
      pokemonArray.forEach(pokemon => {
        createPokemonEl(pokemon);
      });
    }
  }
}

function createSprite(pokemon) {
  const sprite = document.createElement('img');
  sprite.classList.add('sprite');
  sprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  return sprite;
}

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

  // view button
  const viewButton = document.createElement('button')
  viewButton.setAttribute('id', 'viewbutton')
  viewButton.innerHTML = 'Info';
  viewButton.addEventListener("click", handleView)

  // pokemon element
  const pokemonEl = document.createElement('div');
  pokemonEl.setAttribute('id', pokemon.id);
  pokemonEl.setAttribute('class', 'pokemon');
  pokemonEl.appendChild(nameTypeContainer);
  pokemonEl.appendChild(createSprite(pokemon));
  pokemonEl.appendChild(viewButton);

  // append to pokemon container
  pokeContainer.appendChild(pokemonEl);
}

function capitalizeFirstLetter(string) {
    if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }


async function fetchPokemon(input) {
    const url = `https://pokeapi.co/api/v2/pokemon/${input}`;
    try {
        const result = await fetch(url);
        const response = await result.json();
        return response;
    } catch (error) {
        return [];
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

function createBackButton() {
  const backButton = document.createElement('button')
  backButton.setAttribute('id', 'backbutton')
  backButton.innerHTML = 'Back to Results';
  pokeContainer.appendChild(backButton);
  backButton.addEventListener("click", handleBackButton)
}

function handleBackButton() {
  const pokemonCard = document.querySelector('.pokemoncard')
  document.getElementById('backbutton').remove();
  pokemonCard.remove();
  handlePokemonElementsDisplay();
}

function handlePokemonElementsDisplay() {
  // for each setting each pokemon element to display: none
  const pokemonElements = pokeContainer.getElementsByClassName('pokemon');
  const pokemonElementsArray = Array.prototype.map.call(pokemonElements, function(element) {
    return element;
  })
    pokemonElementsArray.forEach(pokemon => {
      if (pokemon.style.display !== 'none') {
        pokemon.style.display = 'none';
      } else {
        pokemon.style.display = 'flex'
      }
    });
}

async function handleView() {
  const pokeId = this.parentNode.id;
  const results = await fetchPokemon(pokeId);
  handlePokemonElementsDisplay();
  //create div
  const pokeCard = document.createElement('div');
  pokeCard.classList.add('pokemoncard');
  // pokeContainer.innerHTML = '';
  pokeContainer.appendChild(pokeCard);
  //create pokemon image
  const cardSprite = pokeCard.appendChild(createSprite(results));
  cardSprite.classList.add('cardsprite');
  //create description
  const description = document.createElement('div');
  description.classList.add('description');
  pokeCard.appendChild(description);
  // const hp, attack, sp atk, def, ... document.createElement('li') 
  const name = document.createElement('p')
  name.innerHTML = `${capitalizeFirstLetter(results.name)}`
  description.append(name);
  results.stats.forEach(stat => {
    const stats = document.createElement('p')
    description.append(stats)
    stats.innerHTML = `${capitalizeFirstLetter(stat.stat.name)}: ${stat.base_stat}` 
    });
  createBackButton();
}

// enter key functionality
function handleEnter(event) {
  if (event.code === 'Enter' || event.code === 'NumpadEnter') {
    handleSearch();
  }
}

searchButton.addEventListener('click', handleSearch);
body.addEventListener('keyup', handleEnter);
