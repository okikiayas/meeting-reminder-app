import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { getIpcRenderer } from './electron-wrapper';
import TaskList from './Components/TaskList';
import TaskForm from './Components/TaskForm';

const ipcRenderer = getIpcRenderer();

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  listItem: {
    marginBottom: theme.spacing(1),
  },
  meetingGroup: {
    marginBottom: theme.spacing(3),
  },
}));

function App() {
  const classes = useStyles();
  const [meetings, setMeetings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');

  useEffect(() => {
    const storedMeetings = localStorage.getItem('meetings');
    const storedTasks = localStorage.getItem('tasks');
    if (!ipcRenderer && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    
    if (storedMeetings) {
      setMeetings(JSON.parse(storedMeetings));
    }
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }

    if (ipcRenderer) {
      ipcRenderer.on('show-meeting-alert', (event, { title }) => {
        setAlertTitle(title);
        setAlertOpen(true);
        playAlertSound();
      });
    }

    return () => {
      if (ipcRenderer) {
        ipcRenderer.removeAllListeners('show-meeting-alert');
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('meetings', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const checkNotifications = () => {
      const now = moment();
      tasks.forEach(task => {
        task.actions.forEach(action => {
          const deadlineDate = moment(action.deadline);
          const diff = deadlineDate.diff(now, 'days');
          
          if (diff === 30 || diff === 14 || diff === 7 || diff === 3 || diff === 1 || diff === 0 || 
              diff === -1 || diff === -3 || diff === -7) {
            showNotification(task.title, action.title, diff);
          }
        });
      });
    };

    const intervalId = setInterval(checkNotifications, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [tasks]);

  const showNotification = (taskTitle, actionTitle, daysUntilDue) => {
    let message;
    if (daysUntilDue > 0) {
      message = `Action "${actionTitle}" for task "${taskTitle}" is due in ${daysUntilDue} day(s)`;
    } else if (daysUntilDue === 0) {
      message = `Action "${actionTitle}" for task "${taskTitle}" is due today`;
    } else {
      message = `Action "${actionTitle}" for task "${taskTitle}" is overdue by ${-daysUntilDue} day(s)`;
    }

    if (ipcRenderer) {
      ipcRenderer.send('show-notification', { title: 'Task Reminder', body: message });
    } else if (Notification.permission === "granted") {
      new Notification('Task Reminder', { body: message });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && dateTime) {
      const newMeeting = { id: Date.now(), title, dateTime };
      setMeetings([...meetings, newMeeting]);
      if (ipcRenderer) {
        ipcRenderer.send('schedule-notification', newMeeting);
      } else {
        // Browser environment
        const currentTime = new Date().getTime();
        const notificationTime = new Date(dateTime).getTime();
        const delay = notificationTime - currentTime;
  
        if (delay > 0) {
          setTimeout(() => {
            if (Notification.permission === "granted") {
              new Notification(`Meeting Reminder: ${title}`, {
                body: `You have a "${title}" meeting now!`,
              });
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                  new Notification(`Meeting Reminder: ${title}`, {
                    body: `You have a "${title}" meeting now!`,
                  });
                }
              });
            }
            setAlertTitle(title);
            setAlertOpen(true);
            playAlertSound();
          }, delay);
        }
      }
      setTitle('');
      setDateTime('');
    }
  };

  const playAlertSound = () => {
    if (ipcRenderer) {
      // In Electron environment
      ipcRenderer.send('play-sound');
    } else {
      // In browser environment
      const audio = new Audio(`${process.env.PUBLIC_URL}/alert-sound.mp3`);
      audio.play().catch(error => console.error('Error playing sound:', error));
    }
  };

  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (taskId, updatedTask) => {
    setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
  };

  const groupTasksAndMeetings = useMemo(() => {
    const now = moment();
    const grouped = {
      today: { meetings: [], tasks: [] },
      thisWeek: { meetings: [], tasks: [] },
      thisMonth: { meetings: [], tasks: [] },
      thisYear: { meetings: [], tasks: [] },
      future: { meetings: [], tasks: [] }
    };

    meetings.forEach(meeting => {
      const meetingDate = moment(meeting.dateTime);
      if (meetingDate.isSame(now, 'day')) {
        grouped.today.meetings.push(meeting);
      } else if (meetingDate.isBetween(now.clone().startOf('week'), now.clone().endOf('week'))) {
        grouped.thisWeek.meetings.push(meeting);
      } else if (meetingDate.isSame(now, 'month')) {
        grouped.thisMonth.meetings.push(meeting);
      } else if (meetingDate.isSame(now, 'year')) {
        grouped.thisYear.meetings.push(meeting);
      } else {
        grouped.future.meetings.push(meeting);
      }
    });

    tasks.forEach(task => {
      const taskDate = moment(task.deadline);
      if (taskDate.isSame(now, 'day')) {
        grouped.today.tasks.push(task);
      } else if (taskDate.isBetween(now.clone().startOf('week'), now.clone().endOf('week'))) {
        grouped.thisWeek.tasks.push(task);
      } else if (taskDate.isSame(now, 'month')) {
        grouped.thisMonth.tasks.push(task);
      } else if (taskDate.isSame(now, 'year')) {
        grouped.thisYear.tasks.push(task);
      } else {
        grouped.future.tasks.push(task);
      }
    });

    return grouped;
  }, [meetings, tasks]);

  return (
    <Container maxWidth="sm" className={classes.container}>
      <Paper className={classes.paper}>
        <Typography variant="h4" gutterBottom>
          Work Planner App
          
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form}>
          <TextField
            label="Meeting Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Date and Time"
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Add Meeting
          </Button>
        </form>
        <TaskForm onAddTask={handleAddTask} />
        {Object.entries(groupTasksAndMeetings).map(([period, items]) => (
          <div key={period} className={classes.meetingGroup}>
            <Typography variant="h5">{period}</Typography>
            <List>
              {items.meetings.map((meeting) => (
                <ListItem key={meeting.id} className={classes.listItem}>
                  <ListItemText
                    primary={meeting.title}
                    secondary={moment(meeting.dateTime).format('MMMM Do YYYY, h:mm:ss a')}
                  />
                </ListItem>
              ))}
            </List>
            <TaskList tasks={items.tasks} onUpdateTask={handleUpdateTask} />
          </div>
        ))}
      </Paper>
      <Dialog open={alertOpen} onClose={() => setAlertOpen(false)}>
        <DialogTitle>Meeting Reminder</DialogTitle>
        <DialogContent>
          <Typography>You have a "{alertTitle}" meeting now!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertOpen(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;