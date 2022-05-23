import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [limit, setlimit] = useState(10);
  const [offset, setoffset] = useState(10);
  const [load, setLoad] = useState(0);

  const listPokemons = async () => {
    setPokemons([]);
    setLoad(0);
    const api = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const res = await fetch(api);
    const data = await res.json();
    console.log("data",data);
}

  useEffect(() => {
    listPokemons();
  }, [limit, offset]);

  return <div className="App">
    <h2>Pokemon Application</h2>
  </div>;
}

export default App;
