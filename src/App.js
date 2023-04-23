import { useEffect, useState } from 'react';
import './App.css';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IkliYWRUb2ZmIiwicGFzc3dvcmQiOiIxMjM0NTYiLCJpYXQiOjE2ODIwMjY1NzV9.ZTNdv_oZFTgOPJyENgE7Din4RXXuIP4bbLGDkbjp6bk'

function App() {

  const [state, setState] = useState('');
  const [todoDb, setTodoDb] = useState([]);
  const [updateId, setUpdateId] = useState('');
  const [updatedTodo, setUpdatedTodo] = useState('');

  useEffect(() => {
    async function getTodos() {
      try {

        fetch('http://localhost:5000/api/mongoose/todo',
          { headers: { Authorization: `Bearer ${token}`, } }
        ).then(res => res.json())
          .then(todos => setTodoDb(todos))

      } catch(error) {
        console.log(error);
      }
    }
    getTodos()
  }, []);


  function addTodo(e) {
    e.preventDefault();
    try {

      fetch('http://localhost:5000/api/mongoose/todo/addTodo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({title : state})
      }).then(data => data.json())
        .then(todo => setTodoDb(prev => [todo, ...prev]));

    } catch (error) {
      console.log(error);
    }
    setState('')
  }

  function deleteTodo(id) {
    try {

      fetch(`http://localhost:5000/api/mongoose/todo/deleteTodo/${id}`, {
        method: 'DELETE'
      })
      const newTodos = todoDb.filter(i => i._id !== id);
      setTodoDb(newTodos);

    } catch (error) {
      console.log(error);
    }
  }

  async function updateTodoInNewForm(e) {
    e.preventDefault();
    try {

      fetch(`http://localhost:5000/api/mongoose/todo/updateTodo/${updateId}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ title: updatedTodo })
      })
      .then(response => response.json())
        .then(data => {
          const newTodos = [...todoDb];
          const index = newTodos.findIndex(i => i._id === updateId);
          newTodos[index].title = updatedTodo;
          setTodoDb(newTodos)
        })
      setUpdatedTodo('');
      setUpdateId('');

    } catch (error) {
      console.log(error);
    }
  }

  async function changeCompleted(id) {
    try {

      const boolCompleted = !todoDb.find(i => i._id === id).isCompleted;
      fetch(`http://localhost:5000/api/mongoose/todo/changeCompleted/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ isCompleted: boolCompleted })
      }).then(response => response.json())
        .then(data => {
          const newTodos = todoDb.map(i => i._id === id ? data : i);
          setTodoDb(newTodos);
        })

    } catch (error) {
      console.log(error);
    }
  }

  function renderUpdateForm() {
    return (
      <form className="update-form" onSubmit={e => updateTodoInNewForm(e)}>
        <input className="update-new-input" placeholder='input new todo' value={updatedTodo} onChange={e => setUpdatedTodo(e.target.value)}/>
        <button className="update-new-btn" type='submit'>Send</button>
      </form>
    )
  }

  return (
    <div className="App">

      <h1>Todo List</h1>

      <form className="form" onSubmit={e => addTodo(e)}>

        <input type="text" placeholder='input todo' onChange={e => setState(e.target.value)} value={state}/>
        <button type='submit'>Enter</button>

      </form>

      <div className="todo-listItems">

        {todoDb.length > 0 

          ? todoDb.map(i => (

            <div className="todo-item">

              {
                updateId === i._id ?

                  renderUpdateForm() :

                  < >

                    <p className="item-content" style={{textDecoration: i.isCompleted ? 'line-through' : 'none'}} onClick={() => changeCompleted(i._id)}>{i.title} -- {i.date} -- {i.time}</p>
                    <button className="update-item" onClick={() => setUpdateId(i._id)}>update</button>
                    <button className="delete-item" onClick={() => deleteTodo(i._id)}>delete</button>

                  </>

              }

            </div>

          )) 

          : 'Empty todo'

        }

      </div>

    </div>
  );
}

export default App;
