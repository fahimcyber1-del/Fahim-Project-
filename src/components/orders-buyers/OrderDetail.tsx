import React, { useState, useEffect } from 'react';
import { Order } from './types';
import { ArrowLeft, Edit, FileText, Download, User, Calendar, CreditCard, DollarSign, Bookmark, HardHat, Ship, Layers, ClipboardList, X, History } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ExportModal, OrderExportOptions } from './ExportModal';
import { DocumentViewerModal } from '../common/DocumentViewerModal';

interface OrderDetailProps {
  order: Order;
  onBack: () => void;
  onEdit: (order: Order) => void;
}

export function OrderDetail({ order, onBack, onEdit }: OrderDetailProps) {
  const [viewModal, setViewModal] = useState<{ type: 'image' | 'pdf', content: string, name?: string } | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('app-fullscreen', { detail: true }));
    return () => {
      window.dispatchEvent(new CustomEvent('app-fullscreen', { detail: false }));
    };
  }, []);

  const handleExportPDF = (options: OrderExportOptions) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFillColor(79, 70, 229); // indigo-600
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('ORDER REPORT', 14, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`PO Number: ${order.poArticleNumber}`, 14, 34);

    let currentY = 50;

    // Reset text color for body
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Summary', 14, currentY);
    currentY += 6;

    const mainTableData = [
      ['Style Number', order.styleNumber, 'Item Name', order.itemName || '-'],
      ['Buyer', order.buyerName, 'Merchandiser', order.merchandiserName || '-'],
      ['Order Date', order.orderDate, 'Delivery Date', order.deliveryDate],
      ['Quantity', order.quantity.toString(), 'Total Amount', `$${order.totalAmount.toFixed(2)}`],
      ['Status', order.status, '', '']
    ];

    autoTable(doc, {
      startY: currentY,
      body: mainTableData,
      theme: 'plain',
      styles: { cellPadding: 3, fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [100, 100, 100], cellWidth: 35 },
        1: { cellWidth: 55 },
        2: { fontStyle: 'bold', textColor: [100, 100, 100], cellWidth: 35 },
        3: { cellWidth: 55 }
      }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;

    if (options.includePODetails && order.poDetails && order.poDetails.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('PO Breakdown', 14, currentY);
      currentY += 6;
      const poData: string[][] = [];
      order.poDetails.forEach(po => {
        po.breakdowns.forEach(bd => {
           poData.push([po.poArticleNumber, bd.color, bd.size, bd.quantity.toString()]);
        });
      });
      autoTable(doc, {
        startY: currentY,
        head: [['PO Number', 'Color', 'Size', 'Quantity']],
        body: poData,
        theme: 'striped',
        headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105], fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 4 }
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    if (options.includeBOM && order.bomEntries && order.bomEntries.length > 0) {
      if (currentY > 240) { doc.addPage(); currentY = 20; }
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Bill of Materials (BOM)', 14, currentY);
      currentY += 6;
      autoTable(doc, {
        startY: currentY,
        head: [['Category', 'Description', 'Consumption', 'Unit Price', 'Total Cost']],
        body: order.bomEntries.map(b => [b.category, b.itemDescription, `${b.consumption} ${b.uom}`, `$${b.unitPrice.toFixed(2)}`, `$${b.totalCost.toFixed(2)}`]),
        theme: 'striped',
        headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105], fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 4 }
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    if (options.includeProductionTracking) {
      if (currentY > 240) { doc.addPage(); currentY = 20; }
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Production Tracking', 14, currentY);
      currentY += 6;
      
      const trackingData = [
         ['Cutting Phase', `Qty: ${order.cuttingQuantity?.toString() || '-'}`, `Dates: ${order.cuttingStartDate||'-'} to ${order.cuttingEndDate||'-'}`],
         ['Sewing Phase', `Input: ${order.sewingInputQuantity?.toString() || '-'}`, `Complete: ${order.sewingCompleteQuantity?.toString() || '-'}`],
         ['Finishing/Packing', `Packed: ${order.packingQuantity?.toString() || '-'}`, '']
      ];
      autoTable(doc, {
        startY: currentY,
        body: trackingData,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 4 },
        columnStyles: {
           0: { fontStyle: 'bold', fillColor: [248, 250, 252] }
        }
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    if (options.includeLogistics && order.shipmentMode) {
      if (currentY > 250) { doc.addPage(); currentY = 20; }
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Logistics Information', 14, currentY);
      currentY += 6;
      autoTable(doc, {
        startY: currentY,
        head: [['Shipment Mode', 'Vessel / Flight No', 'Port of Loading', 'Port of Discharge']],
        body: [[order.shipmentMode||'-', order.vesselFlightNo||'-', order.portOfLoading||'-', order.portOfDischarge||'-']],
        theme: 'striped',
        headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105], fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 4 }
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    if (options.includeProductImage && order.productImage) {
      if (currentY > 180) { doc.addPage(); currentY = 20; }
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Product Image', 14, currentY);
      currentY += 10;
      try {
        doc.addImage(order.productImage, 'JPEG', 14, currentY, 80, 80);
        currentY += 90;
      } catch (e) {
        console.error("Could not add product image to PDF", e);
      }
    }

    // Add footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }

    doc.save(`Order_${order.poArticleNumber}.pdf`);
  };

  const handleExportCSV = (options: OrderExportOptions) => {
     // Flatten data for basic CSV
     const dataToExport = [{
        'PO Number': order.poArticleNumber,
        'Buyer': order.buyerName,
        'Style': order.styleNumber,
        'Order Date': order.orderDate,
        'Delivery Date': order.deliveryDate,
        'Quantity': order.quantity,
        'Status': order.status,
        'Created By': order.createdBy || '-',
        'Created At': order.createdAt || '-',
        'Last Edited By': order.lastEditedBy || '-',
        'Last Edited At': order.lastEditedAt || '-'
     }];
     
     const workbook = XLSX.utils.book_new();
     
     // Main info
     const worksheet = XLSX.utils.json_to_sheet(dataToExport);
     XLSX.utils.book_append_sheet(workbook, worksheet, 'Order Info');

     // PO Breakdown
     if (options.includePODetails && order.poDetails) {
        const poRows: any[] = [];
        order.poDetails.forEach(po => po.breakdowns.forEach(bd => {
           poRows.push({
             'PO Number': po.poArticleNumber,
             'Color': bd.color,
             'Size': bd.size,
             'Quantity': bd.quantity
           });
        }));
        if (poRows.length > 0) {
          const wsPo = XLSX.utils.json_to_sheet(poRows);
          XLSX.utils.book_append_sheet(workbook, wsPo, 'PO Breakdown');
        }
     }

     // BOM
     if (options.includeBOM && order.bomEntries && order.bomEntries.length > 0) {
       const wsBom = XLSX.utils.json_to_sheet(order.bomEntries.map(b => ({
         'Category': b.category,
         'Description': b.itemDescription,
         'Supplier': b.supplierName,
         'Consumption': b.consumption,
         'UOM': b.uom,
         'Unit Price': b.unitPrice,
         'Total Cost': b.totalCost
       })));
       XLSX.utils.book_append_sheet(workbook, wsBom, 'BOM');
     }

     XLSX.writeFile(workbook, `Order_${order.poArticleNumber}.xlsx`);
  };

  return (
    <div className="w-full bg-slate-50 min-h-full">
      {/* Header */}
      <div className="p-4 sm:p-6 pb-4 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
        <button 
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-4 w-fit font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{order.poArticleNumber}</h1>
              <div className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                order.status === 'Completed' || order.status === 'Shipped' ? 'bg-emerald-100 text-emerald-700' : 
                order.status === 'In Production' ? 'bg-blue-100 text-blue-700' :
                order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {order.status}
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <p className="text-sm text-slate-500 font-medium">Style: <span className="text-slate-900 font-bold">{order.styleNumber}</span></p>
              {order.itemName && <p className="text-sm text-slate-500 font-medium">Item Name / Description: <span className="text-slate-900 font-bold">{order.itemName}</span></p>}
              {order.productItemDetail && <p className="text-sm text-slate-500 font-medium max-w-3xl">Product Details: <span className="text-slate-900">{order.productItemDetail}</span></p>}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => setShowExportModal(true)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-indigo-500" /> Export
            </button>
            <button 
              onClick={() => onEdit(order)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <Edit className="w-4 h-4" /> Edit Order
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6 pb-12">
          
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:p-6">
            
            {/* Left Sidebar (Image, Tech Pack) */}
            <div className="xl:col-span-3 space-y-6">
               {/* Product Card */}
               <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div 
                    className={`relative p-4 bg-slate-50 flex items-center justify-center min-h-[220px] ${order.productImage ? 'cursor-pointer group' : ''}`}
                    onClick={() => order.productImage && setViewModal({ type: 'image', content: order.productImage })}
                  >
                     {order.productImage ? (
                       <>
                         <img src={order.productImage} alt={order.poArticleNumber} className="w-48 h-48 object-cover rounded-xl shadow-sm border border-slate-200 group-hover:scale-105 transition-transform duration-300" />
                         <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center rounded-t-2xl">
                           <div className="opacity-0 group-hover:opacity-100 bg-white/90 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm transition-opacity">
                             View Image
                           </div>
                         </div>
                       </>
                     ) : (
                       <div className="w-40 h-40 mx-auto bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center text-slate-400 flex-col gap-3">
                         <Bookmark className="w-8 h-8 text-slate-300" />
                         <span className="text-xs font-bold uppercase tracking-wider text-slate-400">No Image</span>
                       </div>
                     )}
                  </div>
                  <div className="p-5 border-t border-slate-100">
                    {order.timelineStatus && (
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Timeline Status</span>
                        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" /> {order.timelineStatus}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Delivery Date</span>
                      <span className="text-sm font-black text-slate-900">{order.deliveryDate}</span>
                    </div>
                  </div>
               </div>

               {order.buyerTechPack && (
                  <div 
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors cursor-pointer group"
                    onClick={() => order.buyerTechPack && setViewModal({ type: 'pdf', content: order.buyerTechPack, name: order.buyerTechPackName || order.buyerTechPack })}
                  >
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-500" /> Tech Pack
                    </h3>
                    <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl group-hover:bg-indigo-100 transition-colors">
                       <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                       <div className="flex-1 overflow-hidden">
                         <p className="text-sm font-bold text-indigo-900 truncate" title={order.buyerTechPack}>
                           {order.buyerTechPackName || order.buyerTechPack}
                         </p>
                         <p className="text-[10px] text-indigo-600 mt-0.5 font-medium">Click to view document</p>
                       </div>
                    </div>
                  </div>
               )}
            </div>

            {/* Main Content Details */}
            <div className="xl:col-span-9 space-y-6">
               
               {/* Commercials Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                     <div className="flex items-center gap-2 text-slate-500 mb-2">
                       <Layers className="w-4 h-4" />
                       <p className="text-xs font-bold uppercase tracking-wider">Total Quantity</p>
                     </div>
                     <p className="text-3xl font-black text-slate-900">{order.quantity.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                     <div className="flex items-center gap-2 text-slate-500 mb-2">
                       <DollarSign className="w-4 h-4" />
                       <p className="text-xs font-bold uppercase tracking-wider">Unit Price</p>
                     </div>
                     <p className="text-3xl font-black text-emerald-600">${order.unitPrice.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg text-white flex flex-col justify-center relative overflow-hidden">
                     <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                     <div className="flex items-center gap-2 text-slate-400 mb-2 relative z-10">
                       <CreditCard className="w-4 h-4" />
                       <p className="text-xs font-bold uppercase tracking-wider">Total Value</p>
                     </div>
                     <p className="text-3xl font-black mt-1 relative z-10">${order.totalAmount.toLocaleString()}</p>
                  </div>
               </div>

               {/* Stakeholders & Logistics Row */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
                 {/* Stakeholders */}
                 <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-5 flex items-center gap-2 pb-3 border-b border-slate-100">
                      <User className="w-4 h-4 text-indigo-500" /> Stakeholders
                    </h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Buyer</p>
                        <p className="text-sm font-bold text-slate-900">{order.buyerName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Merchandiser</p>
                        <p className="text-sm font-bold text-slate-900">{order.merchandiserName || 'Not Assigned'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Order Date</p>
                        <p className="text-sm font-semibold text-slate-700">{order.orderDate}</p>
                      </div>
                    </div>
                 </div>

                 {/* Logistics */}
                 <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-5 flex items-center gap-2 pb-3 border-b border-slate-100">
                      <Ship className="w-4 h-4 text-blue-500" /> Logistics
                    </h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                       <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Shipment Mode</p>
                         <p className="text-sm font-bold text-slate-900">{order.shipmentMode || '-'}</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Vessel/Flight No</p>
                         <p className="text-sm font-bold text-slate-900">{order.vesselFlightNo || '-'}</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Load Port</p>
                         <p className="text-sm font-semibold text-slate-700">{order.portOfLoading || '-'}</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Discharge Port</p>
                         <p className="text-sm font-semibold text-slate-700">{order.portOfDischarge || '-'}</p>
                       </div>
                    </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 gap-4 sm:p-6">
                 {/* Production Tracking Overview */}
                 <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
                       <Calendar className="w-4 h-4 text-blue-500" /> Production Tracking
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                       <div className="border border-rose-100 rounded-xl p-4 bg-rose-50 flex flex-col justify-between">
                          <h4 className="text-sm font-bold text-rose-800 mb-4 pb-2 border-b border-rose-200/50">Accessories</h4>
                          <div className="space-y-3 text-sm">
                             <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase text-rose-600/70 mb-0.5">Item Name</span>
                                <span className="font-bold text-rose-950 truncate line-clamp-1" title={order.accessoriesItemName || '-'}>{order.accessoriesItemName || '-'}</span>
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase text-rose-600/70 mb-0.5">Quantity</span>
                                <span className="font-bold text-rose-950">{order.accessoriesQuantity || '-'}</span>
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase text-rose-600/70 mb-0.5">Inhouse Date</span>
                                <span className="font-bold text-rose-950">{order.accessoriesInhouseDate || '-'}</span>
                             </div>
                          </div>
                       </div>

                       <div className="border border-blue-100 rounded-xl p-4 bg-blue-50 flex flex-col justify-between">
                          <h4 className="text-sm font-bold text-blue-800 mb-4 pb-2 border-b border-blue-200/50">Cutting</h4>
                          <div className="space-y-3 text-sm">
                             <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase text-blue-600/70 mb-0.5">Quantity</span>
                                <span className="font-black text-blue-950">{order.cuttingQuantity || '-'}</span>
                             </div>
                             <div className="grid grid-cols-2 gap-2">
                               <div className="flex flex-col">
                                  <span className="text-[10px] font-bold uppercase text-blue-600/70 mb-0.5">Start</span>
                                  <span className="font-bold text-blue-950 text-xs">{order.cuttingStartDate || '-'}</span>
                               </div>
                               <div className="flex flex-col text-right">
                                  <span className="text-[10px] font-bold uppercase text-blue-600/70 mb-0.5">End</span>
                                  <span className="font-bold text-blue-950 text-xs">{order.cuttingEndDate || '-'}</span>
                               </div>
                             </div>
                          </div>
                       </div>

                       <div className="border border-emerald-100 rounded-xl p-4 bg-emerald-50 flex flex-col justify-between">
                          <h4 className="text-sm font-bold text-emerald-800 mb-4 pb-2 border-b border-emerald-200/50">Sewing</h4>
                          <div className="space-y-3 text-sm">
                             <div className="grid grid-cols-2 gap-2">
                               <div className="flex flex-col">
                                  <span className="text-[10px] font-bold uppercase text-emerald-600/70 mb-0.5">Input</span>
                                  <span className="font-black text-emerald-950">{order.sewingInputQuantity || '-'}</span>
                               </div>
                               <div className="flex flex-col text-right">
                                  <span className="text-[10px] font-bold uppercase text-emerald-600/70 mb-0.5">Complete</span>
                                  <span className="font-black text-emerald-950">{order.sewingCompleteQuantity || '-'}</span>
                               </div>
                             </div>
                             <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-200/50">
                               <div className="flex flex-col">
                                  <span className="text-[10px] font-bold uppercase text-emerald-600/70 mb-0.5">Start</span>
                                  <span className="font-bold text-emerald-950 text-xs">{order.sewingStartDate || '-'}</span>
                               </div>
                               <div className="flex flex-col text-right">
                                  <span className="text-[10px] font-bold uppercase text-emerald-600/70 mb-0.5">End</span>
                                  <span className="font-bold text-emerald-950 text-xs">{order.sewingEndDate || '-'}</span>
                               </div>
                             </div>
                          </div>
                       </div>

                       <div className="border border-indigo-100 rounded-xl p-4 bg-indigo-50 flex flex-col justify-between">
                          <h4 className="text-sm font-bold text-indigo-800 mb-4 pb-2 border-b border-indigo-200/50">Finishing & Packing</h4>
                          <div className="space-y-3 text-sm">
                             <div className="grid grid-cols-2 gap-2">
                               <div className="flex flex-col">
                                  <span className="text-[10px] font-bold uppercase text-indigo-600/70 mb-0.5">Input</span>
                                  <span className="font-black text-indigo-950">{order.finishingInputQuantity || '-'}</span>
                               </div>
                               <div className="flex flex-col text-right">
                                  <span className="text-[10px] font-bold uppercase text-indigo-600/70 mb-0.5">Complete</span>
                                  <span className="font-black text-indigo-950">{order.finishingCompleteQuantity || '-'}</span>
                               </div>
                             </div>
                             <div className="flex items-center justify-between pt-2 border-t border-indigo-200/50">
                                <span className="text-xs font-bold uppercase text-indigo-800">Packed Total</span>
                                <span className="font-black text-indigo-950 text-lg">{order.packingQuantity || '-'}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Washing Info if present */}
                 {order.hasWashing && (
                   <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
                        <HardHat className="w-4 h-4 text-emerald-500" /> Washing Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
                        <div className="text-sm text-slate-700 bg-emerald-50 p-4 rounded-xl border border-emerald-100 h-full">
                          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-2">Instructions</p>
                          <p className="font-medium text-emerald-950 leading-relaxed">{order.washingInstructions || 'No specific instructions provided.'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Send Qty</p>
                               <p className="font-black text-slate-900">{order.washingQuantitySend || '-'}</p>
                            </div>
                            <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Receive Qty</p>
                               <p className="font-black text-slate-900">{order.washingQuantityReceive || '-'}</p>
                            </div>
                            <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Send Date</p>
                               <p className="font-semibold text-slate-700">{order.washingSendDate || '-'}</p>
                            </div>
                            <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Receive Date</p>
                               <p className="font-semibold text-slate-700">{order.washingReceiveDate || '-'}</p>
                            </div>
                            <div className="col-span-2 pt-2">
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Send Address</p>
                               <p className="font-medium text-slate-900">{order.washingSendAddress || '-'}</p>
                            </div>
                        </div>
                      </div>
                   </div>
                 )}
               </div>

               {/* PO Details Table */}
               <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
                     <Layers className="w-4 h-4 text-indigo-500" /> PO & Breakdown
                  </h3>
                  {order.poDetails && order.poDetails.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
                      {order.poDetails.map((po, index) => (
                        <div key={po.id || index} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                           <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                             <span className="text-xs font-black text-slate-700 uppercase tracking-wider">PO: {po.poArticleNumber || 'N/A'}</span>
                           </div>
                           <table className="w-full text-left text-sm">
                             <thead className="bg-white text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                               <tr>
                                 <th className="px-4 py-2 font-bold">Color</th>
                                 <th className="px-4 py-2 font-bold">Size</th>
                                 <th className="px-4 py-2 text-right font-bold">Qty</th>
                               </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100 bg-white">
                               {po.breakdowns.map((bd, i) => (
                                 <tr key={bd.id || i} className="hover:bg-slate-50 transition-colors">
                                   <td className="px-4 py-2.5 text-slate-800 font-medium">{bd.color || '-'}</td>
                                   <td className="px-4 py-2.5 text-slate-600 font-semibold">{bd.size || '-'}</td>
                                   <td className="px-4 py-2.5 text-slate-900 font-black text-right">{bd.quantity}</td>
                                 </tr>
                               ))}
                             </tbody>
                           </table>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm font-semibold text-slate-500 p-4 sm:p-6 lg:p-8 text-center bg-slate-50 rounded-xl border border-slate-100 border-dashed">No breakdowns defined for this order.</div>
                  )}
               </div>

                {/* BOM Table */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
                       <ClipboardList className="w-4 h-4 text-rose-500" /> Bill of Materials (BOM)
                    </h3>
                    {order.bomEntries && order.bomEntries.length > 0 ? (
                      <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
                         <table className="w-full text-left whitespace-nowrap text-sm">
                            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 font-bold">
                               <tr>
                                 <th className="px-5 py-3">Category</th>
                                 <th className="px-5 py-3">Item Description</th>
                                 <th className="px-5 py-3 text-right">Consumption</th>
                                 <th className="px-5 py-3 text-right">Unit Price</th>
                                 <th className="px-5 py-3 text-right">Total</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                               {order.bomEntries.map((bom, i) => (
                                  <tr key={bom.id || i} className="hover:bg-slate-50 transition-colors">
                                     <td className="px-5 py-3.5 text-slate-900 font-bold">{bom.category || '-'}</td>
                                     <td className="px-5 py-3.5 text-slate-700 font-medium">{bom.itemDescription || '-'}</td>
                                     <td className="px-5 py-3.5 text-slate-600 font-semibold text-right">{bom.consumption} <span className="text-slate-400 font-normal">{bom.uom}</span></td>
                                     <td className="px-5 py-3.5 text-slate-700 font-semibold text-right">${bom.unitPrice?.toFixed(2)}</td>
                                     <td className="px-5 py-3.5 text-emerald-700 font-black text-right">${bom.totalCost?.toFixed(2)}</td>
                                  </tr>
                               ))}
                            </tbody>
                         </table>
                      </div>
                    ) : (
                      <div className="text-sm font-semibold text-slate-500 p-4 sm:p-6 lg:p-8 text-center bg-slate-50 rounded-xl border border-slate-100 border-dashed">No BOM entries defined for this order.</div>
                    )}
                 </div>

                 {/* Audit Trail */}
                 <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-bl-full opacity-50 blur-xl"></div>
                    <div className="relative z-10 flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                          <History className="w-5 h-5 text-indigo-600" />
                       </div>
                       <div>
                          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Audit Trail</h3>
                          <p className="text-xs text-slate-500 font-medium">System tracking for this record</p>
                       </div>
                    </div>
                    <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-8">
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Created By</p>
                          <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /> {order.createdBy || '-'}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{order.createdAt || '-'}</p>
                       </div>
                       <div className="hidden sm:block w-px bg-slate-200 h-10 my-auto"></div>
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Last Edited By</p>
                          <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5"><Edit className="w-3.5 h-3.5 text-slate-400" /> {order.lastEditedBy || '-'}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{order.lastEditedAt || '-'}</p>
                       </div>
                    </div>
                 </div>

            </div>
          </div>
        </div>
      </div>

      {/* Viewer Modal */}
      {viewModal && (
        <DocumentViewerModal
          type={viewModal.type}
          content={viewModal.content}
          name={viewModal.name}
          onClose={() => setViewModal(null)}
        />
      )}

      {/* Export Modal */}
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
