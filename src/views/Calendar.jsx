import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../assets/styles/Calendar.css";
import { getJobs, updateJobStatus } from "../api/jobs";
import { getCustomers } from "../api/customers";
import JobDetail from "../components/JobDetail";
import CustomerDetail from "../components/CustomerDetail";
import { useSwipeable } from "react-swipeable";

moment.tz.setDefault("America/New_York");
const localizer = momentLocalizer(moment);

const eventStyleGetter = (event, start, end, isSelected) => {
  let backgroundColor = "#3174ad";
  if (event.resource.status === "group-3") {
    backgroundColor = "#5cb85c";
  }
  return {
    style: {
      backgroundColor,
      borderRadius: "6px",
      opacity: 0.8,
      color: "black",
      border: "0px",
      display: "block",
    }
  };
};

const MyCalendar = () => {
  const theme = useTheme();
  const [jobs, setJobs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    fetchJobs();
    fetchCustomers();
  }, []);

  const fetchJobs = async () => {
    const fetchedJobs = await getJobs();
    const filteredJobs = fetchedJobs.filter(job => job.status === "group-3");
    const calendarEvents = filteredJobs.map(job => ({
      id: job.id,
      title: job.name,
      start: moment.tz(job.jobDate, "UTC").tz("America/New_York").toDate(),
      end: moment.tz(job.jobDate, "UTC").add(job.durationInHours, "hours").tz("America/New_York").toDate(),
      allDay: false,
      resource: job,
    }));
    setJobs(calendarEvents);
  };

  const fetchCustomers = async () => {
    const fetchedCustomers = await getCustomers();
    setCustomers(fetchedCustomers);
  };

  const handleSelectEvent = (event) => {
    setSelectedJob(event.resource);
    // New: Trigger CustomerDetail with the customer of the selected job
    setEditingCustomer(event.resource.customer); // Assuming 'customer' is part of 'event.resource'
  };

  const handleEventChange = async ({ event, start, end }) => {
    const updatedJob = {
      ...event.resource,
      jobDate: moment(start).tz("America/New_York").utc().format(),
      durationInHours: moment(end).tz("America/New_York").diff(moment(start).tz("America/New_York"), "hours"),
    };
    await updateJobStatus(updatedJob);
    fetchJobs();
  };

  const handleJobDeletion = (jobId) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
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
          setEditingCustomer={handleEditingCustomer}
          onDelete={handleJobDeletion}
          customers={customers}
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
