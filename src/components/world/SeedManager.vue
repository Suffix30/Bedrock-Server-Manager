<template>
  <div class="card p-6">
    <h2 class="text-2xl font-bold mb-6 text-[#00D1FF]">Seed Manager</h2>
    
    <div class="space-y-6">
      <!-- Current Seed -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Current Seed</h3>
        <div class="flex space-x-4">
          <input 
            v-model="currentSeed"
            type="text"
            placeholder="Enter world seed"
            class="flex-1"
            :disabled="!editMode"
          />
          <button 
            v-if="!editMode"
            @click="editMode = true" 
            class="btn btn-secondary"
          >
            Edit
          </button>
          <template v-else>
            <button 
              @click="generateRandomSeed"
              class="btn btn-secondary"
            >
              Random
            </button>
            <button 
              @click="applySeed"
              class="btn btn-primary"
            >
              Apply
            </button>
          </template>
        </div>
      </div>

      <!-- Seed History -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Seed History</h3>
        <div class="space-y-2">
          <div v-for="seed in seedHistory" 
               :key="seed.id"
               class="flex items-center justify-between py-2">
            <div>
              <div class="font-mono text-gray-100">{{ seed.value }}</div>
              <div class="text-sm text-gray-400 mt-1">
                {{ formatDate(seed.usedAt) }}
              </div>
            </div>
            <button 
              @click="reuseSeed(seed)"
              class="text-[#00D1FF] hover:text-[#00B8E6]"
            >
              Use Again
            </button>
          </div>
        </div>
      </div>

      <!-- Seed Preview -->
      <div v-if="editMode" class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Seed Preview</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-400 mb-1">Biomes</div>
              <div class="text-gray-100">
                {{ previewData.biomes.join(', ') }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-400 mb-1">Structures</div>
              <div class="text-gray-100">
                {{ previewData.structures.join(', ') }}
              </div>
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">Spawn Point</div>
            <div class="text-gray-100">
              X: {{ previewData.spawnPoint.x }}, 
              Y: {{ previewData.spawnPoint.y }}, 
              Z: {{ previewData.spawnPoint.z }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { format } from 'date-fns';

interface Seed {
  id: string;
  value: string;
  usedAt: Date;
}

interface PreviewData {
  biomes: string[];
  structures: string[];
  spawnPoint: {
    x: number;
    y: number;
    z: number;
  };
}

const currentSeed = ref('');
const editMode = ref(false);

const seedHistory = ref<Seed[]>([
  {
    id: '1',
    value: '12345678',
    usedAt: new Date(Date.now() - 86400000)
  },
  {
    id: '2',
    value: '87654321',
    usedAt: new Date(Date.now() - 172800000)
  }
]);

const previewData = ref<PreviewData>({
  biomes: ['Plains', 'Forest', 'Desert'],
  structures: ['Village', 'Temple', 'Stronghold'],
  spawnPoint: {
    x: 100,
    y: 64,
    z: -150
  }
});

function generateRandomSeed() {
  currentSeed.value = Math.random().toString(36).substring(2, 15);
}

function applySeed() {
  // Implement seed application
  seedHistory.value.unshift({
    id: Date.now().toString(),
    value: currentSeed.value,
    usedAt: new Date()
  });
  editMode.value = false;
}

function reuseSeed(seed: Seed) {
  currentSeed.value = seed.value;
  editMode.value = true;
}

function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy HH:mm');
}
</script>