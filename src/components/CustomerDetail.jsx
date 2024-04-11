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
import { archiveCustomer, restoreCustomer, saveCustomer } from "../api/customers";

const initialCustomerState = {
  id: null,
  name: "",
  phoneNumber: "",
  address: "",
  email: "",
  // totalPrice: "",
};

const CustomerDetail = ({ customer, onClose, refetch, setEditingJob }) => {
  const theme = useTheme();
  const [details, setDetails] = useState(initialCustomerState);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (customer.id) {
      setDetails(customer);
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Adjust based on the actual structure. If `totalPrice` is a number, ensure conversion.
    const { totalPrice, ...customerDetailsToSave } = details;
    customerDetailsToSave.totalPrice = Number(totalPrice) || 0;

    await saveCustomer(customerDetailsToSave);
    refetch();
    onClose();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    await archiveCustomer({ id: customer.id });
    refetch();
    handleClose();
  };

  const handleRestore = async () => {
    await restoreCustomer({ id: customer.id });
    refetch();
    handleClose();
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
        alignItems: "flex-start",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        paddingTop: "10vh",
        zIndex: theme.zIndex.modal,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          marginTop: "20px",
          padding: theme.spacing(2),
          backgroundColor: theme.palette.background.default,
          boxShadow: theme.shadows[5],
          display: "flex",
          flexDirection: "column",
          width: "90%",
          maxWidth: "500px",
          maxHeight: "80vh",
          overflowY: "auto",
          color: theme.palette.text.primary,
          border: `4px solid ${theme.palette.primary.main}`,
          borderRadius: theme.shape.borderRadius,
          textAlign: "center",
          gap: theme.spacing(1),
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
          label="Email Address"
          name="email"
          value={details.email}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
        {/* <TextField
          label="Total Price"
          name="totalPrice"
          value={details.totalPrice}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        /> */}
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
          {details.archived ? (
            <Button
              variant="contained"
              sx={{
                bgcolor: theme.palette.warning.main,
                "&:hover": { bgcolor: theme.palette.warning.dark },
              }}
              onClick={handleRestore}
            >
              Restore
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{
                bgcolor: theme.palette.error.main,
                "&:hover": { bgcolor: theme.palette.error.dark },
              }}
              onClick={handleOpen}
            >
              Archive
            </Button>
          )}
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
    </div>
  );
};

export default CustomerDetail;
