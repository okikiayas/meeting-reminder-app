import React, { useState } from 'react';
import { Paper, Typography, Button, TextField } from '@material-ui/core';

function Action({ action, onUpdateAction }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(action.title);
  const [deadline, setDeadline] = useState(action.deadline);
  const [doItOnDate, setDoItOnDate] = useState(action.doItOnDate);

  const handleStatusChange = () => {
    const newStatus = action.status === 'completed' ? 'in-progress' : 'completed';
    onUpdateAction(action.id, { ...action, status: newStatus });
  };

  const handleSave = () => {
    onUpdateAction(action.id, { ...action, title, deadline, doItOnDate });
    setEditing(false);
  };

  const getBackgroundColor = () => {
    switch (action.status) {
      case 'not-started': return 'white';
      case 'in-progress': return 'orange';
      case 'completed': return 'green';
      default: return 'white';
    }
  };

  if (editing) {
    return (
      <Paper style={{ padding: '0.5rem', marginBottom: '0.5rem' }}>
        <TextField
          label="Action Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Do it on"
          type="date"
          value={doItOnDate}
          onChange={(e) => setDoItOnDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <Button onClick={handleSave} color="primary">Save</Button>
      </Paper>
    );
  }

  return (
    <Paper style={{ padding: '0.5rem', marginBottom: '0.5rem', backgroundColor: getBackgroundColor() }}>
      <Typography variant="subtitle1">{action.title}</Typography>
      <Typography variant="body2">Deadline: {action.deadline}</Typography>
      <Typography variant="body2">Do it on: {action.doItOnDate}</Typography>
      <Button onClick={handleStatusChange}>
        {action.status === 'completed' ? 'Mark as In Progress' : 'Mark as Complete'}
      </Button>
      <Button onClick={() => setEditing(true)}>Edit</Button>
    </Paper>
  );
}

export default Action;