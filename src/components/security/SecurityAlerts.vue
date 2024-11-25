<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Security Alerts</h2>
      <div class="flex items-center space-x-4">
        <select 
          v-model="alertThreshold"
          class="bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
        >
          <option value="high">High Priority Only</option>
          <option value="medium">Medium & High</option>
          <option value="all">All Alerts</option>
        </select>
        <button @click="clearAllAlerts" class="btn btn-secondary">
          Clear All
        </button>
      </div>
    </div>

    <div class="space-y-4">
      <!-- Active Alerts -->
      <div v-for="alert in filteredAlerts" 
           :key="alert.id"
           :class="{
             'bg-red-900/20 border-red-700': alert.severity === 'high',
             'bg-yellow-900/20 border-yellow-700': alert.severity === 'medium',
             'bg-blue-900/20 border-blue-700': alert.severity === 'low'
           }"
           class="p-4 rounded-lg border">
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-3">
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
              <h3 class="font-medium text-gray-100">{{ alert.title }}</h3>
              <p class="text-sm text-gray-400 mt-1">{{ alert.message }}</p>
              <div class="flex items-center space-x-4 mt-2 text-sm">
                <span class="text-gray-500">{{ formatTimeAgo(alert.timestamp) }}</span>
                <span :class="{
                  'text-red-400': alert.severity === 'high',
                  'text-yellow-400': alert.severity === 'medium',
                  'text-blue-400': alert.severity === 'low'
                }">{{ alert.severity }}</span>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <button 
              v-if="alert.actionable"
              @click="handleAlertAction(alert)"
              class="btn btn-primary text-sm"
            >
              {{ alert.actionText }}
            </button>
            <button 
              @click="dismissAlert(alert.id)"
              class="text-gray-400 hover:text-gray-300"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredAlerts.length === 0" 
           class="text-center text-gray-400 py-8">
        No active alerts
      </div>
    </div>

    <!-- Alert History -->
    <div class="mt-6">
      <h3 class="font-medium mb-4">Alert History</h3>
      <div class="space-y-2">
        <div v-for="alert in alertHistory" 
             :key="alert.id"
             class="text-sm text-gray-400">
          <span :class="{
            'text-red-400': alert.severity === 'high',
            'text-yellow-400': alert.severity === 'medium',
            'text-blue-400': alert.severity === 'low'
          }">{{ alert.severity }}</span>
          <span class="mx-2">{{ alert.title }}</span>
          <span class="text-gray-500">{{ formatTimeAgo(alert.timestamp) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { formatDistanceToNow } from 'date-fns';

interface SecurityAlert {
  id: string;
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: Date;
  actionable?: boolean;
  actionText?: string;
  action?: () => void;
}

const alertThreshold = ref('all');

const activeAlerts = ref<SecurityAlert[]>([
  {
    id: '1',
    title: 'Brute Force Attack Detected',
    message: 'Multiple failed login attempts from IP 192.168.1.100',
    severity: 'high',
    timestamp: new Date(Date.now() - 300000),
    actionable: true,
    actionText: 'Block IP',
    action: () => {
      // Implement IP blocking
    }
  },
  {
    id: '2',
    title: 'Unusual Login Pattern',
    message: 'Multiple logins from different locations',
    severity: 'medium',
    timestamp: new Date(Date.now() - 900000)
  },
  {
    id: '3',
    title: 'Session Timeout',
    message: 'Admin session expired due to inactivity',
    severity: 'low',
    timestamp: new Date(Date.now() - 1800000)
  }
]);

const alertHistory = ref<SecurityAlert[]>([
  {
    id: '4',
    title: 'Failed Two-Factor Authentication',
    message: 'Multiple failed 2FA attempts',
    severity: 'medium',
    timestamp: new Date(Date.now() - 86400000)
  }
]);

const filteredAlerts = computed(() => {
  return activeAlerts.value.filter(alert => {
    if (alertThreshold.value === 'high') return alert.severity === 'high';
    if (alertThreshold.value === 'medium') return ['high', 'medium'].includes(alert.severity);
    return true;
  });
});

function handleAlertAction(alert: SecurityAlert) {
  if (alert.action) {
    alert.action();
    dismissAlert(alert.id);
  }
}

function dismissAlert(id: string) {
  const alert = activeAlerts.value.find(a => a.id === id);
  if (alert) {
    alertHistory.value.unshift(alert);
    activeAlerts.value = activeAlerts.value.filter(a => a.id !== id);
  }
}

function clearAllAlerts() {
  alertHistory.value.unshift(...activeAlerts.value);
  activeAlerts.value = [];
}

function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}
</script>