<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Server Metrics</h2>
      <div class="flex items-center space-x-4">
        <select 
          v-model="timeRange"
          class="bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
        >
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
        <button @click="exportMetrics" class="btn btn-secondary">
          Export Data
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Performance Metrics -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Performance</h3>
        <div class="space-y-4">
          <div v-for="metric in performanceMetrics" 
               :key="metric.name"
               class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">{{ metric.name }}</div>
              <div class="text-sm text-gray-400">{{ metric.description }}</div>
            </div>
            <div class="text-right">
              <div class="text-[#00D1FF] font-medium">{{ formatValue(metric.value) }}</div>
              <div class="text-sm" :class="getChangeColor(metric.change)">
                {{ formatChange(metric.change) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Player Metrics -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Player Activity</h3>
        <div class="space-y-4">
          <div v-for="metric in playerMetrics" 
               :key="metric.name"
               class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">{{ metric.name }}</div>
              <div class="text-sm text-gray-400">{{ metric.description }}</div>
            </div>
            <div class="text-right">
              <div class="text-[#00D1FF] font-medium">{{ formatValue(metric.value) }}</div>
              <div class="text-sm" :class="getChangeColor(metric.change)">
                {{ formatChange(metric.change) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- System Metrics -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">System Resources</h3>
        <div class="space-y-4">
          <div v-for="metric in systemMetrics" 
               :key="metric.name"
               class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">{{ metric.name }}</div>
              <div class="text-sm text-gray-400">{{ metric.description }}</div>
            </div>
            <div class="text-right">
              <div class="text-[#00D1FF] font-medium">{{ formatValue(metric.value) }}</div>
              <div class="text-sm" :class="getChangeColor(metric.change)">
                {{ formatChange(metric.change) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Network Metrics -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Network</h3>
        <div class="space-y-4">
          <div v-for="metric in networkMetrics" 
               :key="metric.name"
               class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">{{ metric.name }}</div>
              <div class="text-sm text-gray-400">{{ metric.description }}</div>
            </div>
            <div class="text-right">
              <div class="text-[#00D1FF] font-medium">{{ formatValue(metric.value) }}</div>
              <div class="text-sm" :class="getChangeColor(metric.change)">
                {{ formatChange(metric.change) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Metric {
  name: string;
  description: string;
  value: number;
  change: number;
  unit?: string;
}

const timeRange = ref('24h');

const performanceMetrics = ref<Metric[]>([
  {
    name: 'Average TPS',
    description: 'Ticks per second',
    value: 19.8,
    change: -0.5
  },
  {
    name: 'Response Time',
    description: 'Average server response',
    value: 45,
    change: 12,
    unit: 'ms'
  }
]);

const playerMetrics = ref<Metric[]>([
  {
    name: 'Peak Players',
    description: 'Highest concurrent players',
    value: 42,
    change: 8
  },
  {
    name: 'Average Session',
    description: 'Average play time',
    value: 85,
    change: 15,
    unit: 'min'
  }
]);

const systemMetrics = ref<Metric[]>([
  {
    name: 'CPU Usage',
    description: 'Average processor usage',
    value: 45.2,
    change: 5.5,
    unit: '%'
  },
  {
    name: 'Memory Usage',
    description: 'Average memory consumption',
    value: 3.2,
    change: -0.4,
    unit: 'GB'
  }
]);

const networkMetrics = ref<Metric[]>([
  {
    name: 'Bandwidth Usage',
    description: 'Total data transferred',
    value: 256.5,
    change: 32.8,
    unit: 'GB'
  },
  {
    name: 'Packet Loss',
    description: 'Lost network packets',
    value: 0.05,
    change: -0.02,
    unit: '%'
  }
]);

function formatValue(value: number): string {
  return value.toFixed(1);
}

function formatChange(change: number): string {
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

function getChangeColor(change: number): string {
  if (change > 0) return 'text-green-400';
  if (change < 0) return 'text-red-400';
  return 'text-gray-400';
}

function exportMetrics() {
  // Implement metrics export functionality
  console.log('Exporting metrics for range:', timeRange.value);
}
</script>