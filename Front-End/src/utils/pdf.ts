import { jsPDF } from 'jspdf';
import { SECTIONS } from '../constants';
import type { Brief } from '../types';
import { fmtDate } from './storage';

type RGB = [number, number, number];

export function exportBriefPdf(b: Brief): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 50, TW = W - M * 2;
  let y = M;
  const need = (h: number): void => { if (y + h > H - M) { doc.addPage(); y = M; } };
  const write = (t: string, size: number, style: 'normal' | 'bold', c: RGB, gap = 4): void => {
    doc.setFont('helvetica', style); doc.setFontSize(size); doc.setTextColor(c[0], c[1], c[2]);
    (doc.splitTextToSize(t, TW) as string[]).forEach(line => { need(size * 1.4); doc.text(line, M, y); y += size * 1.4; });
    y += gap;
  };
  const o = b.overview;
  const blocks: string[][] = [
    [`Description: ${o.description}`, `Industry: ${o.industry}`, `Headquarters: ${o.hq}`, `Products: ${o.products}`, `Business model: ${o.model}`],
    b.news.map(n => `${n.date} (sample) – ${n.title}: ${n.summary}`),
    b.executives.map(e => `${e.name}, ${e.role} – ${e.description}`),
    b.talkingPoints,
    [...b.competitors.map(c => `${c.name}: ${c.positioning}. Advantage: ${c.advantage}`), b.competitorNote],
    b.questions,
    ['Risks:', ...b.risks, 'Opportunities:', ...b.opportunities, 'Further investigation:', ...b.investigate],
    b.trends
  ];
  doc.setFillColor(3, 4, 17); doc.rect(0, 0, W, 90, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.setTextColor(255, 255, 255); doc.text(`${b.company} – Meeting Brief`, M, 50);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(185, 189, 240);
  doc.text('BriefAI · Demo content generated from sample data, not verified research', M, 70);
  y = 115;
  write(`Meeting date: ${fmtDate(b.date)}`, 11, 'normal', [40, 40, 60]);
  write(`Query: ${b.query}`, 11, 'normal', [40, 40, 60]);
  write(`Generated: ${new Date(b.generatedAt).toLocaleString()}`, 10, 'normal', [110, 110, 130], 10);
  SECTIONS.forEach((s, i) => {
    need(50); y += 8;
    doc.setDrawColor(124, 127, 242); doc.setLineWidth(1.5); doc.line(M, y, M + 30, y); y += 18;
    write(`${i + 1}. ${s.title}`, 14, 'bold', [30, 32, 90], 6);
    blocks[i].forEach(l => { const head = l.endsWith(':'); write(head ? l : `• ${l}`, 10.5, head ? 'bold' : 'normal', [50, 50, 70], 3); });
  });
  const n = doc.getNumberOfPages();
  for (let p = 1; p <= n; p++) {
    doc.setPage(p); doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(130, 130, 150);
    doc.text(`Page ${p} of ${n}`, W / 2, H - 25, { align: 'center' });
  }
  doc.save(`${b.company.replace(/\W+/g, '_')}_Meeting_Brief.pdf`);
}
