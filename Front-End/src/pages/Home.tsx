import { useState, type ChangeEvent, type FormEvent } from "react";
import { WandSparkles } from "lucide-react";
import BriefResult from "../components/BriefResult";
import { EXAMPLES, STEPS } from "../constants";
import { useApp } from "../context/AppContext";
import { generateBrief } from "../services/briefService";
import type { BriefInput } from "../types";

type Errors = Partial<Record<keyof BriefInput, string>>;
const MSG: Record<keyof BriefInput, string> = {
  company: "Enter a company name.",
  date: "Choose a meeting date.",
  query: "Tell us what you want to know.",
};

export default function Home() {
  const { current, setCurrent, addBrief, toast } = useApp();
  const [form, setForm] = useState<BriefInput>(() =>
    current
      ? { company: current.company, date: current.date, query: current.query }
      : { company: "", date: new Date().toISOString().slice(0, 10), query: "" },
  );
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const set = (k: keyof BriefInput, v: string): void => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    const errs: Errors = {};
    (Object.keys(MSG) as (keyof BriefInput)[]).forEach((k) => {
      if (!form[k].trim()) errs[k] = MSG[k];
    });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setStep(0);
    setCurrent(null);
    try {
      const brief = await generateBrief(
        {
          company: form.company.trim(),
          date: form.date,
          query: form.query.trim(),
        },
        setStep,
      );
      addBrief(brief);
      setCurrent(brief);
      toast("Brief generated and saved");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Could not generate the brief",
      );
    } finally {
      setLoading(false);
    }
  };

  const hasResult = loading || current !== null;
  const field = (k: keyof BriefInput) => ({
    id: k,
    value: form[k],
    className: errors[k] ? "invalid" : "",
    onChange: (e: ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) =>
      set(k, e.target.value),
  });

  return (
    <section className="view active">
      <div className="hero">
        <h2>Walk into every meeting prepared.</h2>
        <p>
          Your AI-powered research assistant for smarter conversations, better
          questions, and more confident decisions.
        </p>
      </div>
      <div className={`split ${hasResult ? "has-result" : ""}`}>
        <form
          className={`card glass form ${loading ? "loading" : ""}`}
          onSubmit={(e) => void onSubmit(e)}
          noValidate
        >
          <h3>
            <WandSparkles />
            Meeting brief generator
          </h3>
          <label htmlFor="company">Company name</label>
          <input
            {...field("company")}
            type="text"
            placeholder="e.g. Google, Microsoft, Zomato..."
            autoComplete="off"
            required
          />
          <small className="err">{errors.company}</small>
          <label htmlFor="date">Meeting date</label>
          <input {...field("date")} type="date" required />
          <small className="err">{errors.date}</small>
          <label htmlFor="query">Meeting query</label>
          <textarea
            {...field("query")}
            rows={5}
            placeholder="What would you like to know before this meeting?"
            required
          />
          <small className="err">{errors.query}</small>
          <div className="chips" aria-label="Example queries">
            {EXAMPLES.map((x) => (
              <button
                type="button"
                className="chip"
                key={x}
                onClick={() => set("query", x)}
              >
                {x}
              </button>
            ))}
          </div>
          <button className="btn primary big" type="submit" disabled={loading}>
            <span className="spin" />
            {!loading && <WandSparkles />}
            <span>{loading ? "Generating..." : "Generate Brief"}</span>
          </button>
        </form>
        {loading && (
          <section className="card glass result" aria-live="polite">
            <div className="loader">
              <div className="orb" />
              <b>{STEPS[step]}</b>
              <span className="muted">
                Building a sample brief for {form.company}
              </span>
            </div>
          </section>
        )}
        {!loading && current && <BriefResult brief={current} />}
      </div>
    </section>
  );
}
