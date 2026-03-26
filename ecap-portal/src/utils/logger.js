// ─── Event Logger ──────────────────────────────────────────────
// All login/logout/modifications stored on event basis
// In production, POST each entry to /api/logs → MySQL `event_logs` table

class EventLogger {
  constructor() {
    this.logs = [];
  }

  log(event, user, details = '') {
    const entry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      event,
      user: user || 'SYSTEM',
      details,
    };
    this.logs.unshift(entry);
    // In production: POST to backend
    // fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) });
    console.log(`[ECAP LOG] ${entry.timestamp} | ${event} | ${user} | ${details}`);
    return entry;
  }

  getLogs() {
    return this.logs;
  }

  exportAsText() {
    const divider = '─'.repeat(80);
    const header = `ECAP Portal — Event Log Export\nExported: ${new Date().toISOString()}\n${divider}\nTimestamp | Event | User | Details\n${divider}\n`;
    const body = this.logs
      .map((l) => `${l.timestamp} | ${l.event} | ${l.user} | ${l.details}`)
      .join('\n');
    return header + body;
  }
}

// Singleton instance
const logger = new EventLogger();
export default logger;
