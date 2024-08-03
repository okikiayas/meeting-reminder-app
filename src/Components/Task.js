import React from 'react';
import Action from './Action';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  task: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  actions: {
    marginTop: theme.spacing(2),
  },
}));

function Task({ task, onUpdateTask }) {
  const classes = useStyles();

  const handleActionUpdate = (actionId, updatedAction) => {
    const updatedActions = task.actions.map(action =>
      action.id === actionId ? updatedAction : action
    );
    onUpdateTask(task.id, { ...task, actions: updatedActions });
  };

  const handleAddAction = () => {
    const newAction = {
      id: Date.now().toString(),
      title: 'New Action',
      deadline: '',
      status: 'not-started'
    };
    onUpdateTask(task.id, { ...task, actions: [...task.actions, newAction] });
  };

  const allActionsCompleted = task.actions.every(action => action.status === 'completed');
  const taskStatus = allActionsCompleted ? 'completed' : 'in-progress';

  const getTaskColor = () => {
    if (task.actions.length === 0) return 'pink';
    if (allActionsCompleted) return 'green';
    return 'white';
  };

  return (
    <Paper className={classes.task} style={{ backgroundColor: getTaskColor() }}>
      <Typography variant="h6">{task.title}</Typography>
      <Typography>Status: {taskStatus}</Typography>
      <div className={classes.actions}>
        {task.actions.map(action => (
          <Action key={action.id} action={action} onUpdate={handleActionUpdate} />
        ))}
      </div>
      <Button onClick={handleAddAction} color="primary">
        Add Action
      </Button>
    </Paper>
  );
}

export default Task;