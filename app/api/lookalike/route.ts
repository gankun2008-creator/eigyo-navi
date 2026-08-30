import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NextResponse } from 'next/server';

type Company = {
  id: string;
  companyName: string;
  industryCode: string;
  industryName: string;
  prefecture: string;
  employees: number;
  scale: string;
  revenueMillionYen: number;
  businessDescription: string;
  demandSignal: string;
  targetDepartment: string;
  salesScore: number;
  existingCustomer: boolean;
};

const numericSimilarity = (left: number, right: number) => {
  const largest = Math.max(left, right, 1);
  return Math.max(0, 1 - Math.abs(left - right) / largest);
};

const textSimilarity = (left: string, right: string) => {
  const makeTokens = (value: string) => new Set(value.replace(/[・、,.\s]/g, '').split('').filter(Boolean));
  const leftTokens = makeTokens(left);
  const rightTokens = makeTokens(right);
  const intersection = [...leftTokens].filter(token => rightTokens.has(token)).length;
  const union = new Set([...leftTokens, ...rightTokens]).size;
  return union ? intersection / union : 0;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sourceId = String(body.sourceId ?? '');
    const limit = Math.min(50, Math.max(1, Number(body.limit ?? 5)));
    const database = JSON.parse(await readFile(join(process.env.DATA_DIR ?? join(process.cwd(), 'data'), 'companies.json'), 'utf8')) as { companies: Company[] };
    const source = database.companies.find(company => company.id === sourceId);
    if (!source) return NextResponse.json({ error: '基準企業が見つかりません' }, { status: 404 });

    const matches = database.companies
      .filter(company => company.id !== source.id)
      .map(company => {
        const factors = {
          industry: company.industryCode === source.industryCode ? 35 : 0,
          scale: numericSimilarity(company.employees, source.employees) * 20,
          revenue: numericSimilarity(company.revenueMillionYen, source.revenueMillionYen) * 15,
          business: textSimilarity(company.businessDescription, source.businessDescription) * 15,
          location: company.prefecture === source.prefecture ? 5 : 0,
          signal: company.demandSignal === source.demandSignal ? 5 : 0,
          department: company.targetDepartment === source.targetDepartment ? 5 : 0,
        };
        const similarityScore = Math.round(Object.values(factors).reduce((total, value) => total + value, 0));
        const reasons = [
          factors.industry ? `同じ${source.industryName}` : '',
          factors.scale >= 15 ? `従業員規模が近い（${company.employees.toLocaleString()}名）` : '',
          factors.revenue >= 11 ? '売上規模が近い' : '',
          factors.business >= 8 ? `事業内容が類似（${company.businessDescription}）` : '',
          factors.location ? `同じ${source.prefecture}` : '',
          factors.signal ? `同じ需要シグナル「${source.demandSignal}」` : '',
          factors.department ? `同じ推奨部署「${source.targetDepartment}」` : '',
        ].filter(Boolean);
        return { company, similarityScore, reasons, factors };
      })
      .sort((a, b) => b.similarityScore - a.similarityScore || b.company.salesScore - a.company.salesScore)
      .slice(0, limit);

    return NextResponse.json({ source, matches, analyzedCount: database.companies.length - 1, methodology: '業界35%、従業員規模20%、売上15%、事業内容15%、所在地5%、需要シグナル5%、推奨部署5%' });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : '類似企業分析に失敗しました' }, { status: 500 });
  }
}
