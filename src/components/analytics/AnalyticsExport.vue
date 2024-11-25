<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Analytics Export</h2>
      <button @click="exportAll" class="btn btn-primary">
        Export All Data
      </button>
    </div>

    <div class="space-y-6">
      <!-- Export Options -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Export Options</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Date Range</div>
              <div class="text-sm text-gray-400">Select time period</div>
            </div>
            <div class="flex items-center space-x-4">
              <input 
                v-model="dateRange.start"
                type="date"
                class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
              />
              <span class="text-gray-400">to</span>
              <input 
                v-model="dateRange.end"
                type="date"
                class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Format</div>
              <div class="text-sm text-gray-400">Export file format</div>
            </div>
            <select 
              v-model="exportFormat"
              class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="xlsx">Excel</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Data Categories -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Data Categories</h3>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="category in categories" 
               :key="category.id"
               class="flex items-center space-x-3">
            <input 
              v-model="category.selected"
              type="checkbox"
              class="rounded border-gray-700"
            />
            <div>
              <div class="text-gray-100">{{ category.name }}</div>
              <div class="text-sm text-gray-400">{{ category.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Exports -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Recent Exports</h3>
        <div class="space-y-2">
          <div v-for="export_ in recentExports" 
               :key="export_.id"
               class="flex items-center justify-between py-2">
            <div>
              <div class="text-gray-100">{{ export_.name }}</div>
              <div class="text-sm text-gray-400">
                {{ formatDate(export_.date) }} • {{ formatSize(export_.size) }}
              </div>
            </div>
            <button 
              @click="downloadExport(export_)"
              class="text-[#00D1FF] hover:text-[#00B8E6]"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { format } from 'date-fns';

interface ExportCategory {
  id: string;
  name: string;
  description: string;
  selected: boolean;
}

interface ExportFile {
  id: string;
  name: string;
  date: Date;
  size: number;
  url: string;
}

const dateRange = ref({
  start: new Date().toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
});

const exportFormat = ref('csv');

const categories = ref<ExportCategory[]>([
  {
    id: 'performance',
    name: 'Performance Metrics',
    description: 'TPS, memory usage, etc.',
    selected: true
  },
  {
    id: 'players',
    name: 'Player Activity',
    description: 'Logins, playtime, etc.',
    selected: true
  },
  {
    id: 'network',
    name: 'Network Data',
    description: 'Bandwidth, connections',
    selected: true
  },
  {
    id: 'events',
    name: 'Server Events',
    description: 'Crashes, restarts, etc.',
    selected: true
  }
]);

const recentExports = ref<ExportFile[]>([
  {
    id: '1',
    name: 'Full Analytics Export',
    date: new Date(Date.now() - 86400000),
    size: 1024 * 1024 * 2.5,
    url: '#'
  },
  {
    id: '2',
    name: 'Performance Report',
    date: new Date(Date.now() - 172800000),
    size: 1024 * 512,
    url: '#'
  }
]);

function exportAll() {
  // Implement full export functionality
  console.log('Exporting data:', {
    dateRange: dateRange.value,
    format: exportFormat.value,
    categories: categories.value.filter(c => c.selected).map(c => c.id)
  });
}

function downloadExport(export_: ExportFile) {
  // Implement download functionality
  console.log('Downloading:', export_.name);
}

function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

function formatSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
</script>