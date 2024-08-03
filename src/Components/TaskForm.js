import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && deadline) {
      onAddTask({
        id: Date.now().toString(),
        title,
        deadline,
        status: 'in-progress',
        actions: []
      });
      setTitle('');
      setDeadline('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="Deadline"
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Add Task
      </Button>
    </form>
  );
}

export default TaskForm;