import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(10);
  const [value, setValue] = useState();
  const [load, setLoad] = useState(0);
  const [detailsPage, setDetailsPage] = useState(false);
  const [pagination, setpagination] = useState([1, 2, 3]);

  
  const listPokemons = async () => {
    setPokemons([]);
    setLoad(0);
    const api = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const res = await fetch(api);
    const data = await res.json();
    //console.log("data", data);
    function getPokemons(result) {
      result.forEach(async (pokemon) => {
        // console.log("pokemon",pokemon);
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
        );
        const data = await res.json();
        //console.log("results", data);
         setPokemons((currentList) => [...currentList, data]);
        })
    }
    getPokemons(data.results);
    //console.log("pokemons",pokemons);
  }
  const next = (num) => {
    const setPage = num * limit - limit;
    setOffset(setPage);
  };
  //Next page
  const nextPage = (page) => {
    const setPage = page + limit;
    //console.log(setPage + ">" + pagination[pagination.length - 1] * limit);
    if (setPage >= pagination[pagination.length - 1] * limit) {
      const pageNumbers = [];
      pagination.forEach((item, index) => {
        pageNumbers.push(item + pagination.length);
      });
      setpagination(pageNumbers);
    }
    setOffset(setPage);
  };

  //Previous page
  const prevPage = (page) => {
    const setPage = page - limit;
   // console.log(page + "<" + pagination[0] * limit);
    if (page < pagination[0] * limit) {
      const pageNumbers = [];
      pagination.forEach((item, index) => {
        pageNumbers.push(item - pagination.length);
      });
      setpagination(pageNumbers);
    }
    setOffset(setPage);
  };


// search pokemon
  const searchPokemon = async (e) => {
   // console.log("target value",e.target.value);
    setValue(e.target.value);
    if (e.charCode === 13) {
      try {
        if (e.target.value.trim() === "") {
          listPokemons();
        } else {
          const res = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${e.target.value.toLowerCase()}`
          );
          const data = await res.json();
         // console.log("sdds", data);
          setPokemons([data]);
        }
      } catch (e) {
        //console.log("err", e);
        setPokemons([]);
        setLoad(2);
      }
    }
  };

  const pokemonDetails = (data) => {
    setDetailsPage(data);
  };

  const backaToPage = (data) => {
    setDetailsPage(false);
  };

  useEffect(() => {
    listPokemons();
  }, [limit, offset]);

  return (
    <div className="App">
      <h2>Pokemon Application</h2>
      {/* Pokemon details page */}
      {detailsPage ? (
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                {" "}
                #{detailsPage.id} {detailsPage.name}
              </h5>
              <button
                class="btn btn-outline-success my-2 my-sm-0"
                onClick={backaToPage}
              >
                Back
              </button>
            </div>
            <div className="modal-body">
              <img
                src={detailsPage.sprites.other.dream_world.front_default}
                className="img-fluid"
                alt="..."
              />
              <ol className="list-group list-group-numbered">
                <li className="list-group-item d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto text-start">
                    <div className="fw-bold">Height</div>
                    {detailsPage.height}
                  </div>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto text-start">
                    <div className="fw-bold">Weight</div>
                    {detailsPage.weight}
                  </div>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto text-start">
                    <div className="fw-bold">Abilities</div>
                    {detailsPage.abilities.map((val, key) => (
                      <div key={key}>- {val.ability.name}</div>
                    ))}
                  </div>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto text-start">
                    <div className="fw-bold">Moves</div>
                    {detailsPage.moves.map((val, key) => (
                      <div key={key}>- {val.move.name}</div>
                    ))}
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* search pokemon by name */}
          <div className="container">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by Name"
                aria-label="Search"
                aria-describedby="basic-addon1"
                onKeyPress={(e) => searchPokemon(e)}
              />
            </div>
            </div>
            {/*  */}
           <div className="container d-flex justify-content-end"> 
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li
                  className={offset === 0 ? `page-item disabled` : `page-item`}
                >
                  <a
                    className="page-link"
                    tabindex="-1"
                    aria-disabled="true"
                    href="#"
                    onClick={() => prevPage(offset)}
                  >
                    Previous
                  </a>
                </li>
                {pagination.map((val, key) => (
                  <li
                    className={
                      offset == val * limit - limit
                        ? `page-item active`
                        : `page-item`
                    }
                  >
                    <a className="page-link" href="#" onClick={() => next(val)}>
                      {val}
                    </a>
                  </li>
                ))}

                <li className="page-item">
                  <a
                    className="page-link"
                    href="#"
                    onClick={() => nextPage(offset)}
                  >
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          {/* Pokemon cards display */}
          <div className="container">
            <div className="row">
              {pokemons.length > 0 ? (
                pokemons.map((pokemon, index) => (
                  <div className="col-md-3" key={index}>
                    <div
                      className="card"
                      onClick={() => pokemonDetails(pokemon)}
                      role="button"
                    >
                      <img
                        className="card-img-top"
                        src={pokemon.sprites.other.dream_world.front_default}
                        alt={pokemon.name}
                      />
                      <div className="card-body">
                        <h5 className="card-title">#{pokemon.id}</h5>
                        <h5 className="card-title">{pokemon.name}</h5>
                        <h5 className="card-subtitle mb-2 text-muted">
                          {" "}
                          Height: {pokemon.height}
                        </h5>
                        <h5 className="card-subtitle mb-2 text-muted">
                          {" "}
                          weight: {pokemon.weight}
                        </h5>
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
          {/* footer pagination */}
          <div className="container">
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li
                  className={offset === 0 ? `page-item disabled` : `page-item`}
                >
                  <a
                    className="page-link"
                    tabindex="-1"
                    aria-disabled="true"
                    href="#"
                    onClick={() => prevPage(offset)}
                  >
                    Previous
                  </a>
                </li>
                {pagination.map((val, key) => (
                  <li
                    className={
                      offset == val * limit - limit
                        ? `page-item active`
                        : `page-item`
                    }
                  >
                    <a className="page-link" href="#" onClick={() => next(val)}>
                      {val}
                    </a>
                  </li>
                ))}

                <li className="page-item">
                  <a
                    className="page-link"
                    href="#"
                    onClick={() => nextPage(offset)}
                  >
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
