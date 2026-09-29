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

    // Handle new civic issue submission
    socket.on('issue:new', (newIssue) => {
      console.log(`[Socket.io] New issue broadcasted: ${newIssue?.title || newIssue?.id}`);
      // Broadcast to all connected clients including sender
      io.emit('issue:created', {
        issue: newIssue,
        broadcastTime: new Date().toISOString(),
        senderId: socket.id,
      });
    });

    // Handle community issue confirmation / upvote
    socket.on('issue:confirm', (payload) => {
      console.log(`[Socket.io] Issue confirmed: ${payload?.id}`);
      io.emit('issue:confirmed', {
        ...payload,
        broadcastTime: new Date().toISOString(),
        senderId: socket.id,
      });
    });

    // Handle authority status changes & timeline audits
    socket.on('issue:statusChange', (payload) => {
      console.log(`[Socket.io] Issue status changed: ${payload?.id} -> ${payload?.newStatus}`);
      io.emit('issue:updated', {
        ...payload,
        broadcastTime: new Date().toISOString(),
        senderId: socket.id,
      });
    });

    // Handle citizen resolution verification vote
    socket.on('issue:vote', (payload) => {
      console.log(`[Socket.io] Issue resolution vote: ${payload?.id} -> ${payload?.vote}`);
      io.emit('issue:voted', {
        ...payload,
        broadcastTime: new Date().toISOString(),
        senderId: socket.id,
      });
    });

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
