import React, { useMemo } from 'react';
import moment from 'moment';
import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ActionList from './ActionList';

function TodoPage({ tasks, onUpdateTask }) {
  const groupedActions = useMemo(() => {
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

    tasks.forEach(task => {
      task.actions.forEach(action => {
        const doItOnDate = moment(action.doItOnDate);
        if (doItOnDate.isSame(now, 'day')) {
          grouped.today.push({ ...action, taskId: task.id, taskTitle: task.title });
        } else if (doItOnDate.isBefore(endOfWeek)) {
          grouped.thisWeek.push({ ...action, taskId: task.id, taskTitle: task.title });
        } else if (doItOnDate.isBefore(endOfMonth)) {
          grouped.thisMonth.push({ ...action, taskId: task.id, taskTitle: task.title });
        } else if (doItOnDate.isBefore(endOfYear)) {
          grouped.thisYear.push({ ...action, taskId: task.id, taskTitle: task.title });
        } else {
          grouped.future.push({ ...action, taskId: task.id, taskTitle: task.title });
        }
      });
    });

    return grouped;
  }, [tasks]);

  const handleUpdateAction = (taskId, actionId, updatedAction) => {
    onUpdateTask(taskId, {
      ...tasks.find(task => task.id === taskId),
      actions: tasks.find(task => task.id === taskId).actions.map(action =>
        action.id === actionId ? updatedAction : action
      )
    });
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>To-Do List</Typography>
      {Object.entries(groupedActions).map(([period, actions]) => (
        <Accordion key={period}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{period} ({actions.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ActionList actions={actions} onUpdateAction={handleUpdateAction} />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default TodoPage;