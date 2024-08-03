import React from 'react';
import { Paper, Typography, Button } from '@material-ui/core';
import ActionList from './ActionList';
import ActionForm from './ActionForm';

function Task({ task, onUpdateTask }) {
  const handleAddAction = (newAction) => {
    const updatedTask = {
      ...task,
      actions: [...task.actions, newAction]
    };
    onUpdateTask(task.id, updatedTask);
  };

  const handleUpdateAction = (actionId, updatedAction) => {
    const updatedActions = task.actions.map(action =>
      action.id === actionId ? updatedAction : action
    );
    onUpdateTask(task.id, { ...task, actions: updatedActions });
  };

  const allActionsCompleted = task.actions.every(action => action.status === 'completed');
  const taskStatus = allActionsCompleted ? 'completed' : 'in-progress';

  const getTaskColor = () => {
    if (task.actions.length === 0) return 'pink';
    if (allActionsCompleted) return 'green';
    return 'white';
  };

  return (
    <Paper style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: getTaskColor() }}>
      <Typography variant="h6">{task.title}</Typography>
      <Typography>Status: {taskStatus}</Typography>
      <ActionList actions={task.actions} onUpdateAction={handleUpdateAction} />
      <ActionForm onAddAction={handleAddAction} />
    </Paper>
  );
}

export default Task;