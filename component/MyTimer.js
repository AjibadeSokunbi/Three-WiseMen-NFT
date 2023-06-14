import React from 'react';
import { useTimer } from 'react-timer-hook';

export default function MyTimer({ expiryTimestamp }) {
  const {
    seconds,
    minutes,


  } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });


  return (
    <div >
      <div>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  );
}