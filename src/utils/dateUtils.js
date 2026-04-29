const monthMap = {
  'jan': 0, 'january': 0,
  'feb': 1, 'february': 1,
  'mar': 2, 'march': 2,
  'apr': 3, 'april': 3,
  'may': 4,
  'jun': 5, 'june': 5,
  'jul': 6, 'july': 6,
  'aug': 7, 'august': 7,
  'sep': 8, 'september': 8,
  'oct': 9, 'october': 9,
  'nov': 10, 'november': 10,
  'dec': 11, 'december': 11,
};

export const parseDateString = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') {
    return null;
  }

  const trimmed = dateStr.trim().toLowerCase();
  
  const match = trimmed.match(/^(\w+)\s+(\d+)(?:st|nd|rd|th)?\s+at\s+(\d+):(\d+)(am|pm)$/i);
  
  if (!match) {
    return null;
  }

  const [, monthStr, dayStr, hourStr, minuteStr, period] = match;
  const month = monthMap[monthStr.toLowerCase()];
  
  if (month === undefined) {
    return null;
  }

  const day = parseInt(dayStr, 10);
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (period.toLowerCase() === 'pm' && hour < 12) {
    hour += 12;
  } else if (period.toLowerCase() === 'am' && hour === 12) {
    hour = 0;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  
  const date = new Date(currentYear, month, day, hour, minute, 0);
  
  if (date.getMonth() !== month || date.getDate() !== day) {
    return null;
  }

  return date;
};

export const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isOverdue = (date) => {
  if (!date) return false;
  const now = new Date();
  return date < now;
};

export const compareByDate = (taskA, taskB) => {
  const dateA = parseDateString(taskA.day);
  const dateB = parseDateString(taskB.day);

  if (!dateA && !dateB) return 0;
  if (!dateA) return 1;
  if (!dateB) return -1;

  return dateA - dateB;
};

export const sortTasksByReminderTime = (tasks) => {
  return [...tasks].sort(compareByDate);
};

export const filterTasks = (tasks, filterType) => {
  switch (filterType) {
    case 'today':
      return tasks.filter((task) => {
        const date = parseDateString(task.day);
        return isToday(date);
      });
    case 'overdue':
      return tasks.filter((task) => {
        const date = parseDateString(task.day);
        return isOverdue(date);
      });
    case 'all':
    default:
      return tasks;
  }
};
