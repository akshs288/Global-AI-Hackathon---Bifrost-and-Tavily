import type { ReactNode } from "react";
import { Download, TriangleAlert } from "lucide-react";
import { SECTIONS } from "../constants";
import { useApp } from "../context/AppContext";
import type { Brief, EvidenceItem, Source } from "../types";
import { exportBriefPdf } from "../utils/pdf";
import { fmtDate } from "../utils/storage";

const UL = ({ items = [] }: { items?: string[] }) => (
  <ul>
    {items.map((i, k) => (
      <li key={k}>{i}</li>
    ))}
  </ul>
);

function EvidenceLinks({ sourceIds, sources }: { sourceIds: string[]; sources: Source[] }) {
  const evidence = sources.filter((source) => sourceIds.includes(source.id));

  if (!evidence.length) return null;

  return (
    <small>
      Sources: {evidence.map((source, index) => (
        <span key={source.id}>
          {index > 0 && ", "}
          <a href={source.url} target="_blank" rel="noreferrer">
            {source.title || `Source ${index + 1}`}
          </a>
        </span>
      ))}
    </small>
  );
}

function EvidenceList({ items, sources }: { items: EvidenceItem[]; sources: Source[] }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {item.text}
          <EvidenceLinks sourceIds={item.evidenceIds ?? []} sources={sources} />
        </li>
      ))}
    </ul>
  );
}

function bodies(b: Brief): ReactNode[] {
  const o = b.overview;
  return [
    <dl className="kv">
      <dt>Description</dt>
      <dd>{o.description}</dd>
      <dt>Industry</dt>
      <dd>{o.industry}</dd>
      <dt>Headquarters</dt>
      <dd>{o.hq}</dd>
      <dt>Products</dt>
      <dd>{o.products}</dd>
      <dt>Business model</dt>
      <dd>{o.model}</dd>
      <dt>Sources</dt>
      <dd><EvidenceLinks sourceIds={o.evidenceIds ?? []} sources={b.sources ?? []} /></dd>
    </dl>,
    <EvidenceList items={b.strategicRoadmap ?? []} sources={b.sources ?? []} />,
    <EvidenceList items={b.expansionBlueprint ?? []} sources={b.sources ?? []} />,
    <EvidenceList items={b.meetingPreparationSummary ?? []} sources={b.sources ?? []} />,
    <div className="items">
      {b.news.map((n, k) => (
        <div className="item" key={k}>
          <small>{n.date}</small>
          <b>{n.title}</b>
          <p>{n.summary}</p>
          <EvidenceLinks sourceIds={n.evidenceIds ?? []} sources={b.sources ?? []} />
        </div>
      ))}
    </div>,
    <div className="items">
      {b.executives.map((e, k) => (
        <div className="item" key={k}>
          <b>{e.name}</b>
          <small>{e.role}</small>
          <p>{e.description}</p>
          <EvidenceLinks sourceIds={e.evidenceIds ?? []} sources={b.sources ?? []} />
        </div>
      ))}
    </div>,
    <UL items={b.talkingPoints} />,
    <>
      <div className="items">
        {b.competitors.map((c, k) => (
          <div className="item" key={k}>
            <b>{c.name}</b>
            <p>{c.positioning}</p>
            <small>Advantage: {c.advantage}</small>
            <EvidenceLinks sourceIds={c.evidenceIds ?? []} sources={b.sources ?? []} />
          </div>
        ))}
      </div>
      <p style={{ marginTop: 10 }}>
        {b.competitorNote}
        <EvidenceLinks sourceIds={b.competitorNoteEvidenceIds ?? []} sources={b.sources ?? []} />
      </p>
    </>,
    <UL items={b.questions} />,
    <>
      <p>
        <b>Risks</b>
      </p>
      <EvidenceList items={b.risks} sources={b.sources ?? []} />
      <p style={{ marginTop: 10 }}>
        <b>Opportunities</b>
      </p>
      <EvidenceList items={b.opportunities} sources={b.sources ?? []} />
      <p style={{ marginTop: 10 }}>
        <b>Needs further investigation</b>
      </p>
      <UL items={b.investigate} />
    </>,
    <EvidenceList items={b.trends} sources={b.sources ?? []} />,
  ];
}

export default function BriefResult({ brief }: { brief: Brief }) {
  const { toast } = useApp();
  const content = bodies(brief);
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
      {/* <div className="demo">
        <TriangleAlert />
        <span>
          Demo content generated from sample data. Not verified live research.
        </span>
      </div> */}
      <div className="summary">
        <div>
          <span>Company:</span> {brief.company}
        </div>
        <div>
          <span>Meeting date:</span> {fmtDate(brief.date)}
        </div>
        <div>
          <span>Query:</span> {brief.query}
        </div>
        <div>
          <span>Generated:</span> {new Date(brief.generatedAt).toLocaleString()}
        </div>
      </div>
      {SECTIONS.map(({ title, icon: Icon }, i) => (
        <details key={title} open={i < 2}>
          <summary>
            <Icon />
            {title}
          </summary>
          <div className="body">{content[i]}</div>
        </details>
      ))}
    </section>
  );
}
