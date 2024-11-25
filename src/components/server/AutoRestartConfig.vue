<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Auto-restart Configuration</h2>
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
        <button @click="saveSettings" class="btn btn-primary">
          Save Settings
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

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

function saveSettings() {
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