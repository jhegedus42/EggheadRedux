import { createStore } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';

// this is the reducer
const counter = (state = 0, action) => {
  switch(action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

// Dumb component
const Counter = ({ value, onIncrement, onDecrement }) => {
  return (
    <div>
      <h1>{value}</h1>
      <button onClick={onIncrement}>+</button>
      <button onClick={onDecrement}>-</button>
    </div>
  );
};

const store = createStore(counter);

// Important methods:
// store.getState(); // returns the current state.
// store.dispatch({ type: 'INCREMENT' }) // dispatches an action
// store.subscribe(() => {}) // register a callback that will be called everytime a dispatch fired an action

const render = () => {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={() => store.dispatch({type: 'INCREMENT'})}
      onDecrement={() => store.dispatch({type: 'DECREMENT'})}
    />,
    document.getElementById('root')
  )
}

store.subscribe(render);
// render(); // for initial state

window.onload = () => {
  render();
}
// document.addEventListener('click', () => {
//   store.dispatch({ type: 'INCREMENT' })
// });
