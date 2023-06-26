import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import PropTypes from 'prop-types';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export const CalendarUI = ({ events }) => {
  return (
    <div>
      <Calendar
        localizer={localizer}
        events={(events || []).map(event => {
          return {
            ...event,
            start: new Date(event.startTime),
            end: new Date(event.endTime)
          }
        })}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

CalendarUI.propTypes = {
  events: PropTypes.array.isRequired
};