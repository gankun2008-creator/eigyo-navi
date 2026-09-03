import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';
import { NextResponse } from 'next/server';
import { sessionAccountId } from '@/app/lib/session';

const dbPath=join(process.env.DATA_DIR??join(process.cwd(),'data'),'companies.sqlite');
const clean=(v:unknown,n=2000)=>String(v??'').trim().slice(0,n);

function openDb(){
  const db=new DatabaseSync(dbPath);
  db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS companies_id_unique ON companies(id);
    CREATE TABLE IF NOT EXISTS network_members(companyId TEXT PRIMARY KEY,offerSummary TEXT NOT NULL DEFAULT '',profile TEXT NOT NULL DEFAULT '',joinedAt TEXT NOT NULL,lastActiveAt TEXT NOT NULL,FOREIGN KEY(companyId) REFERENCES companies(id) ON DELETE CASCADE);
    CREATE TABLE IF NOT EXISTS company_challenges(id TEXT PRIMARY KEY,companyId TEXT NOT NULL,title TEXT NOT NULL,detail TEXT NOT NULL DEFAULT '',category TEXT NOT NULL,urgency TEXT NOT NULL,source TEXT NOT NULL,contactIntent TEXT NOT NULL,createdAt TEXT NOT NULL,updatedAt TEXT NOT NULL,FOREIGN KEY(companyId) REFERENCES companies(id) ON DELETE CASCADE);
    CREATE TABLE IF NOT EXISTS member_accounts(id TEXT PRIMARY KEY,companyId TEXT NOT NULL,name TEXT NOT NULL,jobTitle TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT '対応可能',internalEmail TEXT NOT NULL DEFAULT '',phone TEXT NOT NULL DEFAULT '',iconDataUrl TEXT NOT NULL DEFAULT '',createdAt TEXT NOT NULL,updatedAt TEXT NOT NULL,FOREIGN KEY(companyId) REFERENCES companies(id) ON DELETE CASCADE);
    CREATE TABLE IF NOT EXISTS network_messages(id TEXT PRIMARY KEY,senderCompanyId TEXT NOT NULL,recipientCompanyId TEXT NOT NULL,body TEXT NOT NULL,createdAt TEXT NOT NULL,readAt TEXT,FOREIGN KEY(senderCompanyId) REFERENCES network_members(companyId) ON DELETE CASCADE,FOREIGN KEY(recipientCompanyId) REFERENCES network_members(companyId) ON DELETE CASCADE);`);
  const messageColumns=db.prepare('PRAGMA table_info(network_messages)').all() as Array<{name:string}>;
  if(!messageColumns.some(column=>column.name==='senderAccountId'))db.exec('ALTER TABLE network_messages ADD COLUMN senderAccountId TEXT');
  if(!messageColumns.some(column=>column.name==='recipientAccountId'))db.exec('ALTER TABLE network_messages ADD COLUMN recipientAccountId TEXT');
  const now=new Date().toISOString();
  const companies=db.prepare('SELECT id,businessDescription,demandSignal,demandSignalDetail FROM companies ORDER BY salesScore DESC LIMIT 20').all() as Array<{id:string;businessDescription:string;demandSignal:string;demandSignalDetail:string}>;
  const seed=db.prepare('INSERT OR IGNORE INTO network_members VALUES(?,?,?,?,?)');
  for(const company of companies) seed.run(company.id,company.businessDescription,company.businessDescription,now,now);
  const accounts=db.prepare('INSERT OR IGNORE INTO member_accounts VALUES(?,?,?,?,?,?,?,?,?,?)');
  companies.slice(0,3).forEach((company,index)=>accounts.run(`account-demo-${index+1}`,company.id,['山田 太郎','佐藤 花子','鈴木 健'][index],['営業部長','営業担当','事業開発担当'][index],index===2?'離席中':'対応可能',`member${index+1}@example.jp`,`03-0000-000${index+1}`,'',now,now));
  companies.forEach(company=>accounts.run(`account-inbox-${company.id}`,company.id,'企業窓口','営業受付担当','対応可能','','','',now,now));
  const seedChallenge=db.prepare('INSERT OR IGNORE INTO company_challenges VALUES(?,?,?,?,?,?,?,?,?,?)');
  for(const company of companies.slice(0,8)) seedChallenge.run(`network-seed-${company.id}`,company.id,company.demandSignal||'業務改善の提案を募集',company.demandSignalDetail||'自社の課題解決につながる提案を募集しています。','事業課題','中','企業登録情報','営業提案を受付中',now,now);
  return db;
}

export async function GET(request:Request){
  const q=new URL(request.url).searchParams,accountId=await sessionAccountId(),query=clean(q.get('query'),100).toLowerCase();
  if(!accountId)return NextResponse.json({error:'ログインが必要です'},{status:401});
  const db=openDb();
  try{
    const members=db.prepare(`SELECT n.companyId,c.companyName,c.industryName,c.prefecture,c.businessDescription,n.offerSummary,n.profile,n.joinedAt,
      (SELECT COUNT(*) FROM company_challenges h WHERE h.companyId=n.companyId) challengeCount
      FROM network_members n JOIN companies c ON c.id=n.companyId ORDER BY c.companyName`).all() as Array<Record<string,unknown>>;
    const challenges=db.prepare(`SELECT h.*,c.companyName,c.industryName,c.prefecture,n.offerSummary FROM company_challenges h
      JOIN network_members n ON n.companyId=h.companyId JOIN companies c ON c.id=h.companyId ORDER BY h.updatedAt DESC`).all() as Array<Record<string,unknown>>;
    const filtered=!query?challenges:challenges.filter(row=>[row.companyName,row.industryName,row.prefecture,row.title,row.detail,row.category,row.offerSummary].some(v=>String(v??'').toLowerCase().includes(query)));
    const account=accountId?db.prepare('SELECT id,companyId,name,jobTitle,status,iconDataUrl FROM member_accounts WHERE id=?').get(accountId):null;
    const messages=accountId?db.prepare(`SELECT m.*,s.companyName senderCompanyName,r.companyName recipientCompanyName FROM network_messages m
      JOIN companies s ON s.id=m.senderCompanyId JOIN companies r ON r.id=m.recipientCompanyId
      WHERE m.senderAccountId=? OR m.recipientAccountId=? ORDER BY m.createdAt`).all(accountId,accountId):[];
    return NextResponse.json({members,challenges:filtered,messages,account});
  }finally{db.close()}
}

export async function POST(request:Request){
  const authenticatedAccountId=await sessionAccountId();
  if(!authenticatedAccountId)return NextResponse.json({error:'ログインが必要です'},{status:401});
  const b=await request.json(),db=openDb(),now=new Date().toISOString();
  try{
    if(b.resource==='message'){
      const senderAccountId=authenticatedAccountId,recipient=clean(b.recipientCompanyId,100),body=clean(b.body);
      const senderAccount=db.prepare('SELECT id,companyId FROM member_accounts WHERE id=?').get(senderAccountId) as {id:string;companyId:string}|undefined;
      if(!senderAccount||!recipient||!body||senderAccount.companyId===recipient)return NextResponse.json({error:'送信元・送信先・本文を確認してください'},{status:400});
      const sender=senderAccount.companyId;
      const count=(db.prepare('SELECT COUNT(*) count FROM network_members WHERE companyId IN(?,?)').get(sender,recipient) as {count:number}).count;
      if(count!==2)return NextResponse.json({error:'DMは営業ナビ登録企業同士でのみ送信できます'},{status:403});
      const recipientAccount=db.prepare("SELECT id FROM member_accounts WHERE companyId=? ORDER BY CASE WHEN id LIKE 'account-inbox-%' THEN 1 ELSE 0 END,createdAt LIMIT 1").get(recipient) as {id:string}|undefined;
      if(!recipientAccount)return NextResponse.json({error:'送信先企業にDM受信アカウントがありません'},{status:409});
      db.prepare('INSERT INTO network_messages(id,senderCompanyId,recipientCompanyId,body,createdAt,readAt,senderAccountId,recipientAccountId) VALUES(?,?,?,?,?,NULL,?,?)').run(crypto.randomUUID(),sender,recipient,body,now,senderAccountId,recipientAccount.id);
    }else if(b.resource==='member'){
      const companyId=clean(b.companyId,100);
      if(!db.prepare('SELECT id FROM companies WHERE id=?').get(companyId))return NextResponse.json({error:'企業が見つかりません'},{status:404});
      db.prepare(`INSERT INTO network_members VALUES(?,?,?,?,?) ON CONFLICT(companyId) DO UPDATE SET offerSummary=excluded.offerSummary,profile=excluded.profile,lastActiveAt=excluded.lastActiveAt`).run(companyId,clean(b.offerSummary,500),clean(b.profile,1000),now,now);
      db.prepare('INSERT OR IGNORE INTO member_accounts VALUES(?,?,?,?,?,?,?,?,?,?)').run(`account-inbox-${companyId}`,companyId,'企業窓口','営業受付担当','対応可能','','','',now,now);
    }else return NextResponse.json({error:'登録対象が不正です'},{status:400});
    return NextResponse.json({ok:true});
  }finally{db.close()}
}
