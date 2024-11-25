<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Admin Logs</h2>
      <div class="flex items-center space-x-4">
        <select 
          v-model="filterLevel"
          class="bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
        >
          <option value="all">All Levels</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
        <button @click="exportLogs" class="btn btn-secondary">
          Export Logs
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Log Filters -->
      <div class="grid grid-cols-4 gap-4">
        <div>
          <label class="block text-sm text-gray-400 mb-1">Admin</label>
          <select 
            v-model="filters.admin"
            class="w-full bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
          >
            <option value="all">All Admins</option>
            <option v-for="admin in admins" 
                    :key="admin"
                    :value="admin">
              {{ admin }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">Action Type</label>
          <select 
            v-model="filters.actionType"
            class="w-full bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
          >
            <option value="all">All Actions</option>
            <option value="server">Server Actions</option>
            <option value="player">Player Actions</option>
            <option value="config">Configuration</option>
            <option value="security">Security</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">Start Date</label>
          <input 
            v-model="filters.startDate"
            type="date"
            class="w-full bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">End Date</label>
          <input 
            v-model="filters.endDate"
            type="date"
            class="w-full bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
          />
        </div>
      </div>

      <!-- Log Table -->
      <div class="bg-[#0F172A] rounded-lg border border-gray-800">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-sm text-gray-400 border-b border-gray-800">
                <th class="p-4">Timestamp</th>
                <th class="p-4">Admin</th>
                <th class="p-4">Action</th>
                <th class="p-4">Level</th>
                <th class="p-4">Details</th>
                <th class="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in filteredLogs" 
                  :key="log.id"
                  class="border-b border-gray-800 hover:bg-[#1E293B]">
                <td class="p-4 text-sm font-mono text-gray-400">
                  {{ formatDate(log.timestamp) }}
                </td>
                <td class="p-4 text-gray-300">{{ log.admin }}</td>
                <td class="p-4">
                  <span :class="{
                    'text-red-400': log.level === 'critical',
                    'text-yellow-400': log.level === 'warning',
                    'text-gray-300': log.level === 'info'
                  }">{{ log.action }}</span>
                </td>
                <td class="p-4">
                  <span :class="{
                    'bg-red-900 text-red-400': log.level === 'critical',
                    'bg-yellow-900 text-yellow-400': log.level === 'warning',
                    'bg-blue-900 text-blue-400': log.level === 'info'
                  }" class="px-2 py-0.5 rounded-full text-xs">
                    {{ log.level }}
                  </span>
                </td>
                <td class="p-4 text-sm text-gray-400">{{ log.details }}</td>
                <td class="p-4">
                  <button 
                    @click="showLogDetails(log)"
                    class="text-[#00D1FF] hover:text-[#00B8E6]"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Log Statistics -->
      <div class="grid grid-cols-4 gap-4">
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Total Actions</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ stats.totalActions }}</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Critical Events</div>
          <div class="text-2xl font-bold text-red-400">{{ stats.criticalEvents }}</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Most Active Admin</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ stats.mostActiveAdmin }}</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Common Action</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ stats.commonAction }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { format } from 'date-fns';

interface AdminLog {
  id: string;
  timestamp: Date;
  admin: string;
  action: string;
  level: 'critical' | 'warning' | 'info';
  details: string;
  metadata?: Record<string, any>;
}

const filterLevel = ref('all');
const admins = ['Admin1', 'Admin2', 'Moderator1'];

const filters = ref({
  admin: 'all',
  actionType: 'all',
  startDate: '',
  endDate: ''
});

const logs = ref<AdminLog[]>([
  {
    id: '1',
    timestamp: new Date(Date.now() - 300000),
    admin: 'Admin1',
    action: 'Server Restart',
    level: 'critical',
    details: 'Emergency restart due to performance issues'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 900000),
    admin: 'Admin2',
    action: 'Player Ban',
    level: 'warning',
    details: 'Banned player "Griefer123" for griefing'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1800000),
    admin: 'Moderator1',
    action: 'Config Change',
    level: 'info',
    details: 'Updated server settings'
  }
]);

const stats = computed(() => {
  const criticalCount = logs.value.filter(log => log.level === 'critical').length;
  
  // Count actions per admin
  const adminActions = new Map<string, number>();
  logs.value.forEach(log => {
    const count = adminActions.get(log.admin) || 0;
    adminActions.set(log.admin, count + 1);
  });
  
  // Find most active admin
  let mostActive = '';
  let maxActions = 0;
  adminActions.forEach((count, admin) => {
    if (count > maxActions) {
      maxActions = count;
      mostActive = admin;
    }
  });
  
  // Count action types
  const actionCounts = new Map<string, number>();
  logs.value.forEach(log => {
    const count = actionCounts.get(log.action) || 0;
    actionCounts.set(log.action, count + 1);
  });
  
  // Find most common action
  let commonAction = '';
  let maxCount = 0;
  actionCounts.forEach((count, action) => {
    if (count > maxCount) {
      maxCount = count;
      commonAction = action;
    }
  });

  return {
    totalActions: logs.value.length,
    criticalEvents: criticalCount,
    mostActiveAdmin: mostActive,
    commonAction
  };
});

const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    if (filterLevel.value !== 'all' && log.level !== filterLevel.value) return false;
    if (filters.value.admin !== 'all' && log.admin !== filters.value.admin) return false;
    // Add more filters as needed
    return true;
  });
});

function showLogDetails(log: AdminLog) {
  // Implement log details modal
  console.log('Show details for log:', log);
}

function exportLogs() {
  // Implement log export functionality
  console.log('Exporting logs with filters:', filters.value);
}

function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy HH:mm:ss');
}
</script>