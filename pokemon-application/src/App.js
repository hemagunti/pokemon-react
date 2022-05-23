import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [limit, setlimit] = useState(10);
  const [offset, setoffset] = useState(10);

  const [load, setLoad] = useState(0);
  const [detailsPage, setDetailsPage] = useState(false);

  
  const listPokemons = async () => {
    setPokemons([]);
    setLoad(0);
    const api = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const res = await fetch(api);
    const data = await res.json();
    console.log("data", data);
    function getPokemons(result) {
      result.forEach(async (pokemon) => {
        // console.log("pokemon",pokemon);
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
        );
        const data = await res.json();
        console.log("results", data);
         setPokemons((currentList) => [...currentList, data]);
        })
    }
    getPokemons(data.results);
    //console.log("pokemons",pokemons);


  }

  

  useEffect(() => {
    listPokemons();
  }, [limit, offset]);

  return (
    <div className="App">
      <h2>Pokemon Application</h2>
      {/* Pokemon cards display */}
      <div className="container">
        <div className="row">
          {pokemons.length > 0 ? (
            pokemons.map((pokemon, index) => (
              <div className="col-md-3" key={index}>
                <div className="card" role="button">
                  <img className="card-img-top"
                    src={pokemon.sprites.other.dream_world.front_default}
                    alt={pokemon.name}/>
                  <div className="card-body">
                    <h5 className="card-title">#{pokemon.id}</h5>
                    <h5 className="card-title">{pokemon.name}</h5>
                    <h5 className="card-subtitle mb-2 text-muted"> Height: {pokemon.height}</h5>
                    <h5 className="card-subtitle mb-2 text-muted"> weight: {pokemon.weight}</h5>
                  </div>
                </div>
              </div>
            ))
          ) : load === 2 ? (
            <div className="alert alert-primary" role="alert">
              Search result not fount
            </div>
          ) : (
            <div>loading...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
