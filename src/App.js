import React, {Component} from 'react';
import './App.css';

class Start extends Component {
  render(){
    const {done,total} = this.props
    return (
      <strong>
        <span>Done: {done}</span>/<span>Total: {total}</span>

      </strong>
    )
  }
}

class Todo extends Component{

  render() {
    const todo = this.props.todo;
    const todoLableStyle =  this.props.todo.done ? {
      textDecoration : 'line-through',
      color: "blue"
    }: {}

    return (
      <div>
        <input type="checkbox" onChange={this.props.onDoneChange} checked={todo.done}></input>
        <span style={todoLableStyle}>{todo.name}</span>
      </div>
    );
  } 
}

class NewTodoForm extends Component {
  state = {
    newTodoName : ''
  }

  onInputChange(newTodoName) {
    this.setState({
      newTodoName : newTodoName
    })
  }

  render() {
    const {onNewToDo} = this.props
    return (
      <div>
        <input type="text" onChange={(even)=>{
          this.onInputChange(even.target.value);
        }} value={this.state.newTodoName}></input>

        <input type="submit" onClick={()=>{
          onNewToDo({
            name:this.state.newTodoName,
            done: false
          })
          this.setState({
            newTodoName: ""
          })
         
        }}></input>

      </div>
    )
  }
}

export default class App extends Component{
  state = {
    todo: [
      

    ]
  }

componentDidMount(){
  fetch('http://todos.sphinx-demo.com/todos')
  .then(res =>res.json())
  .then(todo => this.setState({todo:todo}))
}






 addNewTodo(newTodo) {
    
    fetch('http://todos.sphinx-demo.com/todos',{
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(newTodo), // body data type must match "Content-Type" heade
    }).then(response => response.json()).then(()=>{

      fetch('http://todos.sphinx-demo.com/todos')
         .then(res =>res.json())
         .then(todo => this.setState({todo:todo}))

    })
    

    
  }












  countDone() {
    let done = 0;
    this.state.todo.forEach(todo=>{
      if (todo.done) {
        done++;
      }
    })
    return done;
  }





  clearDone(){
    const notFinishedTodo = this.state.todo.filter((todo)=>!todo.done);
    this.setState({
      todo:notFinishedTodo
    })
  }






  async handleDoneChange(todoIndex) {
    let updatedTodo = this.state.todo;
    updatedTodo[todoIndex].done = !updatedTodo[todoIndex].done;
    
    await fetch('https://todos.sphinx-demo.com/todos/' +updatedTodo[todoIndex].id, {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: updatedTodo[todoIndex].name,
            done: updatedTodo[todoIndex].done
        }),
    })

    .then(response => response.json())
    this.setState({
      todo: updatedTodo
    })
  }








  render(){
    const done = this.countDone();
    const totalTodo = this.state.todo.length;


    return (
      <div>
        <div className={'todo'}>
          <Start done={done} total={totalTodo}/>
          <button onClick={()=> this.clearDone()}>clear men</button>
        </div>
        <div className={'todo'}>
          <ul>
            {
              this.state.todo.map((todo, index)=>(<Todo onDoneChange={()=>{
                this.handleDoneChange(index);
              }} key={index} todo={todo} />))
            }
          </ul>
        </div>
        <div>
          <NewTodoForm onNewToDo={(todo)=>{
            this.addNewTodo(todo)
          }}/>
        </div>

      </div>
    )
  }
  
}
