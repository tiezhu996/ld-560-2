export interface AuditLogEntry {
  type: 'ws' | 'alert' | 'export';
  time: string;
  detail: string;
}

const queue: AuditLogEntry[] = [];

export function recordAuditLog(type: AuditLogEntry['type'], detail: string) {
  queue.unshift({ type, detail, time: new Date().toISOString() });
  if (queue.length > 200) queue.pop();
}

export function exportAuditLogs() {
  recordAuditLog('export', '导出审计日志');
  return [...queue];
}
