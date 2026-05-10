import React, { useState, useEffect, useRef } from "react";
import {
  IncomingQCRecord,
  QCCategory,
  FabricDetails,
  AccessoriesDetails,
  QualitySignature,
} from "./types";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  X,
  File,
  FileText,
  Image as ImageIcon,
  Search,
  Plus,
  Trash2,
} from "lucide-react";
import { apiStorage } from "../../utils/apiStorage";
import { apiFetch, useApiStorage } from "../../hooks/useApiData";
import { useIncomingQCConfig } from "../../store";
import SignatureCanvas from "react-signature-canvas";
import { INITIAL_DOCUMENTS } from "../document-control/mockData";
import { DocumentRecord } from "../document-control/types";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    const url = localStorage.getItem("global_api_url");
    if (url) {
      return url.replace(/\/$/, "");
    }
  }
  return "";
};

interface Props {
  onNavigate: (view: "list") => void;
  onSubmit: (data: IncomingQCRecord) => void;
  initialData?: IncomingQCRecord;
}

export function IncomingQCForm({ onNavigate, onSubmit, initialData }: Props) {
  const { config } = useIncomingQCConfig();
  const [documents] = useApiStorage<DocumentRecord>(
    "aqm_documentcontrol_records",
    INITIAL_DOCUMENTS,
  );

  const [formData, setFormData] = useState<Partial<IncomingQCRecord>>(
    initialData || {
      category: "Fabric",
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
      documentCode: config.documentCode || "",
      signatures: [],
    },
  );

  const [showDocSuggestions, setShowDocSuggestions] = useState(false);
  const sigPadRef = useRef<SignatureCanvas>(null);

  const [sigInputDesignation, setSigInputDesignation] =
    useState("QC Inspector");

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("userProfile");
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        if (profile.name) {
          setFormData((prev) => ({ ...prev, inspectorName: profile.name }));
        }
        if (profile.role) {
          setSigInputDesignation(profile.role);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleClearSignature = () => {
    sigPadRef.current?.clear();
  };

  const handleAddSignature = () => {
    if (sigPadRef.current?.isEmpty()) {
      alert("Please draw a signature.");
      return;
    }

    const newSig: QualitySignature = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.inspectorName || "Inspector",
      designation: sigInputDesignation,
      date: new Date().toISOString().split("T")[0],
      image: sigPadRef.current?.getCanvas().toDataURL("image/png"),
    };

    setFormData((prev) => ({
      ...prev,
      signatures: [...(prev.signatures || []), newSig],
    }));
    sigPadRef.current?.clear();
  };

  const handleRemoveSignature = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      signatures: (prev.signatures || []).filter((s) => s.id !== id),
    }));
  };

  const filteredDocs = documents.filter(
    (doc) =>
      !formData.documentCode ||
      doc.id.toLowerCase().includes(formData.documentCode.toLowerCase()) ||
      doc.title.toLowerCase().includes(formData.documentCode.toLowerCase()),
  );

  const [fabricDetails, setFabricDetails] = useState<Partial<FabricDetails>>(
    initialData?.fabricDetails || {},
  );
  const [accessoriesDetails, setAccessoriesDetails] = useState<
    Partial<AccessoriesDetails>
  >(initialData?.accessoriesDetails || {});
  const [orders, setOrders] = useState<any[]>([]);
  const [defects, setDefects] = useState<any[]>([]);

  useEffect(() => {
    apiFetch<any>("aqm_ordersbuyers_orders")
      .then((json) => {
        if (
          Array.isArray(json) &&
          json.length > 0 &&
          json[0].id === "singleton" &&
          json[0].collection
        ) {
          setOrders(json[0].collection);
        } else if (
          Array.isArray(json) &&
          json.length > 0 &&
          !json[0].collection
        ) {
          setOrders(json);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch orders from API:", err);
        const storedOrders = apiStorage.getItem("aqm_ordersbuyers_orders");
        if (storedOrders) {
          try {
            setOrders(JSON.parse(storedOrders));
          } catch {}
        }
      });

    apiFetch<any>("aqm_defectlibrary_records")
      .then((json) => {
        if (
          Array.isArray(json) &&
          json.length > 0 &&
          json[0].id === "singleton" &&
          json[0].collection
        ) {
          setDefects(json[0].collection);
        } else if (
          Array.isArray(json) &&
          json.length > 0 &&
          !json[0].collection
        ) {
          setDefects(json);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch defects from API:", err);
        const storedDefects = apiStorage.getItem("aqm_defectlibrary_records");
        if (storedDefects) {
          try {
            setDefects(JSON.parse(storedDefects));
          } catch {}
        }
      });
  }, []);

  useEffect(() => {
    // Auto-fill style based on PO number selection if it's currently empty or mismatches
    if (formData.poNumber && orders.length > 0) {
      const selectedOrder = orders.find(
        (o) => o.poArticleNumber === formData.poNumber,
      );
      if (selectedOrder && selectedOrder.styleNumber) {
        if (formData.style !== selectedOrder.styleNumber) {
          setFormData((prev) => ({
            ...prev,
            style: selectedOrder.styleNumber,
          }));
        }
        if (accessoriesDetails.style !== selectedOrder.styleNumber) {
          setAccessoriesDetails((prev) => ({
            ...prev,
            style: selectedOrder.styleNumber,
          }));
        }
      }
    }
  }, [formData.poNumber, orders, formData.style, accessoriesDetails.style]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFabricChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFabricDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccessoriesChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setAccessoriesDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData: IncomingQCRecord = {
      ...(formData as IncomingQCRecord),
      id: formData.id || `IQC-${Date.now().toString().slice(-6)}`,
      fabricDetails:
        formData.category === "Fabric"
          ? (fabricDetails as FabricDetails)
          : undefined,
      accessoriesDetails:
        formData.category === "Accessories"
          ? (accessoriesDetails as AccessoriesDetails)
          : undefined,
    };

    // Auto update Order's accessories if applicable
    if (finalData.category === "Accessories" && finalData.poNumber) {
      const orderIndex = orders.findIndex(
        (o) => o.poArticleNumber === finalData.poNumber,
      );
      if (orderIndex !== -1 && accessoriesDetails.itemName) {
        const updatedOrders = [...orders];
        const matchingOrder = updatedOrders[orderIndex];

        // Auto update the order with QC accessory item
        matchingOrder.accessoriesItemName = accessoriesDetails.itemName;
        // Add quantity
        if (accessoriesDetails.quantity) {
          matchingOrder.accessoriesQuantity = Number(
            accessoriesDetails.quantity,
          );
        }
        if (finalData.date) {
          matchingOrder.accessoriesInhouseDate = finalData.date;
        }

        // Save back to storage
        const payload = { id: "singleton", collection: updatedOrders };
        const baseUrl = getBaseUrl();
        fetch(`${baseUrl}/api/data/aqm_ordersbuyers_orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch((err) => {
          console.error("Failed to sync updated orders back:", err);
          apiStorage.setItem(
            "aqm_ordersbuyers_orders",
            JSON.stringify(updatedOrders),
          );
          window.dispatchEvent(
            new CustomEvent("app-storage-sync", {
              detail: { key: "aqm_ordersbuyers_orders" },
            }),
          );
        });
        // Update the local state synchronously so user doesn't wait
        apiStorage.setItem(
          "aqm_ordersbuyers_orders",
          JSON.stringify(updatedOrders),
        );
        window.dispatchEvent(
          new CustomEvent("app-storage-sync", {
            detail: { key: "aqm_ordersbuyers_orders" },
          }),
        );
      }
    }

    onSubmit(finalData);
  };

  return (
    <div className="h-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
      <div className="flex-none p-4 lg:p-6 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate("list")}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {initialData ? "Edit QC Record" : "New QC Record"}
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Fill in the inspection details
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 flex items-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Record
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-4 sm:p-6 lg:p-8">
        <form
          id="qcForm"
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* General Information */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
              General Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              <div className="md:col-span-2 relative">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Document Code (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="documentCode"
                    value={formData.documentCode || ""}
                    onFocus={() => setShowDocSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowDocSuggestions(false), 200)
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        documentCode: e.target.value,
                      }))
                    }
                    placeholder="e.g. DOC-123 Rev 1.0 or type to search..."
                    className="w-full px-3 py-2 pl-9 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />

                  {showDocSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                      {filteredDocs.length > 0 ? (
                        filteredDocs.map((doc) => (
                          <button
                            key={doc.id}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setFormData((prev) => ({
                                ...prev,
                                documentCode: `${doc.id} Rev ${doc.version}`,
                              }));
                              setShowDocSuggestions(false);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-0 flex flex-col gap-0.5"
                          >
                            <span className="text-sm font-bold text-slate-800">
                              {doc.id} (Rev {doc.version})
                            </span>
                            <span className="text-xs text-slate-500 truncate">
                              {doc.title}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-xs text-slate-500 text-center">
                          No documents found.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="Fabric">Fabric</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  name="date"
                  value={formData.date || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Supplier *
                </label>
                <input
                  type="text"
                  required
                  name="supplier"
                  value={formData.supplier || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="Enter supplier name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  PO Number
                </label>
                <input
                  type="text"
                  name="poNumber"
                  list="po-suggestions"
                  value={formData.poNumber || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="Select or type PO..."
                />
                {orders.length > 0 && (
                  <datalist id="po-suggestions">
                    {Array.from(new Set(orders.map((o) => o.poArticleNumber)))
                      .filter(Boolean)
                      .map((po) => (
                        <option key={po} value={po} />
                      ))}
                  </datalist>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Inspector Name *
                </label>
                <input
                  type="text"
                  required
                  name="inspectorName"
                  value={formData.inspectorName || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="Inspector name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  required
                  value={formData.status || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Passed">Passed</option>
                  <option value="Failed">Failed</option>
                  <option value="Partial Pass">Partial Pass</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
              <div className="lg:col-span-1">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Defect Type
                </label>
                <input
                  type="text"
                  name="defectType"
                  value={formData.defectType || ""}
                  onChange={handleChange}
                  list="qc-defect-options"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="If failed/partial, enter defect..."
                />
                {defects && defects.length > 0 && (
                  <datalist id="qc-defect-options">
                    {defects.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.code} - {d.category}
                      </option>
                    ))}
                  </datalist>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Style (Optional Filter)
                </label>
                <input
                  type="text"
                  name="style"
                  value={formData.style || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. S-Summer26"
                />
              </div>
            </div>
          </div>

          {/* Conditional Sections */}
          {formData.category === "Fabric" && (
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-bottom-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
                Fabric Tests & Inspections
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    4 Point Inspection
                  </label>
                  <input
                    type="text"
                    name="fourPointInspection"
                    value={fabricDetails.fourPointInspection || ""}
                    onChange={handleFabricChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="Score / Result"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    Shrinkage Test
                  </label>
                  <input
                    type="text"
                    name="shrinkageTest"
                    value={fabricDetails.shrinkageTest || ""}
                    onChange={handleFabricChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="Warp / Weft %"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    Shadeband Check
                  </label>
                  <input
                    type="text"
                    name="shadebandCheck"
                    value={fabricDetails.shadebandCheck || ""}
                    onChange={handleFabricChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="Result"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    CSV Check
                  </label>
                  <input
                    type="text"
                    name="csvCheck"
                    value={fabricDetails.csvCheck || ""}
                    onChange={handleFabricChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="Passed / Failed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    Moisture Check
                  </label>
                  <input
                    type="text"
                    name="moistureCheck"
                    value={fabricDetails.moistureCheck || ""}
                    onChange={handleFabricChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="Moisture content %"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.category === "Accessories" && (
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-bottom-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
                Accessories Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    value={accessoriesDetails.itemName || ""}
                    onChange={handleAccessoriesChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Zipper, Button"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    For Which Style
                  </label>
                  <input
                    type="text"
                    name="style"
                    value={accessoriesDetails.style || ""}
                    onChange={handleAccessoriesChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="Style ref"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    Total Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={accessoriesDetails.quantity || ""}
                    onChange={handleAccessoriesChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    Inspected Quantity
                  </label>
                  <input
                    type="number"
                    name="inspectedQuantity"
                    value={accessoriesDetails.inspectedQuantity || ""}
                    onChange={handleAccessoriesChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    Percentage Options
                  </label>
                  <select
                    name="percentageOptions"
                    value={accessoriesDetails.percentageOptions || ""}
                    onChange={handleAccessoriesChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Select %</option>
                    {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((p) => (
                      <option key={p} value={`${p}%`}>
                        {p}%
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notes and Attachments */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
              Notes & Attachments
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes || ""}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="Any additional comments or observations..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Attachments
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 sm:p-6 lg:p-8 bg-slate-50 text-center hover:bg-slate-100 transition-colors relative cursor-pointer group">
                  <input
                    type="file"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (!files) return;
                      const newAttachments = Array.from(files).map(
                        (file, i) => ({
                          id: `att-${Date.now()}-${i}`,
                          name: file.name,
                          url: URL.createObjectURL(file),
                          type: file.type,
                        }),
                      );
                      setFormData((prev) => ({
                        ...prev,
                        attachments: [
                          ...(prev.attachments || []),
                          ...newAttachments,
                        ],
                      }));
                    }}
                  />
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-3 group-hover:text-indigo-500 transition-colors" />
                  <p className="text-sm font-semibold text-slate-700 mb-1">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="text-xs text-slate-500">
                    PDF, JPG, PNG, XLSX up to 10MB
                  </p>
                </div>
                {formData.attachments && formData.attachments.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {formData.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded shrink-0 flex items-center justify-center overflow-hidden border border-indigo-100">
                            {att.type.startsWith("image/") ? (
                              <img
                                src={att.url}
                                alt={att.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FileText className="w-5 h-5" />
                            )}
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-bold text-slate-700 truncate">
                              {att.name}
                            </p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                              {att.type.split("/")[1] || "File"}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              attachments: prev.attachments?.filter(
                                (a) => a.id !== att.id,
                              ),
                            }));
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* E-Signatures Section */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
              E-Signatures / Approvals
            </h3>
            <div className="space-y-6">
              {formData.signatures && formData.signatures.length > 0 && (
                <div className="space-y-3">
                  {formData.signatures.map((sig) => (
                    <div
                      key={sig.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-indigo-200 hover:bg-slate-50 transition-colors gap-3"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {sig.image ? (
                          <div className="w-40 h-16 bg-white border border-slate-200 rounded flex items-center justify-center p-2 shrink-0">
                            <img
                              src={sig.image}
                              alt="Signature"
                              className="h-full object-contain mix-blend-multiply"
                            />
                          </div>
                        ) : (
                          <div className="w-40 h-16 bg-slate-50 border border-slate-200 rounded flex items-center justify-center p-2 shrink-0 text-slate-400 italic text-sm">
                            <span className="font-['Caveat',cursive] text-2xl text-slate-800">
                              {sig.name}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-800 text-sm">
                            {sig.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {sig.designation} • {sig.date}
                          </p>
                        </div>
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

              <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                      Draw Signature
                    </label>
                    <div className="border border-slate-300 rounded-lg bg-white relative overflow-hidden aspect-square w-full max-w-[250px]">
                      <SignatureCanvas
                        ref={sigPadRef}
                        penColor="black"
                        canvasProps={{ className: "w-full h-full rounded-lg" }}
                      />
                      <button
                        type="button"
                        onClick={handleClearSignature}
                        className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 rounded opacity-70 hover:opacity-100 transition-opacity"
                        title="Clear signature"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                      E-Signature Name
                    </label>
                    <input
                      type="text"
                      value={formData.inspectorName || ""}
                      onChange={handleChange}
                      name="inspectorName"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={sigInputDesignation || ""}
                      onChange={(e) => setSigInputDesignation(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. QC Inspector"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                      Signature Date
                    </label>
                    <input
                      type="date"
                      value={new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-100 cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
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
        </form>
      </div>
    </div>
  );
}
