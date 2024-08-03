import React, { useState, useMemo } from 'react';
import moment from 'moment';
import { Typography, TextField, Accordion, AccordionSummary, AccordionDetails, Button } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Task from './Task';
import TaskForm from './TaskForm';

function TaskPage({ tasks, onAddTask, onUpdateTask }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndGroupedTasks = useMemo(() => {
    const filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const now = moment();
    const endOfWeek = moment().endOf('week');
    const endOfMonth = moment().endOf('month');
    const endOfYear = moment().endOf('year');

    const grouped = {
      today: [],
      thisWeek: [],
      thisMonth: [],
      thisYear: [],
      future: []
    };

    filtered.forEach(task => {
      const taskDate = moment(task.deadline);
      if (taskDate.isSame(now, 'day')) {
        grouped.today.push(task);
      } else if (taskDate.isBefore(endOfWeek)) {
        grouped.thisWeek.push(task);
      } else if (taskDate.isBefore(endOfMonth)) {
        grouped.thisMonth.push(task);
      } else if (taskDate.isBefore(endOfYear)) {
        grouped.thisYear.push(task);
      } else {
        grouped.future.push(task);
      }
    });

    return grouped;
  }, [tasks, searchTerm]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>Tasks</Typography>
      <TextField 
        label="Search Tasks" 
        variant="outlined" 
        fullWidth 
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <TaskForm onAddTask={onAddTask} />
      {Object.entries(filteredAndGroupedTasks).map(([period, taskList]) => (
        <Accordion key={period}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{period} ({taskList.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{ width: '100%' }}>
              {taskList.map(task => (
                <Task key={task.id} task={task} onUpdateTask={onUpdateTask} />
              ))}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default TaskPage;