import axios from 'axios';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: true,
    isError: false,
    data: initialData
  });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    default:
      throw new Error();
  }
};
function App() {
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState("pikachu");
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "https://pokeapi.co/api/v2/pokemon/pikachu",
    {
      abilities: [],
      name: [],
      sprites: []
    }
  );
  const {id:id, abilities:abilities, name:name, sprites:sprites} = data;

  return (
    <Fragment>
      <div className="App">
        <form
          onSubmit={event => {
            doFetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);

            event.preventDefault();
          }}
        >
          <input
            type="text"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {isError && <div>Something went wrong ...</div>}

        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <Card className="Card_Custom m-4">
            <Card.Img src={sprites.front_default} variant="top"/>
            <Card.Body className="border-top border-3 border-danger Card_Body_Custom">
              <Card.Title>{name.toUpperCase()}</Card.Title>
              <Card.Title className="fw-bold mb-1">No. ID:</Card.Title>
              <Card.Text>{id}</Card.Text>
              <Card.Title className="fw-bold mb-1">Abilities:</Card.Title>
              <ul className="list-group list-group-numbered">
                {abilities.map( (ability, i) => (
                  <li key={i} className="list-group-item mb-1">{ability.ability.name}</li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        )}
      </div>
    </Fragment>
  );
}

export default App;
