import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NextResponse } from 'next/server';

const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'qwen3:0.6b';

const businessMailKnowledge = `
日本企業メールの作成原則:
1. 件名は用件と相手の利益が分かる30文字前後にする。
2. 冒頭で相手名・挨拶・連絡理由を明示し、本文は結論から書く。
3. 営業側は課題仮説→提供価値→根拠→負担の小さい次の行動の順にする。
4. 顧客側は関心の有無、判断条件、予算・時期・決裁・セキュリティ等の懸念を明確にする。
5. 調達側は価格、契約条件、導入体制、比較条件、納期を確認する。
6. 管理職側は投資対効果、リスク、社内説明、優先順位を確認する。
7. 断る場合も理由と再連絡可能な条件を簡潔に示す。過剰な敬語や断定、架空の実績は避ける。
8. 元メールの質問や依頼を漏らさず拾い、回答できない点は確認事項として返す。
これは個人情報を含まない一般化済みの文面パターンであり、実在メール本文ではない。`;

type Company = {
  id: string;
  companyName: string;
  industryName: string;
  prefecture: string;
  employees: number;
  businessDescription: string;
  demandSignal: string;
  demandSignalDetail: string;
  challengeTitle: string;
  challengeDetail: string;
  challengeCategory: string;
  challengeUrgency: string;
  seekingProposals: boolean;
  targetDepartment: string;
  targetRole: string;
  salesScore: number;
  existingCustomer: boolean;
};

export async function GET() {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(5000), cache: 'no-store' });
    if (!response.ok) throw new Error('Ollama API error');
    const data = await response.json();
    const models = (data.models ?? []).map((model: { name: string }) => model.name);
    return NextResponse.json({ connected: true, model: OLLAMA_MODEL, modelReady: models.includes(OLLAMA_MODEL), models });
  } catch {
    return NextResponse.json({ connected: false, model: OLLAMA_MODEL, modelReady: false, models: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = {
      name: String(body.product?.name ?? ''),
      category: String(body.product?.category ?? ''),
      description: String(body.product?.description ?? ''),
      targetIndustries: String(body.product?.targetIndustries ?? ''),
    };
    const conditions = {
      industry: String(body.conditions?.industry ?? 'all'),
      prefecture: String(body.conditions?.prefecture ?? 'all'),
      minEmployees: Math.max(0, Number(body.conditions?.minEmployees ?? 0)),
      maxEmployees: Math.max(0, Number(body.conditions?.maxEmployees ?? 0)),
      minScore: Math.min(99, Math.max(0, Number(body.conditions?.minScore ?? 70))),
      demandSignal: String(body.conditions?.demandSignal ?? '').trim(),
      limit: Math.min(100, Math.max(1, Number(body.conditions?.limit ?? 10))),
      excludeExisting: body.conditions?.excludeExisting !== false,
    };
    if (!product.name) return NextResponse.json({ error: '分析対象の商品が必要です' }, { status: 400 });

    const database = JSON.parse(await readFile(join(process.env.DATA_DIR ?? join(process.cwd(), 'data'), 'companies.json'), 'utf8')) as { companies: Company[] };
    if (body.mode === 'sales-draft') {
      const company = database.companies.find(item => item.id === String(body.companyId ?? ''));
      if (!company) return NextResponse.json({ error: '対象企業が見つかりません' }, { status: 404 });
      const channel = String(body.channel ?? 'メール');
      const recipientRole = String(body.recipientRole ?? company.targetRole);
      const objective = String(body.objective ?? '15分のオンライン商談を提案する');
      const tone = String(body.tone ?? '丁寧で簡潔');
      const extra = String(body.extra ?? '').trim().slice(0, 1500);
      const prompt = `日本のB2B営業で使う初回${channel}を1通作成してください。説明や分析は不要です。\n\n${businessMailKnowledge}\n\n送信者の立場:自社の営業担当\n送信先:${company.companyName} ${company.targetDepartment} ${recipientRole}\n相手企業の事業:${company.businessDescription}\n相手が登録した困りごと:${company.challengeTitle}、${company.challengeDetail}\n提案商材:${product.name}（${product.description}）\n目的:${objective}\n文体:${tone}\n追加条件:${extra || 'なし'}\n\n登録された困りごとと商材の価値を自然につなげ、推測や「可能性がある」という表現を使わず、相手が答えやすい具体的な次の行動を1つ示してください。入力にない人物名、導入実績、数値、価格、日程は作らないでください。${channel === 'メール' ? '件名を1行、空行、本文を250〜400文字で書いてください。' : '件名は不要。本文を120〜220文字で書いてください。'} 完成文だけを出力してください。`;
      try {
        const ollamaResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false, think: false, options: { temperature: 0.35, num_predict: 700 } }),
          signal: AbortSignal.timeout(120000),
        });
        if (!ollamaResponse.ok) throw new Error('Ollama API error');
        const result = await ollamaResponse.json();
        return NextResponse.json({ model: OLLAMA_MODEL, draft: `立場: 自社の営業担当\n送信先: ${company.targetDepartment} ${recipientRole}\n\n${String(result.response).trim()}` });
      } catch {
        return NextResponse.json({ error: 'Ollamaに接続できません。Ollamaを起動して再試行してください。' }, { status: 503 });
      }
    }
    if (body.mode === 'email-reply') {
      const company = database.companies.find(item => item.id === String(body.companyId ?? ''));
      if (!company) return NextResponse.json({ error: '対象企業が見つかりません' }, { status: 404 });
      const sourceText = String(body.sourceText ?? '').trim().slice(0, 6000);
      const aiRole = String(body.aiRole ?? '営業担当');
      const objective = String(body.objective ?? '次回の打ち合わせにつなげる');
      const tone = String(body.tone ?? '丁寧で簡潔');
      if (!sourceText) return NextResponse.json({ error: '返信元の文章を入力してください' }, { status: 400 });
      const prompt = `日本語の返信メール本文だけを作成してください。説明、箇条書き、見出し、分析は出力禁止です。\n\n${businessMailKnowledge}\n\nあなたの立場:${aiRole}\n相手:${company.companyName} ${company.targetDepartment} ${company.targetRole}\n商材:${product.name}（${product.description}）\n目的:${objective}\n文体:${tone}\n受信文:\n${sourceText}\n\n重要: 指定された立場を変えないでください。受信文の質問すべてに答えてください。不明な費用・実績・日時は作らず「確認のうえご案内します」としてください。挨拶、回答、次の行動、結びを含む200〜350文字の完成した返信本文だけを書いてください。`;
      try {
        const ollamaResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false, think: false, options: { temperature: 0.25, num_predict: 700 } }),
          signal: AbortSignal.timeout(120000),
        });
        if (!ollamaResponse.ok) throw new Error('Ollama API error');
        const result = await ollamaResponse.json();
        const subject = objective.includes('断り') ? `Re: ご提案について` : objective.includes('日程') ? `Re: お打ち合わせ日程について` : `Re: ${product.name}について`;
        return NextResponse.json({ model: OLLAMA_MODEL, reply: `立場: ${aiRole}\n件名: ${subject}\n\n${String(result.response).trim()}`, aiRole, knowledge: '匿名化・一般化した企業メール文面パターン' });
      } catch {
        return NextResponse.json({ error: 'Ollamaに接続できません。Ollamaを起動して再試行してください。' }, { status: 503 });
      }
    }
    if (body.mode === 'dm-practice') {
      const company = database.companies.find(item => item.id === String(body.companyId ?? ''));
      if (!company) return NextResponse.json({ error: '演習対象の企業が見つかりません' }, { status: 404 });
      const conversation = Array.isArray(body.conversation)
        ? body.conversation.slice(-12).map((message: { role?: string; content?: string }) => `${message.role === 'user' ? '営業担当' : '企業担当者'}: ${String(message.content ?? '')}`).join('\n')
        : '';
      const message = String(body.message ?? '').trim();
      const finish = body.finish === true;
      const customerSystem = `あなたは営業を受ける側の企業担当者です。役割は「${company.companyName} ${company.targetDepartment} ${company.targetRole}」です。営業担当者ではありません。絶対に商品を提案・販売・紹介しません。「弊社の商品」「ご提案いたします」「導入をおすすめします」とは発言しません。営業から届いたDMに対して、顧客として質問、懸念、検討状況、断りのいずれかを返してください。返答本文だけを1〜3文で書いてください。`;
      const prompt = finish
        ? `あなたはB2B営業コーチです。次の架空企業へのDM演習を、100点満点で採点してください。\n企業:${company.companyName}／${company.industryName}／需要:${company.demandSignal}\n商材:${product.name}／${product.description}\n会話:\n${conversation}\n\n「総合点」「良かった点」「改善点」「改善版DM」の4項目で日本語で簡潔に講評してください。改善版DMは120文字以内にしてください。`
        : `あなたは架空企業「${company.companyName}」の${company.targetDepartment} ${company.targetRole}です。営業DMの模擬演習です。あなたはDMを受け取る顧客側であり、営業担当ではありません。商品を売ったり提案したりせず、顧客側の返事だけを書いてください。\n企業情報:${company.industryName}、${company.businessDescription}\n自社が登録した困りごと:${company.challengeTitle}、${company.challengeDetail}\n提案を受ける商材:${product.name}（${product.description}）\n会話履歴:\n${conversation || 'まだ会話はありません'}\n営業担当から届いた新しいDM:${message || '（最初の連絡を待っています）'}\n\n返答は登録した困りごとを前提に、DM風の自然な日本語で1〜3文にしてください。簡単に購入を決めず、内容に応じて質問・懸念・断りを示してください。企業情報にない事実は作らないでください。`;
      try {
        const ollamaResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: OLLAMA_MODEL, system: finish ? 'あなたはB2B営業コーチです。' : customerSystem, prompt, stream: false, think: false, options: { temperature: finish ? 0.3 : 0.2, num_predict: finish ? 500 : 180 } }),
          signal: AbortSignal.timeout(120000),
        });
        if (!ollamaResponse.ok) throw new Error('Ollama API error');
        const result = await ollamaResponse.json();
        let reply = String(result.response ?? '').trim();
        const salesVoice = /弊社.{0,20}(商品|サービス|商材)|ご提案いたします|ご紹介いたします|ご説明いたします|導入をおすすめ|販売いたします|お役に立てる.*ご連絡|ご関心(でしょうか|はありますか)|内容に合致|確認できます/;
        const customerVoice = /教えていただ|伺いた|確認(させて|したい|します)|検討(したい|します|いたします)|見送|懸念|社内で|予算について/;
        const roleReversed = salesVoice.test(reply) || !customerVoice.test(reply);
        if (!finish && roleReversed) {
          const correctionResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: OLLAMA_MODEL, system: customerSystem, prompt: `次の文章は営業側の発言になっており役割違反です。顧客側の返事に書き直してください。\n営業から届いたDM:${message}\n役割違反の文章:${reply}\n顧客としての返信本文だけを書いてください。`, stream: false, think: false, options: { temperature: 0.1, num_predict: 150 } }),
            signal: AbortSignal.timeout(120000),
          });
          if (correctionResponse.ok) reply = String((await correctionResponse.json()).response ?? '').trim();
          if (salesVoice.test(reply) || !customerVoice.test(reply)) {
            reply = `ご提案ありがとうございます。${company.demandSignal}に関連する内容として関心があります。導入条件と既存環境への影響について、もう少し詳しく教えていただけますか。`;
          }
        }
        return NextResponse.json({ model: OLLAMA_MODEL, reply, finish, role: finish ? '営業コーチ' : `${company.companyName} ${company.targetDepartment} ${company.targetRole}`, roleLocked: !finish });
      } catch {
        return NextResponse.json({ error: 'Ollamaに接続できません。Ollamaを起動して再試行してください。' }, { status: 503 });
      }
    }
    const productIndustries = product.targetIndustries === '全業界'
      ? []
      : product.targetIndustries.split(/[、,]/).map(value => value.trim()).filter(Boolean);
    const normalize = (value: string) => value.normalize('NFKC').toLowerCase().replace(/[\s　・、,。/／]/g, '');
    const synonymGroups = [
      ['dx','it','デジタル','システム','効率化','自動化','ペーパーレス','クラウド'],
      ['監視','カメラ','防犯','セキュリティ','安全','事故','点検','品質'],
      ['人事','労務','採用','教育','研修','人材','定着','勤怠','給与'],
      ['省エネ','電力','エネルギー','光熱費','コスト','経費','削減'],
      ['物流','配送','倉庫','在庫','入出庫','輸送'],
      ['営業','顧客','問い合わせ','crm','対応','商談','販売'],
      ['設備','施設','保守','修理','老朽化','更新'],
      ['提携','協業','パートナー','新規事業','販路','事業開発'],
    ];
    const matchesKeyword = (company: Company, keyword: string) => {
      if (!keyword.trim()) return true;
      const source = normalize(`${company.challengeTitle} ${company.challengeDetail} ${company.challengeCategory} ${company.businessDescription}`);
      const normalizedKeyword = normalize(keyword);
      if (source.includes(normalizedKeyword)) return true;
      const tokens = keyword.split(/[\s　、,。・/／]+/).map(normalize).filter(token => token.length >= 2);
      if (tokens.some(token => source.includes(token))) return true;
      return synonymGroups.some(group => group.some(word => normalizedKeyword.includes(normalize(word))) && group.some(word => source.includes(normalize(word))));
    };
    const registeredCompanies = database.companies
      // Older Docker volumes predate this field. Those 2,000 records are also
      // registered companies, so only an explicit false means "not accepting".
      .filter(company => company.seekingProposals !== false)
      .filter(company => !conditions.excludeExisting || !company.existingCustomer);
    const explicitConditions = registeredCompanies
      .filter(company => conditions.industry === 'all' || company.industryName === conditions.industry)
      .filter(company => conditions.prefecture === 'all' || company.prefecture === conditions.prefecture)
      .filter(company => company.employees >= conditions.minEmployees)
      .filter(company => conditions.maxEmployees === 0 || company.employees <= conditions.maxEmployees);
    const productMatched = explicitConditions.filter(company => conditions.industry !== 'all' || productIndustries.length === 0 || productIndustries.some(industry => company.industryName.includes(industry) || industry.includes(company.industryName)));
    const scored = productMatched.filter(company => company.salesScore >= conditions.minScore);
    let matchMode: 'exact' | 'related' | 'relaxed-product' | 'relaxed-score' | 'relaxed-size' | 'relaxed-location' | 'none' = 'exact';
    let matched = scored.filter(company => matchesKeyword(company, conditions.demandSignal));
    if (matched.length === 0 && conditions.demandSignal) {
      matched = scored.filter(company => matchesKeyword(company, `${product.name} ${product.category} ${product.description}`));
      matchMode = 'related';
    }
    if (matched.length === 0 && conditions.industry === 'all') {
      matched = explicitConditions.filter(company => company.salesScore >= conditions.minScore).filter(company => matchesKeyword(company, conditions.demandSignal || `${product.name} ${product.category} ${product.description}`));
      matchMode = 'relaxed-product';
    }
    if (matched.length === 0 && explicitConditions.length > 0) {
      matched = explicitConditions.filter(company => matchesKeyword(company, conditions.demandSignal || `${product.name} ${product.category} ${product.description}`));
      matchMode = 'relaxed-score';
    }
    if (matched.length === 0) {
      const sizeRelaxed = registeredCompanies
        .filter(company => conditions.industry === 'all' || company.industryName === conditions.industry)
        .filter(company => conditions.prefecture === 'all' || company.prefecture === conditions.prefecture)
        .filter(company => matchesKeyword(company, conditions.demandSignal || `${product.name} ${product.category} ${product.description}`));
      if (sizeRelaxed.length) { matched = sizeRelaxed; matchMode = 'relaxed-size'; }
    }
    if (matched.length === 0) {
      matched = registeredCompanies
        .filter(company => conditions.industry === 'all' || company.industryName === conditions.industry)
        .filter(company => matchesKeyword(company, conditions.demandSignal || `${product.name} ${product.category} ${product.description}`));
      matchMode = matched.length ? 'relaxed-location' : 'none';
    }
    if (matched.length === 0) matchMode = 'none';
    const candidates = matched
      .sort((a, b) => b.salesScore - a.salesScore)
      .slice(0, conditions.limit);
    const conditionNote = matchMode === 'exact' ? '指定条件に一致'
      : matchMode === 'related' ? '課題の関連語で一致'
      : matchMode === 'relaxed-product' ? '商品の対象業界だけを緩和'
      : matchMode === 'relaxed-score' ? '最低スコアだけを緩和'
      : matchMode === 'relaxed-size' ? '従業員規模と最低スコアを緩和'
      : matchMode === 'relaxed-location' ? '所在地・従業員規模・最低スコアを緩和'
      : '一致なし';

    if (candidates.length === 0) {
      return NextResponse.json({ model: OLLAMA_MODEL, analysis: '登録課題2,000件を検索しましたが、指定した業界または課題キーワードに関連する登録課題がありません。課題キーワードを短くして再検索してください。', candidates: [], totalMatched: 0, matchMode, conditionNote, aiAvailable: true });
    }

    const companyContext = candidates.map((company, index) =>
      `${index + 1}. ${company.companyName}｜${company.industryName}｜${company.prefecture}｜従業員${company.employees}名｜適合スコア${company.salesScore}｜登録課題:${company.challengeTitle}（${company.challengeDetail}）｜課題カテゴリ:${company.challengeCategory}｜緊急度:${company.challengeUrgency}｜事業:${company.businessDescription}｜担当部署:${company.targetDepartment}`
    ).join('\n');
    const conversation = Array.isArray(body.conversation)
      ? body.conversation.slice(-8).map((message: { role?: string; content?: string }) => `${message.role === 'user' ? 'ユーザー' : 'AI'}: ${String(message.content ?? '')}`).join('\n')
      : '';
    const userMessage = String(body.message ?? '').trim();
    const isConversation = body.mode === 'chat' && userMessage;
    const conversationPrompt = `あなたは日本のB2B企業間マッチング支援AIです。現在選択中の商品、検索条件、登録企業が自ら登録した困りごとを前提に対話してください。\n商品: ${product.name}（${product.description}）\n検索条件: 業界=${conditions.industry}, 所在地=${conditions.prefecture}, 従業員=${conditions.minEmployees}〜${conditions.maxEmployees || '上限なし'}名, 最低スコア=${conditions.minScore}, 課題キーワード=${conditions.demandSignal || '指定なし'}\n検索結果:\n${companyContext}\n\n直近の会話:\n${conversation || 'なし'}\nユーザー: ${userMessage}\n\n根拠は登録課題だけに限定し、「可能性」「推測」「見込み」という表現を使わないでください。検索結果にない企業や事実を作らず、日本語で具体的かつ簡潔に答えてください。`;
    const prompt = `あなたは日本のB2B企業間マッチング支援AIです。商品の内容と、営業ナビ登録企業が自ら登録した困りごとを照合してください。\n\n商品名: ${product.name}\nカテゴリー: ${product.category}\n概要: ${product.description}\n対象業界: ${product.targetIndustries}\n指定条件: 業界=${conditions.industry}, 所在地=${conditions.prefecture}, 従業員=${conditions.minEmployees}〜${conditions.maxEmployees || '上限なし'}名, 最低スコア=${conditions.minScore}, 課題キーワード=${conditions.demandSignal || '指定なし'}\n\n候補企業と登録課題:\n${companyContext}\n\n次の形式で日本語で簡潔に回答してください。\n【登録課題との適合総評】2文\n【課題を解決できる理由】候補企業名を正確に使い、各社1文\n【推奨初回DM】80文字以内\n推測や「可能性がある」という表現は禁止です。登録課題にない事実を作らず、すべて架空データであることを最後に明記してください。`;

    try {
      const ollamaResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: OLLAMA_MODEL, prompt: isConversation ? conversationPrompt : prompt, stream: false, think: false, options: { temperature: 0.15, num_predict: 600 } }),
        signal: AbortSignal.timeout(120000),
      });
      if (!ollamaResponse.ok) throw new Error(`Ollama returned ${ollamaResponse.status}`);
      const result = await ollamaResponse.json();
      const adjustment = matchMode === 'exact' ? '' : `【条件調整】${conditionNote}で近い登録課題を表示しています。\n`;
      return NextResponse.json(isConversation
        ? { model: OLLAMA_MODEL, reply: `${adjustment}${result.response}`, candidates, matchMode, conditionNote, aiAvailable: true }
        : { model: OLLAMA_MODEL, analysis: `${adjustment}${result.response}`, candidates, totalMatched: matched.length, matchMode, conditionNote, aiAvailable: true });
    } catch {
      return NextResponse.json(isConversation
        ? { model: OLLAMA_MODEL, reply: `${conditionNote}の登録課題を表示しています。Ollamaに接続できないため、AIの説明だけを省略しました。`, candidates, matchMode, conditionNote, aiAvailable: false }
        : { model: OLLAMA_MODEL, analysis: `${conditionNote}の登録課題を表示しています。Ollamaを起動すると、登録課題との適合理由も生成されます。`, candidates, totalMatched: matched.length, matchMode, conditionNote, aiAvailable: false });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ollama分析に失敗しました';
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
