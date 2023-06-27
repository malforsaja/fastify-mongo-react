import { createContext, useContext, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEventFn, deleteEventFn, updateEventFn } from '../apis/eventAPIs';
import { QueryKeys } from '../utils/queryKeys';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventContext = createContext();

export const useEventContext = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [errorResponse, setErrorResponse] = useState(null);
  const queryClient = useQueryClient();

  const { mutate: createEvent } = useMutation((event) => createEventFn(event), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.EVENTS] });
      toast.success('Event created successfully');
      setErrorResponse(null);
    },
    onError: (error) => {
      setErrorResponse(error?.response?.data);
      toast.error(error?.response?.data?.message);
    },
  });

  const { mutate: updateEvent } = useMutation((event) => updateEventFn(event), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.EVENTS]);
      toast.success('Event updated successfully');
      setErrorResponse(null);
    },
    onError: (error) => {
      setErrorResponse(error?.response?.data);
      toast.error(error?.response?.data?.message);
    },
  });

  const { mutate: deleteEvent } = useMutation((id) => deleteEventFn(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.EVENTS]);
      toast.success('Event deleted successfully');
    },
    onError: (error) => {
      setErrorResponse(error?.response?.data);
      toast.error(error?.response?.data?.message);
    },
  });

  const handleSelectEvent = (event) => {
    // setSelectedEventId(eventId);
    // Set the selectedEvent using the fetched data or fetch the event details separately
    //const event = data.find((event) => event.id === eventId);
    setSelectedEvent(event);
  };

  const handleCheckboxChange = (e) => {
    const eventId = e.target.value;
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedEventId(eventId);
      //setSelectedEvent(data.data.find((event) => event.id === eventId));
    } else {
      setSelectedEventId('');
      //setSelectedEvent(null);
    }
  };

  const handleAddOrUpdateEvent = (event) => {
    if (!event.id) {
      createEvent(event);
    } else {
      updateEvent(event);
    }
  };

  const handleDeleteEvent = (eventId) => {
    deleteEvent(eventId);
  };

  const eventContextValue = useMemo(() => ({
    selectedEventId,
    selectedEvent,
    errorResponse,
    setSelectedEvent,
    handleSelectEvent,
    handleAddOrUpdateEvent,
    handleDeleteEvent,
    handleCheckboxChange,
    setSelectedEventId,
  }), []);

  return (
    <EventContext.Provider value={eventContextValue}>{children}</EventContext.Provider>
  );
};

EventProvider.propTypes = {
  children: PropTypes.node.isRequired,
};