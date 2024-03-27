import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

const initialCustomerGroups = {
  'group-1': {
    id: 'group-1',
    name: 'Opportunities',
    color: '#FFD700',
    items: [
      { id: 'customer-1', content: 'Customer 1' },
      { id: 'customer-2', content: 'Customer 2' },
    ],
  },
  'group-2': {
    id: 'group-2',
    name: 'Pending',
    color: '#FF8C00',
    items: [
      { id: 'customer-3', content: 'Customer 3' },
      { id: 'customer-4', content: 'Customer 4' },
    ],
  },
  'group-3': {
    id: 'group-3',
    name: 'Upcoming Jobs',
    color: '#1E90FF',
    items: [
      { id: 'customer-5', content: 'Customer 5' },
      { id: 'customer-6', content: 'Customer 6' },
    ],
  },
  'group-4': {
    id: 'group-4',
    name: 'Completed Jobs',
    color: '#32CD32',
    items: [
      { id: 'customer-7', content: 'Customer 7' },
      { id: 'customer-8', content: 'Customer 8' },
    ],
  },
};

console.log('Initial Groups:', initialCustomerGroups);

const WorkingBoard = () => {
  const [customerGroups, setCustomerGroups] = useState(initialCustomerGroups);
  const theme = useTheme();

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
      setCustomerGroups(newState);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          padding: theme.spacing(2),
          backgroundColor: theme.palette.background.primary,
          gap: theme.spacing(2),
          margin: 'auto',
          flexWrap: 'wrap',
          overflowY: 'auto',
          maxWidth: '100%',
          maxHeight: `calc(100vh - ${theme.spacing(30)})`,
          '& > *': {
            flex: '1 1 auto',
            width: {
              xs: '100%',
              sm: '48%',
              md: '30%',
              lg: 'auto',
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
                <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
                  {group.name}
                </Typography>
                {group.items.map((customer, index) => (
                  <Draggable
                    key={customer.id}
                    draggableId={customer.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          backgroundColor: snapshot.isDragging
                            ? alpha(theme.palette.action.hover, 0.8)
                            : alpha(group.color, 0.7),
                          padding: theme.spacing(1),
                          margin: theme.spacing(1),
                          borderRadius: theme.shape.borderRadius,
                          boxShadow: 1,
                          cursor: 'grab',
                          color: theme.palette.getContrastText(alpha(group.color, 0.7)),
                        }}
                      >
                        {customer.content}
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                <Button variant="contained" color="primary" sx={{ mt: 1 }}>
                  + New
                </Button>
              </Box>
            )}
          </Droppable>
        ))}
      </Box>
    </DragDropContext>
  );
};

export default WorkingBoard;
