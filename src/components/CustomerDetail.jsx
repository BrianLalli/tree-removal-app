import React, { useState, useEffect } from "react";
import {
  useTheme,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const statusOptions = {
  "group-1": "Opportunities",
  "group-2": "Pending",
  "group-3": "Upcoming Jobs",
  "group-4": "Completed Jobs",
};

const CustomerDetail = ({ customer, onClose, onSave, onMove, onDelete }) => {
  const theme = useTheme();
  const [details, setDetails] = useState({
    name: customer.content,
    phoneNumber: "",
    address: "",
    tasks: "",
    totalPrice: "",
    status: customer.groupId || "group-1",
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedDetails = localStorage.getItem(customer.id);
    if (savedDetails) {
      setDetails({ ...JSON.parse(savedDetails), status: customer.groupId });
    }
  }, [customer.id, customer.groupId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleStatusChange = (event) => {
    setDetails({ ...details, status: event.target.value });
  };

  const handleSave = () => {
    onSave(customer.id, details);
    if (details.status !== customer.groupId) {
      onMove(customer.id, details.status);
    }
    onClose();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = () => {
    onDelete(customer.id);
    handleClose();
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        zIndex: theme.zIndex.modal,
      }}
    >
      <div
        style={{
          padding: theme.spacing(4),
          backgroundColor: theme.palette.background.default,
          boxShadow: theme.shadows[5],
          display: "flex",
          flexDirection: "column",
          minWidth: "320px",
          maxWidth: "90%",
          color: theme.palette.text.primary,
          border: `4px solid ${theme.palette.primary.main}`,
          borderRadius: theme.shape.borderRadius,
          textAlign: "center",
          gap: theme.spacing(2),
          zIndex: theme.zIndex.modal + 1,
        }}
      >
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
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            id="status-select"
            value={details.status}
            label="Status"
            onChange={handleStatusChange}
          >
            {Object.keys(statusOptions).map((groupId) => (
              <MenuItem value={groupId} key={groupId}>
                {statusOptions[groupId]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: theme.spacing(3),
          }}
        >
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={handleOpen}>
            Delete
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this customer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomerDetail;
