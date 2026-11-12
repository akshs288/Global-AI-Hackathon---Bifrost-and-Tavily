export interface BriefInput { company: string; date: string; query: string }
export interface Overview { description: string; industry: string; hq: string; products: string; model: string }
export interface NewsItem { date: string; title: string; summary: string }
export interface Executive { name: string; role: string; description: string }
export interface Competitor { name: string; positioning: string; advantage: string }
export interface Brief extends BriefInput {
  id: string;
  generatedAt: string;
  overview: Overview;
  news: NewsItem[];
  executives: Executive[];
  talkingPoints: string[];
  competitors: Competitor[];
  competitorNote: string;
  questions: string[];
  risks: string[];
  opportunities: string[];
  investigate: string[];
  trends: string[];
}
export interface Settings { animations: boolean; compactSidebar: boolean }
export interface ToastItem { id: number; message: string }
export interface DialogState { title: string; message: string; okLabel: string; resolve: (v: boolean) => void }
