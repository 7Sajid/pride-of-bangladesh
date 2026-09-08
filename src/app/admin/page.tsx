'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAtlasStore } from '@/lib/store';
import { mergeAchievers } from '@/lib/data/achievers';
import type { Achiever } from '@/types/achiever';

export default function AdminDashboard() {
  const router = useRouter();
  const isAdmin = useAtlasStore((state) => state.isAdmin);
  const customAchievers = useAtlasStore((state) => state.customAchievers);
  const setAdmin = useAtlasStore((state) => state.setAdmin);
  const removeAchiever = useAtlasStore((state) => state.removeAchiever);
  
  const [achievers, setAchievers] = useState<Achiever[]>([]);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/login');
    } else {
      setAchievers(mergeAchievers(customAchievers));
    }
  }, [isAdmin, customAchievers, router]);

  const handleRemove = async (id: string) => {
    if (!confirm('Are you sure you want to remove this achiever?')) return;
    
    try {
      const res = await fetch(`/api/achievers?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        removeAchiever(id);
      }
    } catch (err) {
      console.error('Failed to remove achiever', err);
    }
  };

  if (!isAdmin) return null;

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage achievers and their photos</p>
          </div>
          <button 
            onClick={() => {
              setAdmin(false);
              router.push('/');
            }}
            className="px-4 py-2 bg-white border border-gray-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Achiever</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Photo Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {achievers.map((achiever) => (
                  <tr key={achiever.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-xl">{achiever.countryFlag}</div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{achiever.name}</div>
                          <div className="text-xs text-gray-500">{achiever.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {achiever.category}
                    </td>
                    <td className="px-6 py-4">
                      {achiever.photoUrl ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Uploaded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Missing
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/admin/edit/${achiever.id}`}
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleRemove(achiever.id)}
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
