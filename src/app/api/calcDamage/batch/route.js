import { NextResponse } from 'next/server';
import { calcDamageCore } from '../lib/calcDamageCore';

export const dynamic = 'force-dynamic'; 
export const maxDuration = 10;

export async function POST(request) {
  let body;
  try {
    body = await request.json(); // { requests: [{ id?, attacker, defender, move, field }, ...] }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' ,  status: 400 });
  }

  const { requests } = body || {};
  if (!Array.isArray(requests) || requests.length === 0) {
    return NextResponse.json({ error: '`requests` must be a non-empty array' ,  status: 400 });
  }

  // 1件あたり最大サイズなどの軽いバリデーション
  // ここでidを付けなかった場合に連番を振る
  const normalized = requests.map((r, i) => ({
    id: r?.id ?? String(i),
    payload: {
      attacker: r?.attacker,
      defender: r?.defender,
      move: r?.move,
      field: r?.field
    }
  }));

  // 並列実行
  const settled = await Promise.allSettled(
    normalized.map(async ({ id, payload }) => {
      const result = await calcDamageCore(payload); // { damage: [...] }
      return { id, result };
    })
  );

  // 成功/失敗をまとめて返す
  const results = settled.map((s, idx) => {
    const id = normalized[idx].id;
    if (s.status === 'fulfilled') {
      return {
        id,
        status: '200',
        damage: s.value.result.damage
      };
    } else {
      return {
        id,
        status: '400',
        error: String(s.reason?.message || s.reason || 'unknown error')
      };
    }
  });

  return NextResponse.json(
    {
      status: '200',
      count: results.length,
      results
    }
  );
}