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

const localTimeZone = moment.tz.guess() || "America/New_York";
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
    console.log("Jobs fetched with dates:", fetchedJobs.map(job => ({
      jobDate: job.jobDate,
      timeZone: moment(job.jobDate).format('Z z') // Log timezone offset and abbreviation
    })));
  
    // Filter jobs to only include those in 'group-3' and have a non-null jobDate
    const filteredJobs = fetchedJobs.filter((job) => job.status === 'group-3' && job.jobDate);
  
    const calendarEvents = filteredJobs.map((job) => {
      // Assume jobDate is already in local time, so just parse it directly without utc()
      const startLocal = moment(job.jobDate).tz(localTimeZone, true); // the 'true' flag keeps the original time, interpreting it as local time
      const endLocal = startLocal.clone().add(job.durationInHours, 'hours');
      return {
        id: job.id,
        title: job.name,
        start: startLocal.toDate(),
        end: endLocal.toDate(),
        allDay: false,
        resource: job,
      };
    });
    setJobs(calendarEvents);
  };
  

  const fetchCustomers = async () => {
    const fetchedCustomers = await getCustomers();
    setCustomers(fetchedCustomers);
  };

  const handleSelectEvent = (event) => {
    setSelectedJob(event.resource);
    setEditingCustomer(event.resource.customer);
  };

  const handleEventChange = async ({ event, start, end }) => {
    const startUTC = moment.tz(start, localTimeZone).utc().format();
    const endUTC = moment.tz(end, localTimeZone).utc().format();
    const durationInHours = moment(end).diff(moment(start), 'hours');

    const updatedJob = {
      ...event.resource,
      jobDate: startUTC,
      durationInHours: durationInHours,
    };

    await updateJobStatus(updatedJob);
    fetchJobs(); // Re-fetch jobs to update the calendar with the correct times
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
          onMove={(jobId, newStatus) => console.log(`Moving job ${jobId} to status ${newStatus}`)}
          setEditingCustomer={setEditingCustomer}
          onDelete={(jobId) => setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId))}
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
