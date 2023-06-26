/* eslint-disable react/prop-types */
import { TextField, Button, Modal, Box, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Controller, useForm } from "react-hook-form";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { zodResolver } from "@hookform/resolvers/zod";
import { validationSchema } from "../utils/validations";
import { red } from "@mui/material/colors";
import { useEventContext } from "../context/EventContext";

const EventFormModal = ({ handleClose, isOpen }) => {
  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(validationSchema)
  });

  const {
    selectedEvent: event,
    errorResponse,
    handleAddOrUpdateEvent,
    handleDeleteEvent,
  } = useEventContext();

  const handleFormSubmit = (data) => {
    handleAddOrUpdateEvent({ ...event, ...data });
  };


  console.log('event', event);
  return (
    <div>
      <Modal open={isOpen} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 5,
            m: 2,
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Controller
                name="title"
                control={control}
                defaultValue={event?.title || ""}
                rules={{ required: "Title is required" }}
                render={({ field }) => {
                  console.log('field', field);
                  return (
                    <TextField
                      style={{ marginBottom: -5 }}
                      label="Title"
                      {...field}
                      fullWidth
                      margin="normal"
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                  )
                }}
              />

              <Controller
                name="notes"
                control={control}
                defaultValue={event?.notes || ""}
                rules={{ required: false }}
                render={({ field }) => (
                  <TextField
                    style={{ marginBottom: 10 }}
                    label="Notes"
                    multiline
                    {...field}
                    fullWidth
                    margin="normal"
                    error={!!errors.notes}
                    helperText={errors.notes?.message}
                  />
                )}
              />

              <div className="date-time-picker">
              <Controller
                name="startTime"
                control={control}
                defaultValue={event?.startTime ? new Date(event.startTime) : null}
                rules={{
                  required: "Start Time is required"
                }}
                render={({ field }) => {
                  return (
                    <DateTimePicker
                      className="date-time-picker"
                      label="Start Time"
                      value={field.value || null}
                      onChange={field.onChange}
                      minDateTime={new Date()}
                      /* renderInput={(params) => (
                        <TextField {...params} fullWidth margin="normal" />
                      )} */
                      slotProps={{
                        textField: {
                          variant: 'outlined',
                          fullWidth: true,
                          error: !!errors?.startTime,
                          helperText: errors?.startTime?.message
                        }
                      }}
                    />
                  )
                }}
              />
              </div>
              <div className="date-time-picker">
              <Controller
                name="endTime"
                control={control}
                defaultValue={event?.endTime ? new Date(event.endTime) : null}
                rules={{ required: "End Time is required" }}
                render={({ field }) => (
                  <DateTimePicker
                    label="End Time"
                    value={field.value || null}
                    onChange={field.onChange}
                    minDateTime={new Date()}
                    /* renderInput={(params) => (
                      <TextField {...params} fullWidth margin="normal" />
                    )} */
                    slotProps={{
                      textField: {
                        variant: 'outlined',
                        fullWidth: true,
                        error: !!errors?.endTime,
                        helperText: errors?.endTime?.message
                      }
                    }}
                  />
                )}
              />
              </div>
              
              <hr />
              <Typography color={red[500]} fontSize={15}>
                {errorResponse?.message}
              </Typography>
              <Button type="submit" variant="contained" sx={{ mr: 2 }} disabled={!errors} >
                {event ? "Update" : "Add"}
              </Button>

              {event && (
                <Button onClick={() => handleDeleteEvent(event.id)} variant="outlined">
                  Delete
                </Button>
              )}
            </form>
          </LocalizationProvider>
        </Box>
      </Modal>
    </div>
  );
};

export default EventFormModal;
