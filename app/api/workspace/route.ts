import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';
import { NextResponse } from 'next/server';

const dbPath = join(process.env.DATA_DIR ?? join(process.cwd(), 'data'), 'companies.sqlite');
const taskStatuses = ['未着手', '進行中', '確認待ち', '完了'];
const priorities = ['低', '中', '高'];

function openDb() {
  const db = new DatabaseSync(dbPath);
  db.exec(`PRAGMA foreign_keys=ON;
    CREATE UNIQUE INDEX IF NOT EXISTS companies_id_unique ON companies(id);
    CREATE TABLE IF NOT EXISTS workspace_users(id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT UNIQUE NOT NULL,role TEXT NOT NULL,createdAt TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS account_permissions(userId TEXT NOT NULL,companyId TEXT NOT NULL,accessLevel TEXT NOT NULL,createdAt TEXT NOT NULL,updatedAt TEXT NOT NULL,PRIMARY KEY(userId,companyId),FOREIGN KEY(userId) REFERENCES workspace_users(id) ON DELETE CASCADE,FOREIGN KEY(companyId) REFERENCES companies(id) ON DELETE CASCADE);
    CREATE TABLE IF NOT EXISTS sales_tasks(id TEXT PRIMARY KEY,title TEXT NOT NULL,description TEXT NOT NULL DEFAULT '',companyId TEXT,assigneeId TEXT,status TEXT NOT NULL,priority TEXT NOT NULL,dueDate TEXT NOT NULL DEFAULT '',createdAt TEXT NOT NULL,updatedAt TEXT NOT NULL,FOREIGN KEY(companyId) REFERENCES companies(id) ON DELETE SET NULL,FOREIGN KEY(assigneeId) REFERENCES workspace_users(id) ON DELETE SET NULL);
    CREATE TABLE IF NOT EXISTS company_challenges(id TEXT PRIMARY KEY,companyId TEXT NOT NULL,title TEXT NOT NULL,detail TEXT NOT NULL DEFAULT '',category TEXT NOT NULL,urgency TEXT NOT NULL,source TEXT NOT NULL,contactIntent TEXT NOT NULL,createdAt TEXT NOT NULL,updatedAt TEXT NOT NULL,FOREIGN KEY(companyId) REFERENCES companies(id) ON DELETE CASCADE);`);
  const now = new Date().toISOString();
  const add = db.prepare('INSERT OR IGNORE INTO workspace_users VALUES(?,?,?,?,?)');
  add.run('user-admin','山田 管理者','admin@example.jp','管理者',now);
  add.run('user-sato','佐藤 営業','sato@example.jp','営業担当',now);
  add.run('user-suzuki','鈴木 営業','suzuki@example.jp','営業担当',now);
  return db;
}

const clean = (value: unknown, max=1000) => String(value ?? '').trim().slice(0,max);

export async function GET(request: Request) {
  const db=openDb();
  try {
    const userId=new URL(request.url).searchParams.get('userId') ?? '';
    const users=db.prepare('SELECT id,name,email,role FROM workspace_users ORDER BY role,name').all();
    const tasks=db.prepare(`SELECT t.*,c.companyName,u.name assigneeName FROM sales_tasks t LEFT JOIN companies c ON c.id=t.companyId LEFT JOIN workspace_users u ON u.id=t.assigneeId WHERE ?='' OR ?='user-admin' OR t.assigneeId=? OR t.companyId IN(SELECT companyId FROM account_permissions WHERE userId=?) ORDER BY CASE t.status WHEN '進行中' THEN 0 WHEN '未着手' THEN 1 WHEN '確認待ち' THEN 2 ELSE 3 END,CASE t.priority WHEN '高' THEN 0 WHEN '中' THEN 1 ELSE 2 END,t.dueDate`).all(userId,userId,userId,userId);
    const permissions=db.prepare(`SELECT p.*,u.name userName,c.companyName FROM account_permissions p JOIN workspace_users u ON u.id=p.userId JOIN companies c ON c.id=p.companyId ORDER BY p.updatedAt DESC`).all();
    const challenges=db.prepare(`SELECT h.*,c.companyName FROM company_challenges h JOIN companies c ON c.id=h.companyId WHERE ?='' OR ?='user-admin' OR h.companyId IN(SELECT companyId FROM account_permissions WHERE userId=?) ORDER BY h.updatedAt DESC`).all(userId,userId,userId);
    return NextResponse.json({users,tasks,permissions,challenges});
  } finally { db.close(); }
}

export async function POST(request: Request) {
  const b=await request.json(); const now=new Date().toISOString(); const db=openDb();
  try {
    if(b.resource==='task') {
      if(!clean(b.title,200)) return NextResponse.json({error:'タスク名が必要です'},{status:400});
      db.prepare(`INSERT INTO sales_tasks VALUES(?,?,?,NULLIF(?,''),NULLIF(?,''),?,?,?,?,?)`).run(crypto.randomUUID(),clean(b.title,200),clean(b.description),clean(b.companyId,100),clean(b.assigneeId,100),taskStatuses.includes(b.status)?b.status:'未着手',priorities.includes(b.priority)?b.priority:'中',clean(b.dueDate,10),now,now);
    } else if(b.resource==='permission') {
      const userId=clean(b.userId,100),companyId=clean(b.companyId,100),level=['閲覧','編集','管理'].includes(b.accessLevel)?b.accessLevel:'閲覧';
      if(!userId||!companyId) return NextResponse.json({error:'ユーザーと取引先を選択してください'},{status:400});
      db.prepare(`INSERT INTO account_permissions VALUES(?,?,?,?,?) ON CONFLICT(userId,companyId) DO UPDATE SET accessLevel=excluded.accessLevel,updatedAt=excluded.updatedAt`).run(userId,companyId,level,now,now);
    } else if(b.resource==='challenge') {
      const companyId=clean(b.companyId,100),title=clean(b.title,200);
      if(!companyId||!title) return NextResponse.json({error:'会社と課題名が必要です'},{status:400});
      db.prepare(`INSERT INTO company_challenges VALUES(?,?,?,?,?,?,?,?,?,?)`).run(crypto.randomUUID(),companyId,title,clean(b.detail,2000),clean(b.category,100)||'その他',priorities.includes(b.urgency)?b.urgency:'中',clean(b.source,100)||'ヒアリング',clean(b.contactIntent,100)||'営業提案を受付中',now,now);
    } else return NextResponse.json({error:'登録対象が不正です'},{status:400});
    return NextResponse.json({ok:true});
  } catch(error) { return NextResponse.json({error:error instanceof Error?error.message:'登録できませんでした'},{status:400}); }
  finally { db.close(); }
}

export async function PATCH(request: Request) {
  const b=await request.json(); const db=openDb();
  try {
    if(b.resource!=='task') return NextResponse.json({error:'更新対象が不正です'},{status:400});
    db.prepare(`UPDATE sales_tasks SET title=?,description=?,companyId=NULLIF(?,''),assigneeId=NULLIF(?,''),status=?,priority=?,dueDate=?,updatedAt=? WHERE id=?`).run(clean(b.title,200),clean(b.description),clean(b.companyId,100),clean(b.assigneeId,100),taskStatuses.includes(b.status)?b.status:'未着手',priorities.includes(b.priority)?b.priority:'中',clean(b.dueDate,10),new Date().toISOString(),clean(b.id,100));
    return NextResponse.json({ok:true});
  } finally { db.close(); }
}

export async function DELETE(request: Request) {
  const q=new URL(request.url).searchParams,resource=q.get('resource'),db=openDb();
  try {
    if(resource==='task') db.prepare('DELETE FROM sales_tasks WHERE id=?').run(q.get('id'));
    else if(resource==='challenge') db.prepare('DELETE FROM company_challenges WHERE id=?').run(q.get('id'));
    else if(resource==='permission') db.prepare('DELETE FROM account_permissions WHERE userId=? AND companyId=?').run(q.get('userId'),q.get('companyId'));
    else return NextResponse.json({error:'削除対象が不正です'},{status:400});
    return NextResponse.json({ok:true});
  } finally { db.close(); }
}
