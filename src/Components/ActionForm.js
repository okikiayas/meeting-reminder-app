import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';

function ActionForm({ onAddAction }) {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [doItOnDate, setDoItOnDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && deadline && doItOnDate) {
      onAddAction({
        id: Date.now().toString(),
        title,
        deadline,
        doItOnDate,
        status: 'not-started'
      });
      setTitle('');
      setDeadline('');
      setDoItOnDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Action Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Deadline"
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        required
      />
      <TextField
        label="Do it on"
        type="date"
        value={doItOnDate}
        onChange={(e) => setDoItOnDate(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Add Action
      </Button>
    </form>
  );
}

export default ActionForm;