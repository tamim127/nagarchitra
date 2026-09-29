'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Issue, IssueStatus, StatusHistoryEntry } from '@/types';

export interface RealtimeAlert {
  id: string;
  type: 'NEW_ISSUE' | 'CONFIRM' | 'STATUS_CHANGE' | 'VOTE';
  title: string;
  titleBn: string;
  message: string;
  messageBn: string;
  issueId?: string;
  timestamp: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineCount: number;
  lastAlert: RealtimeAlert | null;
  clearAlert: () => void;
  emitNewIssue: (issue: Issue) => void;
  emitConfirmIssue: (id: string, count: number, userConfirmed: boolean) => void;
  emitStatusChange: (payload: {
    id: string;
    newStatus: IssueStatus;
    note: string;
    noteBn?: string;
    evidenceUrl?: string;
    assignedDepartment?: string;
    assignedOfficer?: string;
    timelineEntry: StatusHistoryEntry;
  }) => void;
  emitVote: (payload: {
    id: string;
    vote: 'FIXED' | 'STILL_EXISTS';
    fixedCount: number;
    stillExistsCount: number;
    status: IssueStatus;
    timelineEntry?: StatusHistoryEntry;
  }) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1);
  const [lastAlert, setLastAlert] = useState<RealtimeAlert | null>(null);
  const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showAlert = useCallback((alert: RealtimeAlert) => {
    setLastAlert(alert);
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    alertTimeoutRef.current = setTimeout(() => {
      setLastAlert(null);
    }, 6000);
  }, []);

  const clearAlert = useCallback(() => {
    setLastAlert(null);
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    // Only connect in browser environment
    if (typeof window === 'undefined') return;

    // Use current origin so works on localhost, 0.0.0.0, or production domain
    const socketInstance = io({
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
      autoConnect: true,
    });

    socketInstance.on('connect', () => {
      console.log('[SocketClient] Connected to NagarChitra real-time server with id:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('[SocketClient] Disconnected from real-time server:', reason);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.warn('[SocketClient] Connection error (falling back to local state):', error.message);
      setIsConnected(false);
    });

    socketInstance.on('users:count', (data: { onlineCount: number }) => {
      if (typeof data?.onlineCount === 'number') {
        setOnlineCount(data.onlineCount);
      }
    });

    // Alert listeners
    socketInstance.on('issue:created', (data: { issue: Issue; senderId: string }) => {
      // Don't show toast to the exact submitter if they already see it, but here we can show live alert!
      if (data?.issue) {
        showAlert({
          id: `alert-${Date.now()}`,
          type: 'NEW_ISSUE',
          title: 'New Issue Reported Live',
          titleBn: 'নতুন সমস্যা লাইভ রিপোর্ট করা হয়েছে',
          message: `${data.issue.title} in ${data.issue.location?.area || 'Dhaka'}`,
          messageBn: `${data.issue.location?.area || 'ঢাকা'} এলাকায়: ${data.issue.titleBn || data.issue.title}`,
          issueId: data.issue.id,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    });

    socketInstance.on('issue:updated', (data: { id: string; newStatus: IssueStatus; note?: string; senderId: string }) => {
      if (data?.id) {
        showAlert({
          id: `alert-${Date.now()}`,
          type: 'STATUS_CHANGE',
          title: 'Status Updated Live',
          titleBn: 'সমস্যার অগ্রগতি লাইভ আপডেট',
          message: `Issue updated to: ${data.newStatus.replace('_', ' ')}`,
          messageBn: `স্ট্যাটাস পরিবর্তন: ${data.newStatus}`,
          issueId: data.id,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    });

    socketInstance.on('issue:voted', (data: { id: string; vote: string; senderId: string }) => {
      if (data?.id) {
        showAlert({
          id: `alert-${Date.now()}`,
          type: 'VOTE',
          title: 'Citizen Verification Vote Cast',
          titleBn: 'নাগরিক যাচাইকরণ ভোট যুক্ত হয়েছে',
          message: `A resident cast a verification vote (${data.vote === 'FIXED' ? 'Resolved' : 'Still Exists'})`,
          messageBn: `এক নাগরিক সমাধান যাচাইয়ে ভোট দিয়েছেন (${data.vote === 'FIXED' ? 'সমাধান হয়েছে' : 'সমস্যা বহাল আছে'})`,
          issueId: data.id,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, [showAlert]);

  const emitNewIssue = useCallback(
    (issue: Issue) => {
      if (socket && isConnected) {
        socket.emit('issue:new', issue);
      }
    },
    [socket, isConnected]
  );

  const emitConfirmIssue = useCallback(
    (id: string, count: number, userConfirmed: boolean) => {
      if (socket && isConnected) {
        socket.emit('issue:confirm', { id, count, userConfirmed });
      }
    },
    [socket, isConnected]
  );

  const emitStatusChange = useCallback(
    (payload: {
      id: string;
      newStatus: IssueStatus;
      note: string;
      noteBn?: string;
      evidenceUrl?: string;
      assignedDepartment?: string;
      assignedOfficer?: string;
      timelineEntry: StatusHistoryEntry;
    }) => {
      if (socket && isConnected) {
        socket.emit('issue:statusChange', payload);
      }
    },
    [socket, isConnected]
  );

  const emitVote = useCallback(
    (payload: {
      id: string;
      vote: 'FIXED' | 'STILL_EXISTS';
      fixedCount: number;
      stillExistsCount: number;
      status: IssueStatus;
      timelineEntry?: StatusHistoryEntry;
    }) => {
      if (socket && isConnected) {
        socket.emit('issue:vote', payload);
      }
    },
    [socket, isConnected]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        onlineCount,
        lastAlert,
        clearAlert,
        emitNewIssue,
        emitConfirmIssue,
        emitStatusChange,
        emitVote,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
