import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// Ensure you import the CSS correctly. The path must match your project structure.
import '../assets/styles/Calendar.css'; // Adjusted import statement
import { getJobs, updateJobStatus } from '../api/jobs';
import JobDetail from '../components/JobDetail';
import { useSwipeable } from 'react-swipeable'; // Import useSwipeable for swipe gestures

const localizer = momentLocalizer(moment);

const eventStyleGetter = (event, start, end, isSelected) => {
  let backgroundColor = '#3174ad'; // Default color
  if (event.resource.status === 'group-3') {
    backgroundColor = '#5cb85c'; // Green for upcoming jobs
  }

  const style = {
    backgroundColor,
    borderRadius: '6px',
    opacity: 0.8,
    color: 'black',
    border: '0px',
    display: 'block',
  };

  return { style };
};

const MyCalendar = () => {
  const theme = useTheme();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const fetchedJobs = await getJobs();
    const filteredJobs = fetchedJobs.filter(job => job.status === "group-3");
    const calendarEvents = filteredJobs.map(job => ({
      id: job.id,
      title: job.name,
      start: moment.utc(job.jobDate).local().toDate(),
      end: moment.utc(job.jobDate).add(job.durationInHours, 'hours').local().toDate(),
      allDay: false,
      resource: job,
    }));
    setJobs(calendarEvents);
  };

  const handleSelectEvent = (event) => {
    setSelectedJob(event.resource);
  };

  const handleEventChange = async ({ event, start, end }) => {
    const updatedJob = {
      ...event.resource,
      jobDate: moment(start).utc().format(),
      durationInHours: moment.utc(end).diff(moment.utc(start), 'hours'),
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
    console.log("Editing customer:", customer);
  };

  const calendarStyles = {
    height: 'calc(100vh - var(--header-height) - var(--footer-height))',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    width: '100%',
    overflow: 'auto',
    boxSizing: 'border-box',
  };
  
  
  const handlers = useSwipeable({
    onSwipedLeft: () => console.log('Swiped left'), // Placeholder for actual implementation
    onSwipedRight: () => console.log('Swiped right'), // Placeholder for actual implementation
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
        style={{ height: '100%' }}
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
        />
      )}
    </div>
  );
};

export default MyCalendar;
