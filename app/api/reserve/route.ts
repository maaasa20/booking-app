import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // libがrootにあればこの書き方でOK

const MAX_CAPACITY = 30;

// キャンセル用 (DELETE)
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'Error' }, { status: 400 });

  const { error } = await supabase.from('reservations').delete().eq('id', id);
  if (error) return NextResponse.json({ message: 'Error' }, { status: 500 });
  return NextResponse.json({ success: true });
}

// データ取得用 (GET)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // ID指定がある場合（整理券画面）：その人の詳細と「何番目か」を返す
  if (id) {
    const { data, error } = await supabase.from('reservations').select('*').eq('id', id).single();
    if (error || !data) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    // 自分より前に予約した人の数を数える（＝整理番号）
    const { count } = await supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true })
      .eq('date', data.date)
      .eq('time', data.time)
      .lte('created_at', data.created_at);

    return NextResponse.json({ ...data, queue_number: count });
  }

  // ID指定がない場合（カレンダー画面）：予約状況の集計を返す
  const { data } = await supabase.from('reservations').select('date, time');
  const counts: Record<string, number> = {};
  data?.forEach((row: any) => {
    const key = `${row.date}_${row.time}`;
    counts[key] = (counts[key] || 0) + 1;
  });
  return NextResponse.json(counts);
}

// 予約登録用 (POST)
export async function POST(request: Request) {
  const body = await request.json();
  const { date, time } = body;

  // 定員チェック
  const { count } = await supabase
    .from('reservations')
    .select('*', { count: 'exact', head: true })
    .eq('date', date)
    .eq('time', time);

  if ((count || 0) >= MAX_CAPACITY) {
    return NextResponse.json({ message: '満席です', success: false }, { status: 400 });
  }

  // 予約作成（IDを返してもらう）
  const { data, error } = await supabase
    .from('reservations')
    .insert([{ date, time }])
    .select()
    .single();

  if (error) return NextResponse.json({ message: 'Error' }, { status: 500 });
  return NextResponse.json({ success: true, id: data.id });
}