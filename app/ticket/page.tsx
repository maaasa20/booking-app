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

  if (!ticket) return <div className="p-10 text-center font-bold">読み込み中...</div>;

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl border-t-8 border-green-500 text-center">
      {/* 修正1：タイトルを真っ黒(text-gray-900)で極太(font-black)に */}
      <h2 className="text-3xl font-black text-gray-900 mb-4">予約完了</h2>
      
      {/* 修正2：注意書きを赤色(text-red-600)で太字(font-bold)に */}
      <p className="text-red-600 font-bold text-lg mb-6 border-2 border-red-500 p-2 rounded bg-red-50">
        必ずこの画面を保存してください
      </p>
      
      <div className="bg-green-50 p-6 rounded-lg mb-6">
        <p className="text-sm text-gray-600 mb-1 font-bold">予約日時</p>
        {/* 修正3：日付と時間を大きく、真っ黒で表示 */}
        <p className="text-2xl font-black text-gray-900 mb-6">
          {ticket.date} <br/>
          <span className="text-3xl text-green-700">{ticket.time}</span>
        </p>

        <div className="bg-white p-4 rounded shadow mt-4 border border-gray-200">
          <p className="text-sm text-gray-600 font-bold">整理番号</p>
          {/* 番号もさらに大きく強調 */}
          <p className="text-6xl font-black text-gray-900 my-2">{ticket.queue_number}<span className="text-2xl font-bold ml-1">番</span></p>
        </div>
      </div>

      <button onClick={() => router.push('/')} className="w-full py-4 bg-gray-900 text-white font-bold rounded-lg text-lg mb-4 hover:bg-gray-700">
        トップへ戻る
      </button>
      
      <button onClick={cancel} className="text-gray-500 text-sm underline hover:text-red-500 p-2">
        予約をキャンセルする
      </button>
    </div>
  );
}

export default function Page() {
  return <Suspense><TicketContent /></Suspense>;
}