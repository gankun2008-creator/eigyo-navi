import {cookies} from 'next/headers';
import {DatabaseSync} from 'node:sqlite';
import {join} from 'node:path';
export const SESSION_COOKIE='eigyo_navi_account';
const dbPath=join(process.env.DATA_DIR??join(process.cwd(),'data'),'companies.sqlite');
export async function sessionAccountId(){const token=(await cookies()).get(SESSION_COOKIE)?.value;if(!token)return null;const db=new DatabaseSync(dbPath);try{db.exec('CREATE TABLE IF NOT EXISTS account_sessions(token TEXT PRIMARY KEY,accountId TEXT NOT NULL,createdAt TEXT NOT NULL,expiresAt TEXT NOT NULL)');const row=db.prepare('SELECT accountId FROM account_sessions WHERE token=? AND expiresAt>?').get(token,new Date().toISOString()) as {accountId:string}|undefined;return row?.accountId??null}finally{db.close()}}
