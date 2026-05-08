import { apiStorage } from '../../utils/apiStorage';
import React, { useState, useEffect } from 'react';
import { Users, Shield, UserPlus, ShieldPlus, Search, Edit, Trash2, Check, X, ShieldAlert, Lock, ChevronDown, ChevronRight } from 'lucide-react';
import { APP_MODULES, MODULE_GROUPS } from '../../config/modules';
import { usePermissions } from '../../hooks/usePermissions';

import { logAuditActivity } from '../../utils/audit';

// Mock Data
const MOCK_USERS = [
  { id: '1', name: 'Admin User', username: 'admin', email: 'admin@example.com', role: 'Super Admin', status: 'Active', password: 'password123', lastActive: 'Just now' },
  { id: '2', name: 'John Doe', username: 'johndoe', email: 'john@example.com', role: 'QC Manager', status: 'Active', password: 'password123', lastActive: '2 hours ago' },
  { id: '3', name: 'Jane Smith', username: 'janesmith', email: 'jane@example.com', role: 'Inspector', status: 'Inactive', password: 'password123', lastActive: '3 days ago' },
];

const MOCK_ROLES = [
  { id: 'r1', name: 'Super Admin', usersCount: 1, description: 'Unrestricted access. Can do anything without restrictions.' },
  { id: 'r2', name: 'QC Manager', usersCount: 1, description: 'Can manage all QC data, reports, and settings.' },
  { id: 'r3', name: 'Inspector', usersCount: 2, description: 'Can view and create QC records.' },
  { id: 'r4', name: 'Viewer', usersCount: 0, description: 'Read-only access to dashboards and reports.' },
];

const MODULES = APP_MODULES.map(m => m.label);

export function UsersAndRolesSettings() {
  const { create, edit, manage } = usePermissions('Setting');
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  
  useEffect(() => {
    const loadUsers = () => {
      const storedUsers = apiStorage.getItem('aqm_users');
      if (storedUsers) {
        try {
          setUsers(JSON.parse(storedUsers));
        } catch (e) {
          setUsers(MOCK_USERS);
        }
      } else {
        setUsers(MOCK_USERS);
        apiStorage.setItem('aqm_users', JSON.stringify(MOCK_USERS));
      }

      const storedRoles = apiStorage.getItem('aqm_roles');
      if (storedRoles) {
        try {
          setRoles(JSON.parse(storedRoles));
        } catch (e) {
          setRoles(MOCK_ROLES);
        }
      } else {
        setRoles(MOCK_ROLES);
        apiStorage.setItem('aqm_roles', JSON.stringify(MOCK_ROLES));
      }
    };
    
    loadUsers();
    
    // Listen for custom profile-updated event
    window.addEventListener('profile-updated', loadUsers);
    return () => {
      window.removeEventListener('profile-updated', loadUsers);
    };
  }, []);

  const handleSaveUsers = (newUsers: any[]) => {
    setUsers(newUsers);
    apiStorage.setItem('aqm_users', JSON.stringify(newUsers));
  };
  
  const handleSaveRoles = (newRoles: any[]) => {
    setRoles(newRoles);
    apiStorage.setItem('aqm_roles', JSON.stringify(newRoles));
  };

  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  return (
    <div className="p-6 lg:p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Users & Roles</h2>
          <p className="text-sm text-slate-500">Manage user access, assign roles, and configure module permissions.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'users' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Users className="w-4 h-4" /> Users
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'roles' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Shield className="w-4 h-4" /> Roles & Permissions
          </button>
        </div>
      </div>

      {activeTab === 'users' ? (
        <UserManagement 
          users={users} 
          onAdd={() => { setEditingUserId(null); setIsUserModalOpen(true); }}
          onEdit={(id: string) => { setEditingUserId(id); setIsUserModalOpen(true); }}
          onDelete={(id: string) => setDeletingUserId(id)}
          roles={roles}
          canCreate={create || manage}
          canEdit={edit || manage}
          canManage={manage}
        />
      ) : (
        <RoleManagement 
          roles={roles}
          users={users}
          onAdd={() => { setEditingRoleId(null); setIsRoleModalOpen(true); }}
          onEdit={(id: string) => { setEditingRoleId(id); setIsRoleModalOpen(true); }}
          canCreate={create || manage}
          canEdit={edit || manage}
          canManage={manage}
        />
      )}

      {/* User Modal */}
      {isUserModalOpen && (
        <UserModal 
          onClose={() => setIsUserModalOpen(false)} 
          userId={editingUserId} 
          users={users} 
          roles={roles} 
          onSave={(u: any) => {
            if (editingUserId) {
              handleSaveUsers(users.map(user => user.id === u.id ? u : user));
              logAuditActivity('UPDATE', 'Users & Roles', `Updated user: ${u.name} (${u.email})`);
            } else {
              handleSaveUsers([...users, { ...u, id: Math.random().toString(), lastActive: 'Never' }]);
              logAuditActivity('CREATE', 'Users & Roles', `Created new user: ${u.name} (${u.email})`);
            }
            setIsUserModalOpen(false);
          }} 
          canEdit={edit || manage}
          canCreate={create || manage}
        />
      )}

      {/* Role Modal */}
      {isRoleModalOpen && (
        <RoleModal 
          onClose={() => setIsRoleModalOpen(false)} 
          roleId={editingRoleId} 
          roles={roles} 
          onSave={(r: any) => {
            if (editingRoleId) {
              handleSaveRoles(roles.map(role => role.id === r.id ? r : role));
              logAuditActivity('UPDATE', 'Users & Roles', `Updated role permissions: ${r.name}`);
            } else {
              handleSaveRoles([...roles, { id: Math.random().toString(), name: r.name, description: r.description, usersCount: 0, permissions: r.permissions }]);
              logAuditActivity('CREATE', 'Users & Roles', `Created new role: ${r.name}`);
            }
            setIsRoleModalOpen(false);
          }} 
          canEdit={edit || manage}
          canCreate={create || manage}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingUserId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-red-600">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete User</h3>
              <p className="text-sm text-slate-500">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => setDeletingUserId(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const userToDelete = users.find(u => u.id === deletingUserId);
                  const newUsers = users.filter((u: any) => u.id !== deletingUserId);
                  handleSaveUsers(newUsers);
                  if (userToDelete) {
                    logAuditActivity('DELETE', 'Users & Roles', `Deleted user: ${userToDelete.name} (${userToDelete.email})`);
                  }
                  setDeletingUserId(null);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors border border-transparent"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------
// USER MANAGEMENT COMPONENT
// ----------------------------------------
function UserManagement({ users, onAdd, onEdit, onDelete, roles, canCreate, canEdit, canManage }: any) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter((u: any) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        {canCreate && (
          <button 
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shrink-0"
          >
            <UserPlus className="w-4 h-4" /> Add User
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-600">User</th>
              <th className="px-6 py-4 font-bold text-slate-600">Role</th>
              <th className="px-6 py-4 font-bold text-slate-600">Status</th>
              <th className="px-6 py-4 font-bold text-slate-600">Last Active</th>
              <th className="px-6 py-4 font-bold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user: any) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {user.imageUrl ? (
                      <img src={user.imageUrl} alt={user.name} className="w-8 h-8 rounded-full border border-slate-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">
                        {user.username ? <span className="font-medium text-slate-700">@{user.username}</span> : null}
                        {user.username ? " • " : ""}
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    <Shield className="w-3 h-3" /> {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                    user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {user.status === 'Active' ? <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{user.lastActive}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {canEdit && (
                      <button onClick={() => onEdit(user.id)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="Edit User">
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {canManage && (
                      <button 
                        onClick={() => onDelete(user.id)}
                        className={`p-1.5 rounded ${user.role === 'Super Admin' ? 'text-slate-300 cursor-not-allowed opacity-50' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'}`} 
                        title={user.role === 'Super Admin' ? "Cannot delete Super Admin" : "Delete User"}
                        disabled={user.role === 'Super Admin'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----------------------------------------
// ROLE MANAGEMENT COMPONENT
// ----------------------------------------
function RoleManagement({ roles, users, onAdd, onEdit, canCreate, canEdit, canManage }: any) {
  return (
    <div className="space-y-6">
      <div className="flex sm:items-center justify-between gap-4">
        <p className="text-sm text-slate-600">Roles define what users can see and do within the application. Assign roles to users to grant them specific permissions.</p>
        {canCreate && (
          <button 
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shrink-0"
          >
            <ShieldPlus className="w-4 h-4" /> Create Role
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role: any) => {
          const uCount = users.filter((u: any) => u.role === role.name).length;
          return (
            <div key={role.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900">{role.name}</h3>
                </div>
                {canEdit && (
                  <button onClick={() => onEdit(role.id)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="Manage Role">
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-sm text-slate-500 mb-4 flex-1">{role.description}</p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{uCount} User{uCount !== 1 ? 's' : ''}</span>
                <button onClick={() => onEdit(role.id)} className="font-semibold text-indigo-600 hover:underline">View Permissions</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------
// USER MODAL
// ----------------------------------------
function UserModal({ onClose, userId, users, roles, onSave, canEdit, canCreate }: any) {
  const isEditing = !!userId;
  const isReadonly = isEditing ? !canEdit : !canCreate;
  const existingUser = isEditing ? users.find((u: any) => u.id === userId) : null;
  
  const [formData, setFormData] = useState({
    id: existingUser?.id || '',
    name: existingUser?.name || '',
    username: existingUser?.username || '',
    email: existingUser?.email || '',
    role: existingUser?.role || roles[0]?.name || '',
    status: existingUser?.status || 'Active',
    password: existingUser?.password || ''
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const saveFormData = { ...formData };
    if (isEditing && !saveFormData.password) {
      saveFormData.password = existingUser.password;
    }
    onSave(saveFormData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            {isEditing ? <Edit className="w-5 h-5 text-indigo-600" /> : <UserPlus className="w-5 h-5 text-indigo-600" />}
            {isEditing ? 'Edit User' : 'Add New User'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-200 rounded-md transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} disabled={isReadonly} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm disabled:bg-slate-100 disabled:text-slate-500" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
            <input required type="text" name="username" value={formData.username} onChange={handleChange} disabled={isReadonly} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm disabled:bg-slate-100 disabled:text-slate-500" placeholder="johndoe" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} disabled={isReadonly} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm disabled:bg-slate-100 disabled:text-slate-500" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} disabled={isReadonly} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm bg-white disabled:bg-slate-100 disabled:text-slate-500">
              {roles.map((r: any) => (
                <option key={r.id} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} disabled={isReadonly} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm bg-white disabled:bg-slate-100 disabled:text-slate-500">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {isEditing ? 'Change Password (leave blank to keep current)' : 'Password'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required={!isEditing}
                disabled={isReadonly}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm disabled:bg-slate-100 disabled:text-slate-500" 
                placeholder="••••••••" 
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Super Admins can set or reset passwords here.</p>
          </div>
        </form>
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">{isReadonly ? 'Close' : 'Cancel'}</button>
          {!isReadonly && (
            <button onClick={handleSubmit} className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm">
              {isEditing ? 'Save Changes' : 'Add User'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------
// ROLE MODAL & PERMISSIONS MANAGER
// ----------------------------------------
function RoleModal({ onClose, roleId, roles, onSave, canEdit, canCreate }: any) {
  const isEditing = !!roleId;
  const isReadonly = isEditing ? !canEdit : !canCreate;
  const existingRole = isEditing ? roles.find((r: any) => r.id === roleId) : null;
  
  const [formData, setFormData] = useState({
    id: existingRole?.id || '',
    name: existingRole?.name || '',
    description: existingRole?.description || ''
  });

  // Permissions state [moduleName]: { view: boolean, create: boolean, edit: boolean, manage: boolean }
  const [permissions, setPermissions] = useState<Record<string, any>>(() => {
    if (existingRole?.permissions) {
      return existingRole.permissions;
    }
    
    const defaultPerms: Record<string, any> = {};
    MODULES.forEach(mod => {
      // If Admin, all true. If new, all false.
      const isAdmin = existingRole?.name === 'Super Admin';
      defaultPerms[mod] = {
        view: isAdmin || !!existingRole, // just some dummy defaults
        create: isAdmin,
        edit: isAdmin,
        manage: isAdmin
      };
    });
    return defaultPerms;
  });

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    MODULE_GROUPS.forEach(g => {
       initial[g] = true;
    });
    return initial;
  });

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = (module: string, type: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [type]: value,
        // If unchecking 'view', uncheck all others
        ...(type === 'view' && !value ? { create: false, edit: false, manage: false } : {}),
        // If checking manage, check others
        ...(type === 'manage' && value ? { view: true, create: true, edit: true } : {}),
        // If checking anything else, 'view' must be true
        ...((type === 'create' || type === 'edit') && value ? { view: true } : {})
      }
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave({ ...formData, permissions });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            {isEditing ? <Shield className="w-5 h-5 text-indigo-600" /> : <ShieldPlus className="w-5 h-5 text-indigo-600" />}
            {isEditing ? 'Manage Role & Permissions' : 'Create New Role'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-200 rounded-md transition-colors"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
          {/* Role Details */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Role Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} disabled={isReadonly || existingRole?.name === 'Super Admin'} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm disabled:bg-slate-100 disabled:text-slate-500" placeholder="e.g. Quality Auditor" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} disabled={isReadonly} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm disabled:bg-slate-100 disabled:text-slate-500" placeholder="Role description..." />
              </div>
            </div>
            {existingRole?.name === 'Super Admin' && (
              <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex gap-3 text-sm text-indigo-800">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <p>The Super Admin role is a system role. Its name and core permissions cannot be restricted. Super Admins can do anything without restrictions.</p>
              </div>
            )}
          </div>

          {/* Access Control Matrix */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Access Control Matrix</h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-bold text-slate-600">Module</th>
                    <th className="px-4 py-3 font-bold text-slate-600 text-center">View</th>
                    <th className="px-4 py-3 font-bold text-slate-600 text-center">Create</th>
                    <th className="px-4 py-3 font-bold text-slate-600 text-center">Edit</th>
                    <th className="px-4 py-3 font-bold text-slate-600 text-center">Manage / Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MODULE_GROUPS.map((group) => {
                    const groupModules = APP_MODULES.filter((m) => m.group === group);
                    const isExpanded = expandedGroups[group];
                    
                    return (
                      <React.Fragment key={group}>
                        {/* Group Header */}
                        <tr className="bg-slate-50/80 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleGroup(group)}>
                          <td colSpan={5} className="px-4 py-3 font-semibold text-slate-700">
                            <div className="flex items-center gap-2">
                              {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                              {group}
                            </div>
                          </td>
                        </tr>
                        {/* Group Modules */}
                        {isExpanded && groupModules.map(module => (
                          <tr key={module.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 pl-10 font-medium text-slate-900 flex items-center gap-2">
                              <module.icon className="w-4 h-4 text-slate-400" />
                              {module.label}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input 
                                type="checkbox" 
                                checked={permissions[module.label]?.view || false} 
                                onChange={(e) => handlePermissionChange(module.label, 'view', e.target.checked)}
                                disabled={isReadonly || existingRole?.name === 'Super Admin'}
                                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input 
                                type="checkbox" 
                                checked={permissions[module.label]?.create || false} 
                                onChange={(e) => handlePermissionChange(module.label, 'create', e.target.checked)}
                                disabled={isReadonly || existingRole?.name === 'Super Admin'}
                                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input 
                                type="checkbox" 
                                checked={permissions[module.label]?.edit || false} 
                                onChange={(e) => handlePermissionChange(module.label, 'edit', e.target.checked)}
                                disabled={isReadonly || existingRole?.name === 'Super Admin'}
                                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input 
                                type="checkbox" 
                                checked={permissions[module.label]?.manage || false} 
                                onChange={(e) => handlePermissionChange(module.label, 'manage', e.target.checked)}
                                disabled={isReadonly || existingRole?.name === 'Super Admin'}
                                className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">{isReadonly ? 'Close' : 'Cancel'}</button>
          {!isReadonly && (
            <button onClick={handleSubmit} className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm">
              {isEditing ? 'Save Roles & Permissions' : 'Create Role'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
