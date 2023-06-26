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
import { useEventContext } from "../context/EventContext";

export const EventManagement = () => {
  //const [selectedEventId, setSelectedEventId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  //const [errorResponse, setErrorResponse] = useState(null);
  //const [selectedEvent, setSelectedEvent] = useState(null);

  const {
    selectedEventId,
    selectedEvent,
    errorResponse,
  } = useEventContext();

  /* const { mutate: createEvent } = useMutation((event) => createEventFn(event), {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [QueryKeys.EVENTS] })
      toast.success('Event created successfully');
      //setSelectedEvent(null);
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
        queryClient.invalidateQueries([QueryKeys.EVENTS]);
        toast.success('Event updated successfully');
        //setSelectedEvent(null);
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
      queryClient.invalidateQueries([QueryKeys.EVENTS]);
      toast.success('Event deleted successfully');
      //setSelectedEvent(null);
    },
    onError(error) {
      setErrorResponse(error.response.data);
      toast.error(error.response.data.message);
    },
  }); */

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

  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {console.log('selected', selectedEventId)}
      <Button variant={selectedEventId ? "outlined" : "contained"} onClick={handleOpen}>
        {selectedEventId ? 'Edit' : 'Add'} Event
      </Button>
      <EventFormModal
        //event={selectedEventId ? selectedEvent : null}
        // onSubmit={() => handleAddOrUpdateEvent(selectedEvent)}
        // onDelete={() => handleDeleteEvent(selectedEventId)}
        handleClose={handleClose}
        isOpen={isOpen}
        //errorResponse={errorResponse}
      />
      <EventList
        events={data.data}
      />
      <ToastContainer autoClose={3000} position="top-right" />
      <CalendarUI events={data.data} />
    </div>
  );
};