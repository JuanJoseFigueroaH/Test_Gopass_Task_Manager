'use client';

import { useEffect } from 'react';
import { useProjectStore } from '@/application/stores/project.store';
import { useTaskStore } from '@/application/stores/task.store';

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const initProjectWebSocket = useProjectStore((state) => state.initWebSocket);
  const initTaskWebSocket = useTaskStore((state) => state.initWebSocket);

  useEffect(() => {
    initProjectWebSocket();
    initTaskWebSocket();
  }, [initProjectWebSocket, initTaskWebSocket]);

  return <>{children}</>;
}
