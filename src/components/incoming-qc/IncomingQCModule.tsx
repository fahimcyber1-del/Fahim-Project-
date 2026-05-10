import { useApiStorage } from "../../hooks/useApiData";
import React, { useState, useEffect } from "react";
import { IncomingQCDashboard } from "./IncomingQCDashboard";
import { IncomingQCList } from "./IncomingQCList";
import { IncomingQCForm } from "./IncomingQCForm";
import { IncomingQCDetail } from "./IncomingQCDetail";
import { IncomingQCSettings } from "./IncomingQCSettings";
import { IncomingQCRecord } from "./types";
import { mockIncomingQC } from "./mockData";
import { LayoutDashboard, List, FileText, Settings } from "lucide-react";

export function IncomingQCModule() {
  const [view, setView] = useState<
    "dashboard" | "list" | "form" | "detail" | "settings"
  >("dashboard");
  const [records, setRecords] = useApiStorage<IncomingQCRecord>(
    "aqm_incomingqc_records",
    mockIncomingQC,
  );
  const [selectedRecord, setSelectedRecord] = useState<IncomingQCRecord | null>(
    null,
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreen = (e: CustomEvent) => setIsFullscreen(!!e.detail);
    window.addEventListener("app-fullscreen", handleFullscreen as EventListener);
    return () => window.removeEventListener("app-fullscreen", handleFullscreen as EventListener);
  }, []);

  const handleCreate = (data: IncomingQCRecord) => {
    setRecords([data, ...records]);
    setView("list");
  };

  const handleUpdate = (data: IncomingQCRecord) => {
    setRecords(records.map((r) => (r.id === data.id ? data : r)));
    setView("list");
  };

  const handleDelete = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    if (view === "detail" && selectedRecord?.id === id) {
      setView("list");
    }
  };

  const renderNav = () => {
    if (view === "detail") return null;
    return (
      <div className="flex bg-white rounded-lg p-1 border border-slate-200 mb-6 shrink-0 w-fit">
        <button
          onClick={() => setView("dashboard")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${view === "dashboard" ? "bg-slate-100 text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
        >
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </button>
        <button
          onClick={() => setView("list")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${view === "list" ? "bg-slate-100 text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
        >
          <List className="w-4 h-4" /> QC List
        </button>
        <button
          onClick={() => {
            setSelectedRecord(null);
            setView("form");
          }}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${view === "form" && !selectedRecord ? "bg-slate-100 text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
        >
          <FileText className="w-4 h-4" /> New QC Form
        </button>
        <button
          onClick={() => setView("settings")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${view === "settings" ? "bg-slate-100 text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
        >
          <Settings className="w-4 h-4" /> Settings
        </button>
      </div>
    );
  };

  return (
    <div
      className={`w-full h-full flex flex-col ${isFullscreen ? "bg-slate-50" : "p-4 sm:p-6 lg:p-8 bg-slate-50/50"}`}
    >
      {!isFullscreen && renderNav()}

      <div
        className={`flex-1 overflow-y-auto w-full ${isFullscreen ? "h-full" : ""}`}
      >
        {view === "dashboard" && (
          <IncomingQCDashboard
            records={records}
            onNavigate={(viewName) => {
              setSelectedRecord(null);
              setView(viewName as any);
            }}
          />
        )}

        {view === "list" && (
          <IncomingQCList
            records={records}
            onNavigate={(viewName) => {
              setSelectedRecord(null);
              setView(viewName as any);
            }}
            onView={(record) => {
              setSelectedRecord(record);
              setView("detail");
            }}
            onEdit={(record) => {
              setSelectedRecord(record);
              setView("form");
            }}
            onDelete={handleDelete}
          />
        )}

        {view === "form" && (
          <IncomingQCForm
            onNavigate={(viewName) => setView(viewName as any)}
            onSubmit={selectedRecord ? handleUpdate : handleCreate}
            initialData={selectedRecord || undefined}
          />
        )}

        {view === "detail" && selectedRecord && (
          <IncomingQCDetail
            record={selectedRecord}
            onNavigate={(viewName) => setView(viewName as any)}
          />
        )}

        {view === "settings" && (
          <IncomingQCSettings onBack={() => setView("dashboard")} />
        )}
      </div>
    </div>
  );
}
