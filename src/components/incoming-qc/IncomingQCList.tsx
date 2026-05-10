import React, { useState, useRef, useEffect } from "react";
import { IncomingQCRecord } from "./types";
import {
  Search,
  Filter,
  Plus,
  FileText,
  Download,
  FileSpreadsheet,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  LayoutGrid,
  List,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { ExportModal, IncomingQCExportOptions } from "./ExportModal";

interface Props {
  records: IncomingQCRecord[];
  onNavigate: (view: "dashboard" | "form") => void;
  onView: (r: IncomingQCRecord) => void;
  onEdit: (r: IncomingQCRecord) => void;
  onDelete: (id: string) => void;
}

export function IncomingQCList({
  records,
  onNavigate,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStyle, setFilterStyle] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm, filterCategory, filterStyle]);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTarget, setExportTarget] = useState<IncomingQCRecord[] | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenActionMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Derive unique categories/styles for filters
  const styles = Array.from(
    new Set(records.map((r) => r.style).filter(Boolean)),
  ) as string[];

  const filtered = records.filter((r) => {
    const matchSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      filterCategory === "All" || r.category === filterCategory;
    const matchStyle = !filterStyle || r.style === filterStyle;
    return matchSearch && matchCategory && matchStyle;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((r) => r.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newKeys = new Set(selectedIds);
    if (newKeys.has(id)) newKeys.delete(id);
    else newKeys.add(id);
    setSelectedIds(newKeys);
  };

  const handleOpenExportModal = (target: IncomingQCRecord[] = filtered) => {
    setExportTarget(target);
    setShowExportModal(true);
  };

  const handleExportPDF = (options: IncomingQCExportOptions) => {
    const dataToExport = exportTarget || filtered;
    const doc = new jsPDF();
    doc.text("Incoming QC Report", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [
        ["ID", "Date", "Supplier", "Category", "Style", "PO Number", "Status"],
      ],
      body: dataToExport.map((r) => [
        r.id,
        r.date,
        r.supplier,
        r.category,
        r.style || "-",
        r.poNumber || "-",
        r.status,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 70, 229] },
    });

    doc.save("Incoming_QC_Report.pdf");
  };

  const handleExportExcel = (options: IncomingQCExportOptions) => {
    const dataToExport = exportTarget || filtered;
    const worksheet = XLSX.utils.json_to_sheet(
      dataToExport.map((r) => {
        const baseRow: any = {
          ID: r.id,
          Date: r.date,
          Supplier: r.supplier,
          Category: r.category,
          Style: r.style || "",
          "PO Number": r.poNumber || "",
          Inspector: r.inspectorName,
          Status: r.status,
          "Defect Type": r.defectType || "",
        };

        if (options.includeSpecificDetails) {
          if (r.category === 'Fabric' && r.fabricDetails) {
            baseRow['4 Point'] = r.fabricDetails.fourPointInspection;
            baseRow['Shrinkage'] = r.fabricDetails.shrinkageTest;
            baseRow['Shadeband'] = r.fabricDetails.shadebandCheck;
            baseRow['CSV'] = r.fabricDetails.csvCheck;
            baseRow['Moisture'] = r.fabricDetails.moistureCheck;
          } else if (r.category === 'Accessories' && r.accessoriesDetails) {
            baseRow['Item Name'] = r.accessoriesDetails.itemName;
            baseRow['Quantity'] = r.accessoriesDetails.quantity;
            baseRow['Inspected Qty'] = r.accessoriesDetails.inspectedQuantity;
          }
        }

        if (options.includeNotes) {
          baseRow["Remarks"] = r.notes || "";
        }
        
        return baseRow;
      })
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "QC Records");

    XLSX.writeFile(workbook, "Incoming_QC_Records.xlsx");
  };

  return (
    <div className="h-full flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 lg:p-6 border-b border-slate-200 bg-slate-50 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Incoming QC Records
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Manage inspections for raw materials
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-200 p-1 rounded-lg mr-2 shrink-0">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => handleOpenExportModal()}
              className="px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-100 flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID or Supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 border rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${showFilters ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"}`}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white border border-slate-200 rounded-lg mt-2">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Categories</option>
                <option value="Fabric">Fabric</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Style
              </label>
              <select
                value={filterStyle}
                onChange={(e) => setFilterStyle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="">All Styles</option>
                {styles.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Show
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto bg-slate-50/50 min-h-[400px] pb-48">
        {viewMode === "list" ? (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.size === paginated.length &&
                      paginated.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300"
                  />
                </th>
                <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">
                  Style
                </th>
                <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">
                  PO Number
                </th>
                <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-bold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white cursor-default">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                paginated.map((record, index) => {
                  const isLastFew =
                    index >= paginated.length - 2 && paginated.length > 3;
                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(record.id)}
                          onChange={() => toggleSelect(record.id)}
                          className="rounded border-slate-300"
                        />
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {record.id}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {record.date}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">
                          {record.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-900 font-medium">
                        {record.style ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.dispatchEvent(
                                new CustomEvent("app-navigate", {
                                  detail: {
                                    module: "orders_and_buyers",
                                    styleNumber: record.style,
                                  },
                                }),
                              );
                            }}
                            className="text-indigo-600 hover:text-indigo-800 hover:underline"
                          >
                            {record.style}
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-900 font-medium">
                        {record.poNumber ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.dispatchEvent(
                                new CustomEvent("app-navigate", {
                                  detail: {
                                    module: "orders_and_buyers",
                                    poArticleNumber: record.poNumber,
                                  },
                                }),
                              );
                            }}
                            className="text-indigo-600 hover:text-indigo-800 hover:underline"
                          >
                            {record.poNumber}
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-900 font-medium">
                        {record.supplier}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            record.status === "Passed"
                              ? "bg-emerald-100 text-emerald-700"
                              : record.status === "Failed"
                                ? "bg-rose-100 text-rose-700"
                                : record.status === "Partial Pass"
                                  ? "bg-amber-100 text-amber-700"
                                  : record.status === "On Hold"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div
                          className="flex items-center justify-end gap-2"
                          ref={openActionMenuId === record.id ? menuRef : null}
                        >
                          <button
                            onClick={() => onView(record)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenActionMenuId(
                                  openActionMenuId === record.id
                                    ? null
                                    : record.id,
                                );
                              }}
                              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            {openActionMenuId === record.id && (
                              <div
                                className={`absolute right-0 w-48 bg-white border border-slate-200 rounded-md shadow-lg z-50 flex flex-col p-1 text-sm text-left ${isLastFew ? "bottom-full mb-1" : "top-full mt-1"}`}
                              >
                                <button
                                  onClick={() => {
                                    onView(record);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded"
                                >
                                  <Eye className="w-4 h-4" /> View Details
                                </button>
                                <button
                                  onClick={() => {
                                    onEdit(record);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded"
                                >
                                  <Edit className="w-4 h-4" /> Edit Record
                                </button>
                                <div className="h-px bg-slate-100 my-1"></div>
                                <button
                                  onClick={() => {
                                    handleOpenExportModal([record]);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded"
                                >
                                  <Download className="w-4 h-4" /> Export
                                </button>
                                <div className="h-px bg-slate-100 my-1"></div>
                                <button
                                  onClick={() => {
                                    if (confirm("Are you sure?"))
                                      onDelete(record.id);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 rounded"
                                >
                                  <Trash2 className="w-4 h-4" /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginated.length === 0 ? (
              <div className="col-span-full py-8 text-center text-slate-500">
                No records found.
              </div>
            ) : (
              paginated.map((record) => (
                <div
                  key={record.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(record.id)}
                        onChange={() => toggleSelect(record.id)}
                        className="rounded border-slate-300 mr-1"
                      />
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          record.status === "Passed"
                            ? "bg-emerald-100 text-emerald-700"
                            : record.status === "Failed"
                              ? "bg-rose-100 text-rose-700"
                              : record.status === "Partial Pass"
                                ? "bg-amber-100 text-amber-700"
                                : record.status === "On Hold"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>
                    <div
                      className="relative"
                      ref={openActionMenuId === record.id ? menuRef : null}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenActionMenuId(
                            openActionMenuId === record.id ? null : record.id,
                          );
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {openActionMenuId === record.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-md shadow-lg z-20 flex flex-col p-1 text-sm text-left">
                          <button
                            onClick={() => {
                              onView(record);
                              setOpenActionMenuId(null);
                            }}
                            className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded"
                          >
                            <Eye className="w-4 h-4" /> View Details
                          </button>
                          <button
                            onClick={() => {
                              onEdit(record);
                              setOpenActionMenuId(null);
                            }}
                            className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded"
                          >
                            <Edit className="w-4 h-4" /> Edit Record
                          </button>
                          <div className="h-px bg-slate-100 my-1"></div>
                          <button
                            onClick={() => {
                              handleOpenExportModal([record]);
                              setOpenActionMenuId(null);
                            }}
                            className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded"
                          >
                            <Download className="w-4 h-4" /> Export
                          </button>
                          <div className="h-px bg-slate-100 my-1"></div>
                          <button
                            onClick={() => {
                              if (confirm("Are you sure?")) onDelete(record.id);
                              setOpenActionMenuId(null);
                            }}
                            className="px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 rounded"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{record.id}</h3>
                  <div className="text-sm text-slate-600 mb-2">
                    {record.supplier}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    <span className="bg-slate-100 px-2 py-0.5 rounded">
                      {record.category}
                    </span>
                    {record.style && (
                      <span>
                        • Style:{" "}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.dispatchEvent(
                              new CustomEvent("app-navigate", {
                                detail: {
                                  module: "orders_and_buyers",
                                  styleNumber: record.style,
                                },
                              }),
                            );
                          }}
                          className="text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          {record.style}
                        </button>
                      </span>
                    )}
                    {record.poNumber && (
                      <span>
                        • PO:{" "}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.dispatchEvent(
                              new CustomEvent("app-navigate", {
                                detail: {
                                  module: "orders_and_buyers",
                                  poArticleNumber: record.poNumber,
                                },
                              }),
                            );
                          }}
                          className="text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          {record.poNumber}
                        </button>
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>{record.date}</span>
                    <span>Ins: {record.inspectorName}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <span>Show</span>
          <select
            className="border-slate-300 rounded px-2 py-1 focus:outline-none focus:border-indigo-500 bg-slate-50"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={80}>80</option>
            <option value={100}>100</option>
          </select>
          <span>per page</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-500">
            Showing{" "}
            {Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)} to{" "}
            {Math.min(currentPage * itemsPerPage, filtered.length)} of{" "}
            {filtered.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border border-slate-200 rounded bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50"
            >
              Prev
            </button>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border border-slate-200 rounded bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          onExportPDF={handleExportPDF}
          onExportCSV={handleExportExcel}
        />
      )}
    </div>
  );
}
