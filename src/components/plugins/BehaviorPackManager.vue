<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Behavior Pack Manager</h2>
      <button @click="showUploadModal = true" class="btn btn-primary">
        Upload Pack
      </button>
    </div>

    <div class="space-y-6">
      <!-- Installed Behavior Packs -->
      <div class="bg-[#0F172A] rounded-lg border border-gray-800">
        <div class="p-4 border-b border-gray-800">
          <h3 class="font-medium">Installed Behavior Packs</h3>
        </div>

        <div class="divide-y divide-gray-800">
          <div v-for="pack in behaviorPacks" 
               :key="pack.id"
               class="p-4">
            <div class="flex items-start justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 rounded-lg bg-[#1E293B] flex items-center justify-center">
                  <img 
                    v-if="pack.icon"
                    :src="pack.icon"
                    :alt="pack.name"
                    class="w-8 h-8"
                  />
                  <div v-else 
                       class="w-8 h-8 rounded bg-[#2E3B4B] flex items-center justify-center text-[#00D1FF]">
                    {{ pack.name[0].toUpperCase() }}
                  </div>
                </div>
                <div>
                  <div class="flex items-center space-x-2">
                    <span class="text-gray-100 font-medium">{{ pack.name }}</span>
                    <span class="text-sm text-gray-400">v{{ pack.version }}</span>
                  </div>
                  <p class="text-sm text-gray-400 mt-1">{{ pack.description }}</p>
                  <div class="flex items-center space-x-4 mt-2">
                    <span class="text-sm text-gray-500">{{ formatSize(pack.size) }}</span>
                    <span class="text-sm text-gray-500">{{ pack.author }}</span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <button 
                  @click="togglePack(pack.id)"
                  :class="[
                    'btn',
                    pack.enabled ? 'btn-primary' : 'btn-secondary'
                  ]"
                >
                  {{ pack.enabled ? 'Enabled' : 'Disabled' }}
                </button>
                <button 
                  @click="showPackSettings(pack)"
                  class="text-[#00D1FF] hover:text-[#00B8E6]"
                >
                  Settings
                </button>
                <button 
                  @click="deletePack(pack.id)"
                  class="text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>

            <!-- Dependencies -->
            <div v-if="pack.dependencies?.length" class="mt-4">
              <div class="text-sm text-gray-500">Dependencies:</div>
              <div class="flex flex-wrap gap-2 mt-1">
                <span v-for="dep in pack.dependencies" 
                      :key="dep"
                      class="text-xs px-2 py-1 rounded-full bg-[#1E293B] text-gray-400">
                  {{ dep }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pack Order -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Load Order</h3>
        <div class="space-y-2">
          <div v-for="pack in enabledPacks" 
               :key="pack.id"
               class="flex items-center justify-between bg-[#1E293B] p-2 rounded">
            <span class="text-gray-100">{{ pack.name }}</span>
            <div class="flex items-center space-x-2">
              <button 
                @click="movePack(pack.id, 'up')"
                class="text-gray-400 hover:text-gray-300"
                :disabled="isFirstPack(pack.id)"
              >
                ↑
              </button>
              <button 
                @click="movePack(pack.id, 'down')"
                class="text-gray-400 hover:text-gray-300"
                :disabled="isLastPack(pack.id)"
              >
                ↓
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface BehaviorPack {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  size: number;
  enabled: boolean;
  icon?: string;
  dependencies?: string[];
}

const showUploadModal = ref(false);

const behaviorPacks = ref<BehaviorPack[]>([
  {
    id: '1',
    name: 'Custom Mobs',
    version: '1.2.0',
    description: 'Adds new custom mobs with unique behaviors',
    author: 'BehaviorCrafter',
    size: 1024 * 1024 * 25,
    enabled: true,
    dependencies: ['base-pack']
  },
  {
    id: '2',
    name: 'Advanced NPCs',
    version: '2.1.0',
    description: 'Enhanced NPC behaviors and interactions',
    author: 'NPCMaster',
    size: 1024 * 1024 * 35,
    enabled: false,
    dependencies: ['base-pack', 'custom-mobs']
  }
]);

const enabledPacks = computed(() => {
  return behaviorPacks.value.filter(pack => pack.enabled);
});

function togglePack(id: string) {
  const pack = behaviorPacks.value.find(p => p.id === id);
  if (pack) {
    pack.enabled = !pack.enabled;
  }
}

function showPackSettings(pack: BehaviorPack) {
  // Implement settings modal
  console.log('Show settings for:', pack.name);
}

function deletePack(id: string) {
  behaviorPacks.value = behaviorPacks.value.filter(p => p.id !== id);
}

function movePack(id: string, direction: 'up' | 'down') {
  const index = behaviorPacks.value.findIndex(p => p.id === id);
  if (index === -1) return;

  const newIndex = direction === 'up' ? index - 1 : index + 1;
  if (newIndex < 0 || newIndex >= behaviorPacks.value.length) return;

  const pack = behaviorPacks.value[index];
  behaviorPacks.value.splice(index, 1);
  behaviorPacks.value.splice(newIndex, 0, pack);
}

function isFirstPack(id: string): boolean {
  return enabledPacks.value[0]?.id === id;
}

function isLastPack(id: string): boolean {
  return enabledPacks.value[enabledPacks.value.length - 1]?.id === id;
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