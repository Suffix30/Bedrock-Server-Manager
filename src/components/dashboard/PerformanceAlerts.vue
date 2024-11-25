<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Performance Alerts</h2>
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-400">Alert Threshold:</span>
        <select v-model="alertThreshold" 
                class="bg-[#0F172A] border border-gray-700 rounded-lg px-2 py-1 text-sm">
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>

    <div class="space-y-4">
      <div v-for="alert in activeAlerts" 
           :key="alert.id"
           :class="{
             'bg-red-900/50 border-red-700': alert.severity === 'high',
             'bg-yellow-900/50 border-yellow-700': alert.severity === 'medium',
             'bg-blue-900/50 border-blue-700': alert.severity === 'low'
           }"
           class="p-4 rounded-lg border flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div :class="{
            'text-red-500': alert.severity === 'high',
            'text-yellow-500': alert.severity === 'medium',
            'text-blue-500': alert.severity === 'low'
          }">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <p class="font-medium text-gray-100">{{ alert.message }}</p>
            <p class="text-sm text-gray-400">{{ formatTime(alert.timestamp) }}</p>
          </div>
        </div>
        <button @click="dismissAlert(alert.id)" 
                class="text-gray-400 hover:text-gray-300">
          Dismiss
        </button>
      </div>

      <div v-if="activeAlerts.length === 0" 
           class="text-center text-gray-400 py-8">
        No active alerts
      </div>

      <!-- Alert History -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800 mt-6">
        <h3 class="font-medium mb-4">Alert History</h3>
        <div class="space-y-2">
          <div v-for="alert in alertHistory" 
               :key="alert.id"
               class="flex items-center justify-between py-2">
            <div>
              <span :class="{
                'text-red-400': alert.severity === 'high',
                'text-yellow-400': alert.severity === 'medium',
                'text-blue-400': alert.severity === 'low'
              }">{{ alert.message }}</span>
              <span class="text-gray-500 ml-2">{{ formatTimeAgo(alert.timestamp) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { format, formatDistanceToNow } from 'date-fns';
import { useMainStore } from '../../stores/mainStore';

const store = useMainStore();
const alertThreshold = ref('medium');

interface Alert {
  id: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: Date;
}

const activeAlerts = ref<Alert[]>([]);
const alertHistory = ref<Alert[]>([]);

let checkInterval: NodeJS.Timer;

function checkPerformance() {
  const { cpu, memory, tps } = store.stats;
  const maxMemory = store.stats.maxMemory;
  
  // CPU Alerts
  if (cpu > 90) {
    addAlert('High CPU usage detected', 'high');
  } else if (cpu > 75) {
    addAlert('Elevated CPU usage', 'medium');
  }
  
  // Memory Alerts
  const memoryUsagePercent = (memory / maxMemory) * 100;
  if (memoryUsagePercent > 90) {
    addAlert('Critical memory usage', 'high');
  } else if (memoryUsagePercent > 75) {
    addAlert('High memory usage', 'medium');
  }
  
  // TPS Alerts
  if (tps < 10) {
    addAlert('Critical TPS drop detected', 'high');
  } else if (tps < 15) {
    addAlert('Low TPS warning', 'medium');
  }
}

function addAlert(message: string, severity: Alert['severity']) {
  // Only add alert if it matches or exceeds the current threshold
  const severityLevels = { low: 1, medium: 2, high: 3 };
  const thresholdLevel = severityLevels[alertThreshold.value];
  const alertLevel = severityLevels[severity];

  if (alertLevel >= thresholdLevel) {
    // Check if similar alert already exists
    const existingAlert = activeAlerts.value.find(a => a.message === message);
    if (!existingAlert) {
      const alert: Alert = {
        id: Date.now().toString(),
        message,
        severity,
        timestamp: new Date()
      };
      activeAlerts.value.unshift(alert);
    }
  }
}

function dismissAlert(id: string) {
  const alert = activeAlerts.value.find(a => a.id === id);
  if (alert) {
    alertHistory.value.unshift(alert);
    activeAlerts.value = activeAlerts.value.filter(a => a.id !== id);
  }
}

function formatTime(date: Date): string {
  return format(date, 'HH:mm:ss');
}

function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

onMounted(() => {
  // Check performance every 5 seconds
  checkInterval = setInterval(checkPerformance, 5000);
});

onUnmounted(() => {
  clearInterval(checkInterval);
});
</script>