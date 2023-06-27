import axios from 'axios';

const privateApi = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});

export const fetchEventListFn = async (offset = 0, limit = 10) => {
  const { data } = await privateApi.get(`/events?offset=${offset}&limit=${limit}`);
  return data;
};

export const fetchEventFn = async (id) => {
  const { data } = await privateApi.get(`/events/${id}`);
  return data;
}

export const createEventFn = async (event) => {
  const { data } = await privateApi.post('/events', event);
  return data;
}

export const updateEventFn = async (event) => {
  const { data } = await privateApi.put(`/events/${event.id}`, event);
  return data;
}

export const deleteEventFn = async (id) => {
  const { data } = await privateApi.delete(`/events/${id}`);
  return data;
}
