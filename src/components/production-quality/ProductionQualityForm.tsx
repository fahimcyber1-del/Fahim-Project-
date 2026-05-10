import React, { useState, useEffect, useRef } from "react";
import SignaturePad, { SignaturePadRef } from "../ui/SignaturePad";
import { QualityRecord } from "./types";
import { ArrowLeft, Save, AlertCircle, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { INITIAL_ORDERS } from "../orders-buyers/mockData";
import { INITIAL_DEFECTS } from "../defect-library/mockData";

interface FormProps {
  initialData?: QualityRecord;
  onSave: (data: QualityRecord) => void;
  onCancel: () => void;
  sections: string[];
  lines: string[];
  units: string[];
  shifts: string[];
}

export function ProductionQualityForm({
  initialData,
  onSave,
  onCancel,
  sections,
  lines,
  units,
  shifts,
}: FormProps) {
  const [formData, setFormData] = useState<Partial<QualityRecord>>({
    id: `PQ-${format(new Date(), "yyyy")}-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`,
    date: format(new Date(), "yyyy-MM-dd"),
    section: sections[0] || "Sewing",
    unit: "",
    line: lines[0] || "Line 01",
    shift: shifts[0] || "Day",
    style: "",
    buyer: "",
    color: "",
    size: "M",
    inspectedQuantity: 0,
    passedQuantity: 0,
    defectedQuantity: 0,
    reworkedQuantity: 0,
    rejectedQuantity: 0,
    status: "Passed",
    inspector: "",
    remarks: "",
    topDefects: [{ type: "", count: 0 }],
    signatures: [],
  });

  const sigPadRef = useRef<SignaturePadRef>(null);
  const [sigInputName, setSigInputName] = useState("");
  const [sigInputDesignation, setSigInputDesignation] = useState("");
  const [sigInputDate, setSigInputDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("userProfile");
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        if (profile.name) setSigInputName(profile.name);
        if (profile.role) setSigInputDesignation(profile.role);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleClearSignature = () => {
    if (sigPadRef.current) {
      sigPadRef.current.clear();
    }
  };

  const handleAddSignature = () => {
    if (!sigPadRef.current) return;
    const imgUrl = sigPadRef.current.isEmpty()
      ? ""
      : sigPadRef.current.toDataURL();

    if (!sigInputName.trim() && !imgUrl) {
      alert("Please draw a signature or provide a name.");
      return;
    }

    const newSig = {
      id: `sig-${Date.now()}`,
      name: sigInputName,
      designation: sigInputDesignation,
      date: sigInputDate,
      image: imgUrl,
    };

    setFormData((prev) => ({
      ...prev,
      signatures: [...(prev.signatures || []), newSig],
    }));

    setSigInputName("");
    setSigInputDesignation("");
    setSigInputDate(format(new Date(), "yyyy-MM-dd"));
    sigPadRef.current.clear();
  };

  const handleRemoveSignature = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      signatures: (prev.signatures || []).filter((s) => s.id !== id),
    }));
  };

  const handleDefectChange = (
    index: number,
    field: "type" | "count",
    value: string | number,
  ) => {
    const updatedDefects = [...(formData.topDefects || [])];
    updatedDefects[index] = { ...updatedDefects[index], [field]: value };

    const totalDefects = updatedDefects.reduce(
      (sum, defect) => sum + (Number(defect.count) || 0),
      0,
    );

    setFormData((prev) => ({
      ...prev,
      topDefects: updatedDefects,
      defectedQuantity: totalDefects,
    }));
  };

  const addDefectField = () => {
    setFormData((prev) => ({
      ...prev,
      topDefects: [...(prev.topDefects || []), { type: "", count: 0 }],
    }));
  };

  const removeDefectField = (index: number) => {
    const updatedDefects = [...(formData.topDefects || [])];
    updatedDefects.splice(index, 1);
    const totalDefects = updatedDefects.reduce(
      (sum, defect) => sum + (Number(defect.count) || 0),
      0,
    );
    setFormData((prev) => ({
      ...prev,
      topDefects: updatedDefects,
      defectedQuantity: totalDefects,
    }));
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    // Auto-calculate passed quantity if others are updated
    if (
      [
        "inspectedQuantity",
        "defectedQuantity",
        "reworkedQuantity",
        "rejectedQuantity",
      ].includes(name)
    ) {
      const numValue = value === "" ? "" : parseInt(value);
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const calculatePassed = () => {
    const inspected = Number(formData.inspectedQuantity) || 0;
    const defected = Number(formData.defectedQuantity) || 0;
    const reworked = Number(formData.reworkedQuantity) || 0;
    const rejected = Number(formData.rejectedQuantity) || 0;

    const passed = inspected - defected - reworked - rejected;
    setFormData((prev) => ({ ...prev, passedQuantity: Math.max(0, passed) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as QualityRecord);
  };

  const uniqueStyles = Array.from(
    new Set(INITIAL_ORDERS.map((o) => o.styleNumber)),
  ).filter(Boolean);
  const uniqueBuyers = Array.from(
    new Set(INITIAL_ORDERS.map((o) => o.buyerName)),
  ).filter(Boolean);
  const uniqueDefects = Array.from(
    new Set(INITIAL_DEFECTS.map((d) => d.name)),
  ).filter(Boolean);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <datalist id="styles-list">
        {uniqueStyles.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
      <datalist id="buyers-list">
        {uniqueBuyers.map((b) => (
          <option key={b} value={b} />
        ))}
      </datalist>
      <datalist id="defects-list">
        {uniqueDefects.map((d) => (
          <option key={d} value={d} />
        ))}
      </datalist>

      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Summary
      </button>

      <form onSubmit={handleSubmit}>
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg">
          <div className="border-b border-slate-100 p-4 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">
              {initialData ? "Edit Quality Record" : "New Quality Record"}
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-2">
                  Basic Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Record ID
                    </label>
                    <input
                      type="text"
                      name="id"
                      value={formData.id}
                      readOnly
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Section
                    </label>
                    <select
                      name="section"
                      value={formData.section || sections[0]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {sections.map((section) => (
                        <option key={section} value={section}>
                          {section}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Unit
                    </label>
                    <select
                      name="unit"
                      value={formData.unit || units[0]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Shift
                    </label>
                    <select
                      name="shift"
                      value={formData.shift || shifts[0]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {shifts.map((shift) => (
                        <option key={shift} value={shift}>
                          {shift}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Production Line
                    </label>
                    <select
                      name="line"
                      value={formData.line || lines[0]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {lines.map((line) => (
                        <option key={line} value={line}>
                          {line}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Quality Inspector Name
                    </label>
                    <input
                      type="text"
                      name="inspector"
                      value={formData.inspector || ""}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Buyer
                    </label>
                    <input
                      type="text"
                      name="buyer"
                      list="buyers-list"
                      value={formData.buyer || ""}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Style
                    </label>
                    <input
                      type="text"
                      name="style"
                      list="styles-list"
                      value={formData.style || ""}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Color
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Size
                    </label>
                    <input
                      type="text"
                      name="size"
                      value={formData.size || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Inspection Data */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-2 flex justify-between items-center">
                  Inspection Data
                  <button
                    type="button"
                    onClick={calculatePassed}
                    className="text-[10px] text-blue-600 font-bold px-2 py-1 bg-blue-50 rounded hover:bg-blue-100"
                  >
                    Auto-Calculate Passed
                  </button>
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Inspected Qty
                    </label>
                    <input
                      type="number"
                      name="inspectedQuantity"
                      value={formData.inspectedQuantity ?? ""}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Passed Qty
                    </label>
                    <input
                      type="number"
                      name="passedQuantity"
                      value={formData.passedQuantity ?? ""}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-emerald-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                      Defected Qty
                    </label>
                    <input
                      type="number"
                      name="defectedQuantity"
                      value={formData.defectedQuantity ?? ""}
                      onChange={handleChange}
                      readOnly
                      title="Auto-calculated from Defects List"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 bg-slate-50 cursor-not-allowed focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                      Reworked Qty
                    </label>
                    <input
                      type="number"
                      name="reworkedQuantity"
                      value={formData.reworkedQuantity ?? ""}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-amber-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                      Rejected Qty
                    </label>
                    <input
                      type="number"
                      name="rejectedQuantity"
                      value={formData.rejectedQuantity ?? ""}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-rose-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 bg-rose-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Final Status
                  </label>
                  <div className="flex gap-4">
                    {["Passed", "Rework", "Rejected"].map((status) => (
                      <label
                        key={status}
                        className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="status"
                          value={status}
                          checked={formData.status === status}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any observations or comments..."
                  ></textarea>
                </div>

                {/* Defects */}
                <div className="space-y-4 border border-slate-200 p-4 rounded-lg bg-slate-50">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-bold text-slate-900">
                      Defects List
                    </label>
                    <button
                      type="button"
                      onClick={addDefectField}
                      className="text-xs text-blue-600 font-bold px-3 py-1.5 bg-blue-100 rounded hover:bg-blue-200 transition-colors shadow-sm"
                    >
                      + Add Defect
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.topDefects?.map((defect, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Defect Type (e.g. Open Seam, Skip Stitch)"
                          list="defects-list"
                          value={defect.type}
                          onChange={(e) =>
                            handleDefectChange(index, "type", e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        />
                        <input
                          type="number"
                          placeholder="Qty"
                          value={
                            defect.count === 0 && defect.type === ""
                              ? ""
                              : defect.count
                          }
                          onChange={(e) =>
                            handleDefectChange(
                              index,
                              "count",
                              e.target.value === ""
                                ? ""
                                : parseInt(e.target.value, 10),
                            )
                          }
                          min="0"
                          className="w-24 px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => removeDefectField(index)}
                          className="p-2 text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-500 rounded transition-colors"
                          title="Remove Defect"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {(!formData.topDefects ||
                      formData.topDefects.length === 0) && (
                      <div className="text-sm text-slate-500 italic py-2 text-center bg-white rounded border border-slate-100">
                        No defects added.
                      </div>
                    )}
                  </div>
                  <div className="pt-3 mt-2 flex justify-between items-center border-t border-slate-200">
                    <span className="text-sm font-bold text-slate-600">
                      Total Defects From List:
                    </span>
                    <span className="text-lg font-black text-rose-600">
                      {formData.topDefects?.reduce(
                        (sum, d) => sum + (Number(d.count) || 0),
                        0,
                      ) || 0}
                    </span>
                  </div>
                </div>

                {Number(formData.passedQuantity) +
                  Number(formData.defectedQuantity) +
                  Number(formData.reworkedQuantity) +
                  Number(formData.rejectedQuantity) !==
                  Number(formData.inspectedQuantity) && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    Warning: The sum of passed, defected, reworked, and rejected
                    quantities does not equal the total inspected quantity.
                  </div>
                )}

                {/* E-Signatures Section */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-4 pb-2">
                    <h3 className="text-lg font-bold text-slate-800">
                      E-Signatures / Approvals
                    </h3>
                  </div>

                  {formData.signatures && formData.signatures.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      {formData.signatures.map((sig) => (
                        <div
                          key={sig.id}
                          className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm flex items-start gap-4"
                        >
                          <div className="flex-1 space-y-1">
                            <p className="font-bold text-slate-800">
                              {sig.name || "Unnamed"}
                            </p>
                            <p className="text-sm font-medium text-slate-500">
                              {sig.designation || "No Designation"}
                            </p>
                            <p className="text-xs text-slate-400">
                              Signed on: {sig.date}
                            </p>
                            {sig.image && (
                              <div className="mt-2 border border-slate-100 rounded bg-slate-50 inline-block p-1">
                                <img
                                  src={sig.image}
                                  alt="Signature"
                                  className="h-12 object-contain mix-blend-multiply"
                                />
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSignature(sig.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Remove signature"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-200 rounded-lg">
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                          Draw Signature
                        </label>
                        <div
                          className="border border-slate-300 bg-white rounded-lg overflow-hidden flex items-center justify-center relative touch-none aspect-square w-full max-w-[250px]"
                        >
                          <SignaturePad
                            ref={sigPadRef}
                            canvasProps={{
                              className: "w-full h-full cursor-crosshair",
                            }}
                            backgroundColor="white"
                          />
                          <button
                            type="button"
                            onClick={handleClearSignature}
                            className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 rounded opacity-70 hover:opacity-100 transition-opacity"
                            title="Clear signature"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                        E-Signature Name
                      </label>
                      <input
                        type="text"
                        value={sigInputName}
                        onChange={(e) => setSigInputName(e.target.value)}
                        placeholder="Type full name"
                        className="w-full px-4 py-2 border border-slate-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-serif italic"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={sigInputDesignation}
                        onChange={(e) => setSigInputDesignation(e.target.value)}
                        placeholder="e.g. Quality Inspector"
                        className="w-full px-4 py-2 border border-slate-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                        Signature Date
                      </label>
                      <input
                        type="date"
                        value={sigInputDate}
                        onChange={(e) => setSigInputDate(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2 mt-2">
                      <button
                        type="button"
                        onClick={handleAddSignature}
                        className="px-4 py-2 bg-slate-800 text-white rounded text-sm font-bold shadow-sm hover:bg-slate-700 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add Signature
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 bg-slate-50 p-4 flex justify-end gap-3 rounded-b-lg">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Record
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
