import { Checkbox, List, ListItem, ListItemText, Typography } from "@mui/material";
import { format } from "date-fns";
import PropTypes from 'prop-types';
import { useEventContext } from "../context/EventContext";

const EventList = ({ events  }) => {
  /* const handleListItemClick = (event) => {
    const eventId = event.id;
    //setSelectedEventId(eventId);
    onSelectEvent(event);
  }; */
  const {
    selectedEventId,
    handleCheckboxChange,
    handleSelectEvent,
  } = useEventContext();

  return (
    <div>
      <List>
        {events.map((event) => (
          <ListItem key={event.id} onClick={() => handleSelectEvent(event)}>
            <Checkbox
              checked={event.id === selectedEventId}
              onChange={handleCheckboxChange}
              value={event.id}
            />
            <ListItemText
              primary={event.title}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    Start Time: {format(new Date(event.startTime), 'yyyy-MM-dd HH:mm')}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="text.primary">
                    End Time: {format(new Date(event.endTime), 'yyyy-MM-dd HH:mm')}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="text.primary">
                    Notes: {event.notes}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

EventList.propTypes = {
  events: PropTypes.array.isRequired,
  //onSelectEvent: PropTypes.func.isRequired,
  //handleCheckboxChange: PropTypes.func.isRequired,
  //selectedEventId: PropTypes.string.isRequired,
  //setSelectedEventId: PropTypes.func.isRequired
};

export { EventList }