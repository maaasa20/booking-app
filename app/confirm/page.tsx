'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';

function ConfirmContent() {
  const params = useSearchParams();
  const router = useRouter();
  const date = params.get('date');
  const time = params.get('time');
  const [loading, setLoading] = useState(false);

  const handleReserve = async () => {
    setLoading(true);
    const res = await fetch('/api/reserve', {
      method: 'POST',
      body: JSON.stringify({ date, time })
    });
    const data = await res.json();
    if (data.success) {
      router.push(`/ticket?id=${data.id}`); // IDを持ってチケット画面へ
    } else {
      alert(data.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 text-center bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-bold mb-4">予約確認</h2>
      <div className="bg-gray-100 p-4 rounded mb-6">
        <p className="text-lg font-bold">{date}</p>
        <p className="text-3xl text-blue-600 font-bold">{time}</p>
      </div>
      <div className="flex gap-4">
        <button onClick={() => router.back()} className="flex-1 py-2 border rounded">戻る</button>
        <button onClick={handleReserve} disabled={loading} className="flex-1 py-2 bg-blue-600 text-white rounded font-bold">
          {loading ? '処理中...' : '予約確定'}
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense><ConfirmContent /></Suspense>;
}