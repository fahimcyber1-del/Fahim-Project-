/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { apiStorage } from './utils/apiStorage';
import { useState, useEffect } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { Dashboard } from "./components/dashboard/Dashboard";
import { ProductionQualityModule } from "./components/production-quality/ProductionQualityModule";
import { InspectionModule } from "./components/inspection/InspectionModule";
import { IncomingQCModule } from "./components/incoming-qc/IncomingQCModule";
import { QualityInventoryModule } from "./components/quality-inventory/QualityInventoryModule";
import { DefectLibraryModule } from "./components/defect-library/DefectLibraryModule";
import { OrdersBuyersModule } from "./components/orders-buyers/OrdersBuyersModule";
import { NotificationsModule } from "./components/notifications/NotificationsModule";
import { APP_MODULES } from "./config/modules";
import { Card, CardContent } from "./components/ui/card";
import { FileText } from "lucide-react";

import { TestingModule } from "./components/testing/TestingModule";
import { CalibrationModule } from "./components/calibration/CalibrationModule";
import { AuditModule } from "./components/audit/AuditModule";
import { CertificateModule } from "./components/certificate/CertificateModule";
import { TraceabilityModule } from "./components/traceability/TraceabilityModule";
import { KpiModule } from "./components/kpi/KpiModule";
import { SubSuppliersModule } from "./components/sub-suppliers/SubSuppliersModule";
import { CustomerComplaintsModule } from "./components/customer-complaints/CustomerComplaintsModule";
import { QualityGoalModule } from "./components/quality-goal/QualityGoalModule";
import { CapaModule } from "./components/capa/CapaModule";
import { RiskAssessmentModule } from "./components/risk-assessment/RiskAssessmentModule";
import { RootCauseModule } from "./components/root-cause/RootCauseModule";
import { DocumentControlModule } from "./components/document-control/DocumentControlModule";

import { SopManagementModule } from "./components/sop-management/SopManagementModule";
import { QualityManualModule } from "./components/quality-manual/QualityManualModule";
import { ProcedureModule } from "./components/procedure/ProcedureModule";
import { OrganogramModule } from "./components/organogram/OrganogramModule";
import { ProcessFlowModule } from "./components/process-flow/ProcessFlowModule";
import { JobDescriptionModule } from "./components/job-description/JobDescriptionModule";
import { TrainingModule } from "./components/training/TrainingModule";
import { MeetingMinutesModule } from "./components/meeting-minutes/MeetingMinutesModule";
import { ReportAnalysisModule } from "./components/report-analysis/ReportAnalysisModule";
import { SettingModule } from "./components/setting/SettingModule";
import { CommunicationPortalModule } from "./components/communication/CommunicationPortalModule";
import { EventModule } from "./components/events/EventModule";
import { BlogModule } from "./components/blog/BlogModule";
import { Login } from "./components/auth/Login";
import { useAppearance } from "./components/setting/AppearanceContext";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [navigationPayload, setNavigationPayload] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { settings } = useAppearance();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = apiStorage.getItem('aqm_current_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsAuthenticated(true);
        // Sync to profile format expected
        apiStorage.setItem('userProfile', JSON.stringify({
          name: user?.name || 'Admin',
          email: user?.email || 'admin@example.com',
          role: user?.role || 'User',
          imageUrl: user?.imageUrl || 'https://i.pravatar.cc/150?u=admin'
        }));
      } catch (e) {
        console.error("Invalid user JSON:", e);
        apiStorage.removeItem('aqm_current_user');
      }
    }

    const handleNav = (e: CustomEvent) => {
      if (e.detail?.module) {
        setNavigationPayload(e.detail);
        setActiveModuleId(e.detail.module);
      }
    };
    
    const handleLogout = () => {
      apiStorage.removeItem('aqm_current_user');
      setIsAuthenticated(false);
    };

    const handleFullscreen = (e: CustomEvent) => {
      setIsFullscreen(!!e.detail);
    };

    window.addEventListener('app-navigate', handleNav as EventListener);
    window.addEventListener('app-logout', handleLogout);
    window.addEventListener('app-fullscreen', handleFullscreen as EventListener);
    return () => {
      window.removeEventListener('app-navigate', handleNav as EventListener);
      window.removeEventListener('app-logout', handleLogout);
      window.removeEventListener('app-fullscreen', handleFullscreen as EventListener);
    }
  }, []);

  useEffect(() => {
    // Handle UI size
    if (settings.uiSize === 'extra-compact') {
      document.documentElement.style.fontSize = '12px';
    } else if (settings.uiSize === 'compact') {
      document.documentElement.style.fontSize = '14px';
    } else if (settings.uiSize === 'large') {
      document.documentElement.style.fontSize = '18px';
    } else if (settings.uiSize === 'extra-large') {
      document.documentElement.style.fontSize = '20px';
    } else {
      document.documentElement.style.fontSize = '16px';
    }
  }, [settings.uiSize]);

  const handleLogin = (user: any) => {
    apiStorage.setItem('aqm_current_user', JSON.stringify(user));
    
    // Sync to profile format expected and dispatch event
    const userProfile = {
      name: user?.name || 'User',
      email: user?.email || '',
      role: user?.role || 'User',
      imageUrl: user?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`
    };
    apiStorage.setItem('userProfile', JSON.stringify(userProfile));
    window.dispatchEvent(new CustomEvent('profile-updated', { detail: userProfile }));
    
    setIsAuthenticated(true);
  };

  const activeModule = APP_MODULES.find((m) => m.id === activeModuleId);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const getBackgroundClass = () => {
    if (settings.backgroundWallpaper === 'custom' && settings.customWallpaperUrl) {
      return '';
    }
    switch (settings.backgroundWallpaper) {
      case 'abstract': return 'bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%234f46e5\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]';
      case 'geometric': return 'bg-slate-50 bg-[url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%2394a3b8\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")]';
      case 'gradient': return 'bg-gradient-to-tr from-slate-50 via-indigo-50/30 to-rose-50/30';
      case 'none':
      default: return 'bg-slate-50';
    }
  };

  const customBgStyle = settings.backgroundWallpaper === 'custom' && settings.customWallpaperUrl 
    ? { backgroundImage: `url(${settings.customWallpaperUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : {};

  return (
    <div className={`flex h-screen w-full text-slate-900 font-sans overflow-hidden select-none ${getBackgroundClass()} ${settings.theme === 'dark' ? 'dark bg-slate-900' : ''}`} style={customBgStyle}>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && !isFullscreen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar - responsive */}
      {!isFullscreen && (
        <div className={`fixed inset-y-0 left-0 z-50 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shrink-0 ${isSidebarExpanded ? "w-60" : "w-16"}`}>
          <Sidebar 
            activeModuleId={activeModuleId} 
            isExpanded={isSidebarExpanded}
            onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
            onModuleSelect={(id) => {
              setActiveModuleId(id);
              setIsMobileMenuOpen(false);
            }} 
          />
        </div>
      )}

      <div className={`flex flex-1 flex-col overflow-hidden min-w-0 ${settings.layoutMode === 'fixed' ? 'max-w-[1440px] mx-auto w-full shadow-2xl border-x border-slate-200/50 bg-white/90 backdrop-blur-3xl' : (settings.backgroundWallpaper === 'custom' ? 'bg-white/90 backdrop-blur-sm' : '')} ${settings.theme === 'dark' ? 'dark !bg-slate-900/90' : ''}`}>
        {!isFullscreen && !settings.hideTopbar && (
          <Header 
            title={activeModule?.label || "App"} 
            onMenuToggle={() => setIsMobileMenuOpen(true)} 
          />
        )}
        
        <main className={`flex-1 flex flex-col overflow-y-auto ${isFullscreen ? '' : (settings.spacingMode === 'compact' ? 'p-0 gap-0' : settings.spacingMode === 'dense' ? 'p-2 md:p-4 gap-2 md:gap-4' : 'p-4 md:p-6 lg:p-8 gap-4 md:gap-6 lg:gap-8')}`}>
          {activeModuleId === "dashboard" ? (
            <Dashboard />
          ) : activeModuleId === "production_quality" ? (
            <ProductionQualityModule />
          ) : activeModuleId === "quality_inventory" ? (
            <QualityInventoryModule />
          ) : activeModuleId === "incoming_qc" ? (
            <IncomingQCModule />
          ) : activeModuleId === "inspection" ? (
            <InspectionModule />
          ) : activeModuleId === "orders_and_buyers" ? (
            <OrdersBuyersModule 
              navigationPayload={navigationPayload} 
              onNavigationHandled={() => setNavigationPayload(null)} 
            />
          ) : activeModuleId === "notifications" ? (
            <NotificationsModule />
          ) : activeModuleId === "defect_library" ? (
            <DefectLibraryModule />
          ) : activeModuleId === "testing" ? (
            <TestingModule />
          ) : activeModuleId === "calibration" ? (
            <CalibrationModule />
          ) : activeModuleId === "audit" ? (
            <AuditModule />
          ) : activeModuleId === "certificate" ? (
            <CertificateModule />
          ) : activeModuleId === "traceability_audit" ? (
            <TraceabilityModule />
          ) : activeModuleId === "kpi_management" ? (
            <KpiModule />
          ) : activeModuleId === "sub_suppliers" ? (
            <SubSuppliersModule />
          ) : activeModuleId === "customer_complain" ? (
            <CustomerComplaintsModule />
          ) : activeModuleId === "quality_goal" ? (
            <QualityGoalModule />
          ) : activeModuleId === "capa" ? (
            <CapaModule />
          ) : activeModuleId === "root_cause_analysis" ? (
            <RootCauseModule />
          ) : activeModuleId === "risk_assessment" ? (
            <RiskAssessmentModule />
          ) : activeModuleId === "document_control" ? (
            <DocumentControlModule />
          ) : activeModuleId === "sop_management" ? (
            <SopManagementModule />
          ) : activeModuleId === "quality_manual" ? (
            <QualityManualModule />
          ) : activeModuleId === "procedure" ? (
            <ProcedureModule />
          ) : activeModuleId === "organogram" ? (
            <OrganogramModule />
          ) : activeModuleId === "process_flow" ? (
            <ProcessFlowModule />
          ) : activeModuleId === "job_description" ? (
            <JobDescriptionModule />
          ) : activeModuleId === "training" ? (
            <TrainingModule />
          ) : activeModuleId === "meeting_minutes" ? (
            <MeetingMinutesModule />
          ) : activeModuleId === "report_and_analysis" ? (
            <ReportAnalysisModule />
          ) : activeModuleId === "communication_portal" ? (
            <CommunicationPortalModule />
          ) : activeModuleId === "event_module" ? (
            <EventModule />
          ) : activeModuleId === "blog_post" ? (
            <BlogModule />
          ) : activeModuleId === "setting" ? (
            <SettingModule 
              navigationPayload={navigationPayload} 
              onNavigationHandled={() => setNavigationPayload(null)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
              <div className="mb-6 rounded-full bg-white border border-slate-200 p-6 flex items-center justify-center">
                {activeModule && <activeModule.icon className="h-12 w-12 text-blue-600" />}
              </div>
              <h2 className="mb-2 text-2xl font-black uppercase tracking-tighter text-slate-950">
                {activeModule?.label}
              </h2>
              <p className="max-w-md text-slate-600 pb-8 text-sm font-medium">
                This module is currently an empty shell. In a full production environment, 
                this section would contain the complete functionality for managing {activeModule?.label.toLowerCase()}.
              </p>
              
              <Card className="w-full max-w-xl text-left shadow-sm border-dashed border-slate-200">
                <CardContent className="pt-6">
                  <h4 className="font-bold text-slate-950 mb-3 flex items-center uppercase tracking-widest text-xs"><FileText className="w-4 h-4 mr-2 text-blue-600" /> Expected Features</h4>
                  <ul className="list-disc pl-5 space-y-2 text-xs font-medium tracking-wide text-slate-600">
                    <li>Data tables with filtering & pagination</li>
                    <li>Create/Edit/{activeModule?.label === "Setting" ? "Configure" : "Delete"} operations</li>
                    <li>Export to PDF/Excel</li>
                    <li>Role-based access control</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
