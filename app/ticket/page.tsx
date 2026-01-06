'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function TicketContent() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get('id');
  const [ticket, setTicket] = useState<any>(null);

  useEffect(() => {
    if (id) fetch(`/api/reserve?id=${id}`).then(r => r.json()).then(setTicket);
  }, [id]);

  const cancel = async () => {
    if(!confirm('本当にキャンセルしますか？')) return;
    await fetch(`/api/reserve?id=${id}`, { method: 'DELETE' });
    alert('キャンセルしました');
    router.push('/');
  };

  if (!ticket) return <div className="p-10 text-center">読み込み中...</div>;

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl border-t-8 border-green-500 text-center">
      <h2 className="text-2xl font-bold mb-2">予約完了</h2>
      <p className="text-gray-500 text-sm mb-6">この画面を保存してください</p>
      
      <div className="bg-green-50 p-6 rounded-lg mb-6">
        <p className="text-lg font-bold">{ticket.date} {ticket.time}</p>
        <div className="bg-white p-4 rounded shadow mt-4">
          <p className="text-sm text-gray-500">整理番号</p>
          <p className="text-5xl font-black text-gray-800">{ticket.queue_number} <span className="text-xl">番</span></p>
        </div>
      </div>

      <button onClick={() => router.push('/')} className="w-full py-3 bg-gray-800 text-white rounded mb-2">トップへ</button>
      <button onClick={cancel} className="text-red-500 text-sm underline">キャンセルする</button>
    </div>
  );
}

export default function Page() {
  return <Suspense><TicketContent /></Suspense>;
}