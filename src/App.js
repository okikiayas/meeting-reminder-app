import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@material-ui/core';
import TaskPage from './Components/TaskPage';
import TodoPage from './Components/TodoPage';
import MeetingsPage from './Components/MeetingsPage';



function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (taskId, updatedTask) => {
    setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Task and Meeting Manager
          </Typography>
          <Button color="inherit" component={Link} to="/">Tasks</Button>
          <Button color="inherit" component={Link} to="/todo">To-Do</Button>
          <Button color="inherit" component={Link} to="/meetings">Meetings</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<TaskPage tasks={tasks} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} />} />
          <Route path="/todo" element={<TodoPage tasks={tasks} onUpdateTask={handleUpdateTask} />} />
          <Route path="/meetings" element={<MeetingsPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;