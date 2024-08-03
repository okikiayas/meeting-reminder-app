import React from 'react';
import Task from './Task';

function TaskList({ tasks, onUpdateTask }) {
  return (
    <div>
      {tasks.map(task => (
        <Task key={task.id} task={task} onUpdateTask={onUpdateTask} />
      ))}
    </div>
  );
}

export default TaskList;