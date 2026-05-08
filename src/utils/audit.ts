export const logAuditActivity = (action: string, module: string, details: string) => {
  try {
    const rawLogs = localStorage.getItem('aqm_activity_log');
    let logs = rawLogs ? JSON.parse(rawLogs) : [];
    
    let user = 'Unknown User';
    const userRaw = localStorage.getItem('userProfile');
    if (userRaw) {
      try {
        user = JSON.parse(userRaw)?.name || 'Unknown User';
      } catch(e) {}
    }

    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      user: user,
      action: action,
      module: module,
      details: details,
      ipAddress: '127.0.0.1', // Assuming localhost or placeholder due to client-side only
      status: 'Success'
    };

    logs.unshift(newLog);
    
    // limit total logs to avoid localstorage quota issues
    const maxLogs = 500;
    if (logs.length > maxLogs) {
      logs = logs.slice(0, maxLogs);
    }
    
    localStorage.setItem('aqm_activity_log', JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to log audit activity:', err);
  }
};
