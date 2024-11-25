<template>
  <div class="card p-6">
    <h2 class="text-2xl font-bold mb-6 text-[#00D1FF]">Event Logs</h2>
    
    <div class="space-y-6">
      <!-- Filters -->
      <div class="grid grid-cols-4 gap-4">
        <div>
          <label class="block text-sm text-gray-400 mb-1">Event Type</label>
          <select 
            v-model="filters.type"
            class="w-full bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
          >
            <option value="all">All Events</option>
            <option value="player">Player Events</option>
            <option value="server">Server Events</option>
            <option value="world">World Events</option>
            <option value="error">Errors</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">Severity</label>
          <select 
            v-model="filters.severity"
            class="w-full bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">Start Date</label>
          <input 
            v-model="filters.startDate"
            type="datetime-local"
            class="w-full bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">End Date</label>
          <input 
            v-model="filters.endDate"
            type="datetime-local"
            class="w-full bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
          />
        </div>
      </div>

      <!-- Search -->
      <div class="flex space-x-4">
        <input 
          v-model="filters.search"
          type="text"
          placeholder="Search events..."
          class="flex-1"
        />
        <button @click="exportLogs" class="btn btn-secondary">
          Export Logs
        </button>
      </div>

      <!-- Event List -->
      <div class="bg-[#0F172A] rounded-lg border border-gray-800">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-sm text-gray-400 border-b border-gray-800">
                <th class="p-4">Timestamp</th>
                <th class="p-4">Type</th>
                <th class="p-4">Severity</th>
                <th class="p-4">Message</th>
                <th class="p-4">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="event in filteredEvents" 
                  :key="event.id"
                  class="border-b border-gray-800 hover:bg-[#1E293B]">
                <td class="p-4 text-sm font-mono">{{ formatDate(event.timestamp) }}</td>
                <td class="p-4">
                  <span :class="{
                    'bg-blue-900 text-blue-400': event.type === 'player',
                    'bg-purple-900 text-purple-400': event.type === 'server',
                    'bg-green-900 text-green-400': event.type === 'world',
                    'bg-red-900 text-red-400': event.type === 'error'
                  }" class="px-2 py-1 rounded text-xs">
                    {{ event.type }}
                  </span>
                </td>
                <td class="p-4">
                  <span :class="{
                    'text-gray-400': event.severity === 'info',
                    'text-yellow-400': event.severity === 'warning',
                    'text-red-400': event.severity === 'error'
                  }">
                    {{ event.severity }}
                  </span>
                </td>
                <td class="p-4 text-gray-300">{{ event.message }}</td>
                <td class="p-4">
                  <button 
                    v-if="event.details"
                    @click="showEventDetails(event)"
                    class="text-[#00D1FF] hover:text-[#00B8E6]"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Event Details Modal -->
    <div v-if="selectedEvent" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-[#1E293B] p-6 rounded-xl w-full max-w-2xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">Event Details</h3>
          <button @click="selectedEvent = null" class="text-gray-400 hover:text-gray-300">
            Close
          </button>
        </div>
        <div class="space-y-4">
          <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
            <pre class="text-sm font-mono text-gray-300 whitespace-pre-wrap">{{ JSON.stringify(selectedEvent.details, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { format } from 'date-fns';

interface Event {
  id: string;
  timestamp: Date;
  type: 'player' | 'server' | 'world' | 'error';
  severity: 'info' | 'warning' | 'error';
  message: string;
  details?: Record<string, any>;
}

const filters = ref({
  type: 'all',
  severity: 'all',
  startDate: '',
  endDate: '',
  search: ''
});

const selectedEvent = ref<Event | null>(null);

const events = ref<Event[]>([
  {
    id: '1',
    timestamp: new Date(),
    type: 'player',
    severity: 'info',
    message: 'Player Steve joined the game',
    details: {
      player: 'Steve',
      ip: '192.168.1.100',
      version: '1.19.2'
    }
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 300000),
    type: 'server',
    severity: 'warning',
    message: 'High memory usage detected',
    details: {
      memory: '1.8GB',
      threshold: '2GB'
    }
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 600000),
    type: 'error',
    severity: 'error',
    message: 'Failed to save world data',
    details: {
      error: 'Disk space full',
      world: 'world_1'
    }
  }
]);

const filteredEvents = computed(() => {
  return events.value.filter(event => {
    if (filters.value.type !== 'all' && event.type !== filters.value.type) return false;
    if (filters.value.severity !== 'all' && event.severity !== filters.value.severity) return false;
    if (filters.value.search && !event.message.toLowerCase().includes(filters.value.search.toLowerCase())) return false;
    return true;
  });
});

function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

function showEventDetails(event: Event) {
  selectedEvent.value = event;
}

function exportLogs() {
  const data = filteredEvents.value.map(event => ({
    timestamp: formatDate(event.timestamp),
    type: event.type,
    severity: event.severity,
    message: event.message,
    details: event.details ? JSON.stringify(event.details) : ''
  }));

  const csv = [
    ['Timestamp', 'Type', 'Severity', 'Message', 'Details'].join(','),
    ...data.map(row => Object.values(row).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `server-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
</script>