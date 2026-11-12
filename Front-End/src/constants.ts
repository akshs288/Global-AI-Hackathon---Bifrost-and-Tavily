import { Building2, CircleHelp, MessagesSquare, Newspaper, Scale, Swords, TrendingUp, Users, type LucideIcon } from 'lucide-react';

export const SECTIONS: { title: string; icon: LucideIcon }[] = [
  { title: 'Company Overview', icon: Building2 },
  { title: 'Recent Company News', icon: Newspaper },
  { title: 'Key Executives', icon: Users },
  { title: 'Meeting Talking Points', icon: MessagesSquare },
  { title: 'Competitor Analysis', icon: Swords },
  { title: 'Potential Questions to Ask', icon: CircleHelp },
  { title: 'Risks and Opportunities', icon: Scale },
  { title: 'Industry Trends', icon: TrendingUp }
];
export const EXAMPLES: string[] = [
  'Prepare me for a partnership discussion.',
  'Research this company before my sales meeting.',
  'Help me prepare for a potential investment discussion.'
];
export const STEPS: string[] = [
  'Analyzing company profile...',
  'Identifying key executives...',
  'Gathering industry insights...',
  'Preparing your meeting brief...'
];
