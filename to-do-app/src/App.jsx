import { useState } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (task.trim() === '') return;

    setTasks([...tasks, task]);
    setTask('');
  };

  const markAsDone = (index) => {
    const updatedTasks = [...tasks];
    const [completedTask] = updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    setDoneTasks([...doneTasks, completedTask]);
  };

  const markAsUndone = (index) => {
    const updatedDone = [...doneTasks];
    const [undoneTask] = updatedDone.splice(index, 1);
    setDoneTasks(updatedDone);
    setTasks([...tasks, undoneTask]);
  };

  const deleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const deleteDoneTask = (index) => {
    const updatedDone = [...doneTasks];
    updatedDone.splice(index, 1);
    setDoneTasks(updatedDone);
  };

  const date=new Date();
  const day =date.getDate();
  const monthName=date.toLocaleDateString("en-Us",{month:"long"});

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
            <a class="navbar-brand" href="https://tododooo.netlify.app/">
              <img src="https://cdn-icons-png.flaticon.com/512/5290/5290058.png" alt="check" width="30" height="24" />
            </a>
          <a className="navbar-brand" href="https://tododooo.netlify.app/">Tododooo</a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <form className="d-flex w-100 task-form-inside mt-2" onSubmit={handleAddTask}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tasks"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />
                <button type="submit" className="btn btn-success input-group-text"><i class="fa-solid fa-plus"></i></button>
              </div>
            </form>
          </div>

          <form className="d-flex task-form-outside" onSubmit={handleAddTask}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Tasks"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
              <button type="submit" className="btn btn-success input-group-text"><i class="fa-solid fa-plus"></i></button>
            </div>
          </form>
        </div>
      </nav>

      <div className="card">
        <h1>{day} {monthName}</h1>
      </div>

      <ul className='todo-list list-group list-group-flush card m-4'>
        <li className='list-group-item'>
          <div className="fw-bold">Today's Tasks</div>
        </li>

        {
          tasks.length===0 ? <p className='mt-4'>No task! Enjoy your free day 😉</p>:(
        
        <ol className="list-group list-group-numbered">
          {tasks.map((t, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold">{t}</div>
              </div>
              <button className="btn btn-success rounded-pill" onClick={() => markAsDone(index)}><i class="fa-solid fa-check"></i></button>
              <button className="btn btn-danger rounded-pill ms-2" onClick={() => deleteTask(index)}><i class="fa-solid fa-trash"></i></button>
            </li>
          ))}
        </ol>
          )}
        <hr />
        <li className='list-group-item'>
          <div className="fw-bold">Today's Done Tasks</div>
        </li>

        {
          doneTasks.length===0 ? <p className='mt-4'>No task Completed! Keep working 😮‍💨</p>:(
        
        <ol className="list-group list-group-numbered">
          {doneTasks.map((t, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold">{t}</div>
              </div>
              <button className="btn btn-warning rounded-pill" onClick={() => markAsUndone(index)}><i class="fa-solid fa-arrow-rotate-left"></i></button>
            </li>
          ))}
        </ol>)}
      </ul>
    </>
  );
}

export default App;
