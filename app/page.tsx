'use client';

import { useState, useEffect } from 'react';

type Company = {
  id: string;
  companyName: string;
  industryCode: string;
  industryName: string;
  prefecture: string;
  city: string;
  employees: number;
  scale: string;
  revenueMillionYen: number;
  businessDescription: string;
  demandSignal: string;
  demandSignalDetail: string;
  targetDepartment: string;
  targetRole: string;
  salesScore: number;
  existingCustomer: boolean;
};

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  targetIndustries: string;
  active: boolean;
};

type LookalikeMatch = {
  company: Company;
  similarityScore: number;
  reasons: string[];
  factors: Record<string, number>;
};

type SalesLead = Company & {
  companyId: string;
  status: string;
  note: string;
  addedAt: string;
  updatedAt: string;
};

const DEFAULT_PRODUCTS: Product[] = [
  { id: 'product-camera', name: '工場向け監視カメラ', category: 'セキュリティ機器', description: 'AI画像解析を搭載した工場・倉庫向け監視ソリューション', targetIndustries: '製造業、運輸・郵便業、建設業', active: true },
  { id: 'product-hr', name: '人事労務管理SaaS', category: '業務SaaS', description: '勤怠・給与・労務手続きを一元化するクラウドサービス', targetIndustries: '全業界', active: true },
  { id: 'product-energy', name: '法人向け省エネ診断', category: 'コンサルティング', description: '拠点別の電力利用を分析し設備更新計画を提案', targetIndustries: '製造業、宿泊・飲食サービス業、卸売・小売業', active: true },
];

// デモ用データ（AI需要抽出結果 + 機能A/C対応）
const INITIAL_RESULTS = [
  {
    id: 1,
    name: '株式会社テックファクトリー',
    score: 96,
    status: '未対応', // 機能A: ステータス管理（未対応 / アポ獲得 / 商談中 / NG）
    isExistingCustomer: false,
    reasonTags: ['新工場建設を発表', '設備投資を拡大'],
    reasonDetail: '愛知第3工場の新設に伴い、セキュリティおよび防犯設備の新規一括導入需要が発生している可能性が極めて高いです。',
    targetPerson: '施設管理課 長谷川様',
    script: '「新工場の建設発表、拝見いたしました。工場の安全管理システムについて、従来よりコストを30%削減できる監視ソリューションのご提案でご連絡いたしました。」',
    emailSubject: '【ご提案】愛知第3工場における監視セキュリティシステム最適化のご案内',
    emailBody: `株式会社テックファクトリー\n施設管理課 長谷川様\n\n突然のご連絡失礼いたします。営業ナビAIよりご連絡差し上げました。\nこの度、貴社の愛知第3工場建設に関するご発表を拝見し、誠におめでとうございます。\n...`,
    remindDate: null // 機能C: 再追客アラート
  },
  {
    id: 2,
    name: 'グローバルロジスティクス合同会社',
    score: 91,
    status: '未対応',
    isExistingCustomer: false,
    reasonTags: ['物流拠点増設', 'IRで安全管理強化を言及'],
    reasonDetail: '今期のIR情報にて「配送センターの監視体制の強化」が重点施策として挙げられており、即時提案が刺さるタイミングです。',
    targetPerson: '安全衛生管理部 課長代理',
    script: '「IRでの物流拠点セキュリティ強化の方針を拝見し、複数拠点の一括遠隔監視システムの事例をご紹介したくご連絡いたしました。」',
    emailSubject: '【IR拝見】複数拠点の一括遠隔監視システムのご案内',
    emailBody: `グローバルロジスティクス合同会社\n安全衛生管理部 課長代理様\n\nお世話になっております。...\n`,
    remindDate: '2026-11-24' // 機能C: デモ表示用の再追客設定済みデータ
  },
  {
    id: 3,
    name: 'サンライズ製造株式会社',
    score: 88,
    status: '未対応',
    isExistingCustomer: true, // 既存顧客（NGフィルターテスト用）
    reasonTags: ['DX推進室の新設', '老朽化設備の刷新'],
    reasonDetail: '公式プレスリリースにて工場DXの推進が発表。AI画像解析付き監視カメラへのリプレイス需要が見込まれます。',
    targetPerson: 'DX推進部 佐々木様',
    script: '「DX推進のご発表を拝見しました。単なる防犯にとどまらず、AIによるライン検知も可能な最新監視カメラのご提案です。」',
    emailSubject: '【工場DX】AI画像解析を活用した次世代監視カメラのご提案',
    emailBody: `サンライズ製造株式会社\nDX推進部 佐々木様\n\n突然のご連絡失礼いたします。...\n`,
    remindDate: null
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'ai-search' | 'sales-list' | 'dm-practice' | 'pipeline' | 'lookalike' | 'companies' | 'settings'>('home');
  const [productName, setProductName] = useState(() => {
    if (typeof window === 'undefined') return '工場向け監視カメラ';
    return window.localStorage.getItem('eigyo-navi-selected-product') ?? '工場向け監視カメラ';
  });
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_PRODUCTS;
    try {
      const saved = window.localStorage.getItem('eigyo-navi-products');
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({ name: '', category: '', description: '', targetIndustries: '' });
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<{ connected: boolean; model: string; modelReady: boolean } | null>(null);
  const [ollamaAnalysis, setOllamaAnalysis] = useState('');
  const [aiCandidates, setAiCandidates] = useState<Company[]>([]);
  const [searchConditions, setSearchConditions] = useState({ industry: 'all', prefecture: 'all', minEmployees: 0, maxEmployees: 0, minScore: 70, demandSignal: '', limit: 10 });
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // リストデータ状態管理（パイプライン更新用）
  const [results] = useState(INITIAL_RESULTS);

  // アプローチNG（既存顧客・競合）除外フィルター
  const [filterNG, setFilterNG] = useState(true);

  // モーダル・トースト状態
  const [selectedEmail, setSelectedEmail] = useState<{ subject: string; body: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // リアルタイム需要シグナルアラート（演出）
  const [realtimeAlert, setRealtimeAlert] = useState<string | null>(null);

  // 架空企業データベース（20業界・2,000社）
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyDataLoading, setCompanyDataLoading] = useState(true);
  const [companyQuery, setCompanyQuery] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('all');
  const [minimumScore, setMinimumScore] = useState(70);
  const [lookalikeSourceId, setLookalikeSourceId] = useState('');
  const [lookalikeLimit, setLookalikeLimit] = useState(10);
  const [lookalikeLoading, setLookalikeLoading] = useState(false);
  const [lookalikeMatches, setLookalikeMatches] = useState<LookalikeMatch[]>([]);
  const [lookalikeMethodology, setLookalikeMethodology] = useState('');
  const [lookalikeAnalyzedCount, setLookalikeAnalyzedCount] = useState(0);
  const [salesLeads, setSalesLeads] = useState<SalesLead[]>([]);
  const [salesListLoading, setSalesListLoading] = useState(true);
  const [practiceCompanyId, setPracticeCompanyId] = useState('');
  const [practiceMessages, setPracticeMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [practiceInput, setPracticeInput] = useState('');
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [practiceFeedback, setPracticeFeedback] = useState('');
  const [practiceMode, setPracticeMode] = useState<'draft' | 'simulation' | 'reply'>('draft');
  const [replySourceText, setReplySourceText] = useState('');
  const [replyRole, setReplyRole] = useState('自社の営業担当');
  const [replyObjective, setReplyObjective] = useState('相手の懸念に回答し、次回の打ち合わせにつなげる');
  const [replyTone, setReplyTone] = useState('丁寧で簡潔');
  const [generatedReply, setGeneratedReply] = useState('');
  const [draftChannel, setDraftChannel] = useState('メール');
  const [draftRecipientRole, setDraftRecipientRole] = useState('担当者');
  const [draftObjective, setDraftObjective] = useState('15分のオンライン商談を提案する');
  const [draftTone, setDraftTone] = useState('丁寧で簡潔');
  const [draftExtra, setDraftExtra] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setRealtimeAlert('[需要検知] 株式会社テックファクトリーが新工場建設プレスリリースを出しました');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const loadSalesList = async () => {
    try {
      const response = await fetch('/api/sales-list', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSalesLeads(data.leads ?? []);
      setPracticeCompanyId((current: string) => current || data.leads?.[0]?.companyId || '');
    } catch {
      showToast('営業リストを読み込めませんでした');
    } finally {
      setSalesListLoading(false);
    }
  };

  // 初回のみサーバー保存済みの営業リストを取得する
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void loadSalesList(); }, []);

  useEffect(() => {
    window.localStorage.setItem('eigyo-navi-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    window.localStorage.setItem('eigyo-navi-selected-product', productName);
  }, [productName]);

  useEffect(() => {
    fetch('/data/companies.json')
      .then(response => {
        if (!response.ok) throw new Error('企業データを読み込めませんでした');
        return response.json();
      })
      .then(data => {
        setCompanies(data.companies);
        setLookalikeSourceId(current => current || data.companies.find((company: Company) => company.existingCustomer)?.id || data.companies[0]?.id || '');
      })
      .catch(() => {
        setToastMessage('企業データベースの読み込みに失敗しました');
        setTimeout(() => setToastMessage(null), 3500);
      })
      .finally(() => setCompanyDataLoading(false));
  }, []);

  useEffect(() => {
    fetch('/api/ollama')
      .then(response => response.json())
      .then(setOllamaStatus)
      .catch(() => setOllamaStatus({ connected: false, model: 'qwen3:0.6b', modelReady: false }));
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    setShowResults(false);
    setOllamaAnalysis('');
    setAiCandidates([]);
    setChatMessages([]);
    const product = products.find(item => item.name === productName);
    try {
      const response = await fetch('/api/ollama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: product ?? { name: productName, category: '', description: '', targetIndustries: '全業界' },
          conditions: { ...searchConditions, excludeExisting: filterNG },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ollama分析に失敗しました');
      setOllamaAnalysis(data.analysis);
      setAiCandidates(data.candidates ?? []);
      setShowResults(true);
      showToast(`${data.model} によるローカルAI分析が完了しました`);
    } catch (error) {
      setOllamaAnalysis('Ollamaに接続できなかったため、保存済みのデモ分析結果を表示しています。Ollamaアプリが起動しているか確認してください。');
      setShowResults(true);
      showToast(error instanceof Error ? error.message : 'Ollama分析に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    const message = chatInput.trim();
    if (!message || chatLoading) return;
    const product = products.find(item => item.name === productName);
    const nextMessages = [...chatMessages, { role: 'user' as const, content: message }];
    setChatMessages(nextMessages);
    setChatInput('');
    setChatLoading(true);
    try {
      const response = await fetch('/api/ollama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'chat', message, conversation: chatMessages,
          product: product ?? { name: productName, category: '', description: '', targetIndustries: '全業界' },
          conditions: { ...searchConditions, excludeExisting: filterNG },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'AIとの対話に失敗しました');
      setChatMessages(current => [...current, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setChatMessages(current => [...current, { role: 'assistant', content: error instanceof Error ? error.message : 'AIとの対話に失敗しました' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleLookalikeAnalyze = async () => {
    if (!lookalikeSourceId || lookalikeLoading) return;
    setLookalikeLoading(true);
    setLookalikeMatches([]);
    try {
      const response = await fetch('/api/lookalike', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId: lookalikeSourceId, limit: lookalikeLimit }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '類似企業分析に失敗しました');
      setLookalikeMatches(data.matches);
      setLookalikeMethodology(data.methodology);
      setLookalikeAnalyzedCount(data.analyzedCount);
      showToast(`${data.analyzedCount.toLocaleString()}社から類似企業を抽出しました`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : '類似企業分析に失敗しました');
    } finally {
      setLookalikeLoading(false);
    }
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProductForm({ name: '', category: '', description: '', targetIndustries: '' });
  };

  const handleSaveProduct = () => {
    if (!productForm.name.trim() || !productForm.category.trim()) {
      showToast('商品名とカテゴリーを入力してください');
      return;
    }
    if (editingProductId) {
      setProducts(current => current.map(product => product.id === editingProductId ? { ...product, ...productForm } : product));
      showToast('商品情報を更新しました');
    } else {
      const product: Product = { id: crypto.randomUUID(), ...productForm, active: true };
      setProducts(current => [...current, product]);
      setProductName(product.name);
      showToast(`${product.name} を登録しました`);
    }
    resetProductForm();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setProductForm({ name: product.name, category: product.category, description: product.description, targetIndustries: product.targetIndustries });
  };

  const handleToggleProduct = (id: string) => {
    setProducts(current => current.map(product => product.id === id ? { ...product, active: !product.active } : product));
  };

  const handleDeleteProduct = (id: string) => {
    const product = products.find(item => item.id === id);
    setProducts(current => current.filter(item => item.id !== id));
    if (product?.name === productName) setProductName(products.find(item => item.id !== id && item.active)?.name ?? '');
    if (editingProductId === id) resetProductForm();
    showToast(`${product?.name ?? '商品'} を削除しました`);
  };

  const handleSyncSalesforce = (companyName: string) => {
    showToast(`${companyName} をSalesforceへリード登録しました`);
  };

  const addToSalesList = async (company: Company) => {
    const response = await fetch('/api/sales-list', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ companyId: company.id }) });
    const data = await response.json();
    if (!response.ok) return showToast(data.error || '営業リストに追加できませんでした');
    await loadSalesList();
    showToast(`${company.companyName} を営業リストに追加しました`);
  };

  const updateSalesLead = async (lead: SalesLead, changes: { status?: string; note?: string }) => {
    const response = await fetch('/api/sales-list', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ companyId: lead.companyId, status: changes.status ?? lead.status, note: changes.note ?? lead.note }) });
    if (response.ok) await loadSalesList(); else showToast('営業リストを更新できませんでした');
  };

  const removeSalesLead = async (lead: SalesLead) => {
    const response = await fetch(`/api/sales-list?companyId=${encodeURIComponent(lead.companyId)}`, { method: 'DELETE' });
    if (response.ok) { await loadSalesList(); showToast(`${lead.companyName} をリストから外しました`); }
  };

  const openDmPractice = (companyId: string) => {
    const lead = salesLeads.find(item => item.companyId === companyId);
    if (lead && lead.status === '未対応') void updateSalesLead(lead, { status: 'DM作成中' });
    setPracticeCompanyId(companyId);
    setPracticeMessages([]);
    setPracticeFeedback('');
    setPracticeInput('');
    setActiveTab('dm-practice');
  };

  const handleDmPractice = async (finish = false) => {
    const message = practiceInput.trim();
    if ((!message && !finish) || practiceLoading || !practiceCompanyId) return;
    const nextMessages = finish ? practiceMessages : [...practiceMessages, { role: 'user' as const, content: message }];
    if (!finish) { setPracticeMessages(nextMessages); setPracticeInput(''); }
    setPracticeLoading(true);
    try {
      const product = products.find(item => item.name === productName) ?? products[0];
      const response = await fetch('/api/ollama', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'dm-practice', companyId: practiceCompanyId, product, message, conversation: finish ? practiceMessages : practiceMessages, finish }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'AI演習に失敗しました');
      if (finish) setPracticeFeedback(data.reply); else setPracticeMessages(current => [...current, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'AI演習に失敗しました');
    } finally { setPracticeLoading(false); }
  };

  const handleGenerateReply = async () => {
    if (!replySourceText.trim() || !practiceCompanyId || practiceLoading) return;
    setPracticeLoading(true);
    setGeneratedReply('');
    try {
      const product = products.find(item => item.name === productName) ?? products[0];
      const response = await fetch('/api/ollama', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'email-reply', companyId: practiceCompanyId, product, sourceText: replySourceText, aiRole: replyRole, objective: replyObjective, tone: replyTone }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '返信案を作成できませんでした');
      setGeneratedReply(data.reply);
    } catch (error) { showToast(error instanceof Error ? error.message : '返信案を作成できませんでした'); }
    finally { setPracticeLoading(false); }
  };

  const handleGenerateSalesDraft = async () => {
    if (!practiceCompanyId || practiceLoading) return;
    setPracticeLoading(true); setGeneratedDraft('');
    try {
      const product = products.find(item => item.name === productName) ?? products[0];
      const response = await fetch('/api/ollama', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'sales-draft', companyId: practiceCompanyId, product, channel: draftChannel, recipientRole: draftRecipientRole, objective: draftObjective, tone: draftTone, extra: draftExtra }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '営業文を作成できませんでした');
      setGeneratedDraft(data.draft);
    } catch (error) { showToast(error instanceof Error ? error.message : '営業文を作成できませんでした'); }
    finally { setPracticeLoading(false); }
  };

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  const companyIndustries = Array.from(new Map(companies.map(company => [company.industryCode, company.industryName])).entries());
  const companyPrefectures = Array.from(new Set(companies.map(company => company.prefecture))).sort((a, b) => a.localeCompare(b, 'ja'));
  const lookalikeSource = companies.find(company => company.id === lookalikeSourceId);
  const practiceCompany = companies.find(company => company.id === practiceCompanyId) ?? salesLeads.find(lead => lead.companyId === practiceCompanyId);
  const filteredCompanies = companies
    .filter(company => companyIndustry === 'all' || company.industryCode === companyIndustry)
    .filter(company => company.salesScore >= minimumScore)
    .filter(company => {
      const query = companyQuery.trim().toLowerCase();
      return !query || [company.companyName, company.prefecture, company.city, company.businessDescription, company.demandSignal]
        .some(value => value.toLowerCase().includes(query));
    })
    .sort((a, b) => b.salesScore - a.salesScore);

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden relative">
      
      {/* ────────────────────────────────────────────────────────
          リアルタイム需要シグナルアラート（画面上部）
      ──────────────────────────────────────────────────────── */}
      {realtimeAlert && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-indigo-950 border border-indigo-500/50 text-indigo-200 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
          <span>{realtimeAlert}</span>
          <button 
            onClick={() => {
              setActiveTab('ai-search');
              handleAnalyze();
              setRealtimeAlert(null);
            }} 
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-0.5 rounded-full font-bold ml-2 text-[11px]"
          >
            今すぐ分析
          </button>
          <button onClick={() => setRealtimeAlert(null)} className="text-slate-400 hover:text-white ml-1">✕</button>
        </div>
      )}

      {/* 通知トースト */}
      {toastMessage && (
        <div className="absolute top-6 right-6 z-50 bg-emerald-600 text-white font-medium px-4 py-3 rounded-xl shadow-2xl border border-emerald-400 flex items-center gap-2 animate-bounce text-xs">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          1. 左側：サイドバー
      ──────────────────────────────────────────────────────── */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4 flex-shrink-0">
        <div className="space-y-8">
          <div className="px-2 pt-2">
            <span className="text-[10px] bg-indigo-500/20 text-indigo-400 font-bold px-2 py-0.5 rounded border border-indigo-500/30">
              B2B Sales AI
            </span>
            <h1 className="text-2xl font-black mt-1 tracking-tight flex items-center gap-2">
              営業ナビ <span className="text-indigo-400 text-lg">AI</span>
            </h1>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'home'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              ホーム（ダッシュボード）
            </button>

            <button
              onClick={() => setActiveTab('ai-search')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'ai-search'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              AI需要ターゲット抽出
              <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                MAIN
              </span>
            </button>

            <button
              onClick={() => setActiveTab('sales-list')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'sales-list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              営業リスト
              <span className="ml-auto text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-bold">{salesLeads.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('dm-practice')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'dm-practice' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              AI営業DM演習
              <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">AI</span>
            </button>

            {/* 機能A: パイプライン・アポ管理 */}
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'pipeline'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              アポ・案件管理 (CRM)
            </button>

            {/* 機能1: 類似企業分析 */}
            <button
              onClick={() => setActiveTab('lookalike')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'lookalike'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              類似企業分析
            </button>

            <button
              onClick={() => setActiveTab('companies')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'companies'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              企業データベース
              <span className="ml-auto text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-bold">2,000</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              商材・NGリスト設定
            </button>
          </nav>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span>現在のプラン</span>
            <span className="text-indigo-400 font-bold">スタンダード</span>
          </div>
          <div className="text-slate-200 font-semibold">10 ID 契約中</div>
          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
            最低利用金額: JPY 50,000/月
          </div>
        </div>
      </aside>

      {/* ────────────────────────────────────────────────────────
          2. 右側：メインコンテンツ
      ──────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto p-8 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          
          {/* TAB 1: ホーム */}
          {activeTab === 'home' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold">ようこそ、営業チームへ</h2>
                <p className="text-slate-400 text-sm mt-1">
                  AIが最新の公開ニュース・IR・企業需要をリアルタイム解析しています。
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-xl">
                  <span className="text-xs text-slate-400 block">本日発見された高需要企業</span>
                  <span className="text-3xl font-black text-indigo-400 mt-1 block">12 社</span>
                  <span className="text-[11px] text-emerald-400 mt-2 block">前日比 +4社</span>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-xl">
                  <span className="text-xs text-slate-400 block">AIトーク採用による架電率</span>
                  <span className="text-3xl font-black text-emerald-400 mt-1 block">42.8%</span>
                  <span className="text-[11px] text-emerald-400 mt-2 block">従来比 3.2倍</span>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-xl">
                  <span className="text-xs text-slate-400 block">節約されたリサーチ時間</span>
                  <span className="text-3xl font-black text-amber-400 mt-1 block">18.5 時間</span>
                  <span className="text-[11px] text-slate-400 mt-2 block">今週のチーム合計</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-900/40 to-slate-800 border border-indigo-500/30 rounded-xl p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">明日電話すべき企業を抽出しますか？</h3>
                  <p className="text-slate-300 text-sm mt-1">
                    自社製品を選択してAIボタンを押すだけで、指定した件数の提案候補が理由付きで表示されます。
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('ai-search')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-3 rounded-lg text-sm shadow-lg shadow-indigo-600/30 transition whitespace-nowrap"
                >
                  AI抽出を実行する
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: AI抽出 (メイン) */}
          {activeTab === 'ai-search' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  AI需要ターゲット抽出
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  「探す営業」は不要。自社製品名から「今すぐ買うべき企業」を導き出します。
                </p>
              </div>

              <section className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 shadow-xl backdrop-blur space-y-4">
                <div className="flex justify-between items-center">
                  <label htmlFor="product-selector" className="block text-sm font-medium text-slate-300">
                    分析対象の商品・ソリューション
                  </label>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${ollamaStatus?.connected && ollamaStatus.modelReady ? 'text-emerald-400 bg-emerald-950 border-emerald-800' : 'text-amber-300 bg-amber-950 border-amber-800'}`}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${ollamaStatus?.connected && ollamaStatus.modelReady ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                      {ollamaStatus?.connected && ollamaStatus.modelReady ? `Ollama接続中 · ${ollamaStatus.model}` : 'Ollama未接続'}
                    </span>
                    <button onClick={() => setActiveTab('settings')} className="text-[11px] text-indigo-300 hover:text-indigo-200">商品を登録・管理 →</button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <select
                    id="product-selector"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    {products.filter(product => product.active).map(product => <option key={product.id} value={product.name}>{product.name}｜{product.category}</option>)}
                  </select>
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-500 font-bold px-6 py-3 rounded-lg text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                        AI需要解析中...
                      </>
                    ) : (
                      `条件に合う企業を${searchConditions.limit}社検索`
                    )}
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-700/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-300">企業検索条件</h3>
                    <button onClick={() => setSearchConditions({ industry: 'all', prefecture: 'all', minEmployees: 0, maxEmployees: 0, minScore: 70, demandSignal: '', limit: 10 })} className="text-[10px] text-slate-500 hover:text-slate-300">条件をリセット</button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="space-y-1"><span className="text-[10px] text-slate-500">業界</span><select value={searchConditions.industry} onChange={event => setSearchConditions(current => ({ ...current, industry: event.target.value }))} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs"><option value="all">商品設定から自動選択</option>{companyIndustries.map(([code, name]) => <option key={code} value={name}>{name}</option>)}</select></label>
                    <label className="space-y-1"><span className="text-[10px] text-slate-500">所在地</span><select value={searchConditions.prefecture} onChange={event => setSearchConditions(current => ({ ...current, prefecture: event.target.value }))} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs"><option value="all">全国</option>{companyPrefectures.map(prefecture => <option key={prefecture} value={prefecture}>{prefecture}</option>)}</select></label>
                    <label className="space-y-1"><span className="text-[10px] text-slate-500">需要シグナル</span><input value={searchConditions.demandSignal} onChange={event => setSearchConditions(current => ({ ...current, demandSignal: event.target.value }))} placeholder="例：設備更新、DX" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs" /></label>
                    <label className="space-y-1"><span className="text-[10px] text-slate-500">従業員数（最小）</span><input type="number" min="0" value={searchConditions.minEmployees} onChange={event => setSearchConditions(current => ({ ...current, minEmployees: Number(event.target.value) }))} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs" /></label>
                    <label className="space-y-1"><span className="text-[10px] text-slate-500">従業員数（最大・0は無制限）</span><input type="number" min="0" value={searchConditions.maxEmployees} onChange={event => setSearchConditions(current => ({ ...current, maxEmployees: Number(event.target.value) }))} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs" /></label>
                    <label className="space-y-1"><span className="text-[10px] text-slate-500">最低スコア</span><select value={searchConditions.minScore} onChange={event => setSearchConditions(current => ({ ...current, minScore: Number(event.target.value) }))} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-xs">{[55,60,70,80,90].map(score => <option key={score} value={score}>{score}以上</option>)}</select></label>
                  </div>
                  <div className="flex items-center gap-4 bg-indigo-950/40 border border-indigo-800/50 rounded-xl p-3">
                    <div className="min-w-36"><div className="text-xs font-bold text-indigo-200">検索する企業数</div><div className="text-[10px] text-slate-500 mt-0.5">1〜100社から指定</div></div>
                    <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg overflow-hidden">
                      <button onClick={() => setSearchConditions(current => ({ ...current, limit: Math.max(1, current.limit - 1) }))} className="px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800" aria-label="検索件数を1社減らす">−</button>
                      <input aria-label="検索する企業数" type="number" min="1" max="100" value={searchConditions.limit} onChange={event => setSearchConditions(current => ({ ...current, limit: Math.min(100, Math.max(1, Number(event.target.value) || 1)) }))} className="w-16 bg-transparent text-center text-sm font-black text-white py-2 outline-none" />
                      <button onClick={() => setSearchConditions(current => ({ ...current, limit: Math.min(100, current.limit + 1) }))} className="px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800" aria-label="検索件数を1社増やす">＋</button>
                    </div>
                    <div className="flex gap-1.5">
                      {[5, 10, 20, 50, 100].map(limit => <button key={limit} onClick={() => setSearchConditions(current => ({ ...current, limit }))} className={`text-[11px] font-bold px-3 py-2 rounded-lg border transition ${searchConditions.limit === limit ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-indigo-600'}`}>{limit}社</button>)}
                    </div>
                  </div>
                </div>

                {/* アプローチNGフィルター トグルスイッチ */}
                <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span>既存顧客・アプローチNG企業をAIリストから自動除外する</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={filterNG} 
                      onChange={(e) => setFilterNG(e.target.checked)} 
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </section>

              {loading && (
                <div className="text-center py-12 space-y-3">
                  <p className="text-slate-300 text-sm font-medium">
                    Web上の最新IR、ニュース、求人情報を分析中...
                  </p>
                  <p className="text-slate-500 text-xs">「今、需要が発生している企業」を解析しています</p>
                </div>
              )}

              {showResults && (
                <section className="space-y-6">
                  <div className="bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-xl p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-indigo-300">Ollama ローカルAI分析</h3>
                      <span className="text-[10px] text-slate-500">{ollamaStatus?.model ?? 'qwen3:0.6b'} · データはPC外へ送信されません</span>
                    </div>
                    <div className="text-xs text-slate-300 leading-6 whitespace-pre-wrap">{ollamaAnalysis}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      AI推奨：アプローチ優先企業リスト
                    </h3>
                    <span className="text-xs text-slate-400">
                      検索完了（{aiCandidates.length}社 {filterNG && '・既存顧客を除外'})
                    </span>
                  </div>

                  <div className="space-y-4">
                    {aiCandidates.map((company) => (
                      <div
                        key={company.id}
                        className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 space-y-4 hover:border-slate-600 transition shadow-md"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="text-lg font-bold text-white">{company.companyName}</h4>
                              <div className="flex gap-1.5">
                                <span className="bg-indigo-950 text-indigo-300 text-xs px-2.5 py-0.5 rounded border border-indigo-800">{company.industryName}</span>
                                <span className="bg-slate-950 text-slate-300 text-xs px-2.5 py-0.5 rounded border border-slate-700">{company.prefecture}{company.city}</span>
                                <span className="bg-slate-950 text-slate-300 text-xs px-2.5 py-0.5 rounded border border-slate-700">{company.employees.toLocaleString()}名</span>
                              </div>
                            </div>
                            <p className="text-slate-300 text-sm mt-2">{company.demandSignalDetail}</p>
                          </div>
                          <div className="text-center bg-slate-900 border border-emerald-500/30 px-4 py-2 rounded-lg">
                            <span className="text-xs text-slate-400 block">営業優先度</span>
                            <span className="text-2xl font-black text-emerald-400">{company.salesScore}</span>
                            <span className="text-xs text-slate-500">/100</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 bg-slate-950/80 rounded-lg p-4 border border-slate-800 text-xs">
                          <div><span className="text-slate-500 block mb-1">需要シグナル</span><span className="text-indigo-300 font-bold">{company.demandSignal}</span></div>
                          <div><span className="text-slate-500 block mb-1">推奨アプローチ先</span><span className="text-slate-200">{company.targetDepartment} {company.targetRole}</span></div>
                          <div><span className="text-slate-500 block mb-1">事業内容</span><span className="text-slate-200">{company.businessDescription}</span></div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-700/50">
                          <button onClick={() => void addToSalesList(company)} className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded transition">営業リストに追加</button>
                          <button onClick={() => handleSyncSalesforce(company.companyName)} className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded transition">Salesforce連携</button>
                        </div>
                      </div>
                    ))}
                    {aiCandidates.length === 0 && <div className="text-center py-14 bg-slate-800/40 border border-slate-700 rounded-xl text-sm text-slate-400">条件に一致する企業がありません。条件を緩めて再検索してください。</div>}
                  </div>

                  {aiCandidates.length > 0 && (
                    <div className="bg-slate-950/70 border border-slate-700 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
                        <div><h3 className="text-sm font-bold text-white">検索結果についてAIと対話</h3><p className="text-[10px] text-slate-500 mt-0.5">現在の商品・検索条件・表示企業を引き継いで質問できます</p></div>
                        <span className="text-[10px] text-emerald-400">Ollama · ローカル対話</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto p-5 space-y-3">
                        {chatMessages.length === 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {['優先順位と理由を教えて', '各社への初回トークを作って', 'この商品の弱点も踏まえて比較して'].map(example => (
                              <button key={example} onClick={() => setChatInput(example)} className="text-left text-[11px] text-slate-400 border border-slate-800 hover:border-indigo-700 hover:text-indigo-300 rounded-lg p-3">{example}</button>
                            ))}
                          </div>
                        )}
                        {chatMessages.map((message, index) => (
                          <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-6 whitespace-pre-wrap ${message.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>{message.content}</div>
                          </div>
                        ))}
                        {chatLoading && <div className="text-xs text-slate-500 animate-pulse">Ollamaが回答を作成しています...</div>}
                      </div>
                      <div className="flex gap-2 p-4 border-t border-slate-800">
                        <input value={chatInput} onChange={event => setChatInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.nativeEvent.isComposing) handleChat(); }} placeholder="例：上位3社の違いを説明して" className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500" />
                        <button onClick={handleChat} disabled={!chatInput.trim() || chatLoading} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold px-5 py-2.5 rounded-lg text-xs">送信</button>
                      </div>
                    </div>
                  )}
                </section>
              )}
            </div>
          )}

          {activeTab === 'sales-list' && (
            <div className="space-y-6">
              <div className="flex items-end justify-between gap-4">
                <div><h2 className="text-2xl font-bold">営業リスト</h2><p className="text-slate-400 text-sm mt-1">候補企業を保存し、ステータス・メモ・DM演習を一画面で管理します。</p></div>
                <div className="text-right"><div className="text-3xl font-black text-indigo-400">{salesLeads.length}</div><div className="text-[10px] text-slate-500">登録企業</div></div>
              </div>
              {salesListLoading ? <div className="text-center py-16 text-slate-500 animate-pulse">営業リストを読み込み中...</div> : salesLeads.length === 0 ? (
                <div className="border border-dashed border-slate-700 rounded-xl py-16 text-center"><p className="text-slate-300 font-bold">営業リストはまだ空です</p><p className="text-xs text-slate-500 mt-2">AI検索、類似企業分析、企業データベースから企業を追加できます。</p><button onClick={() => setActiveTab('companies')} className="mt-5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg">企業を探す</button></div>
              ) : (
                <div className="space-y-3">
                  {salesLeads.map(lead => (
                    <article key={lead.companyId} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 grid grid-cols-[1fr_160px] gap-5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap"><h3 className="font-bold text-white">{lead.companyName}</h3><span className="text-[10px] bg-slate-950 border border-slate-700 text-slate-400 px-2 py-1 rounded">{lead.industryName}</span><span className="text-[10px] text-emerald-400 font-bold">営業スコア {lead.salesScore}</span></div>
                        <p className="text-xs text-slate-400 mt-2">{lead.prefecture}{lead.city} · {lead.employees.toLocaleString()}名 · {lead.targetDepartment} {lead.targetRole}</p>
                        <p className="text-[11px] text-indigo-300 mt-2">需要シグナル：{lead.demandSignal}</p>
                        <textarea defaultValue={lead.note} onBlur={event => void updateSalesLead(lead, { note: event.target.value })} placeholder="企業メモ、次のアクションなど" rows={2} className="mt-3 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div className="flex flex-col gap-2 justify-center">
                        <select value={lead.status} onChange={event => void updateSalesLead(lead, { status: event.target.value })} className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-xs">
                          {['未対応','DM作成中','送信済み','返信あり','商談化','保留','NG'].map(status => <option key={status}>{status}</option>)}
                        </select>
                        <button onClick={() => openDmPractice(lead.companyId)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2.5 rounded-lg text-xs">この企業でDM演習</button>
                        <button onClick={() => void removeSalesLead(lead)} className="text-rose-400 hover:bg-rose-950 px-3 py-2 rounded-lg text-[11px]">リストから削除</button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'dm-practice' && (
            <div className="space-y-6">
              <div><h2 className="text-2xl font-bold">AI営業DM演習</h2><p className="text-slate-400 text-sm mt-1">AIが企業担当者役を演じます。実際のメールやDMは送信されません。</p></div>
              <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <label className="space-y-1.5"><span className="text-[11px] text-slate-400">演習対象企業</span><select value={practiceCompanyId} onChange={event => { setPracticeCompanyId(event.target.value); setPracticeMessages([]); setPracticeFeedback(''); }} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-3 text-sm"><option value="">企業を選択</option>{salesLeads.map(lead => <option key={lead.companyId} value={lead.companyId}>{lead.companyName}｜{lead.targetDepartment}</option>)}</select></label>
                  <label className="space-y-1.5"><span className="text-[11px] text-slate-400">提案する商材</span><select value={productName} onChange={event => setProductName(event.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-3 text-sm">{products.filter(product => product.active).map(product => <option key={product.id}>{product.name}</option>)}</select></label>
                </div>
                {practiceCompany ? <div className="grid grid-cols-3 gap-3 bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-[11px]"><div><span className="text-slate-500 block">相手役</span>{practiceCompany.targetDepartment} {practiceCompany.targetRole}</div><div><span className="text-slate-500 block">事業</span>{practiceCompany.businessDescription}</div><div><span className="text-slate-500 block">需要シグナル</span>{practiceCompany.demandSignal}</div></div> : <p className="text-xs text-amber-300">営業リストから演習対象企業を追加・選択してください。</p>}
              </section>
              <div className="grid grid-cols-3 bg-slate-950 border border-slate-700 rounded-xl p-1">
                <button onClick={() => setPracticeMode('draft')} className={`px-4 py-2.5 rounded-lg text-xs font-bold ${practiceMode === 'draft' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>新規営業文をAI作成</button>
                <button onClick={() => setPracticeMode('reply')} className={`px-4 py-2.5 rounded-lg text-xs font-bold ${practiceMode === 'reply' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>受信文からAI返信を作成</button>
                <button onClick={() => setPracticeMode('simulation')} className={`px-4 py-2.5 rounded-lg text-xs font-bold ${practiceMode === 'simulation' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>対話型DMロールプレイ</button>
              </div>
              {practiceMode === 'draft' && (
                <section className="bg-slate-950 border border-slate-700 rounded-xl p-5 space-y-4">
                  <div><h3 className="text-sm font-bold">企業に合わせた営業文をAIが提案</h3><p className="text-[10px] text-slate-500 mt-1">選択企業の事業・需要シグナルと商材を組み合わせ、初回アプローチ文をゼロから作成します。</p></div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="space-y-1"><span className="text-[10px] text-slate-500">送信形式</span><select value={draftChannel} onChange={event => setDraftChannel(event.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs"><option>メール</option><option>LinkedIn風DM</option><option>問い合わせフォーム</option><option>短文チャットDM</option></select></label>
                    <label className="space-y-1"><span className="text-[10px] text-slate-500">相手の立場</span><select value={draftRecipientRole} onChange={event => setDraftRecipientRole(event.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs">{['担当者','課長・マネージャー','部門責任者','購買担当','経営者・役員','情報システム担当'].map(role => <option key={role}>{role}</option>)}</select></label>
                    <label className="space-y-1"><span className="text-[10px] text-slate-500">営業の目的</span><select value={draftObjective} onChange={event => setDraftObjective(event.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs"><option>15分のオンライン商談を提案する</option><option>資料送付の許可を得る</option><option>現在の課題をヒアリングする</option><option>無料相談・診断を提案する</option><option>担当部署への取り次ぎを依頼する</option></select></label>
                    <label className="space-y-1"><span className="text-[10px] text-slate-500">文体</span><select value={draftTone} onChange={event => setDraftTone(event.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs">{['丁寧で簡潔','親しみやすい','役員向けに端的','課題提起を重視','押し売り感を抑える'].map(tone => <option key={tone}>{tone}</option>)}</select></label>
                  </div>
                  <label className="space-y-1 block"><span className="text-[10px] text-slate-500">追加で盛り込みたい条件（任意）</span><textarea value={draftExtra} onChange={event => setDraftExtra(event.target.value)} placeholder="例：オンラインで15分、価格は書かない、導入事例の案内を含める" rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs resize-none" /></label>
                  <div className="grid grid-cols-3 gap-3 bg-indigo-950/40 border border-indigo-800/50 rounded-lg p-3 text-[11px]"><div><span className="text-slate-500 block">AIの立場</span><span className="text-indigo-200 font-bold">自社の営業担当</span></div><div><span className="text-slate-500 block">送信先</span>{practiceCompany?.targetDepartment ?? '企業を選択'} · {draftRecipientRole}</div><div><span className="text-slate-500 block">営業の根拠</span>{practiceCompany?.demandSignal ?? '企業を選択'}</div></div>
                  <button onClick={() => void handleGenerateSalesDraft()} disabled={!practiceCompanyId || practiceLoading} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold py-3 rounded-lg text-sm">{practiceLoading ? '企業と商材を分析して作成中...' : 'AIに営業文を提案してもらう'}</button>
                  {generatedDraft && <div className="bg-slate-900 border border-emerald-800/60 rounded-xl p-5"><div className="flex justify-between mb-3"><h4 className="text-sm font-bold text-emerald-300">AI営業文案</h4><button onClick={() => { void navigator.clipboard.writeText(generatedDraft); showToast('営業文をコピーしました'); }} className="text-[11px] text-indigo-300">コピー</button></div><div className="text-xs text-slate-200 leading-6 whitespace-pre-wrap">{generatedDraft}</div></div>}
                </section>
              )}
              {practiceMode === 'reply' && (
                <section className="bg-slate-950 border border-slate-700 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between"><div><h3 className="text-sm font-bold">受信メール・DMへの返信作成</h3><p className="text-[10px] text-slate-500 mt-1">入力した文章の質問・懸念・依頼を読み取り、指定した立場で返信します。</p></div><span className="text-[10px] bg-emerald-950 border border-emerald-800 text-emerald-300 px-2 py-1 rounded">一般化済み企業メール知識を参照</span></div>
                  <textarea value={replySourceText} onChange={event => setReplySourceText(event.target.value)} placeholder="相手から届いたメールやDMを貼り付けてください。個人名などは匿名化を推奨します。" rows={7} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs leading-6 resize-y focus:outline-none focus:border-indigo-500" />
                  <div className="grid grid-cols-3 gap-3">
                    <label className="space-y-1"><span className="text-[10px] text-slate-500">AIが取る立場</span><select value={replyRole} onChange={event => setReplyRole(event.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs">{['自社の営業担当','相手企業の担当者','相手企業の購買担当','相手企業の部門責任者','自社の営業責任者','カスタマーサクセス担当'].map(role => <option key={role}>{role}</option>)}</select></label>
                    <label className="space-y-1"><span className="text-[10px] text-slate-500">返信の目的</span><select value={replyObjective} onChange={event => setReplyObjective(event.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs"><option>相手の懸念に回答し、次回の打ち合わせにつなげる</option><option>条件を確認して社内検討につなげる</option><option>丁寧に断り、将来の接点を残す</option><option>追加資料や見積もりを依頼する</option><option>日程を調整する</option></select></label>
                    <label className="space-y-1"><span className="text-[10px] text-slate-500">文体</span><select value={replyTone} onChange={event => setReplyTone(event.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs">{['丁寧で簡潔','親しみやすい','役員向けに端的','慎重でフォーマル','前向きで熱意を示す'].map(tone => <option key={tone}>{tone}</option>)}</select></label>
                  </div>
                  <div className="bg-indigo-950/40 border border-indigo-800/50 rounded-lg p-3 text-[11px]"><span className="text-indigo-300 font-bold">現在のAIの立場：</span><span className="text-white">{replyRole}</span><span className="text-slate-500 ml-2">この立場以外の発言をしないようLLMへ明示します。</span></div>
                  <button onClick={() => void handleGenerateReply()} disabled={!replySourceText.trim() || !practiceCompanyId || practiceLoading} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold py-3 rounded-lg text-sm">{practiceLoading ? '文章を理解して返信を作成中...' : 'この文章をもとにAI返信を作成'}</button>
                  {generatedReply && <div className="bg-slate-900 border border-emerald-800/60 rounded-xl p-5"><div className="flex justify-between mb-3"><h4 className="text-sm font-bold text-emerald-300">AI返信案</h4><button onClick={() => { void navigator.clipboard.writeText(generatedReply); showToast('返信案をコピーしました'); }} className="text-[11px] text-indigo-300">コピー</button></div><div className="text-xs text-slate-200 leading-6 whitespace-pre-wrap">{generatedReply}</div></div>}
                </section>
              )}
              {practiceMode === 'simulation' && <>
              <section className="bg-slate-950 border border-slate-700 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-800 flex justify-between"><div><h3 className="text-sm font-bold">DMスレッド</h3><p className="text-[10px] text-slate-500">あなた＝営業担当 ／ AI＝{practiceCompany?.companyName ?? '相手企業'}の{practiceCompany?.targetDepartment ?? '企業'}担当者</p></div><span className="text-[10px] text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-1 rounded">企業担当者ロック中</span></div>
                <div className="min-h-72 max-h-[420px] overflow-y-auto p-5 space-y-3">
                  {practiceMessages.length === 0 && <div className="py-16 text-center"><p className="text-slate-400 text-sm">最初の営業DMを書いて演習を始めましょう</p><button onClick={() => setPracticeInput(`突然のご連絡失礼いたします。${practiceCompany?.demandSignal ?? '貴社の取り組み'}を拝見し、${productName}がお役に立てるのではと思いご連絡しました。`)} className="mt-3 text-xs text-indigo-300 hover:text-indigo-200">AI下書きを入力欄にセット</button></div>}
                  {practiceMessages.map((message, index) => <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-6 whitespace-pre-wrap ${message.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm'}`}>{message.content}</div></div>)}
                  {practiceLoading && <p className="text-xs text-slate-500 animate-pulse">AI担当者が返信を考えています...</p>}
                </div>
                <div className="p-4 border-t border-slate-800 space-y-3"><textarea value={practiceInput} onChange={event => setPracticeInput(event.target.value)} placeholder="企業担当者に送るDMを入力..." rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs resize-none focus:outline-none focus:border-indigo-500" /><div className="flex justify-between"><button onClick={() => void handleDmPractice(true)} disabled={practiceMessages.length < 2 || practiceLoading} className="border border-amber-700 text-amber-300 hover:bg-amber-950 disabled:opacity-30 px-4 py-2 rounded-lg text-xs font-bold">演習を終了してAI講評</button><button onClick={() => void handleDmPractice(false)} disabled={!practiceInput.trim() || !practiceCompanyId || practiceLoading} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-6 py-2 rounded-lg text-xs font-bold">DMを送る（模擬）</button></div></div>
              </section>
              {practiceFeedback && <section className="bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-700/50 rounded-xl p-5"><h3 className="text-sm font-bold text-emerald-300 mb-3">AIコーチの講評</h3><div className="text-xs leading-6 text-slate-200 whitespace-pre-wrap">{practiceFeedback}</div><button onClick={() => { setPracticeMessages([]); setPracticeFeedback(''); }} className="mt-4 text-xs border border-slate-700 hover:bg-slate-800 px-4 py-2 rounded-lg">もう一度演習する</button></section>}
              </>}
            </div>
          )}

          {/* TAB: 機能A: アポ・案件管理 (パイプライン) */}
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">アポ・案件管理（パイプライン）</h2>
                <p className="text-slate-400 text-sm mt-1">
                  AIが抽出したターゲット企業の進捗状況を追跡・管理します。
                </p>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {['未対応', 'アポ獲得', '商談中', 'NG / 時期尚早'].map((statusName) => (
                  <div key={statusName} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3 min-h-[400px]">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-slate-300">{statusName}</span>
                      <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold">
                        {results.filter(r => r.status === statusName).length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {results.filter(r => r.status === statusName).map((item) => (
                        <div key={item.id} className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-lg space-y-2 text-xs">
                          <div className="font-bold text-white">{item.name}</div>
                          <div className="text-slate-400 text-[11px]">{item.targetPerson}</div>
                          <div className="text-indigo-400 font-bold">優先度: {item.score}</div>
                          {item.remindDate && (
                            <div className="text-[10px] text-amber-300 bg-amber-950/50 p-1.5 rounded border border-amber-900/50">
                              再アタック予定: {item.remindDate}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: 機能1: 類似企業（Lookalike）分析 */}
          {activeTab === 'lookalike' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">類似企業（Lookalike）自動分析</h2>
                <p className="text-slate-400 text-sm mt-1">
                  「過去に売れた優良顧客」に構造が似ている企業をAIが自動発掘します。
                </p>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-[1fr_150px_auto] gap-3 items-end">
                  <label className="space-y-1.5"><span className="text-xs font-medium text-slate-300">基準企業</span><select value={lookalikeSourceId} onChange={event => { setLookalikeSourceId(event.target.value); setLookalikeMatches([]); }} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm"><optgroup label="既存顧客">{companies.filter(company => company.existingCustomer).map(company => <option key={company.id} value={company.id}>{company.companyName}｜{company.industryName}</option>)}</optgroup><optgroup label="その他の企業">{companies.filter(company => !company.existingCustomer).map(company => <option key={company.id} value={company.id}>{company.companyName}｜{company.industryName}</option>)}</optgroup></select></label>
                  <label className="space-y-1.5"><span className="text-xs font-medium text-slate-300">抽出件数</span><input type="number" min="1" max="50" value={lookalikeLimit} onChange={event => setLookalikeLimit(Math.min(50, Math.max(1, Number(event.target.value) || 1)))} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm" /></label>
                  <button onClick={handleLookalikeAnalyze} disabled={!lookalikeSourceId || lookalikeLoading} className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 font-bold px-6 py-3 rounded-lg text-sm text-white transition whitespace-nowrap">{lookalikeLoading ? '2,000社を分析中...' : '類似企業を自動分析'}</button>
                </div>
                {lookalikeSource && <div className="grid grid-cols-5 gap-3 bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-[11px]"><div><span className="text-slate-500 block">業界</span>{lookalikeSource.industryName}</div><div><span className="text-slate-500 block">従業員</span>{lookalikeSource.employees.toLocaleString()}名</div><div><span className="text-slate-500 block">売上規模</span>{lookalikeSource.revenueMillionYen.toLocaleString()}百万円</div><div><span className="text-slate-500 block">所在地</span>{lookalikeSource.prefecture}</div><div><span className="text-slate-500 block">需要シグナル</span>{lookalikeSource.demandSignal}</div></div>}
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between"><h3 className="text-sm font-bold text-slate-400">類似度ランキング</h3>{lookalikeMatches.length > 0 && <span className="text-[10px] text-slate-500">{lookalikeAnalyzedCount.toLocaleString()}社を比較 · {lookalikeMethodology}</span>}</div>
                {lookalikeMatches.map((match, index) => (
                  <div key={match.company.id} className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-xl flex justify-between items-center gap-5">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-2xl font-black text-slate-700 w-8">{String(index + 1).padStart(2, '0')}</span>
                      <div className="min-w-0"><div className="flex items-center gap-2 flex-wrap"><h4 className="font-bold text-white">{match.company.companyName}</h4><span className="bg-emerald-950 text-emerald-400 text-xs px-2 py-0.5 rounded border border-emerald-800 font-bold">{match.similarityScore}% マッチ</span><span className="text-[10px] text-slate-500">{match.company.industryName} · {match.company.prefecture} · {match.company.employees.toLocaleString()}名</span></div><div className="flex gap-1.5 mt-2 flex-wrap">{match.reasons.map(reason => <span key={reason} className="text-[10px] bg-slate-950 border border-slate-700 text-slate-300 px-2 py-1 rounded">{reason}</span>)}</div><p className="text-[11px] text-slate-500 mt-2">{match.company.businessDescription}｜需要: {match.company.demandSignal}｜営業スコア {match.company.salesScore}</p></div>
                    </div>
                    <button onClick={() => void addToSalesList(match.company)} className="bg-indigo-600 hover:bg-indigo-500 text-xs text-white px-4 py-2 rounded-lg font-bold transition whitespace-nowrap">リストに追加</button>
                  </div>
                ))}
                {!lookalikeLoading && lookalikeMatches.length === 0 && <div className="border border-dashed border-slate-700 rounded-xl py-14 text-center text-sm text-slate-500">基準企業を選び、「類似企業を自動分析」を実行してください。</div>}
              </div>
            </div>
          )}

          {/* TAB 5: 架空企業データベース */}
          {activeTab === 'companies' && (
            <div className="space-y-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">企業データベース</h2>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-950 border border-amber-800 px-2 py-1 rounded-full">DEMO DATA</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">20業界・2,000社の架空企業から、需要シグナルの強い営業候補を検索できます。</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-indigo-400">{companyDataLoading ? '—' : filteredCompanies.length.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500">検索結果 / 2,000社</div>
                </div>
              </div>

              <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-3 bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
                <label className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400">企業名・所在地・事業内容</span>
                  <input value={companyQuery} onChange={event => setCompanyQuery(event.target.value)} placeholder="例：設備更新、東京都" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500" />
                </label>
                <label className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400">業界</span>
                  <select value={companyIndustry} onChange={event => setCompanyIndustry(event.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500">
                    <option value="all">すべての業界</option>
                    {companyIndustries.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                  </select>
                </label>
                <label className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400">最低営業スコア：{minimumScore}</span>
                  <input type="range" min="55" max="95" value={minimumScore} onChange={event => setMinimumScore(Number(event.target.value))} className="w-full accent-indigo-500 mt-3" />
                </label>
              </div>

              {companyDataLoading ? (
                <div className="text-center py-20 text-slate-400 animate-pulse">企業データベースを読み込み中...</div>
              ) : (
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-[1.5fr_1fr_.7fr_.65fr_1.2fr_auto] gap-4 px-4 py-3 text-[10px] font-bold tracking-wider text-slate-500 border-b border-slate-800 uppercase">
                    <span>企業</span><span>業界</span><span>規模</span><span>スコア</span><span>需要シグナル</span><span>操作</span>
                  </div>
                  <div className="divide-y divide-slate-800 max-h-[560px] overflow-y-auto">
                    {filteredCompanies.slice(0, 200).map(company => (
                      <div key={company.id} className="grid grid-cols-[1.5fr_1fr_.7fr_.65fr_1.2fr_auto] gap-4 px-4 py-3.5 items-center hover:bg-slate-800/50 transition text-xs">
                        <div>
                          <div className="font-bold text-slate-100">{company.companyName}</div>
                          <div className="text-[10px] text-slate-500 mt-1">{company.prefecture}{company.city} · {company.targetDepartment}</div>
                        </div>
                        <div className="text-slate-300">{company.industryName}</div>
                        <div><div className="text-slate-300">{company.scale}</div><div className="text-[10px] text-slate-500">{company.employees.toLocaleString()}名</div></div>
                        <div><span className={`inline-flex min-w-10 justify-center rounded-full px-2 py-1 font-black ${company.salesScore >= 85 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-indigo-950 text-indigo-300 border border-indigo-800'}`}>{company.salesScore}</span></div>
                        <div><div className="text-indigo-300 font-semibold">{company.demandSignal}</div><div className="text-[10px] text-slate-500 mt-1 truncate">{company.businessDescription}</div></div>
                        <button onClick={() => void addToSalesList(company)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-2 rounded-lg whitespace-nowrap">リスト追加</button>
                      </div>
                    ))}
                    {filteredCompanies.length === 0 && <div className="text-center py-16 text-slate-500">条件に一致する企業がありません</div>}
                  </div>
                  {filteredCompanies.length > 200 && <div className="px-4 py-2.5 text-[10px] text-slate-500 border-t border-slate-800">表示速度のため上位200社を表示しています。検索条件を絞り込んでください。</div>}
                </div>
              )}
              <p className="text-[10px] text-slate-600">※ 掲載企業はすべてデモ用途の架空企業です。実在の企業・団体とは関係ありません。</p>
            </div>
          )}

          {/* TAB 6: 設定 */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold">商品・ソリューション管理</h2>
                  <p className="text-sm text-slate-400 mt-1">複数の商品を登録し、AI需要分析で使う商材を管理します。</p>
                </div>
                <div className="text-right"><div className="text-2xl font-black text-indigo-400">{products.length}</div><div className="text-[10px] text-slate-500">登録商品</div></div>
              </div>

              <div className="grid grid-cols-[1.15fr_1.85fr] gap-5">
                <section className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 space-y-4 self-start">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm">{editingProductId ? '商品を編集' : '新しい商品を登録'}</h3>
                    {editingProductId && <button onClick={resetProductForm} className="text-[11px] text-slate-400 hover:text-white">編集をキャンセル</button>}
                  </div>
                  <label className="block space-y-1.5"><span className="text-[11px] text-slate-400">商品・ソリューション名 *</span><input value={productForm.name} onChange={event => setProductForm(current => ({ ...current, name: event.target.value }))} placeholder="例：店舗向けAIカメラ" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" /></label>
                  <label className="block space-y-1.5"><span className="text-[11px] text-slate-400">カテゴリー *</span><input value={productForm.category} onChange={event => setProductForm(current => ({ ...current, category: event.target.value }))} placeholder="例：セキュリティ機器" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" /></label>
                  <label className="block space-y-1.5"><span className="text-[11px] text-slate-400">概要</span><textarea rows={3} value={productForm.description} onChange={event => setProductForm(current => ({ ...current, description: event.target.value }))} placeholder="商品の特徴や解決する課題" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 resize-none" /></label>
                  <label className="block space-y-1.5"><span className="text-[11px] text-slate-400">対象業界</span><input value={productForm.targetIndustries} onChange={event => setProductForm(current => ({ ...current, targetIndustries: event.target.value }))} placeholder="例：製造業、建設業" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" /></label>
                  <button onClick={handleSaveProduct} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg py-2.5 text-sm">{editingProductId ? '変更を保存' : '商品を登録'}</button>
                </section>

                <section className="space-y-3">
                  {products.map(product => (
                    <article key={product.id} className={`bg-slate-800/50 border rounded-xl p-4 ${product.active ? 'border-slate-700' : 'border-slate-800 opacity-60'}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2"><h3 className="font-bold text-sm text-white">{product.name}</h3><span className="text-[10px] bg-slate-950 text-indigo-300 px-2 py-0.5 rounded">{product.category}</span>{product.name === productName && <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">分析対象</span>}</div>
                          <p className="text-xs text-slate-400 mt-2">{product.description || '商品概要は未登録です'}</p>
                          <p className="text-[10px] text-slate-500 mt-2">対象業界：{product.targetIndustries || '未設定'}</p>
                        </div>
                        <label className="flex items-center gap-2 text-[10px] text-slate-400 whitespace-nowrap"><input type="checkbox" checked={product.active} onChange={() => handleToggleProduct(product.id)} className="accent-emerald-500" />有効</label>
                      </div>
                      <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-slate-700/50">
                        <button onClick={() => { setProductName(product.name); showToast(`${product.name} を分析対象に設定しました`); }} disabled={!product.active} className="text-[11px] bg-emerald-950 text-emerald-300 hover:bg-emerald-900 disabled:opacity-30 px-3 py-1.5 rounded">分析対象にする</button>
                        <button onClick={() => handleEditProduct(product)} className="text-[11px] bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded">編集</button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-[11px] text-rose-400 hover:bg-rose-950 px-3 py-1.5 rounded">削除</button>
                      </div>
                    </article>
                  ))}
                </section>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-200">アプローチNG・既存顧客データ設定</h3>
                <p className="text-xs text-slate-400">CSVをアップロードするか、Salesforceから自動連携して除外リストを作成します。</p>
                <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center text-slate-500 text-xs">
                  アプローチ除外リスト（CSV）をドラッグ＆ドロップ
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* メール自動生成モーダル */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-indigo-400">
                AI作成 提案メール文面
              </h3>
              <button onClick={() => setSelectedEmail(null)} className="text-slate-400 hover:text-white text-lg font-bold px-2">✕</button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="text-xs text-slate-400 block mb-1">件名</label>
                <input type="text" readOnly value={selectedEmail.subject} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-medium" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">本文</label>
                <textarea readOnly rows={10} value={selectedEmail.body} className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-300 font-mono text-xs leading-relaxed" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`件名: ${selectedEmail.subject}\n\n${selectedEmail.body}`);
                  showToast('メール本文をコピーしました');
                  setSelectedEmail(null);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition"
              >
                文面をコピーする
              </button>
              <button onClick={() => setSelectedEmail(null)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-xs transition">
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
