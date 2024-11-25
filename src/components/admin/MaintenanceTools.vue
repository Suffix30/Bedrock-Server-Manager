<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Maintenance Tools</h2>
      <div class="flex items-center space-x-4">
        <span :class="maintenanceMode ? 'text-yellow-400' : 'text-green-400'">
          {{ maintenanceMode ? 'Maintenance Mode Active' : 'Server Online' }}
        </span>
        <button 
          @click="toggleMaintenanceMode"
          :class="[
            'btn',
            maintenanceMode ? 'btn-secondary' : 'btn-primary'
          ]"
        >
          {{ maintenanceMode ? 'Exit Maintenance' : 'Enter Maintenance' }}
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Quick Actions -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          v-for="action in quickActions"
          :key="action.id"
          @click="executeAction(action)"
          class="bg-[#0F172A] p-4 rounded-lg border border-gray-800 hover:border-[#00D1FF] transition-colors"
        >
          <div class="text-center space-y-2">
            <div class="text-[#00D1FF] text-lg">{{ action.name }}</div>
            <div class="text-sm text-gray-400">{{ action.description }}</div>
          </div>
        </button>
      </div>

      <!-- Scheduled Tasks -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-medium">Scheduled Maintenance</h3>
          <button @click="showScheduleTask = true" class="btn btn-secondary">
            Schedule Task
          </button>
        </div>

        <div class="space-y-2">
          <div v-for="task in scheduledTasks" 
               :key="task.id"
               class="flex items-center justify-between py-2">
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-gray-100">{{ task.name }}</span>
                <span :class="{
                  'bg-yellow-900 text-yellow-400': task.type === 'backup',
                  'bg-blue-900 text-blue-400': task.type === 'cleanup',
                  'bg-purple-900 text-purple-400': task.type === 'optimization'
                }" class="px-2 py-0.5 rounded-full text-xs">
                  {{ task.type }}
                </span>
              </div>
              <div class="text-sm text-gray-400 mt-1">
                Next run: {{ formatDate(task.nextRun) }}
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <button 
                @click="toggleTask(task.id)"
                :class="[
                  'btn',
                  task.enabled ? 'btn-primary' : 'btn-secondary'
                ]"
              >
                {{ task.enabled ? 'Enabled' : 'Disabled' }}
              </button>
              <button 
                @click="deleteTask(task.id)"
                class="text-red-500 hover:text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cleanup Tools -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Cleanup Tools</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Old Backups</div>
              <div class="text-sm text-gray-400">
                Remove backups older than
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="cleanup.backupAge"
                type="number"
                class="w-20 text-center"
                min="1"
              />
              <span class="text-sm text-gray-400">days</span>
              <button @click="cleanupBackups" class="btn btn-secondary">
                Clean
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Player Data</div>
              <div class="text-sm text-gray-400">
                Remove inactive player data
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="cleanup.playerInactivity"
                type="number"
                class="w-20 text-center"
                min="30"
              />
              <span class="text-sm text-gray-400">days</span>
              <button @click="cleanupPlayerData" class="btn btn-secondary">
                Clean
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Log Files</div>
              <div class="text-sm text-gray-400">
                Clear logs older than
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="cleanup.logAge"
                type="number"
                class="w-20 text-center"
                min="1"
              />
              <span class="text-sm text-gray-400">days</span>
              <button @click="cleanupLogs" class="btn btn-secondary">
                Clean
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Maintenance History -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Maintenance History</h3>
        <div class="space-y-2">
          <div v-for="action in maintenanceHistory" 
               :key="action.id"
               class="flex items-center justify-between py-2">
            <div>
              <div class="text-gray-100">{{ action.description }}</div>
              <div class="text-sm text-gray-400 mt-1">
                {{ formatTimeAgo(action.timestamp) }}
              </div>
            </div>
            <span :class="{
              'text-green-400': action.status === 'success',
              'text-red-400': action.status === 'error'
            }">{{ action.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { format, formatDistanceToNow } from 'date-fns';

interface MaintenanceTask {
  id: string;
  name: string;
  type: 'backup' | 'cleanup' | 'optimization';
  nextRun: Date;
  enabled: boolean;
}

interface MaintenanceAction {
  id: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'error';
}

const maintenanceMode = ref(false);
const showScheduleTask = ref(false);

const quickActions = [
  {
    id: 'backup',
    name: 'Quick Backup',
    description: 'Create a backup now'
  },
  {
    id: 'optimize',
    name: 'Optimize',
    description: 'Run optimization tasks'
  },
  {
    id: 'cleanup',
    name: 'Clean Up',
    description: 'Remove temporary files'
  },
  {
    id: 'repair',
    name: 'Repair',
    description: 'Check and repair files'
  }
];

const scheduledTasks = ref<MaintenanceTask[]>([
  {
    id: '1',
    name: 'Daily Backup',
    type: 'backup',
    nextRun: new Date(Date.now() + 86400000),
    enabled: true
  },
  {
    id: '2',
    name: 'Weekly Cleanup',
    type: 'cleanup',
    nextRun: new Date(Date.now() + 604800000),
    enabled: true
  }
]);

const cleanup = ref({
  backupAge: 30,
  playerInactivity: 90,
  logAge: 7
});

const maintenanceHistory = ref<MaintenanceAction[]>([
  {
    id: '1',
    description: 'Daily backup completed',
    timestamp: new Date(Date.now() - 3600000),
    status: 'success'
  },
  {
    id: '2',
    description: 'Optimization failed',
    timestamp: new Date(Date.now() - 7200000),
    status: 'error'
  }
]);

function toggleMaintenanceMode() {
  maintenanceMode.value = !maintenanceMode.value;
}

function executeAction(action: { id: string; name: string }) {
  // Implement action execution
  console.log('Executing action:', action.name);
  
  maintenanceHistory.value.unshift({
    id: Date.now().toString(),
    description: `${action.name} completed`,
    timestamp: new Date(),
    status: 'success'
  });
}

function toggleTask(id: string) {
  const task = scheduledTasks.value.find(t => t.id === id);
  if (task) {
    task.enabled = !task.enabled;
  }
}

function deleteTask(id: string) {
  scheduledTasks.value = scheduledTasks.value.filter(t => t.id !== id);
}

function cleanupBackups() {
  // Implement backup cleanup
  console.log('Cleaning up backups older than', cleanup.value.backupAge, 'days');
}

function cleanupPlayerData() {
  // Implement player data cleanup
  console.log('Cleaning up inactive player data older than', cleanup.value.playerInactivity, 'days');
}

function cleanupLogs() {
  // Implement log cleanup
  console.log('Cleaning up logs older than', cleanup.value.logAge, 'days');
}

function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy HH:mm');
}

function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}
</script>