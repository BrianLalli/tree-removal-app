import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Ensure uuid is installed
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CustomerDetail from "../components/CustomerDetail";
import SearchBar from "../components/SearchBar";
import { getCustomers, updateCustomerStatus } from "../api/customers";
import _ from "lodash";
import JobDetail from "../components/JobDetail";
import { getJobs, updateJobStatus } from "../api/jobs";

const WorkingBoard = () => {
  const initialGroups = {
    "group-1": {
      id: "group-1",
      name: "Opportunities",
      color: "#FFD700",
      items: [],
    },
    "group-2": {
      id: "group-2",
      name: "Pending",
      color: "#FF8C00",
      items: [],
    },
    "group-3": {
      id: "group-3",
      name: "Upcoming Jobs",
      color: "#1E90FF",
      items: [],
    },
    "group-4": {
      id: "group-4",
      name: "Completed Jobs",
      color: "#32CD32",
      items: [],
    },
  };
  const [customerGroups, setCustomerGroups] = useState({});
  const theme = useTheme();
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [refetchData, setRefetchData] = useState(false);

  useEffect(() => {
    async function fetchCustomersAndJobsOnMount() {
      let groups = _.cloneDeep(initialGroups);
      const customers = await getCustomers();
      const jobs = await getJobs();
      jobs.map((job) => {
        if (!job?.archived) {
          groups[job.status]?.items?.push(job);
        }
        const customer = customers.find(
          (customer) => customer.id === job.customerId
        );
        if (customer) {
          customer.jobs = customer.jobs || [];
          customer.jobs.push(job);
        }
      });
      setCustomers(customers);
      setCustomerGroups(groups);
    }
    fetchCustomersAndJobsOnMount();
  }, []);

  useEffect(() => {
    async function refetchDataOnUpdate() {
      if (refetchData) {
        let groups = _.cloneDeep(initialGroups);
        const customers = await getCustomers();
        const jobs = await getJobs();
        jobs.map((job) => {
          if (!job?.archived) {
            groups[job.status]?.items?.push(job);
          }
          const customer = customers.find(
            (customer) => customer.id === job.customerId
          );
          if (customer) {
            customer.jobs = customer.jobs || [];
            customer.jobs.push(job);
          }
        });
        setCustomers(customers);
        setCustomerGroups(groups);
        setRefetchData(false);
      }
    }
    refetchDataOnUpdate();
  }, [refetchData]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    return [sourceClone, destClone];
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        customerGroups[source.droppableId].items,
        source.index,
        destination.index
      );

      const newState = {
        ...customerGroups,
        [source.droppableId]: { ...customerGroups[source.droppableId], items },
      };
      setCustomerGroups(newState);
    } else {
      const [sourceClone, destClone] = move(
        customerGroups[source.droppableId].items,
        customerGroups[destination.droppableId].items,
        source,
        destination
      );

      const newState = {
        ...customerGroups,
        [source.droppableId]: {
          ...customerGroups[source.droppableId],
          items: sourceClone,
        },
        [destination.droppableId]: {
          ...customerGroups[destination.droppableId],
          items: destClone,
        },
      };
      updateJobStatus({
        id: result.draggableId,
        status: destination.droppableId,
      });
      setCustomerGroups(newState);
    }
  };

  const handleCloseJobDetail = () => {
    setEditingJob(null);
  };

  const handleCloseCustomerDetail = () => {
    setEditingCustomer(null);
  };

  const refetch = () => {
    setRefetchData(true);
    handleCloseJobDetail();
    handleCloseCustomerDetail();
  };

  const handleMoveJob = (customerId, newGroupId) => {
    setCustomerGroups((prevGroups) => {
      const newGroups = { ...prevGroups };
      let movedCustomer = null;

      // Remove the customer from the current group
      for (const [groupId, group] of Object.entries(newGroups)) {
        const customerIndex = group.items.findIndex(
          (item) => item.id === customerId
        );
        if (customerIndex > -1) {
          [movedCustomer] = group.items.splice(customerIndex, 1);
          break;
        }
      }

      // Add the customer to the new group
      if (movedCustomer && newGroups[newGroupId]) {
        newGroups[newGroupId].items.push(movedCustomer);
      }

      return newGroups;
    });
  };

  const handleDeleteCustomer = (customerId) => {
    setCustomerGroups((prevGroups) => {
      Object.keys(prevGroups).forEach((group) => {
        const index = prevGroups[group].items.findIndex(
          (item) => item.id === customerId
        );
        if (index !== -1) {
          prevGroups[group].items.splice(index, 1);
        }
      });
      return { ...prevGroups };
    });
  };
  const handleDeleteJob = (jobId) => {
    setCustomerGroups((prevGroups) => {
      Object.keys(prevGroups).forEach((group) => {
        const index = prevGroups[group].items.findIndex(
          (item) => item.id === jobId
        );
        if (index !== -1) {
          prevGroups[group].items.splice(index, 1);
        }
      });
      return { ...prevGroups };
    });
  };

  return (
    <Box
      sx={{
        pt: theme.spacing(8), // Top padding to avoid overlap with AppBar
        pb: theme.spacing(7), // Bottom padding to avoid overlap with Footer
        display: "flex",
        flexDirection: "column", // Stack children vertically
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Button
            variant="contained"
            color="primary"
            style={{ width: "200px", margin: "auto", marginBottom: 15 }}
            sx={{ mt: 1 }}
            onClick={setEditingCustomer}
          >
            + New Customer
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ width: "200px", margin: "auto", marginBottom: 15 }}
            sx={{ mt: 1 }}
            onClick={setEditingJob}
          >
            + New Job
          </Button>
          <SearchBar
            onSelect={setEditingCustomer}
            data={customers.map((customer) => {
              let labelKey = customer.name;
              return { ...customer, labelKey };
            })}
          />
        </div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            padding: theme.spacing(2),
            backgroundColor: theme.palette.background.primary,
            gap: theme.spacing(2),
            margin: "auto",
            flexWrap: "wrap",
            overflow: "auto",
            maxWidth: "100%",
            "& > *": {
              flex: "1 1 auto",
              width: {
                xs: "100%",
                sm: "48%",
                md: "30%",
                lg: "auto",
              },
              minWidth: 200,
            },
          }}
        >
          {Object.entries(customerGroups).map(([groupId, group]) => (
            <Droppable droppableId={groupId} key={groupId}>
              {(provided, snapshot) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    padding: theme.spacing(2),
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: snapshot.isDraggingOver ? 3 : 1,
                    margin: theme.spacing(1),
                    color: theme.palette.text.primary,
                  }}
                >
                  <Typography variant="h6" sx={{ wordBreak: "break-word" }}>
                    {group.name}
                  </Typography>
                  {group.items &&
                    group.items.map((job, index) => (
                      <Draggable
                        key={job.id}
                        draggableId={job.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onDoubleClick={() => setEditingJob({ ...job })}
                            sx={{
                              backgroundColor: snapshot.isDragging
                                ? alpha(theme.palette.action.hover, 0.8)
                                : alpha(group.color, 0.7),
                              padding: theme.spacing(1),
                              margin: theme.spacing(1),
                              borderRadius: theme.shape.borderRadius,
                              boxShadow: 1,
                              cursor: "grab",
                              color: theme.palette.getContrastText(
                                alpha(group.color, 0.7)
                              ),
                            }}
                          >
                            {job.name}
                          </Box>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          ))}
        </Box>
        {editingCustomer && (
          <CustomerDetail
            customer={editingCustomer}
            setEditingJob={setEditingJob}
            onClose={handleCloseCustomerDetail}
            refetch={refetch}
            onDelete={handleDeleteCustomer}
          />
        )}
        {editingJob && (
          <JobDetail
            job={editingJob}
            customers={customers}
            setEditingCustomer={setEditingCustomer}
            onClose={handleCloseJobDetail}
            refetch={refetch}
            onMove={handleMoveJob}
            onDelete={handleDeleteJob}
          />
        )}
      </DragDropContext>
    </Box>
  );
};

export default WorkingBoard;
