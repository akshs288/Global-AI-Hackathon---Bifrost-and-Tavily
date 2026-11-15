export interface BriefInput { company: string; date: string; query: string }
export interface Overview { description: string; industry: string; hq: string; products: string; model: string; evidenceIds: string[] }
export interface Source { id: string; title: string; url: string }
export interface NewsItem { date: string; title: string; summary: string; evidenceIds: string[] }
export interface Executive { name: string; role: string; description: string; evidenceIds: string[] }
export interface Competitor { name: string; positioning: string; advantage: string; evidenceIds: string[] }
export interface EvidenceItem { text: string; evidenceIds: string[] }
export interface Brief extends BriefInput {
  id: string;
  generatedAt: string;
  sources: Source[];
  overview: Overview;
  strategicRoadmap: EvidenceItem[];
  expansionBlueprint: EvidenceItem[];
  meetingPreparationSummary: EvidenceItem[];
  news: NewsItem[];
  executives: Executive[];
  talkingPoints: string[];
  competitors: Competitor[];
  competitorNote: string;
  competitorNoteEvidenceIds: string[];
  questions: string[];
  risks: EvidenceItem[];
  opportunities: EvidenceItem[];
  investigate: string[];
  trends: EvidenceItem[];
}
export interface Settings { animations: boolean; compactSidebar: boolean }
export interface ToastItem { id: number; message: string }
export interface DialogState { title: string; message: string; okLabel: string; resolve: (v: boolean) => void }
