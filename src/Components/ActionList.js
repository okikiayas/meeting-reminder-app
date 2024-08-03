import React from 'react';
import Action from './Action';

function ActionList({ actions, onUpdateAction }) {
  return (
    <div>
      {actions.map(action => (
        <Action 
          key={action.id} 
          action={action} 
          onUpdateAction={(actionId, updatedAction) => onUpdateAction(action.taskId, actionId, updatedAction)} 
        />
      ))}
    </div>
  );
}

export default ActionList;