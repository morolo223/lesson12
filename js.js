let state
let limit = 127
let offset = 0
let urlStart = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`

const results = document.getElementById(`resultDiv`)

let pokemons = []
let readyPokemons


fetch(urlStart)
    .then(async function(response) {
        state = await response.json()

        state.results.forEach(pokemon => {
            let promise = new Promise(function(resolve,reject){
                fetch(pokemon.url)
                .then(async (response) => {
                    if(response.status == 200){
                        resolve(await response.json())
                    } else{
                        reject(response.statusText)
                    }
                 })
                 .catch(function(err){
                    reject(err)
                })
            })
            pokemons.push(promise)

        });
        Promise.all(pokemons).then(function(results){
            console.log(results)
            readyPokemons = results
            readyPokemons.forEach(function(pokemon) {
                drawPokemon(pokemon)
            });
        })
        console.log(state)
    })



    function drawPokemon(pokemon){
         let pokemonElement = document.createElement('div');
    pokemonElement.classList.add('pokemonCard');
    pokemonElement.innerHTML = `
        <p>id: #${pokemon.id}</p>
        <hr>
        <h1>${pokemon.name}</h1>
        <img src="${pokemon.sprites.front_default}">
        <div class="stats">
            <p class="hp">&#10084; ${pokemon.stats[0].base_stat}</p>
            <p class="attack">&#9876; ${pokemon.stats[1].base_stat}</p>
            <p class="defence">&#128737; ${pokemon.stats[2].base_stat}</p>
        </div>
        <p class="height">height: ${pokemon.height}</p>
        <p class="weight">weight: ${pokemon.weight}</p>
    `
    let typeList = document.createElement('ul');
    // populateListWithTypes(pokemon.types, typeList)
    pokemonElement.appendChild(typeList);

    results.appendChild(pokemonElement);
    }