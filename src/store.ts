import { useState, useEffect } from 'react';
import { SubSupplierRecord } from './components/sub-suppliers/types';
import { INITIAL_SUPPLIERS } from './components/sub-suppliers/mockData';
import { AuditRecord } from './components/audit/types';
import { mockAudits } from './components/audit/mockData';
import { useApiStorage } from './hooks/useApiData';

// We now only use these refs as temporary fallback getters if needed synchronously, 
// though with React state the hook will provide the source of truth.
let subSuppliersRef = [...INITIAL_SUPPLIERS];
let auditsRef = [...mockAudits];

export const getSubSuppliers = () => subSuppliersRef;
export const getAudits = () => auditsRef;

export function useSubSuppliersState() {
  const [suppliers, setSupplersState] = useApiStorage<SubSupplierRecord>('aqm_subsuppliers_records', INITIAL_SUPPLIERS);

  // Still keep the ref updated for any synchronous non-hook getters
  useEffect(() => {
    subSuppliersRef = suppliers;
  }, [suppliers]);

  return { suppliers, setSuppliers: setSupplersState };
}

export function useAuditsState() {
  const [audits, setAuditsState] = useApiStorage<AuditRecord>('aqm_audit_records', mockAudits);

  useEffect(() => {
    auditsRef = audits;
  }, [audits]);

  return { audits, setAudits: setAuditsState };
}
