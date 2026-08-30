import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const industries = [
  ['agriculture', '農業・林業'], ['fisheries', '漁業'], ['mining', '鉱業・採石業'],
  ['construction', '建設業'], ['manufacturing', '製造業'], ['utilities', '電気・ガス・熱供給・水道業'],
  ['information', '情報通信業'], ['transport', '運輸・郵便業'], ['wholesale_retail', '卸売・小売業'],
  ['finance', '金融・保険業'], ['real_estate', '不動産・物品賃貸業'],
  ['research_professional', '学術研究・専門技術サービス業'], ['accommodation_food', '宿泊・飲食サービス業'],
  ['lifestyle_entertainment', '生活関連サービス・娯楽業'], ['education', '教育・学習支援業'],
  ['medical_welfare', '医療・福祉'], ['compound_services', '複合サービス事業'],
  ['business_services', 'その他事業サービス業'], ['public_services', '公共関連サービス'],
  ['other_services', 'その他サービス業'],
];

const prefectures = ['北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県','新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県'];
const brandPrefixes = ['アーク','ネクサス','プライム','オルビス','ノヴァ','ユニゾン','ヴェリタス','セントラル','エレメント','クレスト','シナジー','アクセル','リード','ハーモニー','ブリッジ','フォーカス','ビジョン','コア','アドバンス','インテグラ'];
const corporateSuffixes = ['ソリューションズ','パートナーズ','ワークス','グループ','コーポレーション'];
const industryStems = {
  agriculture: 'アグリ', fisheries: 'マリン', mining: 'リソース', construction: 'ビルド',
  manufacturing: 'インダストリー', utilities: 'エナジー', information: 'デジタル',
  transport: 'ロジスティクス', wholesale_retail: 'コマース', finance: 'フィナンシャル',
  real_estate: 'プロパティ', research_professional: 'リサーチ', accommodation_food: 'ホスピタリティ',
  lifestyle_entertainment: 'ライフ', education: 'ラーニング', medical_welfare: 'ヘルスケア',
  compound_services: 'コミュニティ', business_services: 'オペレーション',
  public_services: 'パブリック', other_services: 'サービス',
};
const cityNames = ['中央市','緑市','さくら市','ひかり市','あおば市','若葉市','豊栄市','清流市','旭市','みなと市','高台市','新生市','平和市','希望市','文化市','産業市','学園市','泉市','丘陵市','未来市'];
const legalForms = ['株式会社','合同会社'];
const scaleBands = [
  { label: '小規模', min: 12, span: 38 }, { label: '中小企業', min: 50, span: 250 },
  { label: '中堅企業', min: 300, span: 700 }, { label: '大企業', min: 1000, span: 4000 },
];
const industryProfiles = {
  agriculture: ['スマート農業設備の運営','農産物の生産・加工・流通','温室・農業施設の管理','生産管理部'],
  fisheries: ['水産物の養殖・加工','漁業設備と冷凍網の運営','水産物流通','品質管理部'],
  mining: ['鉱物資源の採掘・加工','砕石・資源リサイクル','採掘設備の保守','設備管理部'],
  construction: ['建築・土木工事','設備工事と施設改修','建設現場の安全管理','工事管理部'],
  manufacturing: ['産業機器の製造','精密部品の加工・組立','工場自動化設備の開発','生産技術部'],
  utilities: ['地域エネルギー供給','水処理・インフラ運営','再生可能エネルギー設備管理','インフラ管理部'],
  information: ['業務システム開発','クラウド・データ基盤運営','通信サービス提供','情報システム部'],
  transport: ['貨物輸送・倉庫運営','共同配送ネットワーク','郵便・ラストマイル配送','物流企画部'],
  wholesale_retail: ['専門商材の卸売','小売店舗・EC運営','商品調達と販売支援','店舗運営部'],
  finance: ['法人向け金融サービス','保険・リスク管理支援','決済・資産管理','業務企画部'],
  real_estate: ['不動産開発・管理','事業用物件の賃貸','設備・物品レンタル','プロパティ管理部'],
  research_professional: ['研究開発・技術支援','調査・コンサルティング','設計・知財サービス','研究企画部'],
  accommodation_food: ['ホテル・宿泊施設運営','飲食店・給食事業','観光施設の運営','施設運営部'],
  lifestyle_entertainment: ['生活支援サービス','スポーツ・娯楽施設運営','美容・ウェルネス事業','事業運営部'],
  education: ['教育施設の運営','企業研修・学習支援','デジタル教材開発','学校運営部'],
  medical_welfare: ['医療・介護施設運営','福祉サービス提供','健康支援事業','法人本部施設課'],
  compound_services: ['地域共同サービス','会員向け複合事業','共同購買・業務支援','事業推進部'],
  business_services: ['BPO・業務受託','警備・施設管理','人材・運営支援','オペレーション部'],
  public_services: ['地域インフラ支援','公共施設の受託運営','地域事業の企画支援','施設政策部'],
  other_services: ['機器修理・保守','会員制サービス運営','地域生活支援','サービス企画部'],
};
const signals = ['新拠点の開設計画','設備更新予算の増額','DX推進組織の新設','人員採用の拡大','省エネ投資の開始','安全管理方針の強化','既存施設の改修','新サービスの発表','業務提携の締結','事業エリアの拡大'];

const companies = [];
for (let industryIndex = 0; industryIndex < industries.length; industryIndex++) {
  const [industryCode, industryName] = industries[industryIndex];
  const profile = industryProfiles[industryCode];
  for (let n = 1; n <= 100; n++) {
    const seed = industryIndex * 100 + n;
    const scale = scaleBands[seed % scaleBands.length];
    const employees = scale.min + ((seed * 37) % scale.span);
    const revenueMillionYen = Math.max(80, employees * (11 + (seed % 19)));
    const brandPrefix = brandPrefixes[Math.floor((n - 1) / corporateSuffixes.length)];
    const industryStem = industryStems[industryCode];
    const corporateSuffix = corporateSuffixes[(n - 1) % corporateSuffixes.length];
    const companyName = `${legalForms[seed % 2]}${brandPrefix}${industryStem}${corporateSuffix}`;
    const signal = signals[(seed * 3) % signals.length];
    companies.push({
      id: `FC-${String(seed).padStart(5, '0')}`,
      companyName,
      companyNameKana: `${legalForms[seed % 2]} ${brandPrefix} ${industryStem} ${corporateSuffix}`,
      industryCode, industryName,
      prefecture: prefectures[(seed * 7) % prefectures.length],
      city: cityNames[(seed + 3) % cityNames.length],
      establishedYear: 1955 + ((seed * 11) % 68),
      employees, scale: scale.label, revenueMillionYen,
      businessDescription: profile[(n - 1) % 3],
      website: `https://example.invalid/${industryCode}/${String(n).padStart(3, '0')}`,
      demandSignal: signal,
      demandSignalDetail: `${signal}に伴い、施設・業務設備および運用体制を見直している可能性があります。`,
      targetDepartment: profile[3],
      targetRole: ['部長','課長','責任者','企画担当'][(seed + 1) % 4],
      salesScore: 55 + ((seed * 17) % 45),
      existingCustomer: seed % 17 === 0,
      approachStatus: ['未対応','情報収集中','アプローチ準備中'][seed % 3],
      createdAt: '2026-08-30',
      fictional: true,
      disclaimer: '本データはデモ用途の架空企業です。実在の企業・団体とは関係ありません。',
    });
  }
}

const outDir = join(process.cwd(), 'data');
const publicDir = join(process.cwd(), 'public', 'data');
await mkdir(outDir, { recursive: true });
await mkdir(publicDir, { recursive: true });
const json = JSON.stringify({ metadata: { generatedAt: '2026-08-30', fictional: true, industryCount: industries.length, companyCount: companies.length, companiesPerIndustry: 100 }, industries: industries.map(([code, name]) => ({ code, name })), companies }, null, 2);
await writeFile(join(outDir, 'companies.json'), json, 'utf8');
await writeFile(join(publicDir, 'companies.json'), json, 'utf8');

const columns = Object.keys(companies[0]);
const csvEscape = (value) => `"${String(value).replaceAll('"', '""')}"`;
const csv = '\uFEFF' + [columns.join(','), ...companies.map(row => columns.map(key => csvEscape(row[key])).join(','))].join('\r\n');
await writeFile(join(outDir, 'companies.csv'), csv, 'utf8');

const dbPath = join(outDir, 'companies.sqlite');
const db = new DatabaseSync(dbPath);
db.exec('DROP TABLE IF EXISTS companies');
db.exec(`CREATE TABLE companies (${columns.map(key => `${key} ${['employees','establishedYear','revenueMillionYen','salesScore'].includes(key) ? 'INTEGER' : ['fictional','existingCustomer'].includes(key) ? 'INTEGER' : 'TEXT'}`).join(', ')})`);
db.exec('CREATE INDEX idx_companies_industry ON companies(industryCode)');
db.exec('CREATE INDEX idx_companies_score ON companies(salesScore DESC)');
const insert = db.prepare(`INSERT INTO companies (${columns.join(',')}) VALUES (${columns.map(() => '?').join(',')})`);
db.exec('BEGIN');
for (const company of companies) insert.run(...columns.map(key => typeof company[key] === 'boolean' ? Number(company[key]) : company[key]));
db.exec('COMMIT');
db.close();

console.log(`Generated ${companies.length} fictional companies across ${industries.length} industries.`);
