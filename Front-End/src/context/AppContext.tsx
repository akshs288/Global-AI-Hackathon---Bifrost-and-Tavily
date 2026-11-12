import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import type { Brief, DialogState, Settings, ToastItem } from "../types";
import { loadJSON, saveJSON } from "../utils/storage";

const BKEY = "briefai.briefs",
  SKEY = "briefai.settings";

interface Ctx {
  briefs: Brief[];
  addBrief: (b: Brief) => void;
  deleteBrief: (id: string) => void;
  clearBriefs: () => void;
  settings: Settings;
  updateSettings: (p: Partial<Settings>) => void;
  toast: (message: string) => void;
  confirm: (
    title: string,
    message: string,
    okLabel?: string,
  ) => Promise<boolean>;
  current: Brief | null;
  setCurrent: (b: Brief | null) => void;
  resetKey: number;
  newMeeting: () => void;
}
const AppContext = createContext<Ctx | null>(null);

export function useApp(): Ctx {
  const c = useContext(AppContext);
  if (!c) throw new Error("useApp must be used inside AppProvider");
  return c;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [briefs, setBriefs] = useState<Brief[]>(() =>
    loadJSON<Brief[]>(BKEY, []),
  );
  const [settings, setSettings] = useState<Settings>(() => ({
    animations: true,
    compactSidebar: false,
    ...loadJSON<Partial<Settings>>(SKEY, {}),
  }));
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [current, setCurrent] = useState<Brief | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => saveJSON(BKEY, briefs), [briefs]);
  useEffect(() => saveJSON(SKEY, settings), [settings]);

  const toast = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  const confirm = useCallback(
    (title: string, message: string, okLabel = "Delete") =>
      new Promise<boolean>((resolve) =>
        setDialog({ title, message, okLabel, resolve }),
      ),
    [],
  );
  const closeDialog = (v: boolean): void => {
    dialog?.resolve(v);
    setDialog(null);
  };

  const value = useMemo<Ctx>(
    () => ({
      briefs,
      settings,
      current,
      setCurrent,
      resetKey,
      toast,
      confirm,
      addBrief: (b) => setBriefs((p) => [b, ...p].slice(0, 50)),
      deleteBrief: (id) => setBriefs((p) => p.filter((b) => b.id !== id)),
      clearBriefs: () => setBriefs([]),
      updateSettings: (p) => setSettings((s) => ({ ...s, ...p })),
      newMeeting: () => {
        setCurrent(null);
        setResetKey((k) => k + 1);
        navigate("/");
      },
    }),
    [briefs, settings, current, resetKey, toast, confirm, navigate],
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div className="toast" key={t.id}>
            <CheckCircle2 />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
      <div
        className={`modal-wrap ${dialog ? "show" : ""}`}
        aria-hidden={!dialog}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeDialog(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") closeDialog(false);
        }}
      >
        <div
          className="modal glass"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mTitle"
        >
          <h3 id="mTitle">{dialog?.title}</h3>
          <p className="muted">{dialog?.message}</p>
          <div className="row end">
            <button className="btn ghost" onClick={() => closeDialog(false)}>
              Cancel
            </button>
            <button className="btn danger" onClick={() => closeDialog(true)}>
              {dialog?.okLabel}
            </button>
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
}
