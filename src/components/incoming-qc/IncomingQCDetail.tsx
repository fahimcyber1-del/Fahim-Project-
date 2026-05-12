import React, { useState, useEffect } from "react";
import { IncomingQCRecord } from "./types";
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  FileSpreadsheet,
  Maximize2,
} from "lucide-react";
import { DocumentViewerModal } from "../common/DocumentViewerModal";
import { ExportModal, IncomingQCExportOptions } from "./ExportModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface Props {
  record: IncomingQCRecord;
  onNavigate: (view: "list") => void;
}

export function IncomingQCDetail({ record, onNavigate }: Props) {
  const [fullscreenDocument, setFullscreenDocument] = useState<{
    type: "image" | "pdf";
    content: string;
    name: string;
  } | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("app-fullscreen", { detail: true }));
    return () => {
      window.dispatchEvent(
        new CustomEvent("app-fullscreen", { detail: false }),
      );
    };
  }, []);

  const handleExportPDF = (options: IncomingQCExportOptions) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Header
    doc.setFillColor(79, 70, 229); // indigo-600
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("INCOMING QC REPORT", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Record ID: ${record.id}`, 14, 34);

    let currentY = 50;

    if (options.includeGeneralDetails) {
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("General details", 14, currentY);
      currentY += 6;

      const mainTableData = [
        ["Date", record.date, "Supplier", record.supplier || "-"],
        ["PO Number", record.poNumber || "-", "Style", record.style || "-"],
        ["Status", record.status, "Category", record.category],
        [
          "Inspector",
          record.inspectorName || "-",
          "Doc Code",
          record.documentCode || "-",
        ],
      ];

      autoTable(doc, {
        startY: currentY,
        body: mainTableData,
        theme: "plain",
        styles: { cellPadding: 3, fontSize: 10 },
        columnStyles: {
          0: { fontStyle: "bold", textColor: [100, 100, 100], cellWidth: 35 },
          1: { cellWidth: 55 },
          2: { fontStyle: "bold", textColor: [100, 100, 100], cellWidth: 35 },
          3: { cellWidth: 55 },
        },
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    if (
      options.includeSpecificDetails &&
      record.category === "Fabric" &&
      record.fabricDetails
    ) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Fabric Tests Results", 14, currentY);
      currentY += 6;
      autoTable(doc, {
        startY: currentY,
        body: [
          [
            "4 Point Inspection",
            record.fabricDetails.fourPointInspection || "-",
          ],
          ["Shrinkage Test", record.fabricDetails.shrinkageTest || "-"],
          ["Shadeband Check", record.fabricDetails.shadebandCheck || "-"],
          ["CSV Check", record.fabricDetails.csvCheck || "-"],
          ["Moisture Check", record.fabricDetails.moistureCheck || "-"],
        ],
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: { 0: { fontStyle: "bold", fillColor: [248, 250, 252] } },
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    if (
      options.includeSpecificDetails &&
      record.category === "Accessories" &&
      record.accessoriesDetails
    ) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Accessories QC Details", 14, currentY);
      currentY += 6;
      autoTable(doc, {
        startY: currentY,
        body: [
          ["Item Name", record.accessoriesDetails.itemName || "-"],
          ["For Style", record.accessoriesDetails.style || "-"],
          [
            "Total Quantity",
            record.accessoriesDetails.quantity?.toString() || "0",
          ],
          [
            "Inspected Quantity",
            record.accessoriesDetails.inspectedQuantity?.toString() || "0",
          ],
          [
            "Percentage Options",
            record.accessoriesDetails.percentageOptions || "-",
          ],
        ],
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: { 0: { fontStyle: "bold", fillColor: [248, 250, 252] } },
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    if (options.includeNotes && record.notes) {
      if (currentY > 240) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Notes", 14, currentY);
      currentY += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(record.notes, pageWidth - 28);
      doc.text(lines, 14, currentY);
      currentY += lines.length * 5 + 10;
    }

    if (
      options.includeAttachments &&
      record.attachments &&
      record.attachments.length > 0
    ) {
      if (currentY > 240) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Attachments Summary", 14, currentY);
      currentY += 6;
      autoTable(doc, {
        startY: currentY,
        head: [["File Name", "Type"]],
        body: record.attachments.map((att) => [att.name, att.type]),
        theme: "striped",
        headStyles: {
          fillColor: [241, 245, 249],
          textColor: [71, 85, 105],
          fontStyle: "bold",
        },
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    if (record.signatures && record.signatures.length > 0) {
      if (currentY > 200) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("E-Signatures / Approvals", 14, currentY);
      currentY += 10;

      let sigX = 14;
      record.signatures.forEach((sig, index) => {
        if (sigX > pageWidth - 60) {
          sigX = 14;
          currentY += 40;
          if (currentY > 240) {
            doc.addPage();
            currentY = 20;
          }
        }

        doc.setDrawColor(200);
        doc.rect(sigX, currentY, 50, 20);

        if (sig.image) {
          try {
            doc.addImage(sig.image, "PNG", sigX + 2, currentY + 2, 46, 16);
          } catch (e) {
            console.error("Failed to add signature image to PDF", e);
          }
        } else {
          doc.setFontSize(12);
          doc.setFont("helvetica", "italic");
          doc.text(sig.name, sigX + 25, currentY + 12, { align: "center" });
        }

        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(sig.name, sigX + 25, currentY + 25, { align: "center" });
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100);
        doc.text(`${sig.designation} • ${sig.date}`, sigX + 25, currentY + 29, {
          align: "center",
        });
        doc.setTextColor(30);

        sigX += 60;
      });
      currentY += 40;
    }

    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" },
      );
    }

    doc.save(`IncomingQC_${record.id}.pdf`);
  };

  const handleExportCSV = (options: IncomingQCExportOptions) => {
    let dataToExport: any = {
      "Record ID": record.id,
      Date: record.date,
      Supplier: record.supplier,
      "PO Number": record.poNumber,
      Style: record.style,
      Category: record.category,
      Status: record.status,
      "Inspector Name": record.inspectorName,
      "Document Code": record.documentCode,
    };

    if (
      options.includeSpecificDetails &&
      record.category === "Fabric" &&
      record.fabricDetails
    ) {
      dataToExport = {
        ...dataToExport,
        "4 Point Inspection": record.fabricDetails.fourPointInspection,
        "Shrinkage Test": record.fabricDetails.shrinkageTest,
        "Shadeband Check": record.fabricDetails.shadebandCheck,
        "CSV Check": record.fabricDetails.csvCheck,
        "Moisture Check": record.fabricDetails.moistureCheck,
      };
    }

    if (
      options.includeSpecificDetails &&
      record.category === "Accessories" &&
      record.accessoriesDetails
    ) {
      dataToExport = {
        ...dataToExport,
        "Item Name": record.accessoriesDetails.itemName,
        Quantity: record.accessoriesDetails.quantity,
        "Inspected Quantity": record.accessoriesDetails.inspectedQuantity,
        "Percentage Options": record.accessoriesDetails.percentageOptions,
      };
    }

    if (options.includeNotes) {
      dataToExport["Notes"] = record.notes;
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([dataToExport]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "QC Details");
    XLSX.writeFile(workbook, `IncomingQC_${record.id}.xlsx`);
  };

  return (
    <div className="h-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
      <div className="flex-none p-4 lg:p-6 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate("list")}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Record {record.id}
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Detailed view of incoming inspection
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExportModal(true)}
            className="px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-100 flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  record.status === "Passed"
                    ? "bg-emerald-100 text-emerald-600"
                    : record.status === "Failed"
                      ? "bg-rose-100 text-rose-600"
                      : record.status === "Partial Pass"
                        ? "bg-amber-100 text-amber-600"
                        : record.status === "On Hold"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-slate-100 text-slate-600"
                }`}
              >
                {record.status === "Passed" && (
                  <CheckCircle className="w-6 h-6" />
                )}
                {record.status === "Failed" && (
                  <AlertTriangle className="w-6 h-6" />
                )}
                {(record.status === "Pending" ||
                  record.status === "On Hold") && <Clock className="w-6 h-6" />}
                {record.status === "Partial Pass" && (
                  <CheckCircle className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase">
                  Inspection Status
                </h3>
                <p
                  className={`text-xl font-black ${
                    record.status === "Passed"
                      ? "text-emerald-600"
                      : record.status === "Failed"
                        ? "text-rose-600"
                        : record.status === "Partial Pass"
                          ? "text-amber-600"
                          : record.status === "On Hold"
                            ? "text-blue-600"
                            : "text-slate-600"
                  }`}
                >
                  {record.status}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-500 uppercase">
                Category
              </p>
              <p className="text-xl font-black text-slate-900">
                {record.category}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
              General Details
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:p-6">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Date
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {record.date}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Supplier
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {record.supplier}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  PO Number
                </p>
                {record.poNumber ? (
                  <button
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("app-navigate", {
                          detail: {
                            module: "orders_and_buyers",
                            poArticleNumber: record.poNumber,
                          },
                        }),
                      );
                    }}
                    className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline text-left bg-transparent border-none p-0 cursor-pointer inline focus:outline-none"
                  >
                    {record.poNumber}
                  </button>
                ) : (
                  <p className="text-sm font-bold text-slate-900">N/A</p>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Inspector
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {record.inspectorName}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Style
                </p>
                {record.style ? (
                  <button
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("app-navigate", {
                          detail: {
                            module: "orders_and_buyers",
                            styleNumber: record.style,
                          },
                        }),
                      );
                    }}
                    className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline text-left bg-transparent border-none p-0 cursor-pointer inline focus:outline-none"
                  >
                    {record.style}
                  </button>
                ) : (
                  <p className="text-sm font-bold text-slate-900">N/A</p>
                )}
              </div>
              {record.defectType && (
                <div className="col-span-2 lg:col-span-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Defect Type
                  </p>
                  <p className="text-sm font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded px-2 py-1 inline-block">
                    {record.defectType}
                  </p>
                </div>
              )}
            </div>
          </div>

          {record.category === "Fabric" && record.fabricDetails && (
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
                Fabric Tests Results
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    4 Point Inspection
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {record.fabricDetails.fourPointInspection || "N/A"}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Shrinkage Test
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {record.fabricDetails.shrinkageTest || "N/A"}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Shadeband Check
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {record.fabricDetails.shadebandCheck || "N/A"}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    CSV Check
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {record.fabricDetails.csvCheck || "N/A"}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Moisture Check
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {record.fabricDetails.moistureCheck || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {record.category === "Accessories" && record.accessoriesDetails && (
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
                Accessories QC Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Item Name
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {record.accessoriesDetails.itemName || "N/A"}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    For Style
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {record.accessoriesDetails.style || "N/A"}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Total Quantity
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {record.accessoriesDetails.quantity || "0"}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Inspected Quantity
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {record.accessoriesDetails.inspectedQuantity || "0"}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Percentage Options
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {record.accessoriesDetails.percentageOptions || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {record.notes && (
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
                Notes
              </h3>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                {record.notes}
              </p>
            </div>
          )}

          {record.attachments && record.attachments.length > 0 && (
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
                Attachments
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {record.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="group relative border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="h-32 bg-slate-50 flex items-center justify-center border-b border-slate-100 overflow-hidden relative">
                      {att.type.startsWith("image/") ? (
                        <img
                          src={att.url}
                          alt={att.name}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                      ) : att.type === "application/pdf" ? (
                        <div className="relative w-full h-full">
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                            <span className="text-xs font-bold text-slate-400 uppercase">
                              PDF Preview
                            </span>
                          </div>
                          <embed
                            src={`${att.url}#toolbar=0&navpanes=0&scrollbar=0`}
                            type="application/pdf"
                            className="w-full h-full relative z-10 pointer-events-none opacity-50"
                          />
                        </div>
                      ) : (
                        <FileSpreadsheet className="w-8 h-8 text-slate-300" />
                      )}

                      {/* Overlay actions */}
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20 backdrop-blur-[2px]">
                        {(att.type.startsWith("image/") ||
                          att.type === "application/pdf") && (
                          <button
                            onClick={() =>
                              setFullscreenDocument({
                                type: att.type.startsWith("image/")
                                  ? "image"
                                  : "pdf",
                                content: att.url,
                                name: att.name,
                              })
                            }
                            className="p-2 bg-white text-slate-700 hover:text-indigo-600 rounded-lg shadow-sm transition-colors"
                            title="Full View"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        )}
                        <a
                          href={att.url}
                          download={att.name}
                          className="p-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                    <div className="p-2.5">
                      <p
                        className="text-xs font-semibold text-slate-700 truncate w-full"
                        title={att.name}
                      >
                        {att.name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider">
                        {att.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Signatures */}
          {record.signatures && record.signatures.length > 0 && (
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
                E-Signatures / Approvals
              </h3>
              <div className="flex flex-wrap gap-6">
                {record.signatures.map((sig) => (
                  <div
                    key={sig.id}
                    className="flex flex-col border border-slate-200 rounded-lg p-4 bg-slate-50 min-w-[200px]"
                  >
                    {sig.image ? (
                      <div className="h-16 flex items-center justify-center mb-4 bg-white border border-slate-100 rounded">
                        <img
                          src={sig.image}
                          alt="Signature"
                          className="h-full object-contain mix-blend-multiply"
                        />
                      </div>
                    ) : (
                      <div className="h-16 flex items-center justify-center mb-4 bg-slate-100 border border-slate-200 rounded text-slate-400 italic text-sm">
                        <span className="font-['Caveat',cursive] text-2xl text-slate-800">
                          {sig.name}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-slate-200 pt-3">
                      <p className="text-sm font-bold text-slate-800">
                        {sig.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {sig.designation}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {sig.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {fullscreenDocument && (
        <DocumentViewerModal
          type={fullscreenDocument.type}
          content={fullscreenDocument.content}
          name={fullscreenDocument.name}
          onClose={() => setFullscreenDocument(null)}
        />
      )}

      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          onExportPDF={handleExportPDF}
          onExportCSV={handleExportCSV}
        />
      )}
    </div>
  );
}
