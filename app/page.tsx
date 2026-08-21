'use client';

import { useEffect, useMemo, useState } from 'react';

type View = 'home' | 'signals' | 'prospects' | 'search' | 'approach' | 'team' | 'settings';
type Stage = '未対応' | '連絡済み' | '商談化';
type Member = {id:number,name:string,email:string,role:'管理者'|'メンバー',status:'利用中'|'招待中'};

const companies = [
  { score:94,name:'東邦マテリアル株式会社',kana:'TOHO MATERIALS',place:'愛知県豊田市',industry:'製造業',people:'従業員 640名',signal:'新工場建設',date:'2時間前',tone:'red',revenue:480,units:12,probability:78,reasons:['新工場建設を発表','設備投資 35億円を決定','24時間稼働の生産ラインを新設'],proposal:'新工場の死角を減らすAI監視カメラと、夜間の異常検知を組み合わせた導入プランをご提案。',contact:'生産技術部 / 設備保全責任者'},
  { score:89,name:'北陸精機株式会社',kana:'HOKURIKU SEIKI',place:'石川県金沢市',industry:'製造業',people:'従業員 310名',signal:'設備投資拡大',date:'5時間前',tone:'orange',revenue:280,units:7,probability:71,reasons:['第2工場の設備更新を発表','省人化プロジェクトを開始','夜間稼働率を40%へ拡大'],proposal:'既存設備を止めずに増設できるワイヤレス監視と、遠隔確認ダッシュボードをご提案。',contact:'製造本部 / DX推進担当'},
  { score:86,name:'関東ロジスティクス株式会社',kana:'KANTO LOGISTICS',place:'埼玉県川越市',industry:'物流・倉庫業',people:'従業員 890名',signal:'新拠点開設',date:'昨日',tone:'yellow',revenue:620,units:16,probability:68,reasons:['大型物流センターを新設','庫内作業の自動化を推進','2027年1月の稼働を予定'],proposal:'搬入口・保管エリアの一元監視と、侵入・滞留を自動通知する安全管理パッケージをご提案。',contact:'物流企画部 / センター長'},
  { score:82,name:'大和フーズ株式会社',kana:'YAMATO FOODS',place:'大阪府堺市',industry:'食品・飲料製造業',people:'従業員 470名',signal:'品質管理強化',date:'2日前',tone:'green',revenue:360,units:9,probability:64,reasons:['食品事故防止の新方針を公表','製造ラインを3本増設','衛生監査を四半期ごとに実施'],proposal:'録画確認を短縮する工程別検索と、衛生区域への入退室検知をご提案。',contact:'品質保証部 / 工場管理責任者'},
  { score:78,name:'西日本パーツ株式会社',kana:'WEST JAPAN PARTS',place:'広島県福山市',industry:'製造業',people:'従業員 225名',signal:'補助金採択',date:'3日前',tone:'blue',revenue:180,units:5,probability:58,reasons:['省力化投資補助金に採択','倉庫管理システムを刷新','設備予算 1.2億円を確保'],proposal:'補助金予算に合わせた段階導入と、倉庫・製造現場を横断する監視プランをご提案。',contact:'経営企画室 / 情報システム担当'},
];

const initialProduct={name:'工場向けAI監視カメラ',category:'セキュリティ・IoT',target:'製造業、物流業、食品工場',features:'AIによる異常検知、24時間遠隔監視、既存設備への後付け対応',problems:'工場内の事故防止、夜間の省人化、設備異常の早期発見'};
const initialMembers:Member[]=[{id:1,name:'山田 健太',email:'yamada@example.jp',role:'管理者',status:'利用中'},{id:2,name:'佐藤 美咲',email:'sato@example.jp',role:'メンバー',status:'利用中'},{id:3,name:'鈴木 大輔',email:'suzuki@example.jp',role:'メンバー',status:'利用中'}];
const initialSettings={emailSignals:true,browserSignals:true,dailyReport:true,approachReminder:false,frequency:'毎日 8:00',score:'80',region:'全国'};
const titles:Record<View,[string,string]>={home:['おはようございます、山田さん','今日の営業チャンスをAIが見つけました。'],signals:['営業シグナル','企業の変化を捉え、最適な営業タイミングを確認できます。'],prospects:['有望企業','AIスコアと最新シグナルから優先順位を確認できます。'],search:['企業検索','企業名・業種・地域から営業候補を検索できます。'],approach:['アプローチリスト','追加した営業先の対応状況を管理できます。'],team:['チーム管理','メンバーの招待と権限を管理できます。'],settings:['設定','AI分析と通知の条件を設定できます。']};

export default function Home(){
  const [view,setView]=useState<View>('home');
  const [active,setActive]=useState(0);
  const [query,setQuery]=useState('明日電話すべき会社を5社出してください');
  const [search,setSearch]=useState('');
  const [industry,setIndustry]=useState('すべて');
  const [minScore,setMinScore]=useState(0);
  const [loading,setLoading]=useState(false);
  const [toast,setToast]=useState('');
  const [productOpen,setProductOpen]=useState(false);
  const [product,setProduct]=useState(initialProduct);
  const [approach,setApproach]=useState<Record<string,Stage>>({});
  const [readSignals,setReadSignals]=useState<string[]>([]);
  const [signalFilter,setSignalFilter]=useState<'すべて'|'未読'>('すべて');
  const [members,setMembers]=useState<Member[]>(initialMembers);
  const [invite,setInvite]=useState({name:'',email:'',role:'メンバー' as Member['role']});
  const [settings,setSettings]=useState(initialSettings);
  const company=companies[active];

  useEffect(()=>{
    const saved=localStorage.getItem('eigyo-navi-product');
    const list=localStorage.getItem('eigyo-navi-approach');
    const reads=localStorage.getItem('eigyo-navi-read-signals');
    const savedMembers=localStorage.getItem('eigyo-navi-members');
    const savedSettings=localStorage.getItem('eigyo-navi-settings');
    if(saved)setProduct({...initialProduct,...JSON.parse(saved)});
    if(list)setApproach(JSON.parse(list));
    if(reads)setReadSignals(JSON.parse(reads));
    if(savedMembers)setMembers(JSON.parse(savedMembers));
    if(savedSettings)setSettings({...initialSettings,...JSON.parse(savedSettings)});
  },[]);
  const notify=(message:string)=>{setToast(message);window.setTimeout(()=>setToast(''),2800)};
  const persistApproach=(next:Record<string,Stage>)=>{setApproach(next);localStorage.setItem('eigyo-navi-approach',JSON.stringify(next))};
  const addApproach=(name:string)=>{persistApproach({...approach,[name]:approach[name]||'未対応'});notify('アプローチリストに追加しました')};
  const removeApproach=(name:string)=>{const next={...approach};delete next[name];persistApproach(next);notify('リストから削除しました')};
  const saveProduct=()=>{localStorage.setItem('eigyo-navi-product',JSON.stringify(product));setProductOpen(false);notify('自社製品を登録しました。AI分析に反映されます')};
  const analyze=()=>{setLoading(true);window.setTimeout(()=>{setLoading(false);setView('prospects');setMinScore(0);notify('1,284社から有望企業を抽出しました')},850)};
  const markRead=(name:string)=>{const next=Array.from(new Set([...readSignals,name]));setReadSignals(next);localStorage.setItem('eigyo-navi-read-signals',JSON.stringify(next))};
  const persistMembers=(next:Member[])=>{setMembers(next);localStorage.setItem('eigyo-navi-members',JSON.stringify(next))};
  const inviteMember=()=>{if(!invite.name.trim()||!invite.email.includes('@')){notify('氏名と正しいメールアドレスを入力してください');return}persistMembers([...members,{id:Date.now(),...invite,status:'招待中'}]);setInvite({name:'',email:'',role:'メンバー'});notify('招待メールを送信しました')};
  const saveSettings=()=>{localStorage.setItem('eigyo-navi-settings',JSON.stringify(settings));notify('設定を保存しました')};

  const filtered=useMemo(()=>companies.filter(c=>(industry==='すべて'||c.industry===industry)&&c.score>=minScore&&(view!=='search'||!search||[c.name,c.place,c.industry,c.signal].some(v=>v.includes(search)))),[industry,minScore,search,view]);
  const listed=companies.filter(c=>approach[c.name]);
  const unread=companies.filter(c=>!readSignals.includes(c.name)).length;
  const signalItems=signalFilter==='未読'?companies.filter(c=>!readSignals.includes(c.name)):companies;
  const nav:[View,string,string][]=[['home','⌂','ホーム'],['signals','⚡','営業シグナル'],['prospects','◎','有望企業'],['search','⌕','企業検索'],['approach','▤','アプローチリスト']];

  const selectCompany=(name:string)=>{const index=companies.findIndex(c=>c.name===name);setActive(index)};

  return <main className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span>S</span><b>営業ナビ</b></div>
      <nav>
        {nav.map(([id,icon,label])=><button key={id} className={view===id?'active':''} onClick={()=>setView(id)}><i>{icon}</i>{label}{id==='approach'&&listed.length>0?<em>{listed.length}</em>:id==='signals'&&unread>0?<em>{unread}</em>:null}</button>)}
        <p>管理</p>
        <button onClick={()=>setProductOpen(true)}><i>⌁</i>自社サービス</button>
        <button className={view==='team'?'active':''} onClick={()=>setView('team')}><i>♙</i>チーム<em>{members.length}</em></button>
        <button className={view==='settings'?'active':''} onClick={()=>setView('settings')}><i>⚙</i>設定</button>
      </nav>
      <div className="plan"><em>利用状況</em><b>企業分析 72%</b><span><i/></span><small>3,600 / 5,000社</small></div>
      <div className="user"><span>YK</span><div><b>山田 健太</b><small>営業部 マネージャー</small></div><strong>⋮</strong></div>
    </aside>

    <section className="workspace">
      <header><div><h1>{titles[view][0]}</h1><p>{titles[view][1]}</p></div><div className="actions"><button onClick={()=>setView('signals')}>♧{unread>0&&<i/>}</button><button onClick={()=>setProductOpen(true)}>＋ 自社サービスを編集</button></div></header>

      {view==='home'&&<>
        <div className="ask"><div className="orb">✦</div><div className="askcopy"><b>AI営業アシスタント</b><small>{product.name}に最適な企業を検索</small></div><div className="search"><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&analyze()} aria-label="AIへの依頼"/><button onClick={analyze} disabled={loading}>{loading?'…':'→'}</button></div><div className="chips"><small>例：</small><button onClick={()=>setQuery('今週、設備投資を発表した企業')}>今週、設備投資を発表した企業</button><button onClick={()=>setQuery('関東の製造業で採用を強化中')}>関東の製造業で採用を強化中</button></div></div>
        <div className="stats">
          {[['✦','本日の新着チャンス','12社','前日比 +4社','purple'],['↗','高優先度企業','28社','スコア 80以上','green'],['◷','今週のアプローチ',`${listed.length}件`,'リスト登録済み','orange']].map(s=><div key={s[1]}><span className={s[4]}>{s[0]}</span><p>{s[1]}<b>{s[2]}</b><small>{s[3]}</small></p></div>)}
        </div>
        <div className="sectionhead"><div><h2>明日、電話すべき会社</h2><p>AIが公開情報を分析し、受注確度の高い順に並べています</p></div><button onClick={analyze}>↻ 最新情報に更新</button></div>
        <CompanyWorkspace items={companies} active={active} onSelect={selectCompany} company={company} approach={approach} onAdd={addApproach} notify={notify}/>
      </>}

      {view==='signals'&&<>
        <div className="signaltoolbar"><div><button className={signalFilter==='すべて'?'active':''} onClick={()=>setSignalFilter('すべて')}>すべて <b>{companies.length}</b></button><button className={signalFilter==='未読'?'active':''} onClick={()=>setSignalFilter('未読')}>未読 <b>{unread}</b></button></div><button onClick={()=>{const all=companies.map(c=>c.name);setReadSignals(all);localStorage.setItem('eigyo-navi-read-signals',JSON.stringify(all));notify('すべて既読にしました')}}>✓ すべて既読にする</button></div>
        <div className="signalfeed">{signalItems.length?signalItems.map(c=><article key={c.name} className={readSignals.includes(c.name)?'read':''}><button className="signalbody" onClick={()=>markRead(c.name)}><span className={`signalflash ${c.tone}`}>⚡</span><div><div className="signalmeta"><b>{c.signal}</b><small>{c.date} · {c.industry}</small></div><h2>{c.name}</h2><p>{c.reasons[0]}。{c.reasons[1]}。営業ニーズが高まっている可能性があります。</p><em>AI営業スコア {c.score}/100</em></div>{!readSignals.includes(c.name)&&<i/>}</button><div className="signalactions"><button onClick={()=>{markRead(c.name);selectCompany(c.name);setView('prospects')}}>企業詳細を見る →</button><button className={approach[c.name]?'added':''} onClick={()=>addApproach(c.name)}>{approach[c.name]?'✓ リスト追加済み':'＋ アプローチリストに追加'}</button></div></article>):<div className="empty"><span>✓</span><h2>未読シグナルはありません</h2><p>新しい企業の動きが見つかると、ここに自動で追加されます。</p><button onClick={()=>setSignalFilter('すべて')}>すべて表示</button></div>}</div>
      </>}

      {view==='prospects'&&<>
        <div className="filterbar"><div><label>業種</label><select value={industry} onChange={e=>setIndustry(e.target.value)}><option>すべて</option><option>製造業</option><option>物流・倉庫業</option><option>食品・飲料製造業</option></select></div><div><label>最低スコア</label><select value={minScore} onChange={e=>setMinScore(Number(e.target.value))}><option value="0">指定なし</option><option value="80">80以上</option><option value="85">85以上</option><option value="90">90以上</option></select></div><span><b>{filtered.length}</b>社が該当</span><button onClick={()=>{setIndustry('すべて');setMinScore(0)}}>条件をクリア</button></div>
        <CompanyWorkspace items={filtered} active={active} onSelect={selectCompany} company={company} approach={approach} onAdd={addApproach} notify={notify}/>
      </>}

      {view==='search'&&<>
        <div className="searchhero"><span>⌕</span><input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="企業名、業種、地域、営業シグナルで検索"/><button onClick={()=>notify(`${filtered.length}社が見つかりました`)}>検索</button></div>
        <div className="searchmeta"><b>{search?`「${search}」の検索結果`:'すべての企業'}</b><span>{filtered.length}社</span></div>
        <CompanyWorkspace items={filtered} active={active} onSelect={selectCompany} company={company} approach={approach} onAdd={addApproach} notify={notify}/>
      </>}

      {view==='approach'&&<>
        <div className="pipeline">
          {(['未対応','連絡済み','商談化'] as Stage[]).map(stage=><div key={stage}><small>{stage}</small><b>{listed.filter(c=>approach[c.name]===stage).length}社</b></div>)}
          <div><small>見込収益合計</small><b>{listed.reduce((sum,c)=>sum+c.revenue,0).toLocaleString()}万円</b></div>
        </div>
        {listed.length===0?<div className="empty"><span>▤</span><h2>アプローチリストは空です</h2><p>有望企業を選び「リストに追加」すると、ここで進捗を管理できます。</p><button onClick={()=>setView('prospects')}>有望企業を見る →</button></div>:<div className="approachtable"><div className="tablehead"><span>企業</span><span>AIスコア</span><span>予想収益</span><span>ステータス</span><span>操作</span></div>{listed.map(c=><div className="tablerow" key={c.name}><button className="companylink" onClick={()=>{selectCompany(c.name);setView('prospects')}}><b>{c.name}</b><small>{c.place} · {c.signal}</small></button><strong>{c.score}</strong><span>{c.revenue}万円</span><select value={approach[c.name]} onChange={e=>persistApproach({...approach,[c.name]:e.target.value as Stage})}><option>未対応</option><option>連絡済み</option><option>商談化</option></select><button className="remove" onClick={()=>removeApproach(c.name)}>削除</button></div>)}</div>}
      </>}

      {view==='team'&&<>
        <div className="teamstats"><div><span>♙</span><p>チームメンバー<b>{members.length}名</b></p></div><div><span>◎</span><p>今週のアプローチ<b>{listed.length}件</b></p></div><div><span>↗</span><p>商談化<b>{listed.filter(c=>approach[c.name]==='商談化').length}件</b></p></div></div>
        <section className="invitecard"><div><h2>メンバーを招待</h2><p>招待したメンバーは営業先とアプローチ状況を共有できます。</p></div><div className="inviteform"><input value={invite.name} onChange={e=>setInvite({...invite,name:e.target.value})} placeholder="氏名"/><input type="email" value={invite.email} onChange={e=>setInvite({...invite,email:e.target.value})} placeholder="メールアドレス"/><select value={invite.role} onChange={e=>setInvite({...invite,role:e.target.value as Member['role']})}><option>メンバー</option><option>管理者</option></select><button onClick={inviteMember}>招待する</button></div></section>
        <section className="membercard"><header><h2>メンバー一覧</h2><span>{members.length}名</span></header><div className="memberhead"><span>メンバー</span><span>権限</span><span>ステータス</span><span>操作</span></div>{members.map((m,index)=><div className="memberrow" key={m.id}><div><span>{m.name.slice(0,1)}</span><p><b>{m.name}</b><small>{m.email}</small></p></div><select value={m.role} disabled={index===0} onChange={e=>persistMembers(members.map(x=>x.id===m.id?{...x,role:e.target.value as Member['role']}:x))}><option>管理者</option><option>メンバー</option></select><em className={m.status==='利用中'?'online':'pending'}>● {m.status}</em><button disabled={index===0} onClick={()=>persistMembers(members.filter(x=>x.id!==m.id))}>{index===0?'オーナー':'削除'}</button></div>)}</section>
      </>}

      {view==='settings'&&<div className="settingslayout">
        <section className="settingscard"><header><span>⚡</span><div><h2>AI分析設定</h2><p>営業先の抽出条件と更新頻度を設定します。</p></div></header><div className="settingfields"><label><span>分析頻度</span><select value={settings.frequency} onChange={e=>setSettings({...settings,frequency:e.target.value})}><option>毎日 8:00</option><option>毎日 12:00</option><option>平日のみ 8:00</option><option>毎週月曜 8:00</option></select></label><label><span>有望企業の基準スコア</span><select value={settings.score} onChange={e=>setSettings({...settings,score:e.target.value})}><option value="70">70以上</option><option value="80">80以上</option><option value="85">85以上</option><option value="90">90以上</option></select></label><label><span>対象地域</span><select value={settings.region} onChange={e=>setSettings({...settings,region:e.target.value})}><option>全国</option><option>関東</option><option>関西</option><option>中部</option><option>その他</option></select></label></div></section>
        <section className="settingscard"><header><span>♧</span><div><h2>通知設定</h2><p>営業シグナルを受け取る方法を選択します。</p></div></header><div className="togglelist">{([['emailSignals','重要シグナルをメールで通知','AIスコア90以上の新着企業をメールで受け取る'],['browserSignals','ブラウザ通知','新しい営業シグナルをリアルタイムで通知'],['dailyReport','デイリーレポート','毎朝、有望企業と進捗のまとめを受け取る'],['approachReminder','アプローチ期限リマインド','未対応の企業が3日以上残った場合に通知']] as const).map(([key,title,desc])=><label key={key}><div><b>{title}</b><small>{desc}</small></div><input type="checkbox" checked={settings[key]} onChange={e=>setSettings({...settings,[key]:e.target.checked})}/><i/></label>)}</div></section>
        <div className="settingsactions"><small>変更内容はこの端末に保存されます</small><button onClick={saveSettings}>設定を保存</button></div>
      </div>}
    </section>

    {productOpen&&<ProductModal product={product} setProduct={setProduct} onSave={saveProduct} onClose={()=>setProductOpen(false)}/>}
    {toast&&<div className="toast">✓ {toast}</div>}
  </main>
}

function CompanyWorkspace({items,active,onSelect,company,approach,onAdd,notify}:{items:typeof companies,active:number,onSelect:(name:string)=>void,company:typeof companies[number],approach:Record<string,Stage>,onAdd:(name:string)=>void,notify:(m:string)=>void}){
  return <div className="grid"><div className="list">{items.length?items.map(c=><button key={c.name} className={`company ${companies[active].name===c.name?'selected':''}`} onClick={()=>onSelect(c.name)}><span className={`score ${c.tone}`}><b>{c.score}</b><small>/100</small></span><span className="companymain"><small>{c.kana}</small><b>{c.name}</b><em>⌖ {c.place}　·　{c.people}</em></span><span className="signal"><b className={c.tone}>● {c.signal}</b><small>{c.date}</small></span><strong>›</strong></button>):<div className="noresults">条件に一致する企業がありません</div>}</div><CompanyDetail company={company} listed={!!approach[company.name]} onAdd={()=>onAdd(company.name)} notify={notify}/></div>
}

function CompanyDetail({company,listed,onAdd,notify}:{company:typeof companies[number],listed:boolean,onAdd:()=>void,notify:(m:string)=>void}){
  return <aside className="detail"><div className="detailtop"><span className={`bigscore ${company.tone}`}><b>{company.score}</b><small>/100</small></span><div><small>{company.kana}</small><h3>{company.name}</h3><p>⌖ {company.place}　·　{company.people}</p></div><button aria-label="詳細を閉じる">×</button></div><section><h4><span>✦</span> AIが注目した理由</h4><ul>{company.reasons.map((r,i)=><li key={r}><i>{i+1}</i><span>{r}<small>{['プレスリリース','ニュース','企業サイト'][i]}</small></span></li>)}</ul></section><div className="forecast prospectforecast"><div className="forecasthead"><span>✦ この営業先のAI受注予測</span><small>企業規模・投資情報・類似商談から算出</small></div><div className="forecastgrid"><div><small>予想収益</small><strong>{company.revenue.toLocaleString()}<b>万円</b></strong></div><div><small>予想販売数</small><strong>{company.units}<b>台</b></strong></div><em>受注確度 {company.probability}%</em></div></div><div className="proposal"><h4>提案すべき内容</h4><p>{company.proposal}</p><div><span>推奨アプローチ先</span><b>{company.contact}</b></div></div><div className="talk"><div><h4>電話トーク例</h4><button onClick={()=>{navigator.clipboard?.writeText(company.proposal);notify('トーク例をコピーしました')}}>コピー</button></div><p>「新しい取り組みに関する発表を拝見し、お電話しました。弊社では製造現場向けに、<mark>{company.proposal.slice(0,31)}</mark>…」</p></div><div className="detailactions"><button className={listed?'added':''} onClick={onAdd}>{listed?'✓ 追加済み':'＋ リストに追加'}</button><button onClick={()=>notify(`${company.contact}の担当者候補を検索しています`)}>担当者を探す →</button></div></aside>
}

function ProductModal({product,setProduct,onSave,onClose}:{product:typeof initialProduct,setProduct:(p:typeof initialProduct)=>void,onSave:()=>void,onClose:()=>void}){
 return <div className="modalback" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><section className="productmodal" role="dialog" aria-modal="true" aria-labelledby="product-title"><header><div><span>✦</span><div><h2 id="product-title">自社製品を登録</h2><p>AIが営業チャンスを探すための基準になります</p></div></div><button onClick={onClose} aria-label="閉じる">×</button></header><div className="formbody"><label><span>製品・サービス名 <b>必須</b></span><input value={product.name} onChange={e=>setProduct({...product,name:e.target.value})}/></label><div className="twocol"><label><span>製品カテゴリ</span><select value={product.category} onChange={e=>setProduct({...product,category:e.target.value})}><option>セキュリティ・IoT</option><option>業務システム・SaaS</option><option>製造設備・機械</option><option>人材・採用</option><option>マーケティング</option><option>コンサルティング</option><option>その他</option></select></label><label><span>ターゲット業種</span><select value={product.target} onChange={e=>setProduct({...product,target:e.target.value})}><option value="製造業、物流業、食品工場">製造・物流・食品工場</option><option>製造業</option><option>物流・倉庫業</option><option>食品・飲料製造業</option><option>建設・不動産業</option><option>小売・卸売業</option><option>医療・介護</option><option>IT・通信業</option><option>金融・保険業</option><option>その他</option></select></label></div><label><span>製品の特徴・強み <b>必須</b></span><textarea value={product.features} onChange={e=>setProduct({...product,features:e.target.value})} rows={3}/><small>具体的な機能や競合との違いを書くと、マッチング精度が上がります</small></label><label><span>解決できる課題</span><textarea value={product.problems} onChange={e=>setProduct({...product,problems:e.target.value})} rows={3}/></label><div className="aihint"><span>✦</span><p><b>AI分析への反映</b>登録内容をもとに、公開情報から「今ニーズがありそうな企業」を毎日探します。</p></div></div><footer><button onClick={onClose}>キャンセル</button><button onClick={onSave} disabled={!product.name.trim()||!product.features.trim()}>登録して分析に反映 →</button></footer></section></div>
}
