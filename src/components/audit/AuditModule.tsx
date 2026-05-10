import React, { useState } from "react";
import { ViewState, AuditRecord, IsoQuestionTemplate } from "./types";
import { useAuditsState } from "../../store";
import { AuditDashboard } from "./AuditDashboard";
import { AuditCalendar } from "./AuditCalendar";
import { AuditList } from "./AuditList";
import { AuditForm } from "./AuditForm";
import { AuditDetail } from "./AuditDetail";
import { ManageQuestions } from "./ManageQuestions";
import { defaultIsoQuestions, defaultSupplierQuestions } from "./isoQuestions";
import {
  LayoutDashboard,
  Calendar,
  List,
  PlusCircle,
  Settings,
} from "lucide-react";

export function AuditModule() {
  const [viewState, setViewState] = useState<ViewState>({ type: "dashboard" });
  const { audits: records, setAudits: setRecords } = useAuditsState();
  const [isoQs, setIsoQs] =
    useState<IsoQuestionTemplate[]>(defaultIsoQuestions);
  const [supplierQs, setSupplierQs] = useState<IsoQuestionTemplate[]>(
    defaultSupplierQuestions,
  );

  const handleSave = (data: AuditRecord) => {
    setRecords([data, ...records]);
    setViewState({ type: "list" });
  };

  const handleDelete = (ids: string[]) => {
    setRecords(records.filter((r) => !ids.includes(r.id)));
  };

  const renderNav = () => {
    if (viewState.type === "detail") return null;
    return (
      <div className="flex bg-white rounded-lg p-1 border border-slate-200 mb-6 shrink-0 w-fit">
        <button
          onClick={() => setViewState({ type: "dashboard" })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === "dashboard" ? "bg-slate-100 text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
        >
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </button>
        <button
          onClick={() => setViewState({ type: "calendar" })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === "calendar" ? "bg-slate-100 text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
        >
          <Calendar className="w-4 h-4" /> Calendar
        </button>
        <button
          onClick={() => setViewState({ type: "list" })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === "list" ? "bg-slate-100 text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
        >
          <List className="w-4 h-4" /> Audits
        </button>
        <button
          onClick={() => setViewState({ type: "form" })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === "form" ? "bg-slate-100 text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
        >
          <PlusCircle className="w-4 h-4" /> New Audit
        </button>
        <button
          onClick={() => setViewState({ type: "manage" })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === "manage" ? "bg-slate-100 text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
        >
          <Settings className="w-4 h-4" /> Manage Questions
        </button>
      </div>
    );
  };

  const currentRecord =
    viewState.type === "detail" && viewState.recordId
      ? records.find((r) => r.id === viewState.recordId)
      : undefined;

  return (
    <div
      className={`w-full h-full flex flex-col overflow-hidden ${viewState.type === "detail" ? "bg-slate-50" : "p-4 sm:p-6 lg:p-8 bg-slate-50/50"}`}
    >
      {renderNav()}

      <div
        className={`flex-1 overflow-y-auto w-full ${viewState.type === "detail" ? "h-full" : ""}`}
      >
        {viewState.type === "dashboard" && <AuditDashboard audits={records} />}
        {viewState.type === "calendar" && <AuditCalendar audits={records} />}
        {viewState.type === "list" && (
          <AuditList
            audits={records}
            onView={(id) => setViewState({ type: "detail", recordId: id })}
            onEdit={(id) => setViewState({ type: "form", recordId: id })}
            onDelete={handleDelete}
            onCreate={() => setViewState({ type: "form" })}
          />
        )}
        {viewState.type === "form" && (
          <AuditForm
            isoQuestionsTemplate={isoQs}
            supplierQuestionsTemplate={supplierQs}
            onSave={handleSave}
            onCancel={() => setViewState({ type: "list" })}
          />
        )}
        {viewState.type === "detail" && currentRecord && (
          <AuditDetail
            record={currentRecord}
            onBack={() => setViewState({ type: "list" })}
          />
        )}
        {viewState.type === "manage" && (
          <ManageQuestions
            internalQuestions={isoQs}
            supplierQuestions={supplierQs}
            onUpdateInternal={setIsoQs}
            onUpdateSupplier={setSupplierQs}
            onBack={() => setViewState({ type: "dashboard" })}
          />
        )}
      </div>
    </div>
  );
}
