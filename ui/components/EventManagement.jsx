import { useState } from "react";
import { EventList } from "./EventList";
import EventFormModal from "./EventFormModal";
import { useQuery } from "@tanstack/react-query";
import { Button, LinearProgress } from "@mui/material";
import { ToastContainer } from 'react-toastify';
import { fetchEventListFn } from "../apis/eventAPIs";
import { QueryKeys } from '../utils/queryKeys'
import { Error } from "./ErrorComponent";
import 'react-toastify/dist/ReactToastify.css';
import { CalendarUI } from "./CalendarUI";
import { useEventContext } from "../context/EventContext";

export const EventManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedEvent } = useEventContext();

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
      <Button variant={selectedEvent ? "outlined" : "contained"} onClick={handleOpen}>
        {selectedEvent ? 'Edit' : 'Add'} Event
      </Button>
      <EventFormModal
        event={selectedEvent}
        handleClose={handleClose}
        isOpen={isOpen}
      />
      <EventList events={data.data} />
      <ToastContainer autoClose={3000} position="top-right" />
      <CalendarUI events={data.data} />
    </div>
  );
};