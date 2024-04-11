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
    // Filter jobs for those with a status of "group-3" (Upcoming Jobs)
    const filteredJobs = fetchedJobs.filter(job => job.status === "group-3");
    const calendarEvents = filteredJobs.map(job => {
      return {
        id: job.id,
        title: job.name,
        // Convert times from UTC to local time zone for display
        start: moment.utc(job.jobDate).local().toDate(),
        end: moment.utc(job.jobDate).add(job.durationInHours, 'hours').local().toDate(),
        allDay: false,
        resource: job,
      };
    });
    setJobs(calendarEvents);
  };

  const handleSelectEvent = (event) => {
    setSelectedJob(event.resource);
  };

  const handleEventChange = async ({ event, start, end }) => {
    // Use moment to ensure start and end times are in UTC for submission
    const updatedJob = {
      ...event.resource,
      jobDate: moment(start).utc().format(),
      durationInHours: moment.utc(end).diff(moment.utc(start), 'hours'),
    };
  
    await updateJobStatus(updatedJob);
    fetchJobs(); // Refresh the job list
  };
  

  const handleJobDeletion = (jobId) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
  };

  const handleJobMove = async (jobId, newStatus) => {
    // Placeholder for moving job to a different status
    // Update the job status in your database accordingly
    console.log(`Moving job ${jobId} to status ${newStatus}`);
    fetchJobs(); // Refresh the jobs list after updating the status
  };

  const handleEditingCustomer = (customer) => {
    console.log("Editing customer:", customer);
    // Placeholder function for editing customer
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
