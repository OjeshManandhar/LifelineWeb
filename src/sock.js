import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_BASE_URL);

socket.on('message', data => console.log('message:', data));

socket.on('driver_gps', data => console.log('driver_gps:', data));
socket.on('driver_route', data => console.log('driver_route:', data));
socket.on('obstruction', data => console.log('obstruction:', data));
socket.on('traffic_gps', data => console.log('traffic_gps:', data));

const driver_gps = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: 0
  },
  properties: {
    role: 'driver',
    contact: '9863198269'
  }
};
setInterval(() => {
  driver_gps.geometry.coordinates += 10;

  socket.emit('driver_gps', { operation: 'update', driver_gps });
}, 10 * 1000);

const driver_route = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [0, 0]
  },
  properties: {
    role: 'driver',
    contact: '9863198269'
  }
};
setInterval(() => {
  driver_route.geometry.coordinates[0] += 25;
  driver_route.geometry.coordinates[1] += 25;

  socket.emit('driver_route', { operation: 'update', driver_route });
}, 25 * 1000);
