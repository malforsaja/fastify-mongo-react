import { z } from 'zod';
import { isBefore } from 'date-fns';

const validationSchema = z.object({
  title: z.string().nonempty(),
  notes: z.string(),
  startTime: z.date(),
  endTime: z.date(),
}).refine(({ startTime, endTime }) => isBefore(new Date(startTime), new Date(endTime)), {
  message: 'Start time must be before end time',
  path: ['startTime'],
});

export {
  validationSchema
}