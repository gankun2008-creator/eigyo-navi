import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';
import { NextResponse } from 'next/server';

const dbPath = join(process.env.DATA_DIR ?? join(process.cwd(), 'data'), 'companies.sqlite');

function openDb() {
  const db = new DatabaseSync(dbPath);
  db.exec(`CREATE TABLE IF NOT EXISTS sales_leads (
    companyId TEXT PRIMARY KEY,
    status TEXT NOT NULL DEFAULT '未対応',
    note TEXT NOT NULL DEFAULT '',
    addedAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )`);
  return db;
}

export async function GET() {
  const db = openDb();
  try {
    const rows = db.prepare(`SELECT s.companyId, s.status, s.note, s.addedAt, s.updatedAt,
      c.companyName, c.industryName, c.prefecture, c.city, c.employees,
      c.businessDescription, c.demandSignal, c.targetDepartment, c.targetRole, c.salesScore
      FROM sales_leads s JOIN companies c ON c.id = s.companyId ORDER BY s.updatedAt DESC`).all();
    return NextResponse.json({ leads: rows });
  } finally {
    db.close();
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const companyId = String(body.companyId ?? '').trim();
  if (!companyId) return NextResponse.json({ error: '企業IDが必要です' }, { status: 400 });
  const db = openDb();
  try {
    const exists = db.prepare('SELECT id FROM companies WHERE id = ?').get(companyId);
    if (!exists) return NextResponse.json({ error: '企業が見つかりません' }, { status: 404 });
    const now = new Date().toISOString();
    db.prepare(`INSERT INTO sales_leads (companyId, status, note, addedAt, updatedAt)
      VALUES (?, '未対応', '', ?, ?)
      ON CONFLICT(companyId) DO UPDATE SET updatedAt = excluded.updatedAt`).run(companyId, now, now);
    return NextResponse.json({ ok: true });
  } finally {
    db.close();
  }
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const companyId = String(body.companyId ?? '').trim();
  const status = String(body.status ?? '未対応');
  const note = String(body.note ?? '').slice(0, 1000);
  const allowed = ['未対応', 'DM作成中', '送信済み', '返信あり', '商談化', '保留', 'NG'];
  if (!companyId || !allowed.includes(status)) return NextResponse.json({ error: '更新内容が不正です' }, { status: 400 });
  const db = openDb();
  try {
    const result = db.prepare('UPDATE sales_leads SET status = ?, note = ?, updatedAt = ? WHERE companyId = ?')
      .run(status, note, new Date().toISOString(), companyId);
    if (!result.changes) return NextResponse.json({ error: '営業リストに企業がありません' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } finally {
    db.close();
  }
}

export async function DELETE(request: Request) {
  const companyId = new URL(request.url).searchParams.get('companyId');
  if (!companyId) return NextResponse.json({ error: '企業IDが必要です' }, { status: 400 });
  const db = openDb();
  try {
    db.prepare('DELETE FROM sales_leads WHERE companyId = ?').run(companyId);
    return NextResponse.json({ ok: true });
  } finally {
    db.close();
  }
}
