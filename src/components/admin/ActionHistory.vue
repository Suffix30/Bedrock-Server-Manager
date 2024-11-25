<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Action History</h2>
      <div class="flex items-center space-x-4">
        <select 
          v-model="filterCategory"
          class="bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
        >
          <option value="all">All Categories</option>
          <option value="server">Server</option>
          <option value="players">Players</option>
          <option value="security">Security</option>
          <option value="config">Configuration</option>
        </select>
        <button @click="exportHistory" class="btn btn-secondary">
          Export History
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Timeline -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="space-y-6">
          <div v-for="(group, date) in groupedActions" 
               :key="date"
               class="space-y-4">
            <div class="text-sm text-gray-400">{{ formatDate(date) }}</div>
            <div class="space-y-4 pl-4 border-l-2 border-gray-800">
              <div v-for="action in group" 
                   :key="action.id"
                   class="relative">
                <div class="absolute -left-[25px] top-2 w-4 h-4 rounded-full bg-[#1E293B] border-2 border-gray-800"></div>
                <div class="bg-[#1E293B] p-4 rounded-lg">
                  <div class="flex items-start justify-between">
                    <div>
                      <div class="flex items-center space-x-2">
                        <span class="text-gray-100">{{ action.admin }}</span>
                        <span :class="{
                          'bg-red-900 text-red-400': action.category === 'security',
                          'bg-blue-900 text-blue-400': action.category === 'server',
                          'bg-green-900 text-green-400': action.category === 'players',
                          'bg-purple-900 text-purple-400': action.category === 'config'
                        }" class="px-2 py-0.5 rounded-full text-xs">
                          {{ action.category }}
                        </span>
                      </div>
                      <p class="text-gray-400 mt-1">{{ action.description }}</p>
                      <div class="text-sm text-gray-500 mt-2">
                        {{ formatTime(action.timestamp) }}
                      </div>
                    </div>
                    <button 
                      @click="showDetails(action)"
                      class="text-[#00D1FF] hover:text-[#00B8E6]"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="grid grid-cols-4 gap-4">
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Total Actions</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ stats.totalActions }}</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Most Active Admin</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ stats.mostActiveAdmin }}</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Common Category</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ stats.commonCategory }}</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Actions Today</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ stats.actionsToday }}</div>
        </div>
      </div>

      <!-- Activity Heatmap -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Activity Heatmap</h3>
        <div class="grid grid-cols-7 gap-1">
          <div v-for="day in activityHeatmap" 
               :key="day.date"
               :class="[
                 'w-4 h-4 rounded',
                 getHeatmapColor(day.count)
               ]"
               :title="`${day.date}: ${day.count} actions`">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { format } from 'date-fns';

interface AdminAction {
  id: string;
  admin: string;
  category: 'server' | 'players' | 'security' | 'config';
  description: string;
  timestamp: Date;
  details?: Record<string, any>;
}

interface ActivityDay {
  date: string;
  count: number;
}

const filterCategory = ref('all');

const actions = ref<AdminAction[]>([
  {
    id: '1',
    admin: 'Admin1',
    category: 'server',
    description: 'Server restart initiated',
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    id: '2',
    admin: 'Admin2',
    category: 'players',
    description: 'Banned player for griefing',
    timestamp: new Date(Date.now() - 7200000)
  },
  {
    id: '3',
    admin: 'Moderator1',
    category: 'security',
    description: 'Updated firewall rules',
    timestamp: new Date(Date.now() - 86400000)
  }
]);

const groupedActions = computed(() => {
  const filtered = filterCategory.value === 'all' 
    ? actions.value 
    : actions.value.filter(a => a.category === filterCategory.value);

  const groups = new Map<string, AdminAction[]>();
  
  filtered.forEach(action => {
    const date = format(action.timestamp, 'yyyy-MM-dd');
    const group = groups.get(date) || [];
    group.push(action);
    groups.set(date, group);
  });

  return Object.fromEntries(groups);
});

const stats = computed(() => {
  const adminCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();
  let todayCount = 0;
  const today = format(new Date(), 'yyyy-MM-dd');

  actions.value.forEach(action => {
    // Count per admin
    const adminCount = adminCounts.get(action.admin) || 0;
    adminCounts.set(action.admin, adminCount + 1);

    // Count per category
    const categoryCount = categoryCounts.get(action.category) || 0;
    categoryCounts.set(action.category, categoryCount + 1);

    // Count today's actions
    if (format(action.timestamp, 'yyyy-MM-dd') === today) {
      todayCount++;
    }
  });

  // Find most active admin
  let mostActive = '';
  let maxActions = 0;
  adminCounts.forEach((count, admin) => {
    if (count > maxActions) {
      maxActions = count;
      mostActive = admin;
    }
  });

  // Find most common category
  let commonCategory = '';
  let maxCategory = 0;
  categoryCounts.forEach((count, category) => {
    if (count > maxCategory) {
      maxCategory = count;
      commonCategory = category;
    }
  });

  return {
    totalActions: actions.value.length,
    mostActiveAdmin: mostActive,
    commonCategory,
    actionsToday: todayCount
  };
});

const activityHeatmap = computed(() => {
  // Generate last 28 days of activity
  const days: ActivityDay[] = [];
  const counts = new Map<string, number>();

  actions.value.forEach(action => {
    const date = format(action.timestamp, 'yyyy-MM-dd');
    counts.set(date, (counts.get(date) || 0) + 1);
  });

  for (let i = 27; i >= 0; i--) {
    const date = format(new Date(Date.now() - i * 86400000), 'yyyy-MM-dd');
    days.push({
      date,
      count: counts.get(date) || 0
    });
  }

  return days;
});

function getHeatmapColor(count: number): string {
  if (count === 0) return 'bg-[#1E293B]';
  if (count < 3) return 'bg-[#00D1FF]/25';
  if (count < 5) return 'bg-[#00D1FF]/50';
  if (count < 10) return 'bg-[#00D1FF]/75';
  return 'bg-[#00D1FF]';
}

function showDetails(action: AdminAction) {
  // Implement action details modal
  console.log('Show details for action:', action);
}

function exportHistory() {
  // Implement history export
  console.log('Exporting action history');
}

function formatDate(date: string): string {
  return format(new Date(date), 'MMMM d, yyyy');
}

function formatTime(date: Date): string {
  return format(date, 'HH:mm:ss');
}
</script>