<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Chat Moderation</h2>
      <div class="flex items-center space-x-4">
        <select 
          v-model="filterLevel"
          class="bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button @click="updateFilters" class="btn btn-primary">
          Update Filters
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Word Filters -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-medium">Word Filters</h3>
          <button @click="showAddFilter = true" class="btn btn-secondary">
            Add Filter
          </button>
        </div>

        <div class="space-y-2">
          <div v-for="filter in wordFilters" 
               :key="filter.id"
               class="flex items-center justify-between py-2">
            <div>
              <div class="flex items-center space-x-2">
                <span class="font-mono text-gray-100">{{ filter.pattern }}</span>
                <span :class="{
                  'bg-red-900 text-red-400': filter.action === 'block',
                  'bg-yellow-900 text-yellow-400': filter.action === 'warn',
                  'bg-blue-900 text-blue-400': filter.action === 'replace'
                }" class="px-2 py-0.5 rounded-full text-xs">
                  {{ filter.action }}
                </span>
              </div>
              <div class="text-sm text-gray-400 mt-1">
                {{ filter.description }}
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <button 
                @click="toggleFilter(filter.id)"
                :class="[
                  'btn',
                  filter.enabled ? 'btn-primary' : 'btn-secondary'
                ]"
              >
                {{ filter.enabled ? 'Enabled' : 'Disabled' }}
              </button>
              <button 
                @click="deleteFilter(filter.id)"
                class="text-red-500 hover:text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Spam Protection -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Spam Protection</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Message Cooldown</div>
              <div class="text-sm text-gray-400">
                Minimum time between messages
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="spamSettings.cooldown"
                type="number"
                class="w-20 text-center"
                min="0"
              />
              <span class="text-sm text-gray-400">seconds</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Similar Message Limit</div>
              <div class="text-sm text-gray-400">
                Maximum similar messages allowed
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="spamSettings.similarLimit"
                type="number"
                class="w-20 text-center"
                min="1"
              />
              <span class="text-sm text-gray-400">messages</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Caps Lock Percentage</div>
              <div class="text-sm text-gray-400">
                Maximum uppercase characters allowed
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="spamSettings.capsPercentage"
                type="number"
                class="w-20 text-center"
                min="0"
                max="100"
              />
              <span class="text-sm text-gray-400">%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Moderation Actions -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Recent Actions</h3>
        <div class="space-y-2">
          <div v-for="action in moderationActions" 
               :key="action.id"
               class="text-sm">
            <span :class="{
              'text-red-400': action.type === 'block',
              'text-yellow-400': action.type === 'warn',
              'text-blue-400': action.type === 'replace'
            }">{{ action.type }}</span>
            <span class="text-gray-400 ml-2">{{ action.player }}</span>
            <span class="text-gray-500 ml-2">{{ formatTimeAgo(action.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formatDistanceToNow } from 'date-fns';

interface WordFilter {
  id: string;
  pattern: string;
  action: 'block' | 'warn' | 'replace';
  description: string;
  enabled: boolean;
}

interface ModerationAction {
  id: string;
  type: 'block' | 'warn' | 'replace';
  player: string;
  timestamp: Date;
}

const filterLevel = ref('medium');
const showAddFilter = ref(false);

const wordFilters = ref<WordFilter[]>([
  {
    id: '1',
    pattern: '*swear*',
    action: 'block',
    description: 'Block swear words',
    enabled: true
  },
  {
    id: '2',
    pattern: '*spam*',
    action: 'warn',
    description: 'Warn for spam patterns',
    enabled: true
  }
]);

const spamSettings = ref({
  cooldown: 3,
  similarLimit: 3,
  capsPercentage: 70
});

const moderationActions = ref<ModerationAction[]>([
  {
    id: '1',
    type: 'block',
    player: 'Player123',
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: '2',
    type: 'warn',
    player: 'Player456',
    timestamp: new Date(Date.now() - 900000)
  }
]);

function toggleFilter(id: string) {
  const filter = wordFilters.value.find(f => f.id === id);
  if (filter) {
    filter.enabled = !filter.enabled;
  }
}

function deleteFilter(id: string) {
  wordFilters.value = wordFilters.value.filter(f => f.id !== id);
}

function updateFilters() {
  // Implement filter update logic
  console.log('Updating filters with level:', filterLevel.value);
}

function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}
</script>