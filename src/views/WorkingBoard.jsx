import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CustomerDetail from "../components/CustomerDetail";
import SearchBar from "../components/SearchBar";
import { getCustomers, updateCustomerStatus } from "../api/customers";
import _ from "lodash";
import JobDetail from "../components/JobDetail";
import { getJobs, updateJobStatus } from "../api/jobs";
import AddIcon from "@mui/icons-material/Add";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

const initialGroups = {
  "group-1": {
    id: "group-1",
    name: "Opportunities",
    color: "#FFD700",
    items: [],
    totalRevenue: 0,
  },
  "group-2": {
    id: "group-2",
    name: "Pending",
    color: "#FF8C00",
    items: [],
    totalRevenue: 0,
  },
  "group-3": {
    id: "group-3",
    name: "Upcoming Jobs",
    color: "#1E90FF",
    items: [],
    totalRevenue: 0,
  },
  "group-4": {
    id: "group-4",
    name: "Completed Jobs",
    color: "#32CD32",
    items: [],
    totalRevenue: 0,
  },
  "group-5": {
    id: "group-5",
    name: "Archived Jobs",
    color: "#A9A9A9", // Gray color for archived
    items: [],
    totalRevenue: 0,
  },
};

// Sort items in each group so newest jobs are first
const sortGroupsByDate = (groups) => {
  Object.values(groups).forEach((group) => {
    group.items.sort((a, b) => {
      const aDate = new Date(a.created_at || a.jobDate || 0);
      const bDate = new Date(b.created_at || b.jobDate || 0);
      return bDate - aDate; // newest first
    });
  });
};

const WorkingBoard = () => {
  const [customerGroups, setCustomerGroups] = useState({});
  const theme = useTheme();
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [refetchData, setRefetchData] = useState(false);
  const [viewAllStatus, setViewAllStatus] = useState({});
  const [showArchived, setShowArchived] = useState(false);

  const loadBoard = async () => {
    const groups = _.cloneDeep(initialGroups);
    const customers = await getCustomers();
    const jobs = (await getJobs()) || [];

    jobs.forEach((job) => {
      const jobPrice = parseFloat(job.price) || 0;

      if (job?.archived) {
        // Add archived jobs to "Archived Jobs" group
        groups["group-5"].items.push(job);
        groups["group-5"].totalRevenue += jobPrice;
      } else if (groups[job.status]) {
        groups[job.status].items.push(job);
        groups[job.status].totalRevenue += jobPrice;
      }

      // Attach jobs to the relevant customer
      const customer = customers.find(
        (customer) => customer.id === job.customerId
      );
      if (customer) {
        customer.jobs = customer.jobs || [];
        customer.jobs.push(job);
      }
    });

    // Ensure newest jobs appear first in each column
    sortGroupsByDate(groups);

    setCustomers(customers);
    setCustomerGroups(groups);
  };

  useEffect(() => {
    loadBoard();
  }, []);

  useEffect(() => {
    if (refetchData) {
      loadBoard().finally(() => setRefetchData(false));
    }
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
      const job = customerGroups[source.droppableId].items[source.index];
      const jobPrice = parseFloat(job.price) || 0; // Get the price of the job, defaulting to 0 if not set

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
          totalRevenue:
            customerGroups[source.droppableId].totalRevenue - jobPrice, // Subtract job price from source group
        },
        [destination.droppableId]: {
          ...customerGroups[destination.droppableId],
          items: destClone,
          totalRevenue:
            customerGroups[destination.droppableId].totalRevenue + jobPrice, // Add job price to destination group
        },
      };
      updateJobStatus({
        id: job.id,
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

  const toggleViewAll = (groupId) => {
    setViewAllStatus((prevStatus) => ({
      ...prevStatus,
      [groupId]: !prevStatus[groupId], // Toggle the boolean value
    }));
  };

  const activeGroups = ["group-1", "group-2", "group-3"];
  const openJobCount = activeGroups.reduce(
    (n, id) => n + (customerGroups[id]?.items.length || 0),
    0
  );
  const pipelineValue = activeGroups.reduce(
    (n, id) => n + (customerGroups[id]?.totalRevenue || 0),
    0
  );
  const formatMoney = (n) =>
    n.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  return (
    <Box
      sx={{
        pt: { xs: 5, sm: 6 },
        pb: theme.spacing(7), // Bottom padding to avoid overlap with Footer
        display: "flex",
        flexDirection: "column", // Stack children vertically
        textAlign: "left",
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "flex-end" },
            justifyContent: "space-between",
            gap: 2,
            px: { xs: 2, sm: 1 },
            mb: 2.5,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ color: "#fff", fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
              {openJobCount} active jobs · {formatMoney(pipelineValue)} in the pipeline
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<PersonAddAlt1Icon />}
              onClick={() => setEditingCustomer({})}
              sx={{
                flex: { xs: 1, md: "none" },
                whiteSpace: "nowrap",
                color: "#fff",
                borderColor: "rgba(255,255,255,0.25)",
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.5)",
                  bgcolor: "rgba(255,255,255,0.06)",
                },
              }}
            >
              New Customer
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setEditingJob({})}
              sx={{ flex: { xs: 1, md: "none" } }}
            >
              New Job
            </Button>
          </Box>
        </Box>
        <Box sx={{ px: { xs: 2, sm: 1 }, mb: 1 }}>
          <SearchBar
            onSelect={setEditingCustomer}
            data={customers.map((customer) => {
              let labelKey = customer.name;
              return { ...customer, labelKey };
            })}
          />
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: showArchived
                ? "repeat(5, minmax(0, 1fr))"
                : "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
            p: { xs: 2, sm: 1 },
            pt: { xs: 2, sm: 2 },
            alignItems: "start",
          }}
        >
          {Object.entries(customerGroups).map(
            ([groupId, group]) =>
              (groupId !== "group-5" || showArchived) && (
                <Droppable droppableId={groupId} key={groupId}>
                  {(provided, snapshot) => (
                    <Box
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      sx={{
                        backgroundColor: snapshot.isDraggingOver
                          ? alpha(group.color, 0.08)
                          : theme.palette.background.paper,
                        p: 1.5,
                        borderRadius: "14px",
                        border: `1px solid ${
                          snapshot.isDraggingOver
                            ? alpha(group.color, 0.6)
                            : "transparent"
                        }`,
                        boxShadow: "0 1px 2px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.18)",
                        color: theme.palette.text.primary,
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0,
                        transition: "background-color 150ms, border-color 150ms",
                      }}
                    >
                      <Box sx={{ px: 0.5, pt: 0.5, pb: 1.25 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              bgcolor: group.color,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 700, flex: 1, wordBreak: "break-word" }}
                          >
                            {group.name}
                          </Typography>
                          <Box
                            sx={{
                              px: 1,
                              py: 0.125,
                              borderRadius: 999,
                              bgcolor: alpha(group.color, 0.14),
                              fontSize: "0.75rem",
                              fontWeight: 700,
                            }}
                          >
                            {group.items.length}
                          </Box>
                        </Box>
                        <Typography
                          component="div"
                          sx={{
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            color: "success.main",
                            mt: 0.5,
                          }}
                        >
                          Total Revenue: ${group.totalRevenue.toFixed(2)}
                        </Typography>
                      </Box>
                      {group.items
                        .slice(
                          0,
                          viewAllStatus[groupId] ? group.items.length : 20 // show up to 20 newest by default
                        )
                        .map((job, index) => (
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
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  backgroundColor: snapshot.isDragging
                                    ? "#ffffff"
                                    : alpha(group.color, 0.09),
                                  borderLeft: `3px solid ${group.color}`,
                                  px: 1.25,
                                  py: 1,
                                  mb: 0.75,
                                  borderRadius: "8px",
                                  boxShadow: snapshot.isDragging
                                    ? "0 12px 28px rgba(0,0,0,0.25)"
                                    : "none",
                                  cursor: "grab",
                                  fontSize: "0.9rem",
                                  fontWeight: 500,
                                  lineHeight: 1.35,
                                  color: theme.palette.text.primary,
                                  transition: "background-color 120ms",
                                  "&:hover": {
                                    backgroundColor: alpha(group.color, 0.16),
                                  },
                                }}
                              >
                                <Box sx={{ flex: 1, minWidth: 0, wordBreak: "break-word" }}>
                                  {job.name}
                                </Box>
                                {parseFloat(job.price) > 0 && (
                                  <Box
                                    sx={{
                                      fontSize: "0.75rem",
                                      fontWeight: 600,
                                      color: "text.secondary",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    ${parseFloat(job.price).toLocaleString()}
                                  </Box>
                                )}
                              </Box>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                      {group.items.length === 0 && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textAlign: "center", py: 2 }}
                        >
                          No jobs
                        </Typography>
                      )}
                      {group.items.length > 20 && (
                        <Button
                          onClick={() => toggleViewAll(groupId)}
                          variant="text"
                          size="small"
                          sx={{ mt: 0.5, alignSelf: "center" }}
                        >
                          {viewAllStatus[groupId]
                            ? "View Less"
                            : `View All (${group.items.length})`}
                        </Button>
                      )}
                    </Box>
                  )}
                </Droppable>
              )
          )}
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
      <Button
        onClick={() => setShowArchived(!showArchived)}
        variant="text"
        startIcon={<Inventory2OutlinedIcon />}
        sx={{
          mt: 2,
          mb: 5,
          alignSelf: "center",
          color: "rgba(255,255,255,0.7)",
          "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.06)" },
        }}
      >
        {showArchived ? "Hide Archived Jobs" : "Show Archived Jobs"}
      </Button>
    </Box>
  );
};

export default WorkingBoard;
