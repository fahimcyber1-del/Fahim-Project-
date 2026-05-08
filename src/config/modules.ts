import {
  LayoutDashboard,
  BarChart2,
  Settings,
  Users,
  ShoppingCart,
  Truck,
  Frown,
  CheckCircle,
  Search,
  AlertTriangle,
  Microscope,
  Scale,
  Target,
  Trophy,
  ClipboardCheck,
  Wrench,
  ShieldAlert,
  Map,
  Award,
  Building,
  Files,
  FileText,
  Book,
  List,
  GitCommit,
  GitMerge,
  Workflow,
  Briefcase,
  GraduationCap,
  Clock,
  MessageSquare,
  Calendar,
  Newspaper,
  Package,
  Activity,
  ShoppingBag,
  Inbox,
  AlertCircle,
  CheckSquare,
  Shield,
  Beaker,
  Focus,
  ClipboardList,
  PenTool,
  Network,
  Compass,
  File,
  FileBox,
  Library,
  GitPullRequest,
  Waypoints,
  User,
  Coffee,
  PanelLeft,
  Mail,
  type LucideIcon,
} from "lucide-react";

export type ModuleId = string;

export interface ModuleConfig {
  id: ModuleId;
  label: string;
  icon: LucideIcon;
  group: string;
}

export const APP_MODULES: ModuleConfig[] = [
  // Core Operations
  { id: "dashboard", label: "Dashboard", icon: Activity, group: "Core Operations" },
  
  // Supply & Orders
  { id: "orders_and_buyers", label: "Orders & Buyers", icon: ShoppingBag, group: "Supply & Orders" },
  { id: "sub_suppliers", label: "Sub Suppliers", icon: Truck, group: "Supply & Orders" },
  { id: "quality_inventory", label: "Stock & Inventory", icon: Inbox, group: "Supply & Orders" },
  { id: "customer_complain", label: "Customer Complain", icon: AlertCircle, group: "Supply & Orders" },

  // Quality & Inspection
  { id: "incoming_qc", label: "Incoming QC", icon: CheckSquare, group: "Quality & Inspection" },
  { id: "production_quality", label: "Production Quality", icon: CheckCircle, group: "Quality & Inspection" },
  { id: "inspection", label: "Inspection", icon: Search, group: "Quality & Inspection" },
  { id: "defect_library", label: "Defect Library", icon: Shield, group: "Quality & Inspection" },
  { id: "testing", label: "Testing", icon: Beaker, group: "Quality & Inspection" },
  { id: "calibration", label: "Calibration", icon: Focus, group: "Quality & Inspection" },

  // Goals & Performance
  { id: "kpi_management", label: "KPI Management", icon: Target, group: "Goals & Performance" },
  { id: "quality_goal", label: "Quality Goal", icon: Trophy, group: "Goals & Performance" },

  // Audit & Compliance
  { id: "audit", label: "Audit", icon: ClipboardList, group: "Audit & Compliance" },
  { id: "capa", label: "CAPA", icon: PenTool, group: "Audit & Compliance" },
  { id: "root_cause_analysis", label: "Root Cause Analysis", icon: Network, group: "Audit & Compliance" },
  { id: "risk_assessment", label: "Risk Assessment", icon: ShieldAlert, group: "Audit & Compliance" },
  { id: "traceability_audit", label: "Traceability Audit", icon: Compass, group: "Audit & Compliance" },
  { id: "certificate", label: "Certificate", icon: Award, group: "Audit & Compliance" },
  { id: "factory_certificate", label: "Factory Certificate", icon: Building, group: "Audit & Compliance" },

  // Docs & Processes
  { id: "document_control", label: "Document Control", icon: File, group: "Docs & Processes" },
  { id: "sop_management", label: "SOP Management", icon: FileText, group: "Docs & Processes" },
  { id: "quality_manual", label: "Quality Manual", icon: Library, group: "Docs & Processes" },
  { id: "guidelines", label: "Guidelines", icon: List, group: "Docs & Processes" },
  { id: "procedure", label: "Procedure", icon: GitPullRequest, group: "Docs & Processes" },
  { id: "process_flow", label: "Process Flow", icon: Waypoints, group: "Docs & Processes" },

  // HR & Management
  { id: "organogram", label: "Organogram", icon: User, group: "HR & Management" },
  { id: "job_description", label: "Job Description", icon: Briefcase, group: "HR & Management" },
  { id: "training", label: "Training", icon: GraduationCap, group: "HR & Management" },
  { id: "meeting_minutes", label: "Meeting Minutes", icon: Coffee, group: "HR & Management" },

  // Communication
  { id: "communication_portal", label: "Communication Portal", icon: Mail, group: "Communication" },
  { id: "event_module", label: "Events", icon: Calendar, group: "Communication" },
  { id: "blog_post", label: "Blog Posts", icon: Newspaper, group: "Communication" },

  // System
  { id: "report_and_analysis", label: "Report & Analysis", icon: PanelLeft, group: "System & Reports" },
  { id: "setting", label: "Setting", icon: Settings, group: "System & Reports" },
];

export const MODULE_GROUPS = Array.from(new Set(APP_MODULES.map((m) => m.group)));
