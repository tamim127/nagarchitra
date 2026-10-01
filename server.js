const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Attach Socket.io to the HTTP server
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  let connectedCount = 0;

  io.on('connection', (socket) => {
    connectedCount++;
    console.log(`[Socket.io] Client connected: ${socket.id} (Total: ${connectedCount})`);

    // Send initial online count to the connected client
    io.emit('users:count', { onlineCount: connectedCount });

    // SECURITY: Removed unauthenticated event handlers (issue:new, issue:confirm, 
    // issue:statusChange, issue:vote). All real-time broadcasts are now handled 
    // exclusively by the backend API controllers after authentication & authorization.

    // Handle ping/liveness
    socket.on('ping', () => {
      socket.emit('pong', { time: Date.now() });
    });

    socket.on('disconnect', () => {
      connectedCount = Math.max(0, connectedCount - 1);
      console.log(`[Socket.io] Client disconnected: ${socket.id} (Total: ${connectedCount})`);
      io.emit('users:count', { onlineCount: connectedCount });
    });
  });

  server.listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> NagarChitra ready with Socket.io on http://${hostname}:${port}`);
    console.log(`> Real-time civic websockets enabled.`);
  });
});
