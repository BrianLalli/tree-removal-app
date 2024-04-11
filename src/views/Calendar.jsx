import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../assets/styles/Calendar.css";
import { getJobs, updateJobStatus } from "../api/jobs";
import { getCustomers } from "../api/customers"; // Make sure this import is correct
import JobDetail from "../components/JobDetail";
import CustomerDetail from "../components/CustomerDetail"; // Ensure this is the correct path to your component
import { useSwipeable } from "react-swipeable";

const localizer = momentLocalizer(moment);

const eventStyleGetter = (event, start, end, isSelected) => {
  let backgroundColor = "#3174ad";
  if (event.resource.status === "group-3") {
    backgroundColor = "#5cb85c";
  }

  const style = {
    backgroundColor,
    borderRadius: "6px",
    opacity: 0.8,
    color: "black",
    border: "0px",
    display: "block",
  };

  return { style };
};

const MyCalendar = () => {
  const theme = useTheme();
  const [jobs, setJobs] = useState([]);
  const [customers, setCustomers] = useState([]); // State for customers
  const [selectedJob, setSelectedJob] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    fetchJobs();
    fetchCustomers(); // Fetch customers when the component mounts
  }, []);

  const fetchJobs = async () => {
    const fetchedJobs = await getJobs();
    const filteredJobs = fetchedJobs.filter((job) => job.status === "group-3");
    const calendarEvents = filteredJobs.map((job) => ({
      id: job.id,
      title: job.name,
      start: moment.utc(job.jobDate).local().toDate(),
      end: moment
        .utc(job.jobDate)
        .add(job.durationInHours, "hours")
        .local()
        .toDate(),
      allDay: false,
      resource: job,
    }));
    setJobs(calendarEvents);
  };

  // Fetch customers function
  const fetchCustomers = async () => {
    const fetchedCustomers = await getCustomers();
    setCustomers(fetchedCustomers);
  };

  const handleSelectEvent = (event) => {
    setSelectedJob(event.resource);
  };

  const handleEventChange = async ({ event, start, end }) => {
    const updatedJob = {
      ...event.resource,
      jobDate: moment(start).utc().format(),
      durationInHours: moment.utc(end).diff(moment.utc(start), "hours"),
    };

    await updateJobStatus(updatedJob);
    fetchJobs();
  };

  const handleJobDeletion = (jobId) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
  };

  const handleJobMove = async (jobId, newStatus) => {
    console.log(`Moving job ${jobId} to status ${newStatus}`);
    fetchJobs();
  };

  const handleEditingCustomer = (customer) => {
    setEditingCustomer(customer);
  };

  const calendarStyles = {
    height: "calc(100vh - var(--header-height) - var(--footer-height))",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    width: "100%",
    overflow: "auto",
    boxSizing: "border-box",
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => console.log("Swiped left"),
    onSwipedRight: () => console.log("Swiped right"),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div {...handlers} style={calendarStyles}>
      <Calendar
        localizer={localizer}
        events={jobs}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleSelectEvent}
        onEventDrop={handleEventChange}
        onEventResize={handleEventChange}
        resizable
        selectable
        style={{ height: "100%" }}
        eventPropGetter={eventStyleGetter}
      />
      {selectedJob && (
        <JobDetail
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          refetch={fetchJobs}
          onMove={handleJobMove}
          setEditingCustomer={handleEditingCustomer} // Now JobDetail can trigger CustomerDetail
          onDelete={handleJobDeletion}
          customers={customers} // Passing the customers to JobDetail
        />
      )}
      {editingCustomer && (
        <CustomerDetail
          customer={editingCustomer}
          onClose={() => setEditingCustomer(null)}
        />
      )}
    </div>
  );
};

export default MyCalendar;
