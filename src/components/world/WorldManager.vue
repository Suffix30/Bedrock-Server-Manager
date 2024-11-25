<template>
  <div class="space-y-6">
    <!-- World Settings -->
    <div class="card p-6">
      <h2 class="text-2xl font-bold mb-6 text-[#00D1FF]">World Settings</h2>
      
      <div class="space-y-4">
        <!-- Seed Management -->
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <h3 class="text-lg font-medium mb-4">Seed Management</h3>
          <div class="flex space-x-4">
            <input 
              v-model="worldSettings.seed"
              type="text"
              placeholder="Enter world seed"
              class="flex-1"
            />
            <button @click="generateRandomSeed" class="btn btn-secondary">
              Random Seed
            </button>
            <button @click="applySeed" class="btn btn-primary" :disabled="!worldSettings.seed">
              Apply Seed
            </button>
          </div>
          <p class="text-sm text-gray-400 mt-2">Current Seed: {{ currentSeed || 'Not set' }}</p>
        </div>

        <!-- World Reset -->
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <h3 class="text-lg font-medium mb-4">World Reset</h3>
          <div class="space-y-4">
            <div class="flex items-center space-x-2">
              <input 
                v-model="resetOptions.keepInventory"
                type="checkbox"
                class="rounded border-gray-700"
              />
              <label class="text-gray-400">Keep player inventories</label>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="resetOptions.keepProgress"
                type="checkbox"
                class="rounded border-gray-700"
              />
              <label class="text-gray-400">Keep player progress (achievements, etc.)</label>
            </div>
            <button 
              @click="showResetConfirmation = true" 
              class="btn btn-secondary w-full"
            >
              Reset World
            </button>
          </div>
        </div>

        <!-- Game Mode Settings -->
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <h3 class="text-lg font-medium mb-4">Game Mode Settings</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-400">Default Game Mode</span>
              <select 
                v-model="worldSettings.gameMode"
                class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
              >
                <option value="survival">Survival</option>
                <option value="creative">Creative</option>
                <option value="adventure">Adventure</option>
                <option value="spectator">Spectator</option>
              </select>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-400">Difficulty</span>
              <select 
                v-model="worldSettings.difficulty"
                class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
              >
                <option value="peaceful">Peaceful</option>
                <option value="easy">Easy</option>
                <option value="normal">Normal</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-400">Spawn Protection</span>
              <div class="flex items-center space-x-2">
                <input 
                  v-model="worldSettings.spawnProtectionRadius"
                  type="number"
                  class="w-24 text-center"
                  min="0"
                />
                <span class="text-gray-400">blocks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reset Confirmation Modal -->
    <div v-if="showResetConfirmation" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-[#1E293B] p-6 rounded-xl w-full max-w-md">
        <h3 class="text-xl font-bold text-red-500 mb-4">⚠️ Reset World</h3>
        <p class="text-gray-300 mb-4">
          Are you sure you want to reset the world? This action cannot be undone!
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="showResetConfirmation = false" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="resetWorld" class="btn btn-primary bg-red-500">
            Reset World
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const worldSettings = ref({
  seed: '',
  gameMode: 'survival',
  difficulty: 'normal',
  spawnProtectionRadius: 16
});

const resetOptions = ref({
  keepInventory: false,
  keepProgress: false,
});

const currentSeed = ref('');
const showResetConfirmation = ref(false);

function generateRandomSeed() {
  worldSettings.value.seed = Math.random().toString(36).substring(2, 15);
}

function applySeed() {
  currentSeed.value = worldSettings.value.seed;
  // In a real implementation, this would apply the seed to the server
}

function resetWorld() {
  // In a real implementation, this would reset the world with the selected options
  showResetConfirmation.value = false;
}
</script>