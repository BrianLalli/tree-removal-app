import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getJobs, updateJobStatus } from '../api/jobs';
import JobDetail from '../components/JobDetail';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const theme = useTheme();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const fetchedJobs = await getJobs();
    const calendarEvents = fetchedJobs.map(job => ({
      id: job.id,
      title: job.name,
      start: new Date(job.jobDate),
      end: new Date(moment(job.jobDate).add(job.durationInHours, 'hours')),
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
      jobDate: start,
      durationInHours: moment(end).diff(moment(start), 'hours'),
    };

    await updateJobStatus(updatedJob);
    fetchJobs(); // Refresh jobs list to reflect the updated job
  };

  const handleJobDeletion = (jobId) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
  };

  // Adapted to the calendar context, for now, just refetching jobs, but could be enhanced
  const handleJobMove = (jobId, newStatus) => {
    fetchJobs();
  };

  const handleEditingCustomer = (customer) => {
    // This could open a modal or trigger another component
    // For now, it's just logging
    console.log("Editing customer:", customer);
  };

  const calendarStyles = {
    height: '100vh',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  };

  return (
    <div style={calendarStyles}>
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
