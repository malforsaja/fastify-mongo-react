import { useState } from "react";
import { EventList } from "./EventList";
import EventFormModal from "./EventFormModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, LinearProgress } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import { createEventFn, deleteEventFn, fetchEventListFn, updateEventFn } from "../apis/eventAPIs";
import { QueryKeys } from '../utils/queryKeys'
import { Error } from "./ErrorComponent";
import 'react-toastify/dist/ReactToastify.css';
import { CalendarUI } from "./CalendarUI";

export const EventManagement = () => {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [errorResponse, setErrorResponse] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const queryClient = useQueryClient();

  const { mutate: createEvent } = useMutation((event) => createEventFn(event), {
    onSuccess: () => {
      // Invalidate and refetch
      setSelectedEvent(null);
      queryClient.invalidateQueries({ queryKey: [QueryKeys.EVENTS] })
      toast.success('Event created successfully');
      setErrorResponse(null);
    },
    onError: (error) => {
      setErrorResponse(error?.response?.data);
      toast.error(error?.response?.data?.message);
    },
  });

  const { mutate: updateEvent } = useMutation((event) =>
    updateEventFn(event),
    {
      onSuccess: () => {
        setSelectedEvent(null);
        queryClient.invalidateQueries([QueryKeys.EVENTS]);
        toast.success('Event updated successfully');
        setErrorResponse(null);
      },
      onError: (error) => {
        setErrorResponse(error.response.data);
        toast.error(error.response.data.message);
      },
    }
  );

  const { mutate: deleteEvent } = useMutation((id) => deleteEventFn(id), {
    onSuccess() {
      setSelectedEvent(null);
      queryClient.invalidateQueries([QueryKeys.EVENTS]);
      toast.success('Event deleted successfully');
    },
    onError(error) {
      setErrorResponse(error.response.data);
      toast.error(error.response.data.message);
    },
  });

  const { isLoading, error, data } = useQuery({
    queryKey: [QueryKeys.EVENTS],
    queryFn: () => fetchEventListFn(),
  });

  if (isLoading) return <LinearProgress />;

  if (error) {
    if (error.response?.status) {
      return <>There is no events on the list</>;
    }
    return <Error message={error.message} />;
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleAddOrUpdateEvent = (event) => {
    if (!event.id) {
      createEvent(event)
    } else {
      console.log('update event', event);
      updateEvent(event)
    }
  };

  const handleDeleteEvent = (event) => {
    deleteEvent(event.id);
  };

  const handleCheckboxChange = (e) => {
    const eventId = e.target.value;
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedEventId(eventId);
    } else {
      setSelectedEventId('');
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Button variant={selectedEvent ? "outlined" : "contained"} onClick={handleOpen}>
        {selectedEvent ? 'Edit' : 'Add'} Event
      </Button>
      <EventFormModal
        event={selectedEvent}
        onSubmit={handleAddOrUpdateEvent}
        onDelete={handleDeleteEvent}
        handleClose={handleClose}
        isOpen={isOpen}
        errorResponse={errorResponse}
      />
      <EventList
        events={data.data}
        onSelectEvent={handleSelectEvent}
        handleCheckboxChange={handleCheckboxChange}
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
      />
      <ToastContainer autoClose={3000} position="top-right" />
      <CalendarUI events={data.data} />
    </div>
  );
};