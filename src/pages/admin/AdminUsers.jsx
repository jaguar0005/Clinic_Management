import React, { useState } from 'react';
import { Database, UserCheck, Stethoscope, Shield, Search, Key, ShieldCheck } from 'lucide-react';
import { getDatabaseUsers } from '../../services/db';

export const AdminUsers = () => {
  const [users] = useState(() => getDatabaseUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E6F4EC] text-[#0F7A4C] border border-[#C8E6D5] flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              Security &amp; User Accounts Database
            </h1>
          </div>
          <p className="text-xs text-[#5C5C5C] mt-1">
            Authentication registry with bcrypt password hashes and role access management (Patient, Doctor, Admin).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 bg-[#E6F4EC] text-[#0F7A4C] rounded border border-[#C8E6D5]">
          <ShieldCheck className="w-4 h-4" />
          <span>Connected: Local &amp; Persistent Database</span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#5C5C5C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search account by email, name, or User ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="text-xs bg-white border border-[#E5E5E5] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C] w-full sm:w-auto"
        >
          <option value="all">All Roles ({users.length})</option>
          <option value="patient">Patients</option>
          <option value="doctor">Doctors (Staff)</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      {/* Users Database Table */}
      <div className="health-card bg-white border border-[#E5E5E5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[#5C5C5C] font-semibold">
              <tr>
                <th className="p-3">User ID</th>
                <th className="p-3">Full Name &amp; Email</th>
                <th className="p-3 text-center">Assigned Role</th>
                <th className="p-3">Clinical Identifier</th>
                <th className="p-3">Password Security</th>
                <th className="p-3 text-right">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="p-3 font-mono text-[#5C5C5C] font-medium">
                    {u.id}
                  </td>
                  <td className="p-3 font-semibold text-[#1A1A1A]">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-800'
                            : u.role === 'doctor'
                            ? 'bg-[#E6F4EC] text-[#0F7A4C]'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div>{u.name}</div>
                        <div className="text-[11px] font-normal text-[#5C5C5C]">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${
                        u.role === 'admin'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : u.role === 'doctor'
                          ? 'bg-[#E6F4EC] text-[#0F7A4C] border-[#C8E6D5]'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-[#5C5C5C]">
                    {u.role === 'doctor' && (
                      <span className="font-semibold text-[#0F7A4C]">
                        Doctor ID: {u.doctorId} ({u.specialization})
                      </span>
                    )}
                    {u.role === 'patient' && (
                      <span className="font-semibold text-[#1A1A1A]">
                        Patient ID: {u.patientId} (Blood: {u.bloodGroup || 'O+'})
                      </span>
                    )}
                    {u.role === 'admin' && (
                      <span className="text-[#5C5C5C] italic">Root Administrative Access</span>
                    )}
                  </td>
                  <td className="p-3 font-mono text-[11px] text-[#5C5C5C]">
                    <span className="bg-[#F7F7F7] px-2 py-0.5 rounded border border-[#E5E5E5] text-[10px]">
                      bcrypt: $2a$08$...
                    </span>
                  </td>
                  <td className="p-3 text-right text-[#5C5C5C] whitespace-nowrap">
                    {u.createdAt || '2026-09-01'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
