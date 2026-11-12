import { STEPS } from '../constants';
import type { Brief, BriefInput } from '../types';
import { fmtDate } from '../utils/storage';

// All data below is SAMPLE data. Replace generateBrief() with a FastAPI call later.
type News = [number, string, string];
type Trio = [string, string, string];
interface Profile {
  name: string; description: string; industry: string; hq: string; products: string; model: string;
  news: News[]; execs: Trio[]; comps: Trio[]; trends: string[]; risks: string[]; opps: string[];
}

const PROFILES: Record<string, Profile> = {
  google: { name: 'Google', description: 'Global technology company focused on search, advertising, cloud computing, and AI, operating as the main subsidiary of Alphabet.', industry: 'Technology / Internet', hq: 'Mountain View, California, USA', products: 'Search, Ads, YouTube, Android, Google Cloud, Workspace, Gemini AI', model: 'Advertising-led, with growing subscription and cloud revenue.',
    news: [[12, 'Expands enterprise AI offerings', 'Sample entry: new AI tooling bundled into Cloud and Workspace plans.'], [34, 'Announces data center investment', 'Sample entry: added infrastructure capacity for AI workloads.'], [58, 'Updates developer platform', 'Sample entry: new APIs and pricing for partners.']],
    execs: [['Sundar Pichai', 'CEO, Alphabet & Google', 'Sets company-wide strategy with an AI-first focus.'], ['Anat Ashkenazi', 'CFO', 'Oversees capital allocation and investor relations.'], ['Thomas Kurian', 'CEO, Google Cloud', 'Leads enterprise cloud and partner ecosystem.']],
    comps: [['Microsoft', 'Enterprise software and cloud with AI partnerships', 'Deep enterprise distribution'], ['Amazon', 'Market-leading cloud and commerce platform', 'Scale and logistics'], ['Meta', 'Social and advertising with open AI models', 'Audience engagement']],
    trends: ['Generative AI embedded in core products', 'Pressure on traditional search models', 'Rising regulatory scrutiny of platforms', 'Cloud and AI infrastructure spending growth'],
    risks: ['Antitrust and regulatory exposure', 'Dependence on advertising revenue'], opps: ['Enterprise AI adoption', 'Cloud partnerships and marketplaces'] },
  microsoft: { name: 'Microsoft', description: 'Software and cloud company serving consumers and enterprises through productivity tools, Azure, gaming, and AI services.', industry: 'Software / Cloud', hq: 'Redmond, Washington, USA', products: 'Azure, Microsoft 365, Dynamics, GitHub, Windows, Copilot', model: 'Recurring software subscriptions and consumption-based cloud.',
    news: [[9, 'Copilot rollout widens', 'Sample entry: AI assistant added to more plans.'], [27, 'Azure partner program refresh', 'Sample entry: updated incentives for ISVs and resellers.'], [51, 'Security initiative update', 'Sample entry: expanded enterprise security commitments.']],
    execs: [['Satya Nadella', 'Chairman & CEO', 'Drives cloud and AI transformation.'], ['Amy Hood', 'CFO', 'Leads financial planning and capital strategy.'], ['Judson Althoff', 'Commercial CEO', 'Runs commercial sales and partner operations.']],
    comps: [['Google', 'Cloud, Workspace, and AI-first products', 'AI research depth'], ['Amazon (AWS)', 'Largest cloud infrastructure provider', 'Breadth of services'], ['Salesforce', 'CRM and enterprise apps', 'Customer data platform']],
    trends: ['Copilot-style AI assistants in workflows', 'Hybrid and multi-cloud strategies', 'Security as a buying criterion', 'Consolidation of enterprise suites'],
    risks: ['Cloud capacity constraints', 'Competition in AI model access'], opps: ['AI upsell across installed base', 'Partner-led industry solutions'] },
  zomato: { name: 'Zomato', description: 'Indian consumer internet company operating food delivery, quick commerce, and dining services (parent now operates as Eternal).', industry: 'Food Tech / Consumer Internet', hq: 'Gurugram, India', products: 'Food delivery, Blinkit quick commerce, Hyperpure supply, dining tools', model: 'Commissions, delivery fees, advertising, and B2B supply.',
    news: [[7, 'Quick commerce expansion', 'Sample entry: new dark stores across tier-1 cities.'], [30, 'Restaurant ad products launched', 'Sample entry: new promotion formats for partners.'], [62, 'Loyalty program changes', 'Sample entry: revised benefits for frequent users.']],
    execs: [['Deepinder Goyal', 'Founder & CEO', 'Sets product vision and long-term strategy.'], ['Akshant Goyal', 'CFO', 'Manages financial strategy and reporting.'], ['Albinder Dhindsa', 'CEO, Blinkit', 'Leads the quick commerce business.']],
    comps: [['Swiggy', 'Food delivery and Instamart', 'City-level execution'], ['Zepto', 'Pure-play quick commerce', 'Delivery speed'], ['Amazon / Flipkart', 'E-commerce giants entering quick commerce', 'Capital and catalog']],
    trends: ['Quick commerce growth in metros', 'Rising ad revenue from restaurants', 'Gig-worker regulation developments', 'Profitability focus after growth phase'],
    risks: ['Intense price competition', 'Labor and regulatory changes'], opps: ['Ad products for brands', 'Tier-2 city expansion'] }
};

const generic = (n: string): Profile => ({
  name: n, description: `${n} is a sample profile built from a template. Replace with verified research before relying on it.`, industry: 'Business Services (sample)', hq: 'Not specified (sample)', products: 'Core products and services (sample)', model: 'Mix of direct sales and recurring contracts (sample)',
  news: [[10, `${n} announces strategic update`, 'Sample entry: illustrative announcement.'], [32, `${n} reports operating milestones`, 'Sample entry: illustrative update.'], [55, `${n} explores new partnerships`, 'Sample entry: illustrative partnership news.']],
  execs: [['Chief Executive Officer', 'CEO', 'Owns overall strategy and key partnerships.'], ['Chief Financial Officer', 'CFO', 'Owns budgets, pricing, and approvals.'], ['Chief Technology Officer', 'CTO', 'Owns technical roadmap and vendor choices.']],
  comps: [['Established Leader', 'Largest incumbent in the category', 'Brand and scale'], ['Fast-Growing Challenger', 'Newer, product-led competitor', 'Speed and pricing'], ['Niche Specialist', 'Focused on a narrow segment', 'Depth of expertise']],
  trends: ['AI adoption across business functions', 'Shift to subscription pricing', 'Increased focus on efficiency', 'Customer demand for integrations'],
  risks: ['Market competition', 'Dependence on key customers'], opps: ['Adjacent market expansion', 'Strategic partnerships']
});

interface Angle { re: RegExp; label: string; points: string[]; questions: string[] }
const ANGLES: Angle[] = [
  { re: /partner|alliance|collab/i, label: 'partnership', points: ['Define shared goals and where both sides gain', 'Explore co-selling or integration opportunities', 'Clarify resource commitments and decision makers', 'Agree a pilot scope and success metrics'], questions: ['Which partner models have worked best for you so far?', 'What would make this partnership a priority this year?', 'How do you measure partner success?'] },
  { re: /sale|sell|vendor|buy|pitch|customer/i, label: 'sales', points: ['Map our value to their current priorities', 'Understand budget cycles and buying process', 'Share relevant customer proof points', 'Agree concrete next steps and timeline'], questions: ['What is driving this initiative now?', 'Who else is involved in the decision?', 'What does success look like in the first 90 days?'] },
  { re: /invest|fund|valuation|due diligence/i, label: 'investment', points: ['Probe growth drivers and unit economics', 'Understand capital allocation priorities', 'Assess competitive moat and durability', 'Discuss governance and exit considerations'], questions: ['What are the largest drivers of margin change?', 'How is capital prioritized across business lines?', 'What are the biggest risks to your plan?'] },
  { re: /./, label: 'general', points: ['Clarify the purpose and desired outcome of the meeting', 'Understand current priorities and challenges', 'Identify areas of mutual interest', 'Agree on follow-ups and owners'], questions: ['What are your top priorities for the next two quarters?', 'What challenges are you trying to solve right now?', 'How can we be most useful to you?'] }
];

const sleep = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));
const clip = (s: string, n: number): string => (s.length > n ? `${s.slice(0, n)}…` : s);

export async function generateBrief(input: BriefInput, onStep?: (i: number) => void): Promise<Brief> {
  for (let i = 0; i < STEPS.length; i++) { onStep?.(i); await sleep(800); }
  const key = input.company.toLowerCase().replace(/[^a-z]/g, '');
  const p = PROFILES[key] ?? generic(input.company.trim());
  const a = ANGLES.find(x => x.re.test(input.query)) ?? ANGLES[ANGLES.length - 1];
  const now = new Date();
  return {
    ...input, company: p.name, id: `b${now.getTime()}`, generatedAt: now.toISOString(),
    overview: { description: p.description, industry: p.industry, hq: p.hq, products: p.products, model: p.model },
    news: p.news.map(([d, title, summary]) => ({ date: fmtDate(Date.now() - d * 864e5), title, summary })),
    executives: p.execs.map(([name, role, description]) => ({ name, role, description })),
    talkingPoints: [...a.points, `Tie discussion back to your goal: "${clip(input.query, 80)}"`],
    competitors: p.comps.map(([name, positioning, advantage]) => ({ name, positioning, advantage })),
    competitorNote: `${p.name} competes on differentiation; compare pricing, integrations, and support depth before the ${a.label} conversation.`,
    questions: [...a.questions, `Given ${p.name}'s current direction, how does this relate to "${clip(input.query, 60)}"?`, 'What would you want us to know that is not in public materials?'],
    risks: p.risks, opportunities: p.opps, investigate: ['Verify recent news from primary sources', 'Confirm current executive roster'], trends: p.trends
  };
}
