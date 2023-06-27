/* eslint-disable react/prop-types */
import { TextField, Button, Modal, Box, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Controller, useForm } from "react-hook-form";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { zodResolver } from "@hookform/resolvers/zod";
import { validationSchema } from "../utils/validations";
import { red } from "@mui/material/colors";
import { useEffect } from "react";

const EventFormModal = ({ event, onSubmit, onDelete, handleClose, isOpen, errorResponse }) => {
  const { handleSubmit, register, control, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(validationSchema)
  });

  const handleFormSubmit = (data) => {
    onSubmit({ ...event, ...data });
  };

  const handleFormDelete = () => {
    onDelete(event);
  };

  useEffect(() => {
    if (event) {
      setValue("title", event.title || "");
      setValue("notes", event.notes || "");
      setValue("startTime", event.startTime ? new Date(event.startTime) : null);
      setValue("endTime", event.endTime ? new Date(event.endTime) : null);
    } else {
      setValue("title", "");
      setValue("notes", "");
      setValue("startTime", null);
      setValue("endTime", null);
    }
  }, [event, setValue]);

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
                render={({ field }) => (
                  <TextField
                    style={{ marginBottom: -5 }}
                    label="Title"
                    {...field}
                    {...register("title", { required: "Title is required" })}
                    fullWidth
                    margin="normal"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />

              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    style={{ marginBottom: 10 }}
                    label="Notes"
                    multiline
                    {...field}
                    {...register("notes", { required: false })}
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
                <Button onClick={handleFormDelete} variant="outlined">
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
