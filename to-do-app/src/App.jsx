import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Login from './login.jsx';
import Signup from './signup.jsx';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const tasksRef = collection(db, 'tasks');
        const q1 = query(tasksRef, where('uid', '==', currentUser.uid), where('done', '==', false));
        const q2 = query(tasksRef, where('uid', '==', currentUser.uid), where('done', '==', true));

        onSnapshot(q1, (snapshot) => {
          const taskList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setTasks(taskList);
        });

        onSnapshot(q2, (snapshot) => {
          const doneList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setDoneTasks(doneList);
        });
      } else {
        setTasks([]);
        setDoneTasks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (task.trim() === '' || !user) return;

    await addDoc(collection(db, 'tasks'), {
      uid: user.uid,
      text: task,
      done: false,
      createdAt: new Date()
    });
    setTask('');
  };

  const markAsDone = async (taskId) => {
    await updateDoc(doc(db, 'tasks', taskId), { done: true });
  };

  const markAsUndone = async (taskId) => {
    await updateDoc(doc(db, 'tasks', taskId), { done: false });
  };

  const deleteTask = async (taskId) => {
    await deleteDoc(doc(db, 'tasks', taskId));
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
            <img src="https://cdn-icons-png.flaticon.com/512/5290/5290058.png" alt="check" width="30" height="24" />
            <span className="fw-bold">Tododooo</span>
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <div className="ms-auto d-flex align-items-center flex-wrap gap-2">
              {user ? (
                <>
                  <form className="d-flex" onSubmit={handleAddTask}>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Tasks"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                      />
                      <button type="submit" className="btn btn-success input-group-text">Add</button>
                    </div>
                  </form>
                  <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-info">Login</Link>
                  <Link to="/signup" className="btn btn-info">Signup</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path='/' element={
          <>
            {user ? (
              <ul className='todo-list list-group list-group-flush card m-4'>
                <li className='list-group-item'>
                  <div className="fw-bold">Today's Tasks</div>
                </li>
                <ol className="list-group list-group-numbered">
                  {tasks.map((t) => (
                    <li key={t.id} className="list-group-item d-flex justify-content-between align-items-start">
                      <div className="ms-2 me-auto">
                        <div className="fw-bold">{t.text}</div>
                      </div>
                      <button className="btn btn-success rounded-pill" onClick={() => markAsDone(t.id)}>Done</button>
                      <button className="btn btn-danger rounded-pill ms-2" onClick={() => deleteTask(t.id)}>Delete</button>
                    </li>
                  ))}
                </ol>
                <hr />
                <li className='list-group-item'>
                  <div className="fw-bold">Today's Done Tasks</div>
                </li>
                <ol className="list-group list-group-numbered">
                  {doneTasks.map((t) => (
                    <li key={t.id} className="list-group-item d-flex justify-content-between align-items-start">
                      <div className="ms-2 me-auto">
                        <div className="fw-bold">{t.text}</div>
                      </div>
                      <button className="btn btn-warning rounded-pill" onClick={() => markAsUndone(t.id)}>Undone</button>
                      <button className="btn btn-danger rounded-pill ms-2" onClick={() => deleteTask(t.id)}>Delete</button>
                    </li>
                  ))}
                </ol>
              </ul>
            ) : (
              <div className="container my-5 card">
                <h2>About Tododooo</h2>
                <p className='card-body'>
                  Tododooo is a simple and efficient task management app designed to help you organize your daily tasks effortlessly.
                  Create, mark tasks done, and keep track of your productivity.
                </p>
                <h3>How to Use This ToDo App</h3>
                <ul className='list-group list-group-flush'>
                  <li className="list-group-item">Sign up for a new account or login if you already have one.</li>
                  <li className="list-group-item">Add your tasks using the input box in the navbar after logging in.</li>
                  <li className="list-group-item">Mark tasks as done or delete them when completed.</li>
                  <li className="list-group-item">Track your completed tasks separately.</li>
                </ul>
              </div>
            )}
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
