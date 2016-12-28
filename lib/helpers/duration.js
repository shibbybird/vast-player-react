
export const getVastDurationInMillis = (timeString) => {
  const timeStr = timeString || '00:00:00';
  const arr = timeStr.split(':');
  const timeArr = arr.slice(0, 2).concat(arr[2].split('.')).map(parseFloat);
  const hours = timeArr[0];
  const minutes = timeArr[1];
  const seconds = timeArr[2];
  const milliseconds = timeArr.length > 3 ? timeArr[3] : 0;
  return (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
};
