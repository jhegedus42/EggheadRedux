import { createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';

// Reducer called by todos
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
    return {
      id: action.id,
      text: action.text,
      completed: false
    };
    case 'TOGGLE_TODO':
    if (action.id !== state.id) {
      return state;
    }
    return Object.assign({}, state, {
      completed: !state.completed
    });
    default:
    return state;
  }
};

// Reducer
const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
    return [
      ...state,
      todo(undefined, action)
    ];
    case 'TOGGLE_TODO':
    return state.map(t => todo(t, action));
    default:
    return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
    return action.filter;
    default:
    return state;
  }
}

// const todoApp = (state = {}, action) => {
//   return {
//     todos: todos(state.todos, action),
//     visibilityFilter: visibilityFilter(state.visibilityFilter, action)
//   }
// }

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

const store = createStore(todoApp);

const Link = ({ active, children, onClick }) => {
  if (active) {
    return <span>{children}</span>
  }
  return (
    <a href="#"
      onClick={ e => {
        e.preventDefault();
        onClick()
      }}
      >
      {children}
    </a>
  )
}

class FilterLink extends React.Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const state = store.getState();

    return (
      <Link
        active={
          props.filter === state.visibilityFilter
        }
        onClick={() =>
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          })
        }
      >{props.children}</Link>
    )
  }
}

const TodoComponent = ({ onClick, completed, text }) => (
  <li
    onClick={onClick}
    style={{
      textDecoration:
      completed ? 'line-through' : 'none'
    }}
    >
    {text}
  </li>
)

const TodoList = ({todos, onTodoClick}) => (
  <ul>
    {todos.map(todo =>
      <TodoComponent
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
        />
    )}
  </ul>
)

const AddTodo = ({onAddClick}) => {
  let input;
  return (
    <div>
      <input ref={node => {
          input = node;
        }} />
        <button onClick={() => {
            onAddClick(input.value)
            input.value = '';
          }}>
          Add Todo
        </button>
      </div>
    )
  }

  const Footer = () => (
    <p>
      Show:
      {' '}
      <FilterLink filter="SHOW_ALL">
        All
      </FilterLink>
      {' '}
      <FilterLink filter="SHOW_ACTIVE">
        Active
      </FilterLink>
      {' '}
      <FilterLink filter="SHOW_COMPLETED">
        Completed
      </FilterLink>
    </p>
  )

  const getVisibleTodos = (todos, f) => {
    switch (f) {
      case 'SHOW_ALL':
      return todos;
      case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed);
      case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed);
    }
  }

  let nextTodoId = 0;
  const TodoApp = ({todos, visibilityFilter}) => (
    <div>
      <AddTodo
        onAddClick={text =>
          store.dispatch({
            type: 'ADD_TODO',
            id: nextTodoId++,
            text
          })
        }
        />
      <TodoList
        todos={getVisibleTodos(todos, visibilityFilter)}
        onTodoClick={id =>
          store.dispatch({
            type: 'TOGGLE_TODO',
            id
          })
        }
        />
      <Footer />
    </div>
  )

  const render = () => {
    ReactDOM.render(
      <TodoApp {...store.getState()} />,
      document.getElementById('root')
    );
  };

  store.subscribe(render);
  window.onload = () => {
    render();
  }
