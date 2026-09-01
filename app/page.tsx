'use client';

import { useState, useEffect, useRef } from 'react';

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

function IconSparkles({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2l1.8 5.6L19.4 9l-5.6 1.8L12 16.4l-1.8-5.6L4.6 9l5.6-1.4L12 2z" />
      <path d="M19 14l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z" />
    </svg>
  );
}

function IconBuilding2({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="4" y="3" width="9" height="18" rx="1" />
      <rect x="13" y="9" width="7" height="12" rx="1" />
      <line x1="7" y1="7" x2="7" y2="7.01" />
      <line x1="10" y1="7" x2="10" y2="7.01" />
      <line x1="7" y1="11" x2="7" y2="11.01" />
      <line x1="10" y1="11" x2="10" y2="11.01" />
      <line x1="7" y1="15" x2="7" y2="15.01" />
      <line x1="10" y1="15" x2="10" y2="15.01" />
      <line x1="16" y1="13" x2="16" y2="13.01" />
      <line x1="16" y1="17" x2="16" y2="17.01" />
    </svg>
  );
}

function IconPhoneCall({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2.1z" />
    </svg>
  );
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function IconCompass({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.5l-2 5-5 2 2-5 5-2z" />
    </svg>
  );
}

function IconHome({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 11.5L12 4l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function IconList({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
      <path d="M8 6h12M8 12h12M8 18h12" />
    </svg>
  );
}

function IconFileEdit({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9" />
      <path d="M14 3l5 5" />
      <path d="M9 15l6-6 2 2-6 6H9v-2z" />
    </svg>
  );
}

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function IconBarChart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 20V10M12 20V4M20 20v-7" />
    </svg>
  );
}

function IconSettingsGear({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  );
}

function IconFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 21V4" />
      <path d="M5 4h13l-3 4 3 4H5" />
    </svg>
  );
}

function IconChevronRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function IconCopy({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </svg>
  );
}

function IconInfo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8v.01" />
    </svg>
  );
}

function IconMapPin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconTrendingUp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

function IconMoreVertical({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  );
}

function IconPlus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconEnvelope({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function IconReply({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M9 14l-5-5 5-5" />
      <path d="M4 9h10a6 6 0 0 1 6 6v3" />
    </svg>
  );
}

function IconChatBubble({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function IconExternalLink({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M14 4h6v6" />
      <path d="M20 4l-9 9" />
      <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
    </svg>
  );
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

const COMPANY_SCORE_RANGE = { min: 55, max: 95 };

const DEFAULT_PRODUCTS: Product[] = [
  { id: 'product-camera', name: '工場向け監視カメラ', category: 'セキュリティ機器', description: 'AI画像解析を搭載した工場・倉庫向け監視ソリューション', targetIndustries: '製造業、運輸・郵便業、建設業', active: true },
  { id: 'product-hr', name: '人事労務管理SaaS', category: '業務SaaS', description: '勤怠・給与・労務手続きを一元化するクラウドサービス', targetIndustries: '全業界', active: true },
  { id: 'product-energy', name: '法人向け省エネ診断', category: 'コンサルティング', description: '拠点別の電力利用を分析し設備更新計画を提案', targetIndustries: '製造業、宿泊・飲食サービス業、卸売・小売業', active: true },
];

const PURPOSE_TABS = [
  { mode: 'draft' as const, title: 'はじめて連絡する', subtitle: '最初の営業文を作成', icon: IconEnvelope },
  { mode: 'reply' as const, title: '返信を作る', subtitle: '届いたメッセージへ返信', icon: IconReply },
  { mode: 'simulation' as const, title: '会話を練習する', subtitle: '企業担当者役とDM練習', icon: IconChatBubble },
];

const OBJECTIVE_PRESETS = [
  { label: '商談を提案', value: '15分のオンライン商談を提案する' },
  { label: '資料を案内', value: '資料送付の許可を得る' },
  { label: '課題をヒアリング', value: '現在の課題をヒアリングする' },
];
const OTHER_OBJECTIVES = ['無料相談・診断を提案する', '担当部署への取り次ぎを依頼する'];

// アポ・案件管理のカンバン列。
// 実データ（sales_leads）のstatusは 未対応/DM作成中/送信済み/返信あり/商談化/保留/NG の7値で、
// 「アポ獲得」に相当する実データは存在しないため、実際の商談化どうかが分かるstatusにのみ
// 「商談中」を割り当て、DM作成〜返信までの進行中stageは正直に「対応中」としてグルーピングする。
const PIPELINE_COLUMNS = [
  {
    key: 'unhandled', label: '未対応', statuses: ['未対応'], accent: 'slate',
    note: '最初の連絡を準備する案件',
    emptyTitle: '未対応の案件はありません', emptyBody: '営業リストに追加した案件がここに表示されます',
    icon: IconList,
  },
  {
    key: 'engaging', label: '対応中', statuses: ['DM作成中', '送信済み', '返信あり'], accent: 'blue',
    note: 'DMの作成・送信・返信を管理する案件',
    emptyTitle: '対応中の案件はありません', emptyBody: 'DMを作成・送信した案件がここに表示されます',
    icon: IconEnvelope,
  },
  {
    key: 'negotiating', label: '商談中', statuses: ['商談化'], accent: 'emerald',
    note: '提案と次回予定を管理する案件',
    emptyTitle: '商談中の案件はありません', emptyBody: '商談へ進んだ案件がここに表示されます',
    icon: IconFileEdit,
  },
  {
    key: 'hold', label: '保留', statuses: ['保留'], accent: 'orange',
    note: '再連絡のタイミングを検討する案件',
    emptyTitle: '保留中の案件はありません', emptyBody: '再連絡を予定している案件がここに表示されます',
    icon: IconClock,
  },
  {
    key: 'ng', label: 'NG', statuses: ['NG'], accent: 'red',
    note: '対象外と判断した案件を確認する案件',
    emptyTitle: 'NGの案件はありません', emptyBody: '対象外と判断した案件がここに表示されます',
    icon: IconInfo,
  },
];

const NAV_ITEMS = [
  { tab: 'home', label: 'ホーム', icon: IconHome },
  { tab: 'ai-search', label: '営業候補を探す', icon: IconSearch },
  { tab: 'sales-list', label: '営業リスト', icon: IconList },
  { tab: 'dm-practice', label: '営業コミュニケーション', icon: IconFileEdit },
  { tab: 'pipeline', label: 'アポ・案件管理', icon: IconCalendar },
  { tab: 'lookalike', label: '類似企業分析', icon: IconBarChart },
  { tab: 'companies', label: '企業データベース', icon: IconBuilding2 },
  { tab: 'settings', label: '商材・除外設定', icon: IconSettingsGear },
] as const;

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'ai-search' | 'sales-list' | 'dm-practice' | 'pipeline' | 'lookalike' | 'companies' | 'settings'>('home');
  // 初回描画はサーバー・クライアントで必ず同じ既定値にする（Hydration不一致を防ぐため、
  // localStorageの読み込みはマウント後のuseEffectで行い、ここでは行わない）。
  const [productName, setProductName] = useState('工場向け監視カメラ');
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [hasLoadedStoredProducts, setHasLoadedStoredProducts] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({ name: '', category: '', description: '', targetIndustries: '' });
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<{ connected: boolean; model: string; modelReady: boolean } | null>(null);
  const [ollamaAnalysis, setOllamaAnalysis] = useState('');
  const [aiCandidates, setAiCandidates] = useState<Company[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [showConditionsPanel, setShowConditionsPanel] = useState(false);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const aiPanelInputRef = useRef<HTMLTextAreaElement>(null);
  const [searchConditions, setSearchConditions] = useState({ industry: 'all', prefecture: 'all', minEmployees: 0, maxEmployees: 0, minScore: 70, demandSignal: '', limit: 10 });
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

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
  const [showLookalikeMethodology, setShowLookalikeMethodology] = useState(false);
  const lookalikeSourceSelectRef = useRef<HTMLSelectElement>(null);
  const [salesLeads, setSalesLeads] = useState<SalesLead[]>([]);
  const [salesListLoading, setSalesListLoading] = useState(true);
  const [salesSearchQuery, setSalesSearchQuery] = useState('');
  const [salesStatusFilter, setSalesStatusFilter] = useState('all');
  const [salesSortOrder, setSalesSortOrder] = useState<'updated-desc' | 'updated-asc' | 'score-desc' | 'score-asc'>('updated-desc');
  const [dirtyNotes, setDirtyNotes] = useState<Record<string, boolean>>({});
  const [openLeadMenuId, setOpenLeadMenuId] = useState<string | null>(null);
  const [selectedPipelineLead, setSelectedPipelineLead] = useState<SalesLead | null>(null);
  const [mobilePipelineTab, setMobilePipelineTab] = useState(PIPELINE_COLUMNS[0].key);
  const [practiceCompanyId, setPracticeCompanyId] = useState('');
  const [practiceMessages, setPracticeMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [practiceInput, setPracticeInput] = useState('');
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [practiceFeedback, setPracticeFeedback] = useState('');
  const [practiceMode, setPracticeMode] = useState<'draft' | 'simulation' | 'reply'>('draft');
  const [isEditingPracticeCompany, setIsEditingPracticeCompany] = useState(false);
  const [isEditingPracticeProduct, setIsEditingPracticeProduct] = useState(false);
  const [showDraftDetails, setShowDraftDetails] = useState(false);
  const [showReplyDetails, setShowReplyDetails] = useState(false);
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

  // 需要検知の演出通知は表示しない（登録処理を呼び出さない）

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

  // マウント後に一度だけlocalStorageから復元する（初回描画はサーバーと同じ既定値のまま）。
  useEffect(() => {
    try {
      const savedProducts = window.localStorage.getItem('eigyo-navi-products');
      if (savedProducts) setProducts(JSON.parse(savedProducts));
    } catch {
      // 保存データが壊れている場合は既定値のまま
    }
    const savedProductName = window.localStorage.getItem('eigyo-navi-selected-product');
    if (savedProductName) setProductName(savedProductName);
    setHasLoadedStoredProducts(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredProducts) return;
    window.localStorage.setItem('eigyo-navi-products', JSON.stringify(products));
  }, [products, hasLoadedStoredProducts]);

  useEffect(() => {
    if (!hasLoadedStoredProducts) return;
    window.localStorage.setItem('eigyo-navi-selected-product', productName);
  }, [productName, hasLoadedStoredProducts]);

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

  useEffect(() => {
    setSelectedCandidateId(current => aiCandidates.some(company => company.id === current) ? current : (aiCandidates[0]?.id ?? ''));
  }, [aiCandidates]);

  useEffect(() => {
    if (!isAiPanelOpen) return;
    aiPanelInputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsAiPanelOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAiPanelOpen]);

  useEffect(() => {
    if (!selectedPipelineLead) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedPipelineLead(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPipelineLead]);

  useEffect(() => {
    setSelectedPipelineLead(current => {
      if (!current) return current;
      return salesLeads.find(lead => lead.companyId === current.companyId) ?? null;
    });
  }, [salesLeads]);

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

  function extractAnalysisSection(text: string, label: string) {
    const match = text.match(new RegExp(`【${label}】([\\s\\S]*?)(?:【|$)`));
    return match ? match[1].trim() : '';
  }

  const handleCopyOpeningLine = (text: string) => {
    if (!text || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => showToast('コピーしました')).catch(() => showToast('コピーできませんでした'));
  };

  const handleViewCompanyProfile = (company: Company) => {
    setCompanyQuery(company.companyName);
    setActiveTab('companies');
  };

  const renderPracticeTargetField = () => (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">送り先</span>
        <button type="button" onClick={() => setIsEditingPracticeCompany(true)} aria-label="送り先企業を変更" className="text-xs text-blue-600 hover:text-blue-700 font-medium">変更</button>
      </div>
      {isEditingPracticeCompany ? (
        <select
          autoFocus
          aria-label="送り先企業を選択"
          value={practiceCompanyId}
          onChange={event => { setPracticeCompanyId(event.target.value); setPracticeMessages([]); setPracticeFeedback(''); setIsEditingPracticeCompany(false); }}
          onBlur={() => setIsEditingPracticeCompany(false)}
          className="w-full mt-1.5 bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">企業を選択</option>
          {salesLeads.map(lead => <option key={lead.companyId} value={lead.companyId}>{lead.companyName}｜{lead.targetDepartment}</option>)}
        </select>
      ) : practiceCompany ? (
        <div className="mt-1.5">
          <div className="text-base font-bold text-[#172033]">{practiceCompany.companyName}</div>
          <div className="text-xs text-slate-500 mt-1">{practiceCompany.industryName}・{practiceCompany.prefecture}　|　{practiceCompany.targetDepartment} {practiceCompany.targetRole}</div>
        </div>
      ) : (
        <p className="mt-1.5 text-sm text-amber-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">営業リストから対象企業を選択してください。</p>
      )}
    </div>
  );

  const renderPracticeProductField = () => {
    const selectedPracticeProduct = products.find(product => product.name === productName);
    return (
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">提案する商材</span>
          <button type="button" onClick={() => setIsEditingPracticeProduct(true)} aria-label="提案する商材を変更" className="text-xs text-blue-600 hover:text-blue-700 font-medium">変更</button>
        </div>
        {isEditingPracticeProduct ? (
          <select
            autoFocus
            aria-label="提案する商材を選択"
            value={productName}
            onChange={event => { setProductName(event.target.value); setIsEditingPracticeProduct(false); }}
            onBlur={() => setIsEditingPracticeProduct(false)}
            className="w-full mt-1.5 bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {products.filter(product => product.active).map(product => <option key={product.id} value={product.name}>{product.name}｜{product.category}</option>)}
          </select>
        ) : (
          <div className="mt-1.5">
            <div className="text-base font-bold text-[#172033]">{productName || '未設定'}</div>
            {selectedPracticeProduct?.description && <div className="text-xs text-slate-500 mt-1">{selectedPracticeProduct.description}</div>}
          </div>
        )}
      </div>
    );
  };

  const handleRemoveSalesLead = (lead: SalesLead) => {
    setOpenLeadMenuId(null);
    if (window.confirm(`${lead.companyName}を営業リストから削除しますか？`)) {
      void removeSalesLead(lead);
    }
  };

  function formatLookalikeReason(reason: string) {
    return reason
      .replace(/^同じ需要シグナル/, '検知した変化が共通')
      .replace(/^同じ推奨部署/, '提案先の部署が共通');
  }

  function getStatusBadgeClass(status: string) {
    switch (status) {
      case 'DM作成中': return 'bg-blue-50 border-blue-200 text-blue-700';
      case '送信済み': return 'bg-slate-100 border-slate-300 text-slate-700';
      case '返信あり': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case '商談化': return 'bg-emerald-100 border-emerald-300 text-emerald-800';
      case '保留': return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'NG': return 'bg-slate-100 border-slate-300 text-slate-500';
      default: return 'bg-slate-50 border-slate-200 text-slate-600';
    }
  }

  function getColumnAccentClasses(accent: string) {
    switch (accent) {
      case 'blue': return { topBar: 'bg-blue-400', badge: 'bg-blue-50 text-blue-700' };
      case 'emerald': return { topBar: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-700' };
      case 'orange': return { topBar: 'bg-orange-400', badge: 'bg-orange-50 text-orange-700' };
      case 'red': return { topBar: 'bg-red-300', badge: 'bg-red-50 text-red-600' };
      default: return { topBar: 'bg-slate-300', badge: 'bg-slate-100 text-slate-600' };
    }
  }

  const renderPipelineCard = (lead: SalesLead) => (
    <button
      key={lead.companyId}
      type="button"
      onClick={() => setSelectedPipelineLead(lead)}
      aria-label={`${lead.companyName}の案件を開く`}
      className="relative w-full min-w-0 text-left bg-white border border-slate-200 rounded-xl p-3.5 hover:border-blue-300 hover:shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
    >
      <div className="pr-6 min-w-0">
        <div className="text-sm font-bold text-[#172033] line-clamp-2 [overflow-wrap:anywhere]" title={lead.companyName}>{lead.companyName}</div>
        <div className="text-xs text-slate-500 mt-0.5 line-clamp-2 [overflow-wrap:anywhere]">{lead.targetDepartment} {lead.targetRole}</div>
      </div>
      <div className="flex items-center gap-2 mt-2 flex-wrap min-w-0">
        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 rounded px-1.5 py-0.5">優先度 {lead.salesScore}</span>
        <span className={`text-[11px] font-medium rounded border px-1.5 py-0.5 ${getStatusBadgeClass(lead.status)}`}>{lead.status}</span>
      </div>
      {lead.note?.trim() && (
        <div className="text-[11px] text-slate-500 mt-2 truncate min-w-0">次にやること：{lead.note.trim()}</div>
      )}
      <span
        role="button"
        tabIndex={0}
        onClick={event => { event.stopPropagation(); setOpenLeadMenuId(current => current === lead.companyId ? null : lead.companyId); }}
        onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); setOpenLeadMenuId(current => current === lead.companyId ? null : lead.companyId); } }}
        aria-label="案件メニューを開く"
        className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        <IconMoreVertical className="w-4 h-4" />
      </span>
      {openLeadMenuId === lead.companyId && (
        <div role="menu" onClick={event => event.stopPropagation()} className="absolute top-9 right-2.5 z-20 bg-white border border-slate-200 rounded-lg shadow-md py-1 min-w-[160px]">
          <span
            role="menuitem"
            tabIndex={0}
            onClick={() => { setOpenLeadMenuId(null); setSalesStatusFilter('all'); setSalesSearchQuery(lead.companyName); setActiveTab('sales-list'); }}
            onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setOpenLeadMenuId(null); setSalesStatusFilter('all'); setSalesSearchQuery(lead.companyName); setActiveTab('sales-list'); } }}
            className="block w-full text-left px-3 py-2 text-sm text-[#172033] hover:bg-slate-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            営業リストで確認
          </span>
        </div>
      )}
    </button>
  );

  const renderCompanyTableRow = (company: Company) => {
    const isInSalesList = salesLeads.some(lead => lead.companyId === company.id);
    return (
      <tr key={company.id} className="hover:bg-[#EFF6FF]/60 transition-colors align-top">
        <td className="px-4 py-3.5 align-top">
          <div className="text-[15px] font-semibold text-[#172033] leading-snug [overflow-wrap:anywhere] line-clamp-2">{company.companyName}</div>
          <div className="text-xs text-[#667085] mt-1">{company.prefecture}{company.city}・{company.targetDepartment}</div>
        </td>
        <td className="px-4 py-3.5 align-top">
          <span className="text-sm text-[#172033] line-clamp-2">{company.industryName}</span>
        </td>
        <td className="px-4 py-3.5 align-top">
          <div className="text-sm text-[#172033]">{company.scale}</div>
          <div className="text-xs text-[#667085] mt-0.5">{company.employees.toLocaleString()}名</div>
        </td>
        <td className="px-4 py-3.5 align-top">
          <span className="inline-flex min-w-[48px] justify-center items-center rounded-full px-2.5 py-1 text-sm font-semibold bg-[#ECFDF3] text-[#15803D] border border-[#15803D]/20">
            {company.salesScore}
          </span>
        </td>
        <td className="px-4 py-3.5 align-top">
          <div className="text-sm text-[#172033]">{company.demandSignal}</div>
          <div className="text-xs text-[#667085] mt-0.5 line-clamp-1">{company.businessDescription}</div>
        </td>
        <td className="px-4 py-3.5 align-top text-right">
          {isInSalesList ? (
            <span
              aria-label={`${company.companyName}は営業リストに追加済みです`}
              className="inline-flex items-center gap-1 bg-[#ECFDF3] text-[#15803D] text-xs font-semibold px-3 py-2 rounded-lg whitespace-nowrap"
            >
              <IconCheck className="w-3.5 h-3.5" /> 追加済み
            </span>
          ) : (
            <button
              onClick={() => void addToSalesList(company)}
              aria-label={`${company.companyName}を営業リストに追加`}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3 py-2 rounded-lg whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              リストに追加
            </button>
          )}
        </td>
      </tr>
    );
  };

  const renderCompanyCard = (company: Company) => {
    const isInSalesList = salesLeads.some(lead => lead.companyId === company.id);
    return (
      <div key={company.id} className="p-4">
        <div className="text-[15px] font-semibold text-[#172033] leading-snug [overflow-wrap:anywhere]">{company.companyName}</div>
        <div className="text-xs text-[#667085] mt-1">{company.industryName}・{company.prefecture}{company.city}</div>
        <div className="text-xs text-[#667085] mt-1">{company.scale}・{company.employees.toLocaleString()}名</div>
        <div className="mt-2.5">
          <span className="inline-flex min-w-[48px] justify-center items-center rounded-full px-2.5 py-1 text-sm font-semibold bg-[#ECFDF3] text-[#15803D] border border-[#15803D]/20">
            スコア {company.salesScore}
          </span>
        </div>
        <div className="mt-2.5">
          <div className="text-sm text-[#172033]">{company.demandSignal}</div>
          <div className="text-xs text-[#667085] mt-0.5">{company.businessDescription}</div>
        </div>
        <div className="mt-3">
          {isInSalesList ? (
            <span
              aria-label={`${company.companyName}は営業リストに追加済みです`}
              className="w-full inline-flex items-center justify-center gap-1.5 bg-[#ECFDF3] text-[#15803D] text-sm font-semibold px-4 py-2.5 rounded-lg"
            >
              <IconCheck className="w-4 h-4" /> 追加済み
            </span>
          ) : (
            <button
              onClick={() => void addToSalesList(company)}
              aria-label={`${company.companyName}を営業リストに追加`}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              営業リストに追加
            </button>
          )}
        </div>
      </div>
    );
  };

  const salesListResults = salesLeads
    .filter(lead => {
      const query = salesSearchQuery.trim().toLowerCase();
      return !query || [lead.companyName, lead.industryName, lead.prefecture, lead.city].some(value => (value ?? '').toLowerCase().includes(query));
    })
    .filter(lead => salesStatusFilter === 'all' || lead.status === salesStatusFilter)
    .slice()
    .sort((a, b) => {
      if (salesSortOrder === 'score-desc') return b.salesScore - a.salesScore;
      if (salesSortOrder === 'score-asc') return a.salesScore - b.salesScore;
      const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return salesSortOrder === 'updated-asc' ? aTime - bTime : bTime - aTime;
    });

  const companyIndustries = Array.from(new Map(companies.map(company => [company.industryCode, company.industryName])).entries());
  const companyPrefectures = Array.from(new Set(companies.map(company => company.prefecture))).sort((a, b) => a.localeCompare(b, 'ja'));
  const selectedProduct = products.find(product => product.name === productName);
  const selectedCandidateIndex = aiCandidates.findIndex(company => company.id === selectedCandidateId);
  const selectedCandidate = selectedCandidateIndex >= 0 ? aiCandidates[selectedCandidateIndex] : undefined;
  const selectedCandidateInSalesList = selectedCandidate ? salesLeads.some(lead => lead.companyId === selectedCandidate.id) : false;
  const openingLine = ollamaAnalysis ? extractAnalysisSection(ollamaAnalysis, '推奨初回トーク') : '';
  const analysisFailed = showResults && aiCandidates.length === 0 && ollamaAnalysis.includes('接続できなかったため');
  const lookalikeSource = companies.find(company => company.id === lookalikeSourceId);
  const practiceCompany = companies.find(company => company.id === practiceCompanyId) ?? salesLeads.find(lead => lead.companyId === practiceCompanyId);
  const isOllamaReady = Boolean(ollamaStatus?.connected && ollamaStatus?.modelReady);
  const isOtherObjectiveSelected = !OBJECTIVE_PRESETS.some(item => item.value === draftObjective);
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
    <div className={`flex flex-col md:flex-row h-screen font-sans overflow-hidden relative ${activeTab === 'home' || activeTab === 'ai-search' || activeTab === 'sales-list' || activeTab === 'dm-practice' || activeTab === 'pipeline' || activeTab === 'lookalike' || activeTab === 'companies' || activeTab === 'settings' ? 'bg-[#eef1f7] text-[#161c2c]' : 'bg-slate-900 text-slate-100'}`}>

      {/* ────────────────────────────────────────────────────────
          リアルタイム需要シグナルアラート（画面上部）
      ──────────────────────────────────────────────────────── */}
      {realtimeAlert && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-32px)] max-w-[720px] bg-white border border-[#E4E7EC] border-l-4 border-l-blue-500 rounded-xl shadow-sm flex items-center gap-2.5 pl-3 pr-2 py-2.5">
          <IconInfo className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="flex-1 min-w-0 truncate text-xs font-medium text-[#172033]" title={realtimeAlert}>{realtimeAlert}</span>
          <button
            onClick={() => {
              setActiveTab('ai-search');
              handleAnalyze();
              setRealtimeAlert(null);
            }}
            className="shrink-0 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-md text-[11px]"
          >
            今すぐ分析
          </button>
          <button onClick={() => setRealtimeAlert(null)} aria-label="通知を閉じる" className="shrink-0 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-md p-1">✕</button>
        </div>
      )}

      {/* 通知トースト */}
      {toastMessage && (
        <div className="absolute top-6 right-6 z-50 bg-emerald-600 text-white font-medium px-4 py-3 rounded-xl shadow-2xl border border-emerald-400 flex items-center gap-2 animate-bounce text-xs">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          モバイル：上部固定ヘッダー（PCでは非表示）
      ──────────────────────────────────────────────────────── */}
      <header className="md:hidden flex items-center justify-between gap-2 h-14 px-4 bg-white border-b border-slate-200 flex-shrink-0 sticky top-0 z-30 text-[#161c2c]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 shrink-0">
            <IconCompass className="w-4.5 h-4.5" />
          </span>
          <h1 className="text-base font-bold tracking-tight truncate">
            営業ナビ <span className="text-blue-600">AI</span>
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="メニューを開く"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-menu"
          className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <IconMenu className="w-5 h-5" />
        </button>
      </header>

      {/* ────────────────────────────────────────────────────────
          モバイル：オーバーレイ＋左からのメニュー（PCでは非表示）
      ──────────────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-slate-900/40"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        id="mobile-nav-menu"
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] bg-white border-r border-slate-200 flex flex-col justify-between p-4 text-[#161c2c] shadow-xl overflow-y-auto transition-transform duration-200 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-2 px-2 pt-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 shrink-0">
                <IconCompass className="w-4.5 h-4.5" />
              </span>
              <h1 className="text-lg font-bold tracking-tight truncate">
                営業ナビ <span className="text-blue-600">AI</span>
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="メニューを閉じる"
              className="shrink-0 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-md p-1"
            >
              ✕
            </button>
          </div>

          <nav className="space-y-0.5">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => { setActiveTab(item.tab); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-200 pt-3 text-xs space-y-1">
          <div className="text-slate-500">スタンダードプラン</div>
          <div className="text-[#161c2c] font-semibold">10 ID利用中</div>
          <div className="text-slate-500">月額50,000円から</div>
          <span className="inline-flex items-center gap-1 text-blue-600 font-medium pt-0.5">
            プランを変更する <IconExternalLink className="w-3 h-3" />
          </span>
        </div>
      </aside>

      {/* ────────────────────────────────────────────────────────
          1. 左側：サイドバー（PCのみ表示）
      ──────────────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col justify-between p-4 flex-shrink-0 text-[#161c2c]">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2 pt-1">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600">
              <IconCompass className="w-4.5 h-4.5" />
            </span>
            <h1 className="text-lg font-bold tracking-tight">
              営業ナビ <span className="text-blue-600">AI</span>
            </h1>
          </div>

          <nav className="space-y-0.5">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-200 pt-3 text-xs space-y-1">
          <div className="text-slate-500">スタンダードプラン</div>
          <div className="text-[#161c2c] font-semibold">10 ID利用中</div>
          <div className="text-slate-500">月額50,000円から</div>
          <span className="inline-flex items-center gap-1 text-blue-600 font-medium pt-0.5">
            プランを変更する <IconExternalLink className="w-3 h-3" />
          </span>
        </div>
      </aside>

      {/* ────────────────────────────────────────────────────────
          2. 右側：メインコンテンツ
      ──────────────────────────────────────────────────────── */}
      <main className={`flex-1 min-h-0 min-w-0 p-4 md:p-8 ${isAiPanelOpen || (selectedPipelineLead && activeTab === 'pipeline') ? 'overflow-hidden' : 'overflow-y-auto'} ${activeTab === 'home' || activeTab === 'ai-search' || activeTab === 'sales-list' || activeTab === 'dm-practice' || activeTab === 'pipeline' || activeTab === 'lookalike' || activeTab === 'companies' || activeTab === 'settings' ? 'bg-[#eef1f7]' : 'bg-slate-900'}`}>
        <div className="max-w-5xl mx-auto">
          
          {/* TAB 1: ホーム */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* ページヘッダー */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-[#161c2c]">今日の営業先を見つける</h2>
                  <p className="text-slate-500 text-sm mt-1.5">
                    商材に合う企業を、営業理由とともに提案します。
                  </p>
                </div>
                {ollamaStatus && (
                  <div className="shrink-0 text-right">
                    <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${ollamaStatus.connected && ollamaStatus.modelReady ? 'text-emerald-600' : 'text-amber-600'}`}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${ollamaStatus.connected && ollamaStatus.modelReady ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      {ollamaStatus.connected && ollamaStatus.modelReady ? 'AI機能は利用可能' : 'AI機能はオフライン'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {ollamaStatus.connected && ollamaStatus.modelReady ? '営業候補の分析と文章生成を利用できます' : '企業検索は利用できます'}
                    </div>
                  </div>
                )}
              </div>

              {/* 営業候補を探すカード */}
              <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#161c2c]">営業候補を探す</h3>
                <p className="text-slate-500 text-sm mt-1">商材と候補企業数を選択してください。</p>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-[1.3fr_1.5fr_auto] gap-5 md:items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
                      販売する商材
                    </div>
                    <select
                      id="home-product-selector"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-[#161c2c] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      {products.filter(product => product.active).map(product => <option key={product.id} value={product.name}>{product.name}｜{product.category}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
                      候補企業数
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {[5, 10, 20, 50, 100].map(limit => (
                        <button
                          key={limit}
                          type="button"
                          onClick={() => setSearchConditions(current => ({ ...current, limit }))}
                          className={`text-sm font-semibold px-4 py-2.5 rounded-lg border transition ${searchConditions.limit === limit ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-600 hover:border-blue-400'}`}
                        >
                          {limit}社
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">3</span>
                      実行
                    </div>
                    <button
                      onClick={() => { setActiveTab('ai-search'); void handleAnalyze(); }}
                      disabled={loading}
                      aria-disabled={loading}
                      className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" aria-hidden="true"></span>
                          検索中...
                        </>
                      ) : (
                        <>
                          営業候補を探す
                          <IconChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <IconSparkles className="w-3 h-3 text-slate-400" />
                    分析対象：公開ニュース・IR情報・企業の需要動向
                  </span>
                  <span className="hidden md:inline text-slate-300">|</span>
                  <span>分析結果は営業判断を支援する参考情報です。</span>
                </div>
              </section>

              {/* 本日の状況 */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-[#161c2c]">本日の状況</h3>
                  <button onClick={() => setActiveTab('sales-list')} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    営業リストを見る <IconChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">営業機会がある企業</span>
                      <IconBuilding2 className="w-5 h-5 text-slate-300" />
                    </div>
                    <span className="text-3xl font-bold text-[#161c2c] mt-2 block">12<span className="text-lg font-semibold ml-0.5">社</span></span>
                    <span className="text-xs text-emerald-600 font-semibold mt-2 block">前日より4社増加</span>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">AIトーク活用時の架電率</span>
                      <IconPhoneCall className="w-5 h-5 text-slate-300" />
                    </div>
                    <span className="text-3xl font-bold text-[#161c2c] mt-2 block">42.8<span className="text-lg font-semibold ml-0.5">%</span></span>
                    <span className="text-xs text-emerald-600 font-semibold mt-2 block">従来の3.2倍</span>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">削減できた調査時間</span>
                      <IconClock className="w-5 h-5 text-slate-300" />
                    </div>
                    <span className="text-3xl font-bold text-[#161c2c] mt-2 block">18.5<span className="text-lg font-semibold ml-0.5">時間</span></span>
                    <span className="text-xs text-slate-500 font-medium mt-2 block">今週のチーム合計</span>
                  </div>
                </div>
              </section>

              {/* 初回利用者向け案内 */}
              <section className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <IconFlag className="w-4.5 h-4.5" />
                  </span>
                  <div>
                    <div className="text-sm font-bold text-[#161c2c]">初めて利用する場合</div>
                    <div className="text-xs text-slate-600 mt-0.5">まず商材を登録すると、より精度の高い営業候補を探せます。</div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="shrink-0 bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-1.5"
                >
                  商材を設定する <IconChevronRight className="w-3.5 h-3.5" />
                </button>
              </section>
            </div>
          )}

          {/* TAB 2: 営業候補を探す */}
          {activeTab === 'ai-search' && (
            <div className="space-y-5">
              {/* ヘッダー */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-[#161c2c]">営業候補を探す</h2>
                  <p className="text-slate-500 text-sm mt-1.5">企業の変化から、今アプローチすべき営業先を提案します。</p>
                </div>
                <div className="shrink-0 text-right">
                  {loading ? (
                    <div className="text-xs font-medium text-slate-500">分析中です…</div>
                  ) : showResults ? (
                    <>
                      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${analysisFailed ? 'text-amber-600' : 'text-emerald-600'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${analysisFailed ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                        {analysisFailed ? '営業候補を取得できませんでした' : '分析が完了しました'}
                      </div>
                      {!analysisFailed && <div className="text-[11px] text-slate-500 mt-0.5">{aiCandidates.length}社の候補が見つかりました</div>}
                    </>
                  ) : ollamaStatus ? (
                    <>
                      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${ollamaStatus.connected && ollamaStatus.modelReady ? 'text-emerald-600' : 'text-amber-600'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${ollamaStatus.connected && ollamaStatus.modelReady ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {ollamaStatus.connected && ollamaStatus.modelReady ? 'AI機能は利用可能' : 'AI機能はオフライン'}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {ollamaStatus.connected && ollamaStatus.modelReady ? '営業候補の分析と文章生成を利用できます' : '企業検索は利用できます'}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {/* 検索条件の要約 */}
              <section className="bg-white border border-slate-200 rounded-xl px-5 py-3">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                  <div>
                    <div className="text-[11px] text-slate-500">販売する商材</div>
                    <div className="text-sm font-semibold text-[#161c2c] mt-0.5">{productName || '未設定'}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">対象地域</div>
                    <div className="text-sm font-semibold text-[#161c2c] mt-0.5">{searchConditions.prefecture === 'all' ? '全国' : searchConditions.prefecture}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">最低営業スコア</div>
                    <div className="text-sm font-semibold text-[#161c2c] mt-0.5">{searchConditions.minScore}以上</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">表示件数</div>
                    <div className="text-sm font-semibold text-[#161c2c] mt-0.5">{searchConditions.limit}社</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConditionsPanel(current => !current)}
                    aria-expanded={showConditionsPanel}
                    className="ml-auto shrink-0 text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    条件を変更
                  </button>
                </div>

                {showConditionsPanel && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor="product-selector" className="text-xs font-semibold text-slate-500">分析対象の商品・ソリューション</label>
                      <button onClick={() => setActiveTab('settings')} className="text-xs text-blue-600 hover:text-blue-700">商品を登録・管理 →</button>
                    </div>
                    <select
                      id="product-selector"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-[#161c2c] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      {products.filter(product => product.active).map(product => <option key={product.id} value={product.name}>{product.name}｜{product.category}</option>)}
                    </select>

                    <div className="flex items-center justify-between pt-1">
                      <h3 className="text-xs font-semibold text-slate-500">企業検索条件</h3>
                      <button onClick={() => setSearchConditions({ industry: 'all', prefecture: 'all', minEmployees: 0, maxEmployees: 0, minScore: 70, demandSignal: '', limit: 10 })} className="text-xs text-slate-400 hover:text-slate-600">条件をリセット</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="space-y-1"><span className="text-[11px] text-slate-500">業界</span><select value={searchConditions.industry} onChange={event => setSearchConditions(current => ({ ...current, industry: event.target.value }))} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"><option value="all">商品設定から自動選択</option>{companyIndustries.map(([code, name]) => <option key={code} value={name}>{name}</option>)}</select></label>
                      <label className="space-y-1"><span className="text-[11px] text-slate-500">所在地</span><select value={searchConditions.prefecture} onChange={event => setSearchConditions(current => ({ ...current, prefecture: event.target.value }))} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"><option value="all">全国</option>{companyPrefectures.map(prefecture => <option key={prefecture} value={prefecture}>{prefecture}</option>)}</select></label>
                      <label className="space-y-1"><span className="text-[11px] text-slate-500">検知した変化のキーワード</span><input value={searchConditions.demandSignal} onChange={event => setSearchConditions(current => ({ ...current, demandSignal: event.target.value }))} placeholder="例：設備更新、DX" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs" /></label>
                      <label className="space-y-1"><span className="text-[11px] text-slate-500">従業員数（最小）</span><input type="number" min="0" value={searchConditions.minEmployees} onChange={event => setSearchConditions(current => ({ ...current, minEmployees: Number(event.target.value) }))} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs" /></label>
                      <label className="space-y-1"><span className="text-[11px] text-slate-500">従業員数（最大・0は無制限）</span><input type="number" min="0" value={searchConditions.maxEmployees} onChange={event => setSearchConditions(current => ({ ...current, maxEmployees: Number(event.target.value) }))} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs" /></label>
                      <label className="space-y-1"><span className="text-[11px] text-slate-500">最低スコア</span><select value={searchConditions.minScore} onChange={event => setSearchConditions(current => ({ ...current, minScore: Number(event.target.value) }))} className="w-full bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs">{[55,60,70,80,90].map(score => <option key={score} value={score}>{score}以上</option>)}</select></label>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
                      <div className="text-xs font-semibold text-slate-600 min-w-24">表示件数</div>
                      <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden">
                        <button onClick={() => setSearchConditions(current => ({ ...current, limit: Math.max(1, current.limit - 1) }))} className="px-3 py-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50" aria-label="検索件数を1社減らす">−</button>
                        <input aria-label="検索する企業数" type="number" min="1" max="100" value={searchConditions.limit} onChange={event => setSearchConditions(current => ({ ...current, limit: Math.min(100, Math.max(1, Number(event.target.value) || 1)) }))} className="w-14 bg-transparent text-center text-sm font-bold text-[#161c2c] py-2 outline-none" />
                        <button onClick={() => setSearchConditions(current => ({ ...current, limit: Math.min(100, current.limit + 1) }))} className="px-3 py-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50" aria-label="検索件数を1社増やす">＋</button>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {[5, 10, 20, 50, 100].map(limit => <button key={limit} onClick={() => setSearchConditions(current => ({ ...current, limit }))} className={`text-xs font-semibold px-3 py-2 rounded-lg border transition ${searchConditions.limit === limit ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-600 hover:border-blue-400'}`}>{limit}社</button>)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-600">既存顧客・アプローチNG企業を自動で除外する</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={filterNG} onChange={(e) => setFilterNG(e.target.checked)} className="sr-only peer" />
                        <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <button
                      onClick={handleAnalyze}
                      disabled={loading}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                          検索中...
                        </>
                      ) : (
                        `条件に合う企業を${searchConditions.limit}社検索`
                      )}
                    </button>
                  </div>
                )}
              </section>

              {/* ローディング */}
              {loading && (
                <section className="bg-white border border-slate-200 rounded-xl p-10 text-center">
                  <span className="inline-block w-6 h-6 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" aria-hidden="true"></span>
                  <p className="text-sm font-semibold text-[#161c2c] mt-3">企業の変化を分析しています</p>
                  <p className="text-xs text-slate-500 mt-1">条件に合う営業候補を整理しています。</p>
                </section>
              )}

              {/* 未検索 */}
              {!loading && !showResults && (
                <section className="bg-white border border-slate-200 rounded-xl p-10 text-center">
                  <p className="text-sm font-semibold text-[#161c2c]">まだ検索していません</p>
                  <p className="text-xs text-slate-500 mt-1">「営業候補を探す」を実行すると、条件に合う企業が表示されます。</p>
                  <button onClick={handleAnalyze} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">営業候補を探す</button>
                </section>
              )}

              {/* エラー */}
              {!loading && analysisFailed && (
                <section className="bg-white border border-slate-200 rounded-xl p-10 text-center">
                  <p className="text-sm font-semibold text-[#161c2c]">営業候補を取得できませんでした</p>
                  <p className="text-xs text-slate-500 mt-1">接続状態を確認して、もう一度お試しください。</p>
                  <button onClick={handleAnalyze} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">再試行</button>
                  <p className="text-[11px] text-slate-400 mt-3">{ollamaAnalysis}</p>
                </section>
              )}

              {/* 0件 */}
              {!loading && showResults && !analysisFailed && aiCandidates.length === 0 && (
                <section className="bg-white border border-slate-200 rounded-xl p-10 text-center">
                  <p className="text-sm font-semibold text-[#161c2c]">条件に合う営業候補が見つかりませんでした</p>
                  <p className="text-xs text-slate-500 mt-1">対象地域や最低営業スコアを変更して、もう一度お試しください。</p>
                  <button onClick={() => setShowConditionsPanel(true)} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">条件を変更</button>
                </section>
              )}

              {/* 結果：一覧 + 詳細 */}
              {!loading && showResults && !analysisFailed && aiCandidates.length > 0 && (
                <>
                  <div className="grid grid-cols-1 xl:grid-cols-[40%_1fr] gap-5 items-start">
                    {/* 左：営業候補一覧 */}
                    <section className="bg-white border border-slate-200 rounded-xl p-4">
                      <div className="flex items-center justify-between px-1 pb-3">
                        <div>
                          <h3 className="text-base font-bold text-[#161c2c]">おすすめの営業候補</h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">優先度が高い順</p>
                        </div>
                        <button onClick={handleAnalyze} className="text-xs font-semibold text-blue-600 hover:text-blue-700 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded">再分析</button>
                      </div>
                      <div role="listbox" aria-label="おすすめの営業候補" className="space-y-2 xl:max-h-[560px] xl:overflow-y-auto pr-0.5">
                        {aiCandidates.map((company, index) => {
                          const isSelected = company.id === selectedCandidateId;
                          const isInSalesList = salesLeads.some(lead => lead.companyId === company.id);
                          return (
                            <button
                              key={company.id}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => setSelectedCandidateId(company.id)}
                              className={`w-full text-left rounded-lg border px-3 py-2.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                                isSelected ? 'bg-blue-50 border-blue-300 border-l-[3px] border-l-blue-600' : 'bg-white border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span className={`shrink-0 w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center mt-0.5 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{index + 1}</span>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-semibold text-[#161c2c] truncate">{company.companyName}</span>
                                    <span className="shrink-0 text-xs font-bold text-blue-700 bg-blue-50 rounded px-1.5 py-0.5">{company.salesScore}</span>
                                  </div>
                                  <div className="text-[11px] text-slate-500 mt-0.5">{company.industryName}・{company.prefecture}</div>
                                  <div className="text-xs text-slate-600 mt-1 truncate">{company.demandSignal}</div>
                                  {isInSalesList && (
                                    <div className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
                                      <IconCheck className="w-3 h-3" /> 営業リスト登録済み
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </section>

                    {/* 右：選択中企業の営業インサイト */}
                    {selectedCandidate && (
                      <section className="bg-white border border-slate-200 rounded-xl p-6">
                        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-blue-600">優先候補 {selectedCandidateIndex + 1}位</div>
                            <h3 className="text-lg font-bold text-[#161c2c] mt-1 truncate">{selectedCandidate.companyName}</h3>
                            <p className="text-sm text-slate-500 mt-0.5">{selectedCandidate.industryName}・{selectedCandidate.prefecture}・従業員{selectedCandidate.employees.toLocaleString()}名</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="text-[11px] text-slate-500">営業優先度</div>
                            <div className="inline-block bg-emerald-50 text-emerald-700 font-bold text-xl rounded-lg px-3 py-1 mt-1">{selectedCandidate.salesScore}</div>
                            <div className="text-[10px] text-slate-400 mt-1 max-w-32">公開情報と商材条件をもとにした参考値</div>
                          </div>
                        </div>

                        <div className="space-y-4 pt-4">
                          <div>
                            <h4 className="text-sm font-bold text-[#161c2c]">検知した変化</h4>
                            <div className="bg-blue-50 rounded-lg px-4 py-3 mt-1.5">
                              <p className="text-sm text-[#161c2c]">{selectedCandidate.demandSignal}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-[#161c2c]">今、営業すべき理由</h4>
                            <div className="border-l-4 border-emerald-300 bg-emerald-50/60 rounded-r-lg px-4 py-3 mt-1.5">
                              <p className="text-sm text-[#161c2c] leading-relaxed">{selectedCandidate.demandSignalDetail}</p>
                              <p className="text-[11px] text-slate-500 mt-1.5">営業ナビによる提案</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-[#161c2c] flex items-center gap-1.5"><IconFileEdit className="w-4 h-4 text-slate-400" /> おすすめの提案</h4>
                            <p className="text-sm text-slate-700 mt-1.5 leading-relaxed">
                              {productName}{selectedProduct?.category ? `（${selectedProduct.category}）` : ''}を、{selectedCandidate.targetDepartment} {selectedCandidate.targetRole}へご提案
                            </p>
                          </div>

                          {openingLine && (
                            <div>
                              <h4 className="text-sm font-bold text-[#161c2c]">最初のアプローチ</h4>
                              <div className="relative bg-slate-50 border-l-4 border-slate-300 rounded-r-lg px-4 py-3 mt-1.5">
                                <p className="text-sm text-slate-700 italic leading-relaxed pr-8">「{openingLine}」</p>
                                <button
                                  type="button"
                                  onClick={() => handleCopyOpeningLine(openingLine)}
                                  aria-label="最初のアプローチをコピー"
                                  className="absolute top-2.5 right-2.5 text-slate-400 hover:text-blue-600 p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
                                >
                                  <IconCopy className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                          <button
                            onClick={() => void addToSalesList(selectedCandidate)}
                            disabled={selectedCandidateInSalesList}
                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-default text-white font-bold px-5 py-2.5 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                          >
                            {selectedCandidateInSalesList ? '営業リストに追加済み' : '営業リストに追加'}
                          </button>
                          <button
                            onClick={() => openDmPractice(selectedCandidate.id)}
                            className="bg-white border border-slate-300 hover:bg-slate-50 text-[#161c2c] font-semibold px-5 py-2.5 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                          >
                            DMを作成
                          </button>
                          <button
                            onClick={() => setIsAiPanelOpen(true)}
                            className="bg-white border border-slate-300 hover:bg-slate-50 text-[#161c2c] font-semibold px-5 py-2.5 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                          >
                            この企業についてAIに質問
                          </button>
                          <button
                            onClick={() => handleViewCompanyProfile(selectedCandidate)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium ml-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
                          >
                            企業情報を見る
                          </button>
                        </div>
                      </section>
                    )}
                  </div>

                  <div className="flex items-start gap-1.5 text-[11px] text-slate-500">
                    <IconInfo className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>営業優先度と提案内容は、公開情報をもとにした営業判断の参考情報です。購買意欲を保証するものではありません。</span>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'sales-list' && (
            <div className="space-y-4" onClick={() => openLeadMenuId && setOpenLeadMenuId(null)}>
              {/* ヘッダー */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-[#161c2c]">営業リスト</h2>
                  <p className="text-slate-500 text-sm mt-1.5">保存した営業候補の状況と、次のアクションを管理します。</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#161c2c]">{salesLeads.length}</div>
                    <div className="text-[11px] text-slate-500">登録企業</div>
                  </div>
                  <button
                    onClick={() => setActiveTab('ai-search')}
                    className="text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg px-4 py-2 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    営業候補を追加
                    <IconPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 検索・絞り込みバー */}
              <section className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[220px]">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <label htmlFor="sales-list-search" className="sr-only">企業名・業界・所在地で検索</label>
                  <input
                    id="sales-list-search"
                    value={salesSearchQuery}
                    onChange={event => setSalesSearchQuery(event.target.value)}
                    placeholder="企業名・業界・所在地で検索"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm text-[#161c2c] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <label htmlFor="sales-list-status-filter" className="sr-only">ステータスで絞り込み</label>
                <select
                  id="sales-list-status-filter"
                  value={salesStatusFilter}
                  onChange={event => setSalesStatusFilter(event.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-[#161c2c] bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">すべてのステータス</option>
                  {['未対応', 'DM作成中', '送信済み', '返信あり', '商談化', '保留', 'NG'].map(status => <option key={status} value={status}>{status}</option>)}
                </select>
                <label htmlFor="sales-list-sort" className="sr-only">並び順</label>
                <select
                  id="sales-list-sort"
                  value={salesSortOrder}
                  onChange={event => setSalesSortOrder(event.target.value as typeof salesSortOrder)}
                  className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-[#161c2c] bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="updated-desc">更新が新しい順</option>
                  <option value="updated-asc">更新が古い順</option>
                  <option value="score-desc">営業スコアが高い順</option>
                  <option value="score-asc">営業スコアが低い順</option>
                </select>
                <span className="ml-auto text-sm text-slate-500 shrink-0">{salesListResults.length}社を表示</span>
              </section>

              {/* 一覧本体 */}
              {salesListLoading ? (
                <div className="space-y-3">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse">
                      <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
                      <div className="h-3 w-1/2 bg-slate-100 rounded mt-3"></div>
                      <div className="h-3 w-2/3 bg-slate-100 rounded mt-2"></div>
                      <div className="h-10 w-full bg-slate-100 rounded mt-3"></div>
                    </div>
                  ))}
                </div>
              ) : salesLeads.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl py-16 text-center">
                  <IconList className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-[#161c2c] mt-3">営業リストはまだありません</p>
                  <p className="text-xs text-slate-500 mt-1">気になる営業候補を追加すると、対応状況やメモをここで管理できます。</p>
                  <button onClick={() => setActiveTab('ai-search')} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">営業候補を探す</button>
                </div>
              ) : salesListResults.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl py-16 text-center">
                  <p className="text-sm font-semibold text-[#161c2c]">条件に一致する企業がありません</p>
                  <p className="text-xs text-slate-500 mt-1">検索キーワードやステータス条件を変更してください。</p>
                  <button onClick={() => { setSalesSearchQuery(''); setSalesStatusFilter('all'); }} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">条件をクリア</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {salesListResults.map(lead => (
                    <article key={lead.companyId} className="relative bg-white border border-slate-200 rounded-xl p-5">
                      <button
                        type="button"
                        aria-label="企業メニューを開く"
                        aria-haspopup="menu"
                        aria-expanded={openLeadMenuId === lead.companyId}
                        onClick={event => { event.stopPropagation(); setOpenLeadMenuId(current => current === lead.companyId ? null : lead.companyId); }}
                        onKeyDown={event => { if (event.key === 'Escape') setOpenLeadMenuId(null); }}
                        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                      >
                        <IconMoreVertical className="w-4 h-4" />
                      </button>
                      {openLeadMenuId === lead.companyId && (
                        <div role="menu" onClick={event => event.stopPropagation()} className="absolute top-10 right-3 z-20 bg-white border border-slate-200 rounded-lg shadow-md py-1 min-w-[180px]">
                          <button
                            role="menuitem"
                            onClick={() => handleRemoveSalesLead(lead)}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            営業リストから削除
                          </button>
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-[73%_1fr] gap-5 items-start">
                        {/* 左：企業情報 */}
                        <div className="min-w-0 lg:pr-5 lg:border-r lg:border-slate-100">
                          <div className="flex flex-wrap items-center gap-2 pr-8">
                            <h3 className="text-base font-bold text-[#161c2c]">{lead.companyName}</h3>
                            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{lead.industryName}</span>
                            <span className="text-xs font-bold text-[#15803D] bg-[#ECFDF3] px-2 py-0.5 rounded">営業スコア {lead.salesScore}</span>
                          </div>
                          <div className="flex items-start gap-1.5 text-xs text-slate-500 mt-2">
                            <IconMapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>{lead.prefecture}{lead.city}・{lead.employees.toLocaleString()}名・{lead.targetDepartment} {lead.targetRole}</span>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                              <IconTrendingUp className="w-3.5 h-3.5 text-blue-500" />
                              検知した変化
                            </div>
                            <p className="text-sm text-[#161c2c] mt-1 leading-snug">{lead.demandSignal}</p>
                          </div>
                          <div className="mt-3">
                            <label htmlFor={`sales-note-${lead.companyId}`} className="text-xs font-semibold text-slate-500 block mb-1">営業メモ</label>
                            <div className="relative">
                              <textarea
                                id={`sales-note-${lead.companyId}`}
                                aria-label={`${lead.companyName}の営業メモ`}
                                defaultValue={lead.note}
                                maxLength={1000}
                                onChange={() => setDirtyNotes(prev => ({ ...prev, [lead.companyId]: true }))}
                                onBlur={event => { void updateSalesLead(lead, { note: event.target.value }); setDirtyNotes(prev => ({ ...prev, [lead.companyId]: false })); }}
                                placeholder="確認したいことや、次のアクションを入力"
                                className="w-full h-[52px] bg-white border border-slate-300 rounded-[10px] pl-3 pr-16 py-2.5 text-sm text-[#161c2c] placeholder:text-slate-400 resize-none overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-400"
                              />
                              <span className={`absolute bottom-1.5 right-2.5 text-[11px] pointer-events-none ${dirtyNotes[lead.companyId] ? 'text-slate-400' : 'text-emerald-600'}`}>
                                {dirtyNotes[lead.companyId] ? '未保存' : '保存済み'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 右：対応状況とアクション */}
                        <div className="flex flex-col gap-3 lg:pl-0">
                          <div>
                            <label htmlFor={`sales-status-${lead.companyId}`} className="text-xs font-semibold text-slate-500 block mb-1">対応状況</label>
                            <select
                              id={`sales-status-${lead.companyId}`}
                              aria-label={`${lead.companyName}の対応状況`}
                              value={lead.status}
                              onChange={event => void updateSalesLead(lead, { status: event.target.value })}
                              className={`w-full border rounded-lg px-2.5 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 ${getStatusBadgeClass(lead.status)}`}
                            >
                              {['未対応', 'DM作成中', '送信済み', '返信あり', '商談化', '保留', 'NG'].map(status => <option key={status} value={status}>{status}</option>)}
                            </select>
                          </div>
                          <button
                            onClick={() => openDmPractice(lead.companyId)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-2.5 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                          >
                            営業DMを作成
                          </button>
                          <button
                            onClick={() => handleViewCompanyProfile(lead)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium text-center py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
                          >
                            企業情報を見る
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* 注意書き（一覧全体の下部に1回だけ） */}
              {!salesListLoading && salesLeads.length > 0 && (
                <div className="flex items-start gap-1.5 text-[11px] text-slate-500 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5">
                  <IconInfo className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-500" />
                  <span>営業スコアは、企業情報と需要の変化をもとにした営業判断の参考値です。</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'dm-practice' && (
            <div className="space-y-5">
              {/* ヘッダー */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-[#172033]">営業コミュニケーション</h2>
                  <p className="text-slate-500 text-sm mt-1.5">企業への最初の連絡から返信、会話練習まで支援します。</p>
                </div>
                {ollamaStatus && (
                  <div className="shrink-0 text-right">
                    <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${isOllamaReady ? 'text-emerald-600' : 'text-amber-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isOllamaReady ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      {isOllamaReady ? 'AI機能は利用可能' : 'AI機能はオフライン'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {isOllamaReady ? '営業文の作成と会話練習を利用できます' : 'Ollamaを起動すると文章作成を利用できます'}
                    </div>
                  </div>
                )}
              </div>

              {/* 目的選択 */}
              <div role="tablist" aria-label="営業コミュニケーションの目的" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PURPOSE_TABS.map(tab => {
                  const isActive = practiceMode === tab.mode;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.mode}
                      id={`purpose-tab-${tab.mode}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`purpose-panel-${tab.mode}`}
                      onClick={() => setPracticeMode(tab.mode)}
                      className={`text-left rounded-xl border px-4 py-3.5 flex items-start gap-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${isActive ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                    >
                      <span className={`shrink-0 mt-0.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}><Icon className="w-5 h-5" /></span>
                      <span className="min-w-0 flex-1">
                        <span className={`block text-sm font-bold ${isActive ? 'text-blue-700' : 'text-[#172033]'}`}>{tab.title}</span>
                        <span className={`block text-xs mt-0.5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>{tab.subtitle}</span>
                      </span>
                      {isActive && <IconCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>

              {/* モード1：はじめて連絡する */}
              {practiceMode === 'draft' && (
                <div id="purpose-panel-draft" role="tabpanel" aria-labelledby="purpose-tab-draft" className="grid grid-cols-1 lg:grid-cols-[42%_1fr] gap-5 items-start">
                  <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-[#172033]">営業文の設定</h3>
                      <p className="text-xs text-slate-500 mt-1">送り先を確認し、連絡の目的を選択してください。</p>
                    </div>

                    {renderPracticeTargetField()}
                    {renderPracticeProductField()}

                    <div>
                      <span className="text-xs font-semibold text-slate-500 block mb-1.5">何をお願いしたいですか？</span>
                      <div className="grid grid-cols-2 gap-2">
                        {OBJECTIVE_PRESETS.map(item => (
                          <button
                            key={item.value}
                            type="button"
                            aria-pressed={draftObjective === item.value}
                            onClick={() => setDraftObjective(item.value)}
                            className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${draftObjective === item.value ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-[#172033] hover:bg-slate-50'}`}
                          >
                            {item.label}
                            {draftObjective === item.value && <IconCheck className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        ))}
                        <button
                          type="button"
                          aria-pressed={isOtherObjectiveSelected}
                          onClick={() => setDraftObjective(current => OTHER_OBJECTIVES.includes(current) ? current : OTHER_OBJECTIVES[0])}
                          className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${isOtherObjectiveSelected ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-[#172033] hover:bg-slate-50'}`}
                        >
                          その他
                          {isOtherObjectiveSelected && <IconCheck className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      </div>
                      {isOtherObjectiveSelected && (
                        <select
                          value={draftObjective}
                          onChange={event => setDraftObjective(event.target.value)}
                          aria-label="その他の営業目的を選択"
                          className="w-full mt-2 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          {OTHER_OBJECTIVES.map(value => <option key={value} value={value}>{value}</option>)}
                        </select>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label htmlFor="draft-extra" className="text-xs font-semibold text-slate-500">追加したい内容</label>
                        <span className="text-[11px] text-slate-400">任意</span>
                      </div>
                      <textarea
                        id="draft-extra"
                        value={draftExtra}
                        onChange={event => setDraftExtra(event.target.value)}
                        placeholder="例：オンラインで15分、価格は書かない"
                        rows={2}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <button type="button" onClick={() => setShowDraftDetails(current => !current)} aria-expanded={showDraftDetails} className="flex items-center justify-between w-full text-xs font-semibold text-slate-500">
                        詳細設定
                        <IconChevronDown className={`w-4 h-4 transition-transform ${showDraftDetails ? 'rotate-180' : ''}`} />
                      </button>
                      {showDraftDetails && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                          <label className="space-y-1"><span className="text-[11px] text-slate-500">送信形式</span><select value={draftChannel} onChange={event => setDraftChannel(event.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-xs"><option>メール</option><option>LinkedIn風DM</option><option>問い合わせフォーム</option><option>短文チャットDM</option></select></label>
                          <label className="space-y-1"><span className="text-[11px] text-slate-500">送る相手</span><select value={draftRecipientRole} onChange={event => setDraftRecipientRole(event.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-xs">{['担当者','課長・マネージャー','部門責任者','購買担当','経営者・役員','情報システム担当'].map(role => <option key={role}>{role}</option>)}</select></label>
                          <label className="space-y-1"><span className="text-[11px] text-slate-500">文章のトーン</span><select value={draftTone} onChange={event => setDraftTone(event.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-xs">{['丁寧で簡潔','親しみやすい','役員向けに端的','課題提起を重視','押し売り感を抑える'].map(tone => <option key={tone}>{tone}</option>)}</select></label>
                        </div>
                      )}
                    </div>

                    {!isOllamaReady && (
                      <p className="text-xs text-amber-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2.5">AI機能は現在オフラインです。Ollamaを起動すると文章を作成できます。</p>
                    )}

                    <div>
                      <button
                        onClick={() => void handleGenerateSalesDraft()}
                        disabled={!practiceCompanyId || practiceLoading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                      >
                        {practiceLoading ? '営業文を作成しています' : '営業文を作成'}
                      </button>
                      <p className="text-[11px] text-slate-400 text-center mt-2">入力内容をもとに、送信前の下書きを作成します</p>
                    </div>
                  </section>

                  <section className="bg-white border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#172033]">営業文のプレビュー</h3>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${generatedDraft ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{generatedDraft ? '下書き' : '未作成'}</span>
                    </div>

                    {practiceLoading && (
                      <p className="text-xs text-slate-500 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5 mt-4">営業文を作成しています</p>
                    )}

                    {!generatedDraft ? (
                      <div className="flex flex-col items-center text-center py-12">
                        <IconFileEdit className="w-8 h-8 text-slate-300" />
                        <p className="text-sm font-semibold text-[#172033] mt-3">作成した営業文がここに表示されます</p>
                        <p className="text-xs text-slate-500 mt-1">左側で条件を選び、「営業文を作成」を押してください。</p>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="generated-draft-body" className="text-xs font-semibold text-slate-500 block mb-1">本文</label>
                          <textarea
                            id="generated-draft-body"
                            value={generatedDraft}
                            onChange={event => setGeneratedDraft(event.target.value)}
                            className="w-full h-64 max-h-[360px] overflow-y-auto bg-white border border-slate-300 rounded-lg px-3 py-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5">
                          <div className="text-xs font-semibold text-slate-600 mb-1">この営業文で反映した内容</div>
                          <ul className="text-xs text-slate-600 space-y-0.5 list-disc list-inside">
                            {practiceCompany?.demandSignal && <li>{practiceCompany.demandSignal}</li>}
                            {practiceCompany?.targetDepartment && <li>{practiceCompany.targetDepartment}・{draftRecipientRole}宛て</li>}
                            <li>{OBJECTIVE_PRESETS.find(item => item.value === draftObjective)?.label ?? draftObjective}</li>
                            {draftExtra.trim() && <li>{draftExtra.trim()}</li>}
                          </ul>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <button onClick={() => { void navigator.clipboard.writeText(generatedDraft); showToast('営業文をコピーしました'); }} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">コピー</button>
                          <button onClick={() => void handleGenerateSalesDraft()} disabled={practiceLoading} className="bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 text-[#172033] font-semibold px-5 py-2.5 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">書き直す</button>
                          <button onClick={() => setPracticeMode('simulation')} className="text-sm text-blue-600 hover:text-blue-700 font-medium ml-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded">この内容で会話を練習する</button>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              )}

              {/* モード2：返信を作る */}
              {practiceMode === 'reply' && (
                <div id="purpose-panel-reply" role="tabpanel" aria-labelledby="purpose-tab-reply" className="grid grid-cols-1 lg:grid-cols-[42%_1fr] gap-5 items-start">
                  <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                    <h3 className="text-base font-bold text-[#172033]">返信内容の設定</h3>

                    {renderPracticeTargetField()}
                    {renderPracticeProductField()}

                    <div>
                      <label htmlFor="reply-source" className="text-xs font-semibold text-slate-500 block mb-1">届いたメッセージ</label>
                      <textarea
                        id="reply-source"
                        value={replySourceText}
                        onChange={event => setReplySourceText(event.target.value)}
                        placeholder="受信したメールやDMの内容を貼り付けてください"
                        rows={6}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">個人名などは入力前に匿名化することをおすすめします。</p>
                    </div>

                    <label className="block space-y-1">
                      <span className="text-xs font-semibold text-slate-500">返信する立場</span>
                      <select value={replyRole} onChange={event => setReplyRole(event.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm">
                        {['自社の営業担当','相手企業の担当者','相手企業の購買担当','相手企業の部門責任者','自社の営業責任者','カスタマーサクセス担当'].map(role => <option key={role}>{role}</option>)}
                      </select>
                    </label>

                    <label className="block space-y-1">
                      <span className="text-xs font-semibold text-slate-500">どのように返信しますか？</span>
                      <select value={replyObjective} onChange={event => setReplyObjective(event.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm">
                        <option>相手の懸念に回答し、次回の打ち合わせにつなげる</option>
                        <option>条件を確認して社内検討につなげる</option>
                        <option>丁寧に断り、将来の接点を残す</option>
                        <option>追加資料や見積もりを依頼する</option>
                        <option>日程を調整する</option>
                      </select>
                    </label>

                    <div className="border-t border-slate-100 pt-4">
                      <button type="button" onClick={() => setShowReplyDetails(current => !current)} aria-expanded={showReplyDetails} className="flex items-center justify-between w-full text-xs font-semibold text-slate-500">
                        詳細設定
                        <IconChevronDown className={`w-4 h-4 transition-transform ${showReplyDetails ? 'rotate-180' : ''}`} />
                      </button>
                      {showReplyDetails && (
                        <div className="mt-3">
                          <label className="space-y-1 block"><span className="text-[11px] text-slate-500">文章のトーン</span><select value={replyTone} onChange={event => setReplyTone(event.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-xs">{['丁寧で簡潔','親しみやすい','役員向けに端的','慎重でフォーマル','前向きで熱意を示す'].map(tone => <option key={tone}>{tone}</option>)}</select></label>
                        </div>
                      )}
                    </div>

                    {!isOllamaReady && (
                      <p className="text-xs text-amber-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2.5">AI機能は現在オフラインです。Ollamaを起動すると文章を作成できます。</p>
                    )}

                    <button
                      onClick={() => void handleGenerateReply()}
                      disabled={!replySourceText.trim() || !practiceCompanyId || practiceLoading}
                      className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      {practiceLoading ? '返信文を作成しています' : '返信文を作成'}
                    </button>
                  </section>

                  <section className="bg-white border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#172033]">返信文のプレビュー</h3>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${generatedReply ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{generatedReply ? '下書き' : '未作成'}</span>
                    </div>

                    {practiceLoading && (
                      <p className="text-xs text-slate-500 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5 mt-4">返信文を作成しています</p>
                    )}

                    {!generatedReply ? (
                      <div className="flex flex-col items-center text-center py-12">
                        <IconReply className="w-8 h-8 text-slate-300" />
                        <p className="text-sm font-semibold text-[#172033] mt-3">作成した返信文がここに表示されます</p>
                        <p className="text-xs text-slate-500 mt-1">左側で条件を選び、「返信文を作成」を押してください。</p>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="generated-reply-body" className="text-xs font-semibold text-slate-500 block mb-1">本文</label>
                          <textarea
                            id="generated-reply-body"
                            value={generatedReply}
                            onChange={event => setGeneratedReply(event.target.value)}
                            className="w-full h-64 max-h-[360px] overflow-y-auto bg-white border border-slate-300 rounded-lg px-3 py-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <button onClick={() => { void navigator.clipboard.writeText(generatedReply); showToast('返信案をコピーしました'); }} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">コピー</button>
                          <button onClick={() => void handleGenerateReply()} disabled={practiceLoading} className="bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 text-[#172033] font-semibold px-5 py-2.5 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">書き直す</button>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              )}

              {/* モード3：会話を練習する */}
              {practiceMode === 'simulation' && (
                <div id="purpose-panel-simulation" role="tabpanel" aria-labelledby="purpose-tab-simulation" className="space-y-5">
                  <div className="grid grid-cols-1 lg:grid-cols-[42%_1fr] gap-5 items-start">
                    <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                      <h3 className="text-base font-bold text-[#172033]">練習の設定</h3>

                      {renderPracticeTargetField()}
                      {renderPracticeProductField()}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-500 block mb-0.5">相手の部署と役職</span>
                          <span className="text-[#172033] font-medium">{practiceCompany ? `${practiceCompany.targetDepartment} ${practiceCompany.targetRole}` : '未選択'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-0.5">練習の目的</span>
                          <span className="text-[#172033] font-medium">{OBJECTIVE_PRESETS.find(item => item.value === draftObjective)?.label ?? draftObjective}</span>
                        </div>
                      </div>
                      <div className="text-xs">
                        <span className="text-slate-500 block mb-0.5">需要シグナル</span>
                        <span className="text-[#172033] font-medium">{practiceCompany?.demandSignal ?? '—'}</span>
                      </div>

                      <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">あなたは営業担当者、AIは選択した企業の担当者として応答します。</p>

                      {!isOllamaReady && (
                        <p className="text-xs text-amber-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2.5">AI機能は現在オフラインです。Ollamaを起動すると文章を作成できます。</p>
                      )}

                      {practiceMessages.length === 0 && (
                        <button
                          type="button"
                          onClick={() => setPracticeInput(`突然のご連絡失礼いたします。${practiceCompany?.demandSignal ?? '貴社の取り組み'}を拝見し、${productName}がお役に立てるのではと思いご連絡しました。`)}
                          disabled={!practiceCompanyId}
                          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        >
                          会話練習を始める
                        </button>
                      )}
                    </section>

                    <section className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
                      <div className="shrink-0 px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3">
                        <h3 className="text-base font-bold text-[#172033]">DM会話練習</h3>
                        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full shrink-0">AIは企業担当者役です</span>
                      </div>
                      <div className="flex-1 min-h-[300px] max-h-[460px] overflow-y-auto overflow-x-hidden px-5 py-4 space-y-3">
                        {practiceMessages.length === 0 && (
                          <p className="text-sm text-slate-500 text-center py-10">左側で対象企業を確認し、メッセージを送って練習を始めましょう。</p>
                        )}
                        {practiceMessages.map((message, index) => (
                          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] min-w-0 rounded-2xl px-4 py-3 text-sm leading-6 whitespace-pre-wrap break-words ${message.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-slate-50 text-[#172033] border border-slate-200 rounded-bl-sm'}`}>
                              <span className={`block text-[10px] font-semibold mb-1 ${message.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>{message.role === 'user' ? '営業担当' : '企業担当者'}</span>
                              {message.content}
                            </div>
                          </div>
                        ))}
                        {practiceLoading && <p className="text-xs text-slate-400 animate-pulse">企業担当者が返信を考えています...</p>}
                      </div>
                      <div className="shrink-0 border-t border-slate-100 p-4 space-y-3">
                        <label htmlFor="practice-input" className="sr-only">企業担当者へ送るメッセージ</label>
                        <textarea
                          id="practice-input"
                          value={practiceInput}
                          onChange={event => setPracticeInput(event.target.value)}
                          placeholder="企業担当者へ送るメッセージを入力"
                          rows={2}
                          className="w-full max-h-24 overflow-y-auto bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                          <button onClick={() => void handleDmPractice(false)} disabled={!practiceInput.trim() || !practiceCompanyId || practiceLoading} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">送信</button>
                          <button
                            type="button"
                            onClick={() => setPracticeInput(`突然のご連絡失礼いたします。${practiceCompany?.demandSignal ?? '貴社の取り組み'}を拝見し、${productName}がお役に立てるのではと思いご連絡しました。`)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
                          >
                            ヒントを見る
                          </button>
                          <button
                            onClick={() => void handleDmPractice(true)}
                            disabled={practiceMessages.length < 2 || practiceLoading}
                            className="ml-auto text-sm text-slate-500 hover:text-slate-700 disabled:opacity-40 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
                          >
                            練習を終了して講評を見る
                          </button>
                        </div>
                      </div>
                    </section>
                  </div>

                  {practiceFeedback && (
                    <section className="bg-white border border-slate-200 rounded-xl p-6">
                      <h3 className="text-base font-bold text-[#172033] mb-3">AIコーチの講評</h3>
                      <div className="text-sm leading-relaxed text-[#172033] whitespace-pre-wrap">{practiceFeedback}</div>
                      <button onClick={() => { setPracticeMessages([]); setPracticeFeedback(''); }} className="mt-4 text-sm border border-slate-300 hover:bg-slate-50 text-[#172033] font-semibold px-4 py-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">もう一度演習する</button>
                    </section>
                  )}
                </div>
              )}

              {/* 安心表示 */}
              <div className="flex items-start gap-1.5 text-[11px] text-slate-500 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5">
                <IconInfo className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-500" />
                <span>作成した文面や練習中のメッセージは自動送信されません。内容を確認してからご利用ください。</span>
              </div>
            </div>
          )}

          {/* TAB: アポ・案件管理 */}
          {activeTab === 'pipeline' && (
            <div className="space-y-5">
              {/* ヘッダー */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-[#172033]">アポ・案件管理</h2>
                  <p className="text-slate-500 text-sm mt-1.5">営業候補から商談までの進捗と、次のアクションを管理します。</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#172033]">{salesLeads.length}件</div>
                    <div className="text-[11px] text-slate-500">進行中の案件</div>
                  </div>
                  <button
                    onClick={() => setActiveTab('sales-list')}
                    className="text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    営業リストを見る
                  </button>
                </div>
              </div>

              {salesListLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {PIPELINE_COLUMNS.map(col => (
                    <div key={col.key} className="bg-[#F1F5F9] border border-slate-200 rounded-xl p-3 animate-pulse">
                      <div className="h-4 w-2/3 bg-slate-200 rounded mb-3"></div>
                      <div className="bg-white border border-slate-200 rounded-lg h-20"></div>
                    </div>
                  ))}
                </div>
              ) : salesLeads.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl py-16 text-center">
                  <IconList className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-[#172033] mt-3">管理する案件はまだありません</p>
                  <p className="text-xs text-slate-500 mt-1">営業候補をリストへ追加し、対応を始めると案件がここに表示されます。</p>
                  <button onClick={() => setActiveTab('ai-search')} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">営業候補を探す</button>
                </div>
              ) : (
                <>
                  {/* 上部サマリー */}
                  <section className="bg-white border border-slate-200 rounded-xl px-5 py-3 flex flex-wrap items-center gap-x-8 gap-y-2">
                    {PIPELINE_COLUMNS.map(col => (
                      <div key={col.key}>
                        <div className="text-[11px] text-slate-500">{col.label}</div>
                        <div className="text-sm font-bold text-[#172033] mt-0.5">{salesLeads.filter(lead => col.statuses.includes(lead.status)).length}件</div>
                      </div>
                    ))}
                  </section>

                  {/* デスクトップ・タブレット：横カンバン */}
                  <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-4 w-full max-w-full min-w-0 overflow-x-hidden">
                    {PIPELINE_COLUMNS.map(col => {
                      const accentClasses = getColumnAccentClasses(col.accent);
                      const leads = salesLeads.filter(lead => col.statuses.includes(lead.status)).sort((a, b) => b.salesScore - a.salesScore);
                      const Icon = col.icon;
                      return (
                        <div
                          key={col.key}
                          className="min-w-0 w-full bg-[#F1F5F9] border border-slate-200 rounded-xl flex flex-col min-h-[240px]"
                          style={{ maxHeight: 'calc(100dvh - 340px)' }}
                        >
                          <div className={`h-1 rounded-t-xl ${accentClasses.topBar}`}></div>
                          <div className="shrink-0 min-w-0 px-3.5 pt-3 pb-2">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="text-sm font-bold text-[#172033] truncate">{col.label}</h3>
                              <span className={`shrink-0 text-xs font-bold rounded-full px-2 py-0.5 ${accentClasses.badge}`}>{leads.length}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">{col.note}</p>
                          </div>
                          <div className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden px-3.5 pb-3.5 space-y-2.5">
                            {leads.length === 0 ? (
                              <div className="bg-white border border-dashed border-slate-300 rounded-lg px-3 text-center h-[120px] flex flex-col items-center justify-center">
                                <Icon className="w-5 h-5 text-slate-300" />
                                <p className="text-xs font-semibold text-[#172033] mt-2">{col.emptyTitle}</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">{col.emptyBody}</p>
                              </div>
                            ) : (
                              leads.map(lead => renderPipelineCard(lead))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* モバイル：ステータスタブ + 縦リスト */}
                  <div className="md:hidden space-y-3">
                    <div role="tablist" aria-label="対応状況で絞り込み" className="flex gap-2 overflow-x-auto pb-1">
                      {PIPELINE_COLUMNS.map(col => {
                        const count = salesLeads.filter(lead => col.statuses.includes(lead.status)).length;
                        const isActive = mobilePipelineTab === col.key;
                        return (
                          <button
                            key={col.key}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => setMobilePipelineTab(col.key)}
                            className={`shrink-0 text-sm font-semibold rounded-lg px-3 py-2 border focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${isActive ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600'}`}
                          >
                            {col.label}（{count}）
                          </button>
                        );
                      })}
                    </div>
                    {(() => {
                      const activeCol = PIPELINE_COLUMNS.find(col => col.key === mobilePipelineTab) ?? PIPELINE_COLUMNS[0];
                      const leads = salesLeads.filter(lead => activeCol.statuses.includes(lead.status)).sort((a, b) => b.salesScore - a.salesScore);
                      const Icon = activeCol.icon;
                      return leads.length === 0 ? (
                        <div className="bg-white border border-dashed border-slate-300 rounded-lg py-8 px-3 text-center">
                          <Icon className="w-5 h-5 text-slate-300 mx-auto" />
                          <p className="text-xs font-semibold text-[#172033] mt-2">{activeCol.emptyTitle}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{activeCol.emptyBody}</p>
                        </div>
                      ) : (
                        <div className="space-y-2.5">{leads.map(lead => renderPipelineCard(lead))}</div>
                      );
                    })()}
                  </div>

                  <p className="text-[11px] text-slate-500">案件の対応状況を変更すると、該当する列へ自動で移動します。</p>
                </>
              )}
            </div>
          )}

          {/* TAB 4: 機能1: 類似企業（Lookalike）分析 */}
          {activeTab === 'lookalike' && (
            <div className="space-y-6">
              {/* ページヘッダー */}
              <div>
                <h2 className="text-2xl font-bold text-[#161c2c]">類似企業分析</h2>
                <p className="text-slate-500 text-sm mt-1.5">受注実績のある企業に似た、新しい営業候補を見つけます。</p>
              </div>

              {/* 分析条件カード */}
              <section className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_auto] gap-4 lg:items-end">
                  <div className="sm:col-span-2 lg:col-span-1 space-y-1.5">
                    <label htmlFor="lookalike-source" className="text-xs font-semibold text-slate-500">基準企業</label>
                    <select
                      id="lookalike-source"
                      ref={lookalikeSourceSelectRef}
                      value={lookalikeSourceId}
                      onChange={event => { setLookalikeSourceId(event.target.value); setLookalikeMatches([]); }}
                      className="w-full h-12 bg-white border border-slate-300 rounded-lg px-3 text-[#172033] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <optgroup label="既存顧客">{companies.filter(company => company.existingCustomer).map(company => <option key={company.id} value={company.id}>{company.companyName}｜{company.industryName}</option>)}</optgroup>
                      <optgroup label="その他の企業">{companies.filter(company => !company.existingCustomer).map(company => <option key={company.id} value={company.id}>{company.companyName}｜{company.industryName}</option>)}</optgroup>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="lookalike-limit" className="text-xs font-semibold text-slate-500">抽出件数</label>
                    <input
                      id="lookalike-limit"
                      type="number"
                      min="1"
                      max="50"
                      value={lookalikeLimit}
                      onChange={event => setLookalikeLimit(Math.min(50, Math.max(1, Number(event.target.value) || 1)))}
                      className="w-full h-12 bg-white border border-slate-300 rounded-lg px-3 text-[#172033] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleLookalikeAnalyze}
                    disabled={!lookalikeSourceId || lookalikeLoading}
                    aria-disabled={!lookalikeSourceId || lookalikeLoading}
                    className="w-full lg:w-auto h-12 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 rounded-lg text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    {lookalikeLoading ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" aria-hidden="true"></span>
                        分析しています
                      </>
                    ) : '似ている企業を探す'}
                  </button>
                </div>

                {/* 基準企業の概要 */}
                {lookalikeSource && (
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <div className="flex flex-wrap gap-x-8 gap-y-3 bg-slate-50 border border-slate-100 rounded-lg px-4 py-3.5">
                      <div>
                        <span className="text-xs text-slate-500 block">業界</span>
                        <span className="text-sm font-semibold text-[#172033]">{lookalikeSource.industryName}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">従業員数</span>
                        <span className="text-sm font-semibold text-[#172033]">{lookalikeSource.employees.toLocaleString()}名</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">売上規模</span>
                        <span className="text-sm font-semibold text-[#172033]">{lookalikeSource.revenueMillionYen.toLocaleString()}百万円</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">所在地</span>
                        <span className="text-sm font-semibold text-[#172033]">{lookalikeSource.prefecture}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">検知した変化</span>
                        <span className="text-sm font-semibold text-[#172033]">{lookalikeSource.demandSignal}</span>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* 類似度ランキング */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                  <h3 className="text-base font-bold text-[#161c2c]">類似企業ランキング</h3>
                  <div className="flex items-center gap-2 flex-wrap text-sm text-slate-500">
                    <span>業界、企業規模、売上、事業内容などを比較</span>
                    <button
                      type="button"
                      onClick={() => setShowLookalikeMethodology(current => !current)}
                      aria-expanded={showLookalikeMethodology}
                      className="text-blue-600 hover:text-blue-700 font-medium shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
                    >
                      比較方法を見る
                    </button>
                  </div>
                </div>
                {showLookalikeMethodology && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs text-slate-600">
                    {lookalikeMethodology || '業界35%、従業員規模20%、売上15%、事業内容15%、所在地5%、需要シグナル5%、推奨部署5%'}
                    {lookalikeAnalyzedCount > 0 && <> ・ {lookalikeAnalyzedCount.toLocaleString()}社を比較</>}
                  </div>
                )}

                {lookalikeLoading ? (
                  <div className="space-y-4" aria-hidden="true">
                    {[0, 1, 2].map(index => (
                      <div key={index} className="bg-white border border-slate-200 rounded-xl px-5 py-5 animate-pulse">
                        <div className="h-4 w-1/3 bg-slate-100 rounded" />
                        <div className="h-3 w-1/4 bg-slate-100 rounded mt-3" />
                        <div className="h-3 w-2/3 bg-slate-100 rounded mt-4" />
                      </div>
                    ))}
                  </div>
                ) : lookalikeMatches.length > 0 ? (
                  <div className="space-y-4">
                    {lookalikeMatches.map((match, index) => {
                      const isInSalesList = salesLeads.some(lead => lead.companyId === match.company.id);
                      return (
                        <div key={match.company.id} className="bg-white border border-slate-200 rounded-xl px-5 py-5 flex flex-col md:flex-row md:items-start gap-4 md:gap-5">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <span className="text-sm font-bold text-slate-400 w-5 shrink-0 pt-0.5">{index + 1}</span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-lg font-bold text-[#172033] [overflow-wrap:anywhere]">{match.company.companyName}</h4>
                                <span className="inline-flex items-center bg-[#ECFDF3] text-[#15803D] text-xs font-bold px-2 py-0.5 rounded-full shrink-0">類似度 {match.similarityScore}%</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">{match.company.industryName} ・ {match.company.prefecture} ・ {match.company.employees.toLocaleString()}名</p>
                              <div className="flex flex-wrap gap-2 mt-2.5">
                                {match.reasons.map(reason => (
                                  <span key={reason} className="text-xs bg-slate-50 border border-slate-200 text-[#172033] px-2 py-1 rounded-md">{formatLookalikeReason(reason)}</span>
                                ))}
                              </div>
                              <div className="text-[13px] text-slate-500 mt-2.5 space-y-0.5">
                                <p>事業内容：{match.company.businessDescription}</p>
                                <p>検知した変化：{match.company.demandSignal}　営業スコア：{match.company.salesScore}</p>
                              </div>
                            </div>
                          </div>
                          <div className="shrink-0 w-full md:w-auto">
                            {isInSalesList ? (
                              <span
                                aria-label={`${match.company.companyName}は営業リストに追加済みです`}
                                className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 bg-[#ECFDF3] text-[#15803D] text-sm font-semibold px-4 py-2.5 rounded-lg"
                              >
                                <IconCheck className="w-4 h-4" /> 営業リストに追加済み
                              </span>
                            ) : (
                              <button
                                onClick={() => void addToSalesList(match.company)}
                                aria-label={`${match.company.companyName}を営業リストに追加`}
                                className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2.5 rounded-lg transition whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                              >
                                営業リストに追加
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : lookalikeAnalyzedCount > 0 ? (
                  <div className="border border-slate-200 rounded-xl bg-white py-14 px-6 text-center">
                    <IconSearch className="w-8 h-8 text-slate-300 mx-auto" />
                    <h4 className="text-sm font-bold text-[#172033] mt-3">類似する企業が見つかりませんでした</h4>
                    <p className="text-sm text-slate-500 mt-1">基準企業を変更するか、抽出件数を確認してください。</p>
                    <button
                      type="button"
                      onClick={() => lookalikeSourceSelectRef.current?.focus()}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      条件を変更
                    </button>
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-200 rounded-xl bg-white py-14 px-6 text-center">
                    <IconBuilding2 className="w-8 h-8 text-slate-300 mx-auto" />
                    <h4 className="text-sm font-bold text-[#172033] mt-3">基準企業を選んで分析を始めましょう</h4>
                    <p className="text-sm text-slate-500 mt-1">似ている企業を、業界や企業規模などから探します。</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: 架空企業データベース */}
          {activeTab === 'companies' && (
            <div className="space-y-6">
              {/* ページヘッダー */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-bold text-[#161c2c]">企業データベース</h2>
                    <span className="text-xs font-semibold text-[#B45309] bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-md">デモデータ</span>
                  </div>
                  <p className="text-slate-500 text-sm mt-1.5">20業界・2,000社の架空企業から、営業候補を検索できます。</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[28px] leading-none font-bold text-[#161c2c]">
                    {companyDataLoading ? '—' : filteredCompanies.length.toLocaleString()}<span className="text-base font-semibold ml-0.5">社</span>
                  </div>
                  <div className="text-[13px] text-slate-500 mt-1">{companies.length.toLocaleString()}社中</div>
                </div>
              </div>

              {/* 検索条件カード */}
              <section className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="company-search" className="text-xs font-semibold text-slate-500">企業名・所在地・事業内容</label>
                    <div className="relative">
                      <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        id="company-search"
                        value={companyQuery}
                        onChange={event => setCompanyQuery(event.target.value)}
                        placeholder="例：設備更新、東京都"
                        className="w-full h-12 pl-9 pr-3 bg-white border border-slate-300 rounded-lg text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="company-industry" className="text-xs font-semibold text-slate-500">業界</label>
                    <select
                      id="company-industry"
                      value={companyIndustry}
                      onChange={event => setCompanyIndustry(event.target.value)}
                      className="w-full h-12 bg-white border border-slate-300 rounded-lg px-3 text-sm text-[#172033] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">すべての業界</option>
                      {companyIndustries.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="company-min-score" className="text-xs font-semibold text-slate-500">最低営業スコア</label>
                      <span className="text-xs font-semibold text-[#172033]">{minimumScore}以上</span>
                    </div>
                    <input
                      id="company-min-score"
                      type="range"
                      min={COMPANY_SCORE_RANGE.min}
                      max={COMPANY_SCORE_RANGE.max}
                      value={minimumScore}
                      onChange={event => setMinimumScore(Number(event.target.value))}
                      aria-valuetext={`${minimumScore}以上`}
                      style={{ background: `linear-gradient(to right, #2563EB ${((minimumScore - COMPANY_SCORE_RANGE.min) / (COMPANY_SCORE_RANGE.max - COMPANY_SCORE_RANGE.min)) * 100}%, #E4E7EC ${((minimumScore - COMPANY_SCORE_RANGE.min) / (COMPANY_SCORE_RANGE.max - COMPANY_SCORE_RANGE.min)) * 100}%)` }}
                      className="w-full h-2 mt-3.5 rounded-full appearance-none cursor-pointer accent-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2563EB] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#2563EB] [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>{COMPANY_SCORE_RANGE.min}</span>
                      <span>{COMPANY_SCORE_RANGE.max}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 検索結果一覧 */}
              {companyDataLoading ? (
                <div className="bg-white border border-slate-200 rounded-xl py-16 text-center text-sm text-slate-500 animate-pulse">企業データベースを読み込み中...</div>
              ) : (
                <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  {filteredCompanies.length === 0 ? (
                    <div className="py-16 px-6 text-center">
                      <IconSearch className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-sm font-semibold text-[#172033] mt-3">条件に一致する企業がありません</p>
                      <p className="text-sm text-slate-500 mt-1">検索キーワードや業界、最低営業スコアを変更してください。</p>
                      <button
                        type="button"
                        onClick={() => { setCompanyQuery(''); setCompanyIndustry('all'); setMinimumScore(70); }}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                      >
                        条件をクリア
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* デスクトップ・タブレット：表形式 */}
                      <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full table-fixed text-sm">
                          <colgroup>
                            <col style={{ width: '27%' }} />
                            <col style={{ width: '17%' }} />
                            <col style={{ width: '12%' }} />
                            <col style={{ width: '11%' }} />
                            <col style={{ width: '21%' }} />
                            <col style={{ width: '12%' }} />
                          </colgroup>
                          <thead>
                            <tr>
                              {['企業', '業界', '規模', 'スコア', '検知した変化', '操作'].map((label, index) => (
                                <th
                                  key={label}
                                  scope="col"
                                  className={`bg-[#F8FAFC] px-4 py-3 text-[13px] font-semibold text-slate-500 border-b border-slate-200 ${index === 5 ? 'text-right' : 'text-left'}`}
                                >
                                  {label}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredCompanies.slice(0, 200).map(renderCompanyTableRow)}
                          </tbody>
                        </table>
                      </div>

                      {/* モバイル：縦型カード */}
                      <div className="sm:hidden divide-y divide-slate-100">
                        {filteredCompanies.slice(0, 200).map(renderCompanyCard)}
                      </div>
                    </>
                  )}
                  {filteredCompanies.length > 200 && (
                    <div className="px-4 py-2.5 text-xs text-slate-500 border-t border-slate-100">表示速度のため上位200社を表示しています。検索条件を絞り込んでください。</div>
                  )}
                </section>
              )}

              <p className="flex items-center gap-1.5 text-xs text-slate-400">
                <IconInfo className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                この画面の企業情報はデモ用の架空データです。
              </p>
            </div>
          )}

          {/* TAB 6: 設定 */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#161c2c]">商品・ソリューション管理</h2>
                  <p className="text-sm text-slate-500 mt-1">複数の商品を登録し、AI需要分析で使う商材を管理します。</p>
                </div>
                <div className="text-right"><div className="text-2xl font-bold text-[#161c2c]">{products.length}</div><div className="text-[11px] text-slate-500">登録商品</div></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1.85fr] gap-5 items-start">
                <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-[#172033]">{editingProductId ? '商品を編集' : '新しい商品を登録'}</h3>
                    {editingProductId && <button onClick={resetProductForm} className="text-xs text-blue-600 hover:text-blue-700 font-medium">編集をキャンセル</button>}
                  </div>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-slate-500">商材名 *</span>
                    <input value={productForm.name} onChange={event => setProductForm(current => ({ ...current, name: event.target.value }))} placeholder="例：店舗向けAIカメラ" className="w-full h-12 bg-white border border-slate-300 rounded-lg px-3 text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-slate-500">カテゴリー *</span>
                    <input value={productForm.category} onChange={event => setProductForm(current => ({ ...current, category: event.target.value }))} placeholder="例：セキュリティ機器" className="w-full h-12 bg-white border border-slate-300 rounded-lg px-3 text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-slate-500">特徴・解決できる課題</span>
                    <textarea rows={3} value={productForm.description} onChange={event => setProductForm(current => ({ ...current, description: event.target.value }))} placeholder="商品の特徴や解決する課題" className="w-full h-24 bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-slate-500">対象業界</span>
                    <input value={productForm.targetIndustries} onChange={event => setProductForm(current => ({ ...current, targetIndustries: event.target.value }))} placeholder="例：製造業、建設業" className="w-full h-12 bg-white border border-slate-300 rounded-lg px-3 text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </label>
                  <button onClick={handleSaveProduct} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">{editingProductId ? '変更を保存' : '商材を登録'}</button>
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
                  {products.map((product, index) => {
                    const isAnalysisTarget = product.name === productName;
                    const isLastOdd = products.length % 2 === 1 && index === products.length - 1;
                    return (
                      <article key={product.id} className={`bg-white border rounded-xl p-4 ${product.active ? 'border-slate-200' : 'border-slate-100 opacity-60'} ${isLastOdd ? 'sm:col-span-2' : ''}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-bold text-sm text-[#172033] truncate">{product.name}</h3>
                            <span className="inline-block mt-1 text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{product.category}</span>
                          </div>
                          <label className="flex items-center gap-1.5 text-[11px] text-slate-500 whitespace-nowrap shrink-0">
                            <input type="checkbox" checked={product.active} onChange={() => handleToggleProduct(product.id)} className="accent-blue-600" />
                            有効
                          </label>
                        </div>
                        <p className="text-xs text-[#667085] mt-2 line-clamp-2">{product.description || '商品概要は未登録です'}</p>
                        <p className="text-xs text-[#667085] mt-1.5 line-clamp-2">対象業界：{product.targetIndustries || '未設定'}</p>
                        <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100">
                          {isAnalysisTarget ? (
                            <span className="text-xs font-semibold bg-[#ECFDF3] text-[#15803D] px-3 py-1.5 rounded-lg">分析対象</span>
                          ) : (
                            <button
                              onClick={() => { setProductName(product.name); showToast(`${product.name} を分析対象に設定しました`); }}
                              disabled={!product.active}
                              className="text-xs font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg"
                            >
                              分析対象にする
                            </button>
                          )}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button onClick={() => handleEditProduct(product)} className="text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg">編集</button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="text-xs font-medium text-[#DC2626] hover:bg-red-50 px-3 py-1.5 rounded-lg">削除</button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </section>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-[#172033]">アプローチNG・既存顧客データ設定</h3>
                <p className="text-xs text-[#667085]">CSVをアップロードするか、Salesforceから自動連携して除外リストを作成します。</p>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs">
                  アプローチ除外リスト（CSV）をドラッグ＆ドロップ
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* AIに質問するサイドパネル（既存のチャット機能を再利用） */}
      {isAiPanelOpen && activeTab === 'ai-search' && selectedCandidate && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-50"
            onClick={() => setIsAiPanelOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="AIに質問する"
            className="fixed top-0 right-0 h-[100dvh] z-[60] w-full sm:w-[80%] md:w-[70%] lg:w-[440px] bg-white border-l border-slate-200 shadow-lg flex flex-col"
          >
            {/* 固定ヘッダー */}
            <div className="shrink-0 border-b border-slate-100 px-5 py-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-base font-bold text-[#172033]">AIに質問する</h3>
                <p className="text-xs text-slate-500 mt-1">選択中の企業と検索条件をもとに回答します。</p>
                <p className="text-xs font-semibold text-blue-600 mt-1 truncate">{selectedCandidate.companyName}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAiPanelOpen(false)}
                aria-label="AI質問パネルを閉じる"
                className="shrink-0 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-md p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                ✕
              </button>
            </div>

            {/* スクロール可能な会話履歴 */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-5 py-4 space-y-3">
              {chatMessages.length === 0 && (
                <>
                  <p className="text-sm text-slate-500">この企業について気になることを質問できます。</p>
                  <div className="space-y-2">
                    {['この企業へ提案する際の注意点は？', '最初に確認すべきことは？', 'この企業に合う提案の切り口は？'].map(example => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => setChatInput(example)}
                        className="w-full text-left text-xs text-slate-500 border border-slate-200 hover:border-blue-300 hover:text-blue-600 rounded-lg p-3"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {chatMessages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] min-w-0 rounded-xl px-4 py-3 text-xs leading-6 whitespace-pre-wrap break-words ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
                    <span className={`block text-[10px] font-semibold mb-1 ${message.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>{message.role === 'user' ? 'あなた' : 'AI'}</span>
                    {message.content}
                  </div>
                </div>
              ))}
              {chatLoading && <div className="text-xs text-slate-400 animate-pulse">回答を作成しています...</div>}
            </div>

            {/* 固定入力エリア */}
            <div className="shrink-0 bg-white border-t border-slate-100 p-4">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={aiPanelInputRef}
                  value={chatInput}
                  onChange={event => setChatInput(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' && !event.nativeEvent.isComposing && !event.shiftKey) {
                      event.preventDefault();
                      handleChat();
                    }
                  }}
                  placeholder="この企業について質問する"
                  rows={1}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-xs resize-none max-h-24 overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={handleChat}
                  disabled={!chatInput.trim() || chatLoading}
                  className="shrink-0 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold px-5 py-2.5 rounded-lg text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  送信
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* アポ・案件の詳細サイドパネル */}
      {selectedPipelineLead && activeTab === 'pipeline' && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-50"
            onClick={() => setSelectedPipelineLead(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="案件の詳細"
            className="fixed top-0 right-0 h-[100dvh] z-[60] w-full sm:w-[85%] md:w-[70%] lg:w-[420px] bg-white border-l border-slate-200 shadow-lg flex flex-col"
          >
            <div className="shrink-0 border-b border-slate-100 px-5 py-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-base font-bold text-[#172033] truncate">{selectedPipelineLead.companyName}</h3>
                <p className="text-xs text-slate-500 mt-1">{selectedPipelineLead.industryName}・{selectedPipelineLead.prefecture}・{selectedPipelineLead.employees.toLocaleString()}名</p>
                <p className="text-xs text-slate-500 mt-0.5">{selectedPipelineLead.targetDepartment} {selectedPipelineLead.targetRole}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPipelineLead(null)}
                aria-label="案件詳細を閉じる"
                className="shrink-0 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-md p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-4">
              <div>
                <label htmlFor="pipeline-status-select" className="text-xs font-semibold text-slate-500 block mb-1">対応状況</label>
                <select
                  id="pipeline-status-select"
                  aria-label={`${selectedPipelineLead.companyName}の対応状況`}
                  value={selectedPipelineLead.status}
                  onChange={event => {
                    const nextStatus = event.target.value;
                    const lead = selectedPipelineLead;
                    void updateSalesLead(lead, { status: nextStatus });
                    setSelectedPipelineLead({ ...lead, status: nextStatus });
                  }}
                  className={`w-full border rounded-lg px-2.5 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 ${getStatusBadgeClass(selectedPipelineLead.status)}`}
                >
                  {['未対応', 'DM作成中', '送信済み', '返信あり', '商談化', '保留', 'NG'].map(status => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <IconTrendingUp className="w-3.5 h-3.5 text-blue-500" />
                  検知した変化
                </div>
                <p className="text-sm text-[#172033] mt-1">{selectedPipelineLead.demandSignal}</p>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500">営業メモ</div>
                <p className="text-sm text-[#172033] mt-1 whitespace-pre-wrap">{selectedPipelineLead.note?.trim() || 'メモはまだありません。'}</p>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-100 p-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => { openDmPractice(selectedPipelineLead.companyId); setSelectedPipelineLead(null); }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                営業DMを作成
              </button>
              <button
                onClick={() => { handleViewCompanyProfile(selectedPipelineLead); setSelectedPipelineLead(null); }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
              >
                企業情報を見る
              </button>
            </div>
          </div>
        </>
      )}

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
