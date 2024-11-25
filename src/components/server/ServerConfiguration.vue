<template>
  <div class="space-y-6">
    <!-- Game Rules Editor -->
    <div class="card p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-[#00D1FF]">Game Rules</h2>
        <button @click="saveGameRules" class="btn btn-primary">
          Save Changes
        </button>
      </div>

      <div class="space-y-6">
        <!-- Categories -->
        <div class="flex space-x-4">
          <button 
            v-for="category in categories" 
            :key="category"
            @click="currentCategory = category"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              currentCategory === category
                ? 'bg-[#00D1FF] text-[#0F172A]'
                : 'bg-[#1E293B] text-gray-400 hover:text-gray-300'
            ]"
          >
            {{ category }}
          </button>
        </div>

        <!-- Rules List -->
        <div class="space-y-4">
          <div v-for="rule in filteredRules" 
               :key="rule.name"
               class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-100">{{ formatRuleName(rule.name) }}</h3>
                <p class="text-sm text-gray-400 mt-1">{{ rule.description }}</p>
              </div>
              
              <div v-if="rule.type === 'boolean'" class="flex items-center space-x-2">
                <button 
                  @click="toggleRule(rule.name)"
                  :class="[
                    'btn',
                    rule.value ? 'btn-primary' : 'btn-secondary'
                  ]"
                >
                  {{ rule.value ? 'Enabled' : 'Disabled' }}
                </button>
              </div>
              
              <div v-else-if="rule.type === 'number'" class="flex items-center space-x-4">
                <input 
                  v-model.number="rule.value"
                  type="number"
                  :min="rule.min"
                  :max="rule.max"
                  class="w-24 text-center"
                />
                <span class="text-sm text-gray-400">
                  ({{ rule.min }} - {{ rule.max }})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Auto-restart Settings -->
    <div class="card p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-[#00D1FF]">Auto-restart Settings</h2>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-400">Status:</span>
          <span :class="autoRestartEnabled ? 'text-green-400' : 'text-gray-400'">
            {{ autoRestartEnabled ? 'Enabled' : 'Disabled' }}
          </span>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Enable/Disable -->
        <div class="flex items-center justify-between bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <span class="text-gray-100">Enable Auto-restart</span>
          <button 
            @click="toggleAutoRestart"
            :class="[
              'btn',
              autoRestartEnabled ? 'btn-primary' : 'btn-secondary'
            ]"
          >
            {{ autoRestartEnabled ? 'Enabled' : 'Disabled' }}
          </button>
        </div>

        <!-- Schedule -->
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <h3 class="font-medium text-gray-100 mb-4">Restart Schedule</h3>
          
          <div class="space-y-4">
            <div v-for="(schedule, index) in restartSchedules" 
                 :key="index"
                 class="flex items-center space-x-4">
              <select 
                v-model="schedule.days"
                multiple
                class="flex-1 bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
              >
                <option value="0">Sunday</option>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
              </select>
              
              <input 
                v-model="schedule.time"
                type="time"
                class="w-32 bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
              />
              
              <button 
                @click="removeSchedule(index)"
                class="text-red-500 hover:text-red-400"
              >
                Remove
              </button>
            </div>
            
            <button 
              @click="addSchedule"
              class="btn btn-secondary w-full"
            >
              Add Schedule
            </button>
          </div>
        </div>

        <!-- Warning Message -->
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <h3 class="font-medium text-gray-100 mb-4">Warning Message</h3>
          <div class="space-y-4">
            <input 
              v-model="warningMessage"
              type="text"
              class="w-full"
              placeholder="Server will restart in {time} minutes"
            />
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <label class="block text-sm text-gray-400 mb-1">Warning Times (minutes)</label>
                <input 
                  v-model="warningTimes"
                  type="text"
                  class="w-full"
                  placeholder="e.g., 15,10,5,1"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-1">Countdown</label>
                <input 
                  v-model="countdownStart"
                  type="number"
                  class="w-24 text-center"
                  min="0"
                  max="60"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end">
          <button @click="saveAutoRestartSettings" class="btn btn-primary">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Game Rules
const categories = ['Gameplay', 'Technical', 'Chat', 'Spawning'];
const currentCategory = ref('Gameplay');

interface GameRule {
  name: string;
  description: string;
  category: string;
  type: 'boolean' | 'number';
  value: boolean | number;
  min?: number;
  max?: number;
}

const gameRules = ref<GameRule[]>([
  {
    name: 'keepInventory',
    description: 'Keep inventory after death',
    category: 'Gameplay',
    type: 'boolean',
    value: false
  },
  {
    name: 'doDaylightCycle',
    description: 'Advance time of day',
    category: 'Gameplay',
    type: 'boolean',
    value: true
  },
  {
    name: 'randomTickSpeed',
    description: 'Random tick update frequency',
    category: 'Technical',
    type: 'number',
    value: 3,
    min: 0,
    max: 100
  },
  {
    name: 'mobGriefing',
    description: 'Allow mobs to destroy blocks',
    category: 'Gameplay',
    type: 'boolean',
    value: true
  },
  {
    name: 'doWeatherCycle',
    description: 'Enable weather changes',
    category: 'Gameplay',
    type: 'boolean',
    value: true
  },
  {
    name: 'doMobSpawning',
    description: 'Enable mob spawning',
    category: 'Spawning',
    type: 'boolean',
    value: true
  },
  {
    name: 'commandBlockOutput',
    description: 'Broadcast command block output',
    category: 'Technical',
    type: 'boolean',
    value: true
  },
  {
    name: 'maxCommandChainLength',
    description: 'Maximum command chain length',
    category: 'Technical',
    type: 'number',
    value: 65536,
    min: 1,
    max: 2147483647
  }
]);

const filteredRules = computed(() => {
  return gameRules.value.filter(rule => rule.category === currentCategory.value);
});

function formatRuleName(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}

function toggleRule(name: string) {
  const rule = gameRules.value.find(r => r.name === name);
  if (rule && rule.type === 'boolean') {
    rule.value = !rule.value;
  }
}

function saveGameRules() {
  // Implement save functionality
  console.log('Saving game rules:', gameRules.value);
}

// Auto-restart Settings
const autoRestartEnabled = ref(false);
const restartSchedules = ref([
  { days: ['0'], time: '02:00' } // Sunday at 2 AM
]);
const warningMessage = ref('Server will restart in {time} minutes');
const warningTimes = ref('15,10,5,1');
const countdownStart = ref(10);

function toggleAutoRestart() {
  autoRestartEnabled.value = !autoRestartEnabled.value;
}

function addSchedule() {
  restartSchedules.value.push({ days: [], time: '00:00' });
}

function removeSchedule(index: number) {
  restartSchedules.value.splice(index, 1);
}

function saveAutoRestartSettings() {
  // Implement save functionality
  console.log('Saving auto-restart settings:', {
    enabled: autoRestartEnabled.value,
    schedules: restartSchedules.value,
    warning: {
      message: warningMessage.value,
      times: warningTimes.value.split(',').map(Number),
      countdown: countdownStart.value
    }
  });
}
</script>