import { STEPS } from '../constants';
import type { Brief, BriefInput } from '../types';

const API_URL: string = 'http://localhost:8000';

export async function generateBrief(input: BriefInput, onStep?: (i: number) => void): Promise<Brief> {
  let step = 0;
  onStep?.(step);
  const timer = window.setInterval(() => { step = Math.min(step + 1, STEPS.length - 1); onStep?.(step); }, 1500);
  console.log(JSON.stringify(input));
  try {
    const res = await fetch(`${API_URL}/api/briefs/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { detail?: unknown } | null;
      throw new Error(typeof body?.detail === 'string' ? body.detail : `Server error (${res.status})`);
    }
    return (await res.json()) as Brief;
  } catch (err) {
    if (err instanceof TypeError) throw new Error('Cannot reach the BriefAI server. Is uvicorn running?');
    throw err;
  } finally {
    window.clearInterval(timer);
  }
}

// export default function generateBrief(input:BriefInput){
//   console.log(JSON.stringify(input));
// }
