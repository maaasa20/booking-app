'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const TIME_SLOTS = ['10:00', '12:00', '14:00'];
const MAX_CAPACITY = 30;
const DAYS_TO_DISPLAY = 7;

export default function Home() {
  const router = useRouter();
  const [dates, setDates] = useState<string[]>([]);
  const [reservations, setReservations] = useState<Record<string, number>>({});

  useEffect(() => {
    const dList = [];
    const today = new Date();
    for (let i = 0; i < DAYS_TO_DISPLAY; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dList.push(d.toISOString().split('T')[0]);
    }
    setDates(dList);

    fetch('/api/reserve').then(r => r.json()).then(setReservations);
  }, []);

  const goToConfirm = (date: string, time: string) => {
    router.push(`/confirm?date=${date}&time=${time}`);
  };

  return (
    <main className="p-4 min-h-screen bg-gray-50 text-center">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">予約カレンダー</h1>
      <div className="overflow-x-auto shadow-lg rounded-lg inline-block">
        <table className="text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th className="px-4 py-3 sticky left-0 bg-gray-200">時間</th>
              {dates.map(date => <th key={date} className="px-4 py-3 border-l border-gray-300">{date}</th>)}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map(time => (
              <tr key={time} className="bg-white border-b">
                <td className="px-4 py-3 font-medium text-gray-900 sticky left-0 bg-white shadow-sm">{time}</td>
                {dates.map(date => {
                  const key = `${date}_${time}`;
                  const count = reservations[key] || 0;
                  const isFull = count >= MAX_CAPACITY;
                  return (
                    <td key={key} className="px-2 py-2 text-center border-l border-gray-100">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-xs ${isFull ? 'text-red-500' : 'text-green-600'}`}>{count}/{MAX_CAPACITY}</span>
                        {isFull ? <span className="text-xs bg-gray-200 px-2 py-1 rounded">満席</span> : 
                          <button onClick={() => goToConfirm(date, time)} className="bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700">選択</button>
                        }
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}