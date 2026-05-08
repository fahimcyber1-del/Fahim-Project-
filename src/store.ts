import { useState, useEffect } from 'react';
import { SubSupplierRecord } from './components/sub-suppliers/types';
import { INITIAL_SUPPLIERS } from './components/sub-suppliers/mockData';
import { AuditRecord } from './components/audit/types';
import { mockAudits } from './components/audit/mockData';

// Shared state
let subSuppliersRef = [...INITIAL_SUPPLIERS];
let auditsRef = [...mockAudits];

// Event listeners
type Listener = () => void;
const subSupplierListeners = new Set<Listener>();
const auditListeners = new Set<Listener>();

export const getSubSuppliers = () => subSuppliersRef;
export const getAudits = () => auditsRef;

export const setSubSuppliers = (suppliers: SubSupplierRecord[]) => {
  subSuppliersRef = suppliers;
  subSupplierListeners.forEach(listener => listener());
};

export const setAudits = (audits: AuditRecord[]) => {
  auditsRef = audits;
  auditListeners.forEach(listener => listener());
};

export function useSubSuppliersState() {
  const [suppliers, setSupplersState] = useState(subSuppliersRef);

  useEffect(() => {
    const listener = () => setSupplersState(subSuppliersRef);
    subSupplierListeners.add(listener);
    return () => {
      subSupplierListeners.delete(listener);
    };
  }, []);

  return { suppliers, setSuppliers: setSubSuppliers };
}

export function useAuditsState() {
  const [audits, setAuditsState] = useState(auditsRef);

  useEffect(() => {
    const listener = () => setAuditsState(auditsRef);
    auditListeners.add(listener);
    return () => {
      auditListeners.delete(listener);
    };
  }, []);

  return { audits, setAudits: setAudits };
}
