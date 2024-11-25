<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">World Backups</h2>
      <button @click="createBackup" class="btn btn-primary" :disabled="isCreating">
        {{ isCreating ? 'Creating...' : 'Create Backup' }}
      </button>
    </div>

    <div class="space-y-4">
      <div v-if="backups.length === 0" class="text-gray-400 text-center py-8">
        No backups available
      </div>

      <div v-else v-for="backup in backups" 
           :key="backup.id"
           class="bg-[#0F172A] p-4 rounded-lg border border-gray-800 flex items-center justify-between">
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-gray-100 font-medium">{{ backup.name }}</span>
            <span class="text-xs px-2 py-1 rounded-full"
                  :class="backup.type === 'auto' ? 'bg-blue-900 text-blue-300' : 'bg-purple-900 text-purple-300'">
              {{ backup.type }}
            </span>
          </div>
          <div class="text-sm text-gray-400 mt-1">
            Created: {{ new Date(backup.createdAt).toLocaleString() }}
            <span class="mx-2">•</span>
            Size: {{ formatSize(backup.size) }}
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <button @click="restoreBackup(backup.id)" 
                  class="btn btn-secondary text-sm py-1"
                  :disabled="isRestoring">
            Restore
          </button>
          <button @click="deleteBackup(backup.id)"
                  class="text-red-500 hover:text-red-400"
                  :disabled="isDeleting">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Backup {
  id: string;
  name: string;
  type: 'auto' | 'manual';
  createdAt: Date;
  size: number;
}

const backups = ref<Backup[]>([
  {
    id: '1',
    name: 'Daily Backup',
    type: 'auto',
    createdAt: new Date(),
    size: 1024 * 1024 * 256 // 256MB
  },
  {
    id: '2',
    name: 'Pre-Update Backup',
    type: 'manual',
    createdAt: new Date(Date.now() - 86400000),
    size: 1024 * 1024 * 512 // 512MB
  }
]);

const isCreating = ref(false);
const isRestoring = ref(false);
const isDeleting = ref(false);

function formatSize(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

async function createBackup() {
  isCreating.value = true;
  try {
    // Simulate backup creation
    await new Promise(resolve => setTimeout(resolve, 2000));
    backups.value.unshift({
      id: Date.now().toString(),
      name: `Manual Backup ${new Date().toLocaleDateString()}`,
      type: 'manual',
      createdAt: new Date(),
      size: Math.random() * 1024 * 1024 * 1000
    });
  } finally {
    isCreating.value = false;
  }
}

async function restoreBackup(id: string) {
  isRestoring.value = true;
  try {
    // Simulate backup restoration
    await new Promise(resolve => setTimeout(resolve, 2000));
  } finally {
    isRestoring.value = false;
  }
}

async function deleteBackup(id: string) {
  isDeleting.value = true;
  try {
    // Simulate backup deletion
    await new Promise(resolve => setTimeout(resolve, 1000));
    backups.value = backups.value.filter(b => b.id !== id);
  } finally {
    isDeleting.value = false;
  }
}
</script>