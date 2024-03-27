import React, { useState, useEffect } from 'react';
import { useTheme, TextField, Button } from '@mui/material';

const CustomerDetail = ({ customer, onClose, onSave }) => {
  const theme = useTheme();
  const [details, setDetails] = useState({
    name: customer.content, // Assuming content is the name
    phoneNumber: '',
    address: '',
    tasks: '',
    totalPrice: '',
  });

  useEffect(() => {
    const savedDetails = localStorage.getItem(customer.id);
    if (savedDetails) {
      setDetails(JSON.parse(savedDetails));
    }
  }, [customer.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem(customer.id, JSON.stringify(details));
    onSave(customer.id, details);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.9)', // semi-transparent overlay
      zIndex: theme.zIndex.modal // ensure it's above other items
    }}>
      <div style={{
        padding: theme.spacing(4),
        backgroundColor: theme.palette.background.default,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[5],
        display: 'flex',
        flexDirection: 'column',
        minWidth: '320px', // Adjust as necessary
        zIndex: theme.zIndex.modal + 1,
        color: theme.palette.text.primary,
        textAlign: 'center',
        gap: theme.spacing(2),
        border: `4px solid ${theme.palette.primary.main}`,
        borderRadius: '24px',
        maxWidth: '90%', // Prevent too wide on large screens
      }}>
        <TextField
          label="Name"
          name="name"
          value={details.name}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={details.phoneNumber}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Address"
          name="address"
          value={details.address}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Tasks"
          name="tasks"
          value={details.tasks}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          multiline
        />
        <TextField
          label="Total Price"
          name="totalPrice"
          value={details.totalPrice}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: theme.spacing(3) }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
