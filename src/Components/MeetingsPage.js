import React, { useState, useEffect, useMemo } from 'react';
import { Typography, TextField, Button, List, ListItem, ListItemText, Paper, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment';

function MeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');

  useEffect(() => {
    const storedMeetings = localStorage.getItem('meetings');
    if (storedMeetings) {
      setMeetings(JSON.parse(storedMeetings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('meetings', JSON.stringify(meetings));
  }, [meetings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && dateTime) {
      const newMeeting = { id: Date.now(), title, dateTime };
      setMeetings([...meetings, newMeeting]);
      scheduleNotification(newMeeting);
      setTitle('');
      setDateTime('');
    }
  };

  const scheduleNotification = (meeting) => {
    const currentTime = new Date().getTime();
    const notificationTime = new Date(meeting.dateTime).getTime();
    const delay = notificationTime - currentTime;

    if (delay > 0) {
      setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification(`Meeting Reminder: ${meeting.title}`, {
            body: `You have a "${meeting.title}" meeting now!`,
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              new Notification(`Meeting Reminder: ${meeting.title}`, {
                body: `You have a "${meeting.title}" meeting now!`,
              });
            }
          });
        }
      }, delay);
    }
  };

  const groupedMeetings = useMemo(() => {
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

    meetings.forEach(meeting => {
      const meetingDate = moment(meeting.dateTime);
      if (meetingDate.isSame(now, 'day')) {
        grouped.today.push(meeting);
      } else if (meetingDate.isBefore(endOfWeek)) {
        grouped.thisWeek.push(meeting);
      } else if (meetingDate.isBefore(endOfMonth)) {
        grouped.thisMonth.push(meeting);
      } else if (meetingDate.isBefore(endOfYear)) {
        grouped.thisYear.push(meeting);
      } else {
        grouped.future.push(meeting);
      }
    });

    return grouped;
  }, [meetings]);

  return (
    <Paper style={{ padding: '1rem' }}>
      <Typography variant="h4" gutterBottom>Meetings</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Meeting Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Date and Time"
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Add Meeting
        </Button>
      </form>
      {Object.entries(groupedMeetings).map(([period, meetingList]) => (
        <Accordion key={period}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{period} ({meetingList.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List style={{ width: '100%' }}>
              {meetingList.map((meeting) => (
                <ListItem key={meeting.id}>
                  <ListItemText
                    primary={meeting.title}
                    secondary={moment(meeting.dateTime).format('MMMM Do YYYY, h:mm:ss a')}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
}

export default MeetingsPage;