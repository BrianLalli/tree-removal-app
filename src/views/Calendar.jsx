import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getJobs, updateJobStatus } from '../api/jobs';
import JobDetail from '../components/JobDetail';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // Fetch jobs and transform them into calendar events
  useEffect(() => {
    async function fetchJobs() {
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
    }

    fetchJobs();
  }, []);

  // Handler for clicking on a calendar event
  const handleSelectEvent = (event) => {
    // Assuming JobDetail is a modal that takes a 'job' prop
    setSelectedJob(event.resource);
  };

  // Handler for moving or resizing a calendar event
  const handleEventChange = ({ event, start, end }) => {
    const updatedJob = {
      ...event.resource,
      jobDate: start,
      // Assuming duration is in hours and can be recalculated as the difference between start and end times
      durationInHours: moment(end).diff(moment(start), 'hours'),
    };

    // Update job in the database
    updateJobStatus(updatedJob).then(() => {
      // Update the local job state to reflect the change on the calendar
      setJobs(jobs.map(j => j.id === event.id ? { ...j, start, end } : j));
    });
  };

  return (
    <div style={{ height: '100vh' }}>
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
          // Pass additional props as needed for JobDetail component functionality
        />
      )}
    </div>
  );
};

export default MyCalendar;
