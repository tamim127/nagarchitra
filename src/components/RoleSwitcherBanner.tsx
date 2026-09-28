'use client';

import React from 'react';
import { useAuthRole } from '@/context/AuthRoleContext';
import { useIssues } from '@/context/IssueContext';
import { Shield, User, Wrench, RotateCcw } from 'lucide-react';

export const RoleSwitcherBanner: React.FC = () => {
  const { role, setRole, currentUser, availableRoles } = useAuthRole();
  const { resetToDefaultData } = useIssues();

  return (
    <div className="bg-slate-900 text-slate-100 text-xs px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 z-50">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          DEMO MODE
        </span>
        <span className="hidden md:inline text-slate-400">
          Actions are simulated in local state. Review different stakeholder perspectives:
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
          {availableRoles.map((r) => {
            const isActive = role === r.role;
            const Icon = r.role === 'AUTHORITY' ? Wrench : r.role === 'ADMIN' ? Shield : User;
            return (
              <button
                key={r.role}
                onClick={() => setRole(r.role)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
                title={r.subtitle}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            if (confirm('Reset to initial Dhaka demo dataset?')) {
              resetToDefaultData();
            }
          }}
          className="flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded border border-slate-700 transition"
          title="Reset local changes to demo dataset"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>
  );
};
