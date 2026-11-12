import { Building2, Eye, Inbox, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import type { Brief } from "../types";
import { fmtDate } from "../utils/storage";

export default function Briefs() {
  const { briefs, deleteBrief, confirm, toast, setCurrent, newMeeting } =
    useApp();
  const navigate = useNavigate();

  const view = (b: Brief): void => {
    setCurrent(b);
    navigate("/");
  };
  const remove = async (b: Brief): Promise<void> => {
    if (
      await confirm(
        "Delete this brief?",
        `The brief for ${b.company} will be permanently removed.`,
      )
    ) {
      deleteBrief(b.id);
      toast("Brief deleted");
    }
  };

  return (
    <section className="view active">
      <div className="hero small">
        <h2>Previous briefs</h2>
        <p>Reopen or remove the briefs you have generated.</p>
      </div>
      <div className="list">
        {briefs.length === 0 ? (
          <div className="empty glass">
            <Inbox />
            <h3>No briefs yet</h3>
            <p className="muted">
              Generate your first brief and it will be saved here.
            </p>
            <button className="btn primary" onClick={newMeeting}>
              <Plus />
              <span>New Meeting</span>
            </button>
          </div>
        ) : (
          briefs.map((b) => (
            <article className="card glass brief-card" key={b.id}>
              <h3>
                <Building2 />
                {b.company}
              </h3>
              <p>
                {b.query.length > 90 ? `${b.query.slice(0, 90)}…` : b.query}
              </p>
              <div className="meta">
                <span>Meeting: {fmtDate(b.date)}</span>
                <span>Generated: {fmtDate(b.generatedAt)}</span>
              </div>
              <div className="row" style={{ padding: 0 }}>
                <button className="btn primary" onClick={() => view(b)}>
                  <Eye />
                  <span>View brief</span>
                </button>
                <button
                  className="btn danger"
                  aria-label={`Delete brief for ${b.company}`}
                  onClick={() => void remove(b)}
                >
                  <Trash2 />
                  <span>Delete</span>
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
