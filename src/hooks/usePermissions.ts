import { apiStorage } from '../utils/apiStorage';
import { useState, useEffect } from 'react';
import { APP_MODULES } from '../config/modules';

export function usePermissions(moduleLabel: string) {
  const [permissions, setPermissions] = useState({
    view: true,
    create: true,
    edit: true,
    manage: true
  });

  useEffect(() => {
    try {
      const storedUser = apiStorage.getItem('userProfile');
      const storedRoles = apiStorage.getItem('aqm_roles');
      
      if (storedUser && storedRoles) {
        const user = JSON.parse(storedUser);
        const roles = JSON.parse(storedRoles);
        
        const userRoleData = Array.isArray(roles) && user ? roles.find((r: any) => r.name === user?.role) : null;
        const isSuperAdmin = user?.role === 'Super Admin';
        
        if (isSuperAdmin) {
          setPermissions({
            view: true,
            create: true,
            edit: true,
            manage: true
          });
          return;
        }

        if (userRoleData && userRoleData.permissions && userRoleData.permissions[moduleLabel]) {
          setPermissions({
            view: userRoleData.permissions[moduleLabel].view || false,
            create: userRoleData.permissions[moduleLabel].create || false,
            edit: userRoleData.permissions[moduleLabel].edit || false,
            manage: userRoleData.permissions[moduleLabel].manage || false
          });
        }
      }
    } catch (e) {
      console.error("Error loading permissions", e);
    }
  }, [moduleLabel]);

  return permissions;
}
