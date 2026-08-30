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
      const prompt = `日本のB2B営業で使う初回${channel}を1通作成してください。説明や分析は不要です。\n\n${businessMailKnowledge}\n\n送信者の立場:自社の営業担当\n送信先:${company.companyName} ${company.targetDepartment} ${recipientRole}\n相手企業の事業:${company.businessDescription}\n営業のきっかけ:${company.demandSignal}、${company.demandSignalDetail}\n提案商材:${product.name}（${product.description}）\n目的:${objective}\n文体:${tone}\n追加条件:${extra || 'なし'}\n\n相手企業の需要シグナルと商材の価値を自然につなげ、売り込みすぎず、相手が答えやすい具体的な次の行動を1つ示してください。入力にない人物名、導入実績、数値、価格、日程は作らないでください。${channel === 'メール' ? '件名を1行、空行、本文を250〜400文字で書いてください。' : '件名は不要。本文を120〜220文字で書いてください。'} 完成文だけを出力してください。`;
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
        : `あなたは架空企業「${company.companyName}」の${company.targetDepartment} ${company.targetRole}です。営業DMの模擬演習です。あなたはDMを受け取る顧客側であり、営業担当ではありません。商品を売ったり提案したりせず、顧客側の返事だけを書いてください。\n企業情報:${company.industryName}、${company.businessDescription}、需要シグナル:${company.demandSignal}\n提案を受ける商材:${product.name}（${product.description}）\n会話履歴:\n${conversation || 'まだ会話はありません'}\n営業担当から届いた新しいDM:${message || '（最初の連絡を待っています）'}\n\n返答はDM風の自然な日本語で1〜3文。簡単に購入を決めず、内容に応じて質問・懸念・断りを示してください。「ご提案ありがとうございます」など顧客側の言葉から始めてください。企業情報にない事実は作らないでください。`;
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
    const candidates = database.companies
      .filter(company => !conditions.excludeExisting || !company.existingCustomer)
      .filter(company => conditions.industry === 'all'
        ? productIndustries.length === 0 || productIndustries.some(industry => company.industryName.includes(industry) || industry.includes(company.industryName))
        : company.industryName === conditions.industry)
      .filter(company => conditions.prefecture === 'all' || company.prefecture === conditions.prefecture)
      .filter(company => company.employees >= conditions.minEmployees)
      .filter(company => conditions.maxEmployees === 0 || company.employees <= conditions.maxEmployees)
      .filter(company => company.salesScore >= conditions.minScore)
      .filter(company => !conditions.demandSignal || `${company.demandSignal} ${company.demandSignalDetail} ${company.businessDescription}`.includes(conditions.demandSignal))
      .sort((a, b) => b.salesScore - a.salesScore)
      .slice(0, conditions.limit);

    if (candidates.length === 0) {
      return NextResponse.json({ model: OLLAMA_MODEL, analysis: '指定条件に一致する企業がありません。業界、所在地、規模、営業スコアの条件を緩めて再検索してください。', candidates: [], totalMatched: 0, aiAvailable: true });
    }

    const companyContext = candidates.map((company, index) =>
      `${index + 1}. ${company.companyName}｜${company.industryName}｜${company.prefecture}｜従業員${company.employees}名｜営業スコア${company.salesScore}｜需要シグナル:${company.demandSignal}｜事業:${company.businessDescription}｜推奨部署:${company.targetDepartment}`
    ).join('\n');
    const conversation = Array.isArray(body.conversation)
      ? body.conversation.slice(-8).map((message: { role?: string; content?: string }) => `${message.role === 'user' ? 'ユーザー' : 'AI'}: ${String(message.content ?? '')}`).join('\n')
      : '';
    const userMessage = String(body.message ?? '').trim();
    const isConversation = body.mode === 'chat' && userMessage;
    const conversationPrompt = `あなたは日本のB2B営業支援AIです。現在選択中の商品、検索条件、検索結果を前提にユーザーと対話してください。\n商品: ${product.name}（${product.description}）\n検索条件: 業界=${conditions.industry}, 所在地=${conditions.prefecture}, 従業員=${conditions.minEmployees}〜${conditions.maxEmployees || '上限なし'}名, 最低スコア=${conditions.minScore}, 需要キーワード=${conditions.demandSignal || '指定なし'}\n検索結果:\n${companyContext}\n\n直近の会話:\n${conversation || 'なし'}\nユーザー: ${userMessage}\n\n検索結果にない企業や事実を作らず、日本語で具体的かつ簡潔に答えてください。必要なら企業名を正確に列挙してください。`;
    const prompt = `あなたは日本のB2B営業戦略アシスタントです。以下の商品と、ユーザーが指定した条件に合致した架空企業候補を分析してください。\n\n商品名: ${product.name}\nカテゴリー: ${product.category}\n概要: ${product.description}\n商品の想定対象業界: ${product.targetIndustries}\n指定条件: 業界=${conditions.industry}, 所在地=${conditions.prefecture}, 従業員=${conditions.minEmployees}〜${conditions.maxEmployees || '上限なし'}名, 最低スコア=${conditions.minScore}, 需要キーワード=${conditions.demandSignal || '指定なし'}\n\n候補企業:\n${companyContext}\n\n次の形式で日本語で簡潔に回答してください。\n【検索結果の総評】2文\n【商品との適合理由】候補企業名を正確に使い、各社1文\n【推奨初回トーク】80文字以内\n与えられていない情報は作らず、すべて架空データの分析であることを最後に明記してください。`;

    try {
      const ollamaResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: OLLAMA_MODEL, prompt: isConversation ? conversationPrompt : prompt, stream: false, think: false, options: { temperature: 0.15, num_predict: 600 } }),
        signal: AbortSignal.timeout(120000),
      });
      if (!ollamaResponse.ok) throw new Error(`Ollama returned ${ollamaResponse.status}`);
      const result = await ollamaResponse.json();
      return NextResponse.json(isConversation
        ? { model: OLLAMA_MODEL, reply: result.response, candidates, aiAvailable: true }
        : { model: OLLAMA_MODEL, analysis: result.response, candidates, totalMatched: candidates.length, aiAvailable: true });
    } catch {
      return NextResponse.json(isConversation
        ? { model: OLLAMA_MODEL, reply: 'Ollamaに接続できません。Ollamaを起動してからもう一度質問してください。', candidates, aiAvailable: false }
        : { model: OLLAMA_MODEL, analysis: '条件に一致した企業を営業スコア順に表示しています。Ollamaを起動すると、商品との適合理由と推奨トークも生成されます。', candidates, totalMatched: candidates.length, aiAvailable: false });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ollama分析に失敗しました';
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
