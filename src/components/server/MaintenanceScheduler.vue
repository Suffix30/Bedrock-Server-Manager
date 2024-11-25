<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Maintenance Scheduler</h2>
      <button @click="showAddMaintenance = true" class="btn btn-primary">
        Schedule Maintenance
      </button>
    </div>

    <div class="space-y-6">
      <!-- Scheduled Maintenance -->
      <div class="bg-[#0F172A] rounded-lg border border-gray-800">
        <div class="p-4 border-b border-gray-800">
          <h3 class="font-medium">Scheduled Maintenance</h3>
        </div>

        <div class="divide-y divide-gray-800">
          <div v-for="maintenance in scheduledMaintenance" 
               :key="maintenance.id"
               class="p-4">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center space-x-2">
                  <span class="text-gray-100 font-medium">{{ maintenance.title }}</span>
                  <span :class="{
                    'bg-yellow-900 text-yellow-400': maintenance.type === 'update',
                    'bg-blue-900 text-blue-400': maintenance.type === 'backup',
                    'bg-purple-900 text-purple-400': maintenance.type === 'optimization'
                  }" class="px-2 py-0.5 rounded-full text-xs">
                    {{ maintenance.type }}
                  </span>
                </div>
                <p class="text-sm text-gray-400 mt-1">{{ maintenance.description }}</p>
                <div class="flex items-center space-x-4 mt-2 text-sm">
                  <span class="text-gray-500">{{ formatDate(maintenance.scheduledFor) }}</span>
                  <span class="text-gray-500">Duration: {{ maintenance.duration }} minutes</span>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <button 
                  @click="editMaintenance(maintenance)"
                  class="text-[#00D1FF] hover:text-[#00B8E6]"
                >
                  Edit
                </button>
                <button 
                  @click="cancelMaintenance(maintenance.id)"
                  class="text-red-500 hover:text-red-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Maintenance History -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Maintenance History</h3>
        <div class="space-y-2">
          <div v-for="maintenance in maintenanceHistory" 
               :key="maintenance.id"
               class="text-sm text-gray-400">
            <span class="text-gray-300">{{ maintenance.title }}</span>
            <span class="text-gray-500 ml-2">{{ formatTimeAgo(maintenance.completedAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { format, formatDistanceToNow } from 'date-fns';

interface Maintenance {
  id: string;
  title: string;
  description: string;
  type: 'update' | 'backup' | 'optimization';
  scheduledFor: Date;
  duration: number;
  completedAt?: Date;
}

const showAddMaintenance = ref(false);

const scheduledMaintenance = ref<Maintenance[]>([
  {
    id: '1',
    title: 'Server Update',
    description: 'Updating to latest Minecraft version',
    type: 'update',
    scheduledFor: new Date(Date.now() + 86400000),
    duration: 30
  },
  {
    id: '2',
    title: 'World Backup',
    description: 'Full world backup and optimization',
    type: 'backup',
    scheduledFor: new Date(Date.now() + 172800000),
    duration: 60
  }
]);

const maintenanceHistory = ref<Maintenance[]>([
  {
    id: '3',
    title: 'Performance Optimization',
    description: 'Server optimization and cleanup',
    type: 'optimization',
    scheduledFor: new Date(Date.now() - 86400000),
    duration: 45,
    completedAt: new Date(Date.now() - 84600000)
  }
]);

function editMaintenance(maintenance: Maintenance) {
  // Implement edit functionality
}

function cancelMaintenance(id: string) {
  scheduledMaintenance.value = scheduledMaintenance.value.filter(m => m.id !== id);
}

function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy HH:mm');
}

function formatTimeAgo(date: Date | undefined): string {
  if (!date) return '';
  return formatDistanceToNow(date, { addSuffix: true });
}
</script>