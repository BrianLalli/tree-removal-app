import React, { useState, useEffect } from "react";
import {
  useTheme,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  archiveCustomer,
  restoreCustomer,
  saveCustomer,
} from "../api/customers";
import ModalShell from "./ModalShell";
import CustomerJobHistory from "./CustomerJobHistory";


const initialCustomerState = {
  id: null,
  name: "",
  phoneNumber: "",
  address: "",
  email: "",
  tasks: ["", "", ""],
  totalPrice: "",
  notes: "",
};

const CustomerDetail = ({ customer, onClose, refetch, setEditingJob }) => {
  const theme = useTheme();
  const [details, setDetails] = useState(initialCustomerState);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (customer.name) setDetails(customer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    await saveCustomer(details);
    refetch?.();
    onClose();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    await archiveCustomer({ id: customer.id });
    refetch?.();
    handleClose();
  };

  const handleRestore = async () => {
    await restoreCustomer({ id: customer.id });
    refetch?.();
    handleClose();
  };

  const footer = (
    <>
      {customer.id &&
        (details.archived ? (
          <Button color="warning" onClick={handleRestore} sx={{ mr: "auto" }}>
            Restore
          </Button>
        ) : (
          <Button color="error" onClick={handleOpen} sx={{ mr: "auto" }}>
            Archive
          </Button>
        ))}
      <Button variant="text" onClick={onClose}>
        Close
      </Button>
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>
    </>
  );

  return (
    <>
      <ModalShell
        title={customer.id ? details.name || "Customer" : "New Customer"}
        subtitle={customer.id ? details.address : null}
        onClose={onClose}
        footer={footer}
        maxWidth={560}
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
          value={details.phoneNumber || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Address"
          name="address"
          value={details.address || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Email Address"
          name="email"
          value={details.email || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
        {customer.id && (
          <CustomerJobHistory
            customerId={customer.id}
            onSelectJob={setEditingJob}
          />
        )}
      </ModalShell>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to archive this customer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: theme.palette.error.main,
              "&:hover": { bgcolor: theme.palette.error.dark },
            }}
            onClick={handleDelete}
          >
            Archive
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomerDetail;
