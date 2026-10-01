import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { ENV } from '../config/env.js';

let io: Server | null = null;
let connectedClientsCount = 0;

export function initSocketService(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: ENV.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket: Socket) => {
    connectedClientsCount++;
    console.log(`[Socket.io] Connected: ${socket.id} (Online users: ${connectedClientsCount})`);

    // Broadcast current online user count
    io?.emit('users:count', { onlineCount: connectedClientsCount });

    socket.on('disconnect', () => {
      connectedClientsCount = Math.max(0, connectedClientsCount - 1);
      console.log(`[Socket.io] Disconnected: ${socket.id} (Online users: ${connectedClientsCount})`);
      io?.emit('users:count', { onlineCount: connectedClientsCount });
    });

    socket.on('ping', () => {
      socket.emit('pong', { time: Date.now() });
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.io has not been initialized yet!');
  }
  return io;
}

// Helper broadcasters
export function broadcastNewIssue(issue: any) {
  if (io) {
    io.emit('issue:created', {
      issue,
      broadcastTime: new Date().toISOString(),
    });
  }
}

export function broadcastIssueConfirmation(issueId: string, count: number) {
  if (io) {
    io.emit('issue:confirmed', {
      id: issueId,
      count,
      broadcastTime: new Date().toISOString(),
    });
  }
}

export function broadcastIssueStatusUpdate(payload: {
  id: string;
  newStatus: string;
  note: string;
  department?: string;
  assignedOfficer?: string;
  evidenceUrl?: string;
  historyEntry: any;
}) {
  if (io) {
    io.emit('issue:updated', {
      ...payload,
      broadcastTime: new Date().toISOString(),
    });
  }
}

export function broadcastIssueVote(payload: {
  id: string;
  fixedCount: number;
  stillExistsCount: number;
  vote: 'FIXED' | 'STILL_EXISTS';
}) {
  if (io) {
    io.emit('issue:voted', {
      ...payload,
      broadcastTime: new Date().toISOString(),
    });
  }
}
