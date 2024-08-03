import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, TextField, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  action: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

function Action({ action, onUpdate }) {
  const classes = useStyles();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(action.title);
  const [deadline, setDeadline] = useState(action.deadline);

  const handleStatusChange = () => {
    const newStatus = action.status === 'completed' ? 'in-progress' : 'completed';
    onUpdate(action.id, { ...action, status: newStatus });
  };

  const handleSave = () => {
    onUpdate(action.id, { ...action, title, deadline });
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
      <Paper className={classes.action}>
        <form className={classes.form}>
          <TextField
            label="Action Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </form>
      </Paper>
    );
  }

  return (
    <Paper className={classes.action} style={{ backgroundColor: getBackgroundColor() }}>
      <Typography variant="subtitle1">{action.title}</Typography>
      <Typography variant="body2">Deadline: {action.deadline}</Typography>
      <Button onClick={handleStatusChange}>
        {action.status === 'completed' ? 'Mark as In Progress' : 'Mark as Complete'}
      </Button>
      <Button onClick={() => setEditing(true)}>Edit</Button>
    </Paper>
  );
}

export default Action;