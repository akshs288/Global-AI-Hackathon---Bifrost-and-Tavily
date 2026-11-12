import { Database, Info, SlidersHorizontal, Trash2, User } from "lucide-react";
import { useApp } from "../context/AppContext";

interface SwitchProps {
  on: boolean;
  label: string;
  onToggle: () => void;
}
const Switch = ({ on, label, onToggle }: SwitchProps) => (
  <button
    className="switch"
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={onToggle}
  />
);

export default function Settings() {
  const { settings, updateSettings, briefs, clearBriefs, confirm, toast } =
    useApp();
  const clear = async (): Promise<void> => {
    if (!briefs.length) {
      toast("No saved briefs to clear");
      return;
    }
    if (
      await confirm(
        "Clear all briefs?",
        "All saved briefs will be permanently deleted.",
        "Clear all",
      )
    ) {
      clearBriefs();
      toast("All briefs cleared");
    }
  };
  return (
    <section className="view active">
      <div className="hero small">
        <h2>Settings</h2>
        <p>Manage your demo workspace and preferences.</p>
      </div>
      <div className="settings">
        <div className="card glass">
          <h3>
            <User />
            Profile
          </h3>
          <div className="row">
            <span className="avatar lg">RS</span>
            <div>
              <b>Rahul Sharma</b>
              <p className="muted">thanosharma1234@gmail.com · Admin account</p>
            </div>
          </div>
        </div>
        <div className="card glass">
          <h3>
            <SlidersHorizontal />
            Display
          </h3>
          <div className="row between">
            <div>
              <b>Animations</b>
              <p className="muted">Background motion and transitions</p>
            </div>
            <Switch
              on={settings.animations}
              label="Animations"
              onToggle={() =>
                updateSettings({ animations: !settings.animations })
              }
            />
          </div>
          <div className="row between">
            <div>
              <b>Compact sidebar</b>
              <p className="muted">Show icons only</p>
            </div>
            <Switch
              on={settings.compactSidebar}
              label="Compact sidebar"
              onToggle={() =>
                updateSettings({ compactSidebar: !settings.compactSidebar })
              }
            />
          </div>
        </div>
        <div className="card glass">
          <h3>
            <Database />
            Data
          </h3>
          <div className="row between">
            <div>
              <b>Saved briefs</b>
              <p className="muted">
                {briefs.length} saved brief{briefs.length === 1 ? "" : "s"}
              </p>
            </div>
            <button className="btn danger" onClick={() => void clear()}>
              <Trash2 />
              <span>Clear all briefs</span>
            </button>
          </div>
        </div>
        <div className="card glass">
          <h3>
            <Info />
            About
          </h3>
          <p className="muted">
            BriefAI v1.0 · Frontend demo. Briefs are generated from sample data
            in your browser and are not verified research. Nothing leaves your
            device.
          </p>
        </div>
      </div>
    </section>
  );
}
