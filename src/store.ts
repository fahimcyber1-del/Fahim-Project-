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

const INITIAL_CATEGORIES = [
  'Fabric', 'Trims & Accessories', 'Packaging', 'Chemicals', 'Service', 'Other'
];

export function useSubSupplierCategoriesState() {
  const [categories, setCategories] = useApiStorage<string>('aqm_subsupplier_categories', INITIAL_CATEGORIES);
  return { categories, setCategories };
}

export function useIncomingQCConfig() {
  const [configArray, setConfigArray] = useApiStorage<{ documentCode: string }>('aqm_incomingqc_config', [{ documentCode: '' }]);
  
  const config = configArray[0] || { documentCode: '' };
  
  const setConfig = (newConfig: { documentCode: string }) => {
    setConfigArray([newConfig]);
  };
  
  return { config, setConfig };
}

export function useSubSupplierConfig() {
  const [configArray, setConfigArray] = useApiStorage<{ documentCode: string }>('aqm_subsupplier_config', [{ documentCode: '' }]);
  
  const config = configArray[0] || { documentCode: '' };
  
  const setConfig = (newConfig: { documentCode: string }) => {
    setConfigArray([newConfig]);
  };
  
  return { config, setConfig };
}
