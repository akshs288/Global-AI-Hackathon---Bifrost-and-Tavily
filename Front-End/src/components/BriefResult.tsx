import type { ReactNode } from "react";
import {
  Building2, ClipboardList, CircleHelp, Compass, Download, MessagesSquare, Newspaper,
  Rocket, Scale, Swords, TrendingUp, Users, type LucideIcon,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import type { Brief, EvidenceItem, Source } from "../types";
import { exportBriefPdf } from "../utils/pdf";
import { fmtDate } from "../utils/storage";

const Empty = () => <p className="muted">No information available.</p>;

const UL = ({ items = [] }: { items?: string[] }) =>
  items.length ? (
    <ul>{items.map((text, i) => <li key={i}>{text}</li>)}</ul>
  ) : (
    <Empty />
  );

/** Inline "Sources" badge; the list opens on hover, keyboard focus or tap. */
function Sources({ ids = [], sources }: { ids?: string[]; sources: Source[] }) {
  const used = sources.filter((s) => ids.includes(s.id));
  if (!used.length) return null;
  return (
    <span className="sources" tabIndex={0} role="group" aria-label={`${used.length} sources`}>
      <span className="sources-badge">Sources · {used.length}</span>
      <span className="sources-list">
        {used.map((s, i) => (
          <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" title={s.title || s.url}>
            {s.title || `Source ${i + 1}`}
          </a>
        ))}
      </span>
    </span>
  );
}

function EvidenceList({ items = [], sources }: { items?: EvidenceItem[]; sources: Source[] }) {
  if (!items.length) return <Empty />;
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>
          {item.text}
          <Sources ids={item.evidenceIds} sources={sources} />
        </li>
      ))}
    </ul>
  );
}

interface Section { title: string; icon: LucideIcon; body: ReactNode }

// Title, icon and content live together so they can never drift out of order.
function buildSections(b: Brief): Section[] {
  const src = b.sources ?? [];
  const o = b.overview;
  return [
    {
      title: "Company Overview", icon: Building2, body: (
        <>
          <dl className="kv">
            <dt>Description</dt><dd>{o.description}</dd>
            <dt>Industry</dt><dd>{o.industry}</dd>
            <dt>Headquarters</dt><dd>{o.hq}</dd>
            <dt>Products</dt><dd>{o.products}</dd>
            <dt>Business model</dt><dd>{o.model}</dd>
          </dl>
          <Sources ids={o.evidenceIds} sources={src} />
        </>
      ),
    },
    { title: "Strategic Roadmap", icon: Compass, body: <EvidenceList items={b.strategicRoadmap} sources={src} /> },
    { title: "Expansion Blueprint", icon: Rocket, body: <EvidenceList items={b.expansionBlueprint} sources={src} /> },
    { title: "Meeting Preparation Summary", icon: ClipboardList, body: <EvidenceList items={b.meetingPreparationSummary} sources={src} /> },
    {
      title: "Recent Company News", icon: Newspaper, body: b.news?.length ? (
        <div className="items">
          {b.news.map((n, i) => (
            <div className="item" key={i}>
              <small>{n.date}</small>
              <b>{n.title}</b>
              <p>{n.summary}</p>
              <Sources ids={n.evidenceIds} sources={src} />
            </div>
          ))}
        </div>
      ) : <Empty />,
    },
    {
      title: "Key Executives", icon: Users, body: b.executives?.length ? (
        <div className="items">
          {b.executives.map((e, i) => (
            <div className="item" key={i}>
              <b>{e.name}</b>
              <small>{e.role}</small>
              <p>{e.description}</p>
              <Sources ids={e.evidenceIds} sources={src} />
            </div>
          ))}
        </div>
      ) : <Empty />,
    },
    { title: "Meeting Talking Points", icon: MessagesSquare, body: <UL items={b.talkingPoints} /> },
    {
      title: "Competitor Analysis", icon: Swords, body: (
        <>
          {b.competitors?.length ? (
            <div className="items">
              {b.competitors.map((c, i) => (
                <div className="item" key={i}>
                  <b>{c.name}</b>
                  <p>{c.positioning}</p>
                  <small>Advantage: {c.advantage}</small>
                  <Sources ids={c.evidenceIds} sources={src} />
                </div>
              ))}
            </div>
          ) : <Empty />}
          {b.competitorNote && (
            <p style={{ marginTop: 10 }}>
              {b.competitorNote}
              <Sources ids={b.competitorNoteEvidenceIds} sources={src} />
            </p>
          )}
        </>
      ),
    },
    { title: "Potential Questions to Ask", icon: CircleHelp, body: <UL items={b.questions} /> },
    {
      title: "Risks and Opportunities", icon: Scale, body: (
        <>
          <p><b>Risks</b></p>
          <EvidenceList items={b.risks} sources={src} />
          <p style={{ marginTop: 10 }}><b>Opportunities</b></p>
          <EvidenceList items={b.opportunities} sources={src} />
          <p style={{ marginTop: 10 }}><b>Needs further investigation</b></p>
          <UL items={b.investigate} />
        </>
      ),
    },
    { title: "Industry Trends", icon: TrendingUp, body: <EvidenceList items={b.trends} sources={src} /> },
  ];
}

export default function BriefResult({ brief }: { brief: Brief }) {
  const { toast } = useApp();
  const sections = buildSections(brief);

  const onExport = (): void => {
    try {
      exportBriefPdf(brief);
      toast("PDF exported successfully");
    } catch {
      toast("PDF export failed");
    }
  };

  return (
    <section className="card glass result" aria-live="polite">
      <div className="r-head">
        <h2>{brief.company} brief</h2>
        <button className="btn ghost" onClick={onExport}>
          <Download />
          <span>Export PDF</span>
        </button>
      </div>
      <div className="summary">
        <div><span>Company:</span> {brief.company}</div>
        <div><span>Meeting date:</span> {fmtDate(brief.date)}</div>
        <div><span>Query:</span> {brief.query}</div>
        <div><span>Generated:</span> {new Date(brief.generatedAt).toLocaleString()}</div>
      </div>
      {sections.map(({ title, icon: Icon, body }, i) => (
        <details key={title} open={i < 2}>
          <summary><Icon />{title}</summary>
          <div className="body">{body}</div>
        </details>
      ))}
    </section>
  );
}
