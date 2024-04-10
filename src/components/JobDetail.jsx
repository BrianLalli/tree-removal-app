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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { archiveJob, restoreJob, saveJob } from "../api/jobs";
import Typeahead from "./Typeahead";
import dayjs from "dayjs";

const statusOptions = {
  "group-1": "Opportunities",
  "group-2": "Pending",
  "group-3": "Upcoming Jobs",
  "group-4": "Completed Jobs",
};

const initialJobState = {
  id: null,
  name: "",
  tasks: ["", "", ""],
  notes: "",
  jobDate: new Date(),
  durationInHours: 0,
  price: "",
  customerId: null,
  customerSigned: false,
  status: "group-1",
};

const JobDetail = ({
  job,
  customers,
  onClose,
  refetch,
  onMove,
  setEditingCustomer,
}) => {
  const theme = useTheme();
  const [details, setDetails] = useState(initialJobState);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (job.id) {
      setDetails(job);
      handleCustomerChange(job.customerId);
      handleJobDateChange(job.jobDate);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("task")) {
      const taskIndex = +name.replace("tasks", "") - 1;
      let newTasks = details.tasks.map((task, index) => {
        if (index === taskIndex) return value;
        return task;
      });
      setDetails((prevDetails) => ({
        ...prevDetails,
        tasks: newTasks,
      }));
    } else {
      setDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleCustomerChange = (customerId) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      customerId,
    }));
  };
  const handleJobDateChange = (jobDate) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      jobDate,
    }));
  };

  const handleStatusChange = (event) => {
    setDetails({ ...details, status: event.target.value });
  };

  const handleSave = async () => {
    await saveJob(details);
    if (details.status !== job.groupId) {
      onMove(job.id, details.status);
    }
    refetch();
    onClose();
  };

  const handleViewCustomer = async () => {
    onClose();
    setEditingCustomer(
      customers.filter((customer) => customer.id == details.customerId)[0]
    );
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    await archiveJob({ id: job.id });
    refetch();
    handleClose();
  };

  const handleRestore = async () => {
    await restoreJob({ id: job.id });
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
        alignItems: "flex-start", // Aligns the form to the top, especially important on small screens
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        paddingTop: "10vh", // Adds some space at the top
        zIndex: theme.zIndex.modal,
        overflowY: "auto", // Allows scrolling on small screens
      }}
    >
      <div
        style={{
          marginTop: "20px", // Additional top margin if needed
          padding: theme.spacing(2),
          backgroundColor: theme.palette.background.default,
          boxShadow: theme.shadows[5],
          display: "flex",
          flexDirection: "column",
          width: "90%", // Set width to 90% of the viewport
          maxWidth: "500px", // Maximum width for larger screens
          maxHeight: "80vh", // Max height to ensure it fits in the viewport
          overflowY: "auto", // Scroll inside the form if content is too tall
          color: theme.palette.text.primary,
          border: `4px solid ${theme.palette.primary.main}`,
          borderRadius: theme.shape.borderRadius,
          textAlign: "center",
          gap: theme.spacing(1), // Reduced gap to save space
          zIndex: theme.zIndex.modal + 1,
        }}
      >
        <Typeahead
          label="Customer"
          data={customers}
          onSelection={(e) => handleCustomerChange(e.id)}
          defaultValue={
            customers.filter((item) => item.id == job.customerId)[0]
          }
        />
        <TextField
          label="Job Name"
          name="name"
          value={details.name}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Tasks 1"
          name="tasks1"
          value={details.tasks[0]}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Tasks 2"
          name="tasks2"
          value={details.tasks[1]}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Tasks 3"
          name="tasks3"
          value={details.tasks[2]}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Notes"
          name="notes"
          value={details.notes}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          multiline
          rows={4}
        />
        <TextField
          label="Price"
          name="price"
          value={details.price}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Duration In Hours"
          name="durationInHours"
          value={details.durationInHours}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Job Date and Time"
            value={dayjs(Date.parse(details.jobDate))}
            onChange={(newValue) => {
              handleJobDateChange(new Date(newValue.$d));
            }}
          />
        </LocalizationProvider>
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleViewCustomer}
          >
            View Customer
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
            Are you sure you want to archive this job?
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

export default JobDetail;
