import React, { useState, useEffect } from 'react';

interface AppTimerProps {
  startedAt: string;
  timeLimit: number;
}

const AppTimer: React.FC<AppTimerProps> = ({ startedAt, timeLimit }) => {
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    const startTimer = () => {
      if (startedAt && timeLimit > 0) {
        const startTime = new Date(startedAt).getTime();
        const endTime = startTime + timeLimit * 60 * 1000;

        const intervalId = setInterval(() => {
          const currentTime = Date.now();
          const timeDiff = Math.max(0, endTime - currentTime);

          if (timeDiff <= 0) {
            setTimeRemaining('00:00:00');
            clearInterval(intervalId);
          } else {
            setTimeRemaining(formatTimeRemaining(timeDiff));
          }
        }, 1000);

        return () => clearInterval(intervalId);
      } else {
        setTimeRemaining('00:00:00');
      }
    };

    return startTimer();
  }, [startedAt, timeLimit]);

  const formatTimeRemaining = (timeInMs: number): string => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return days > 0 
      ? `${days} day(s) ${hours}h : ${minutes}m : ${seconds}s` 
      : `${hours}h : ${minutes}m : ${seconds}s`;
  };

  const padNumber = (num: number): string => {
    return num < 10 ? '0' + num : num.toString();
  };

  return <b>{timeRemaining}</b>;
};

export default AppTimer;
