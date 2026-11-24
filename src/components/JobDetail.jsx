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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { archiveJob, restoreJob, saveJob, setJobPaidStatus } from "../api/jobs";
import Typeahead from "./Typeahead";
import dayjs from "dayjs";
import { generatePDF, downloadPDF, shareFile } from "../utils/pdfGenerator";
import "../assets/styles/JobDetail.css";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { Box, useMediaQuery } from "@mui/material";
import ModalShell from "./ModalShell";
import CustomerJobHistory from "./CustomerJobHistory";

const statusOptions = {
  "group-1": "Opportunities",
  "group-2": "Pending",
  "group-3": "Upcoming Jobs",
  "group-4": "Completed Jobs",
};

const initialJobState = {
  id: null,
  name: "",
  callDate: new Date(),
  tasks: ["", "", ""],
  notes: "",
  jobDate: null,
  isPaid: false,
  durationInHours: 0,
  price: "",
  customerId: null,
  customerSigned: false,
  status: "group-1",
};

const JobDetail = ({
  job = {},
  customers = [],
  onClose,
  refetch,
  onMove,
  setEditingCustomer,
}) => {
  const theme = useTheme();
  const [details, setDetails] = useState(initialJobState);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isWide = useMediaQuery(theme.breakpoints.up("md"));

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

  const handleAddTask = () => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      tasks: [...prevDetails.tasks, ""], // Add an empty string for a new task
    }));
  };

  const handleTaskChange = (index, value) => {
    setDetails((prevDetails) => {
      const newTasks = [...prevDetails.tasks];
      newTasks[index] = value; // Update the task at the given index
      return { ...prevDetails, tasks: newTasks };
    });
  };

  const handleDeleteTask = (index) => {
    setDetails((prevDetails) => {
      const newTasks = prevDetails.tasks.filter((_, i) => i !== index); // Remove the task at the given index
      return { ...prevDetails, tasks: newTasks };
    });
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

  const getSelectedCustomer = (customerId) => {
    return customers.find((customer) => customer.id === customerId);
  };

  const handleViewCustomer = () => {
    const selectedCustomer = getSelectedCustomer(details.customerId);
    setEditingCustomer(selectedCustomer);
    onClose(); // Close JobDetail when moving to CustomerDetail
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

  const handleViewInvoice = () => {
    navigate(`/invoice/${job.id}`, {
      state: {
        customer: getSelectedCustomer(details.customerId),
        job: details,
      },
    });
  };

  const handleCallDateChange = (newValue) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      callDate: newValue ? newValue.toISOString() : null, // Ensure to use ISO string if storing in DB
    }));
  };

  // const handleSharePDF = async () => {
  //   // Formatting the jobDate using dayjs for better readability in the PDF
  //   const formattedJobDate = dayjs(details.jobDate).format("YYYY-MM-DD");

  //   const formData = {
  //     "Job Name": details.name,
  //     "Customer ID": details.customerId.toString(), // Ensuring ID is a string, if necessary
  //     "Job Date": formattedJobDate,
  //     "Duration in Hours": details.durationInHours.toString(),
  //     Price: details.price,
  //     Status: statusOptions[details.status],
  //     Notes: details.notes,
  //     // Add other fields as necessary
  //   };

  //   try {
  //     const pdfBlob = await generatePDF(formData);
  //     await shareFile(pdfBlob, "JobDetails.pdf"); // Use the shareFile function
  //   } catch (error) {
  //     console.error("Error generating or sharing PDF:", error);
  //   }
  // };

  const selectedCustomer = getSelectedCustomer(details.customerId);

  const footer = (
    <>
      {details.archived ? (
        <Button
          color="warning"
          onClick={handleRestore}
          sx={{ mr: "auto" }}
        >
          Restore
        </Button>
      ) : (
        job.id && (
          <Button color="error" onClick={handleOpen} sx={{ mr: "auto" }}>
            Archive
          </Button>
        )
      )}
      <Button variant="text" onClick={onClose}>
        Close
      </Button>
      <Button
        variant="outlined"
        onClick={handleViewCustomer}
        disabled={!selectedCustomer}
      >
        View Customer
      </Button>
      {job.id && (
        <Button variant="outlined" onClick={handleViewInvoice}>
          View Invoice
        </Button>
      )}
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>
    </>
  );

  const history = (
    <CustomerJobHistory
      customerId={details.customerId}
      excludeJobId={job.id}
      title={selectedCustomer ? `${selectedCustomer.name}'s Job History` : "Job History"}
    />
  );

  return (
    <>
      <ModalShell
        title={job.id ? details.name || "Edit Job" : "New Job"}
        subtitle={selectedCustomer?.name !== details.name ? selectedCustomer?.name : null}
        onClose={onClose}
        footer={footer}
        maxWidth={details.customerId && isWide ? 1040 : 640}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: details.customerId && isWide ? "minmax(0, 1fr) 380px" : "1fr",
            gap: 3,
            alignItems: "start",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typeahead
                label="Customer"
                data={customers}
                onSelection={(e) => handleCustomerChange(e?.id ?? null)}
                defaultValue={customers.find((item) => item.id === job.customerId)}
                className="full-width-input" // Ensure consistent width
              />
              {details.customerId && !isWide && history}
              <TextField
                label="Job Name"
                name="name"
                value={details.name}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Call Date"
                  value={details.callDate ? dayjs(details.callDate) : null}
                  onChange={handleCallDateChange}
                  slotProps={{ textField: { fullWidth: true } }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: theme.spacing(1),
                }}
              >
                <span className="field-group-label">Tasks</span>
                {details.tasks.map((task, index) => (
                  <TextField
                    key={index}
                    label={`Task ${index + 1}`}
                    value={task}
                    onChange={(e) => handleTaskChange(index, e.target.value)}
                    variant="outlined"
                    fullWidth
                    multiline // Enable text wrapping
                    minRows={1} // Start with a single row, expand as needed
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          aria-label="delete task"
                          onClick={() => handleDeleteTask(index)}
                          edge="end"
                        >
                          <Delete />
                        </IconButton>
                      ),
                    }}
                  />
                ))}
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddTask}
                  sx={{ width: "100%", mt: 1 }}
                >
                  Add Task
                </Button>
              </div>
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
                disabled={details.isPaid || details.customerSigned}
                variant="outlined"
                fullWidth
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={details.isPaid}
                    onChange={() => {
                      setDetails((prevDetails) => ({
                        ...prevDetails,
                        isPaid: !details.isPaid,
                      }));
                    }}
                  />
                }
                label="Invoice Paid"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    disabled
                    checked={details.customerSigned}
                    onChange={() => {
                      setDetails((prevDetails) => ({
                        ...prevDetails,
                        customerSigned: !details.customerSigned,
                      }));
                    }}
                  />
                }
                label="Contract Signed"
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
                  value={details.jobDate ? dayjs(Date.parse(details.jobDate)) : null}
                  onChange={(newValue) => {
                    handleJobDateChange(new Date(newValue?.$d));
                  }}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
              <FormControl fullWidth>
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
          </Box>
          {details.customerId && isWide && (
            <Box sx={{ position: "sticky", top: 0 }}>{history}</Box>
          )}
        </Box>
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
    </>
  );
};

export default JobDetail;
