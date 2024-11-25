<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Backup Scheduler</h2>
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-400">Status:</span>
        <span :class="autoBackupEnabled ? 'text-green-400' : 'text-gray-400'">
          {{ autoBackupEnabled ? 'Enabled' : 'Disabled' }}
        </span>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Enable/Disable -->
      <div class="flex items-center justify-between bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <span class="text-gray-100">Enable Automatic Backups</span>
        <button 
          @click="toggleAutoBackup"
          :class="[
            'btn',
            autoBackupEnabled ? 'btn-primary' : 'btn-secondary'
          ]"
        >
          {{ autoBackupEnabled ? 'Enabled' : 'Disabled' }}
        </button>
      </div>

      <!-- Schedule -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium text-gray-100 mb-4">Backup Schedule</h3>
        
        <div class="space-y-4">
          <div v-for="(schedule, index) in backupSchedules" 
               :key="index"
               class="flex items-center space-x-4">
            <select 
              v-model="schedule.frequency"
              class="flex-1 bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="hourly">Every Hour</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            
            <div v-if="schedule.frequency !== 'hourly'" class="flex-1">
              <input 
                v-if="schedule.frequency === 'daily'"
                v-model="schedule.time"
                type="time"
                class="w-full bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
              />
              <select 
                v-else-if="schedule.frequency === 'weekly'"
                v-model="schedule.day"
                class="w-full bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
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
                v-else
                v-model="schedule.date"
                type="number"
                min="1"
                max="28"
                class="w-full bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
                placeholder="Day of month (1-28)"
              />
            </div>
            
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

      <!-- Retention Settings -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium text-gray-100 mb-4">Retention Settings</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Keep Backups For</div>
              <div class="text-sm text-gray-400">Maximum backup age</div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="retention.days"
                type="number"
                class="w-20 text-center"
                min="1"
              />
              <span class="text-sm text-gray-400">days</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Maximum Size</div>
              <div class="text-sm text-gray-400">Total backup storage limit</div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="retention.size"
                type="number"
                class="w-20 text-center"
                min="1"
              />
              <select 
                v-model="retention.sizeUnit"
                class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
              >
                <option value="GB">GB</option>
                <option value="TB">TB</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Minimum Free Space</div>
              <div class="text-sm text-gray-400">Required disk space</div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="retention.minSpace"
                type="number"
                class="w-20 text-center"
                min="1"
              />
              <span class="text-sm text-gray-400">GB</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Compression Settings -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium text-gray-100 mb-4">Compression Settings</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Compression Level</div>
              <div class="text-sm text-gray-400">Higher = smaller files, slower backup</div>
            </div>
            <select 
              v-model="compression.level"
              class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="none">None</option>
              <option value="fast">Fast</option>
              <option value="normal">Normal</option>
              <option value="max">Maximum</option>
            </select>
          </div>

          <div class="flex items-center space-x-2">
            <input 
              v-model="compression.excludeMedia"
              type="checkbox"
              class="rounded border-gray-700"
            />
            <span class="text-sm text-gray-400">
              Skip compression for media files (images, videos)
            </span>
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

const autoBackupEnabled = ref(true);
const backupSchedules = ref([
  { frequency: 'daily', time: '02:00' }
]);

const retention = ref({
  days: 30,
  size: 500,
  sizeUnit: 'GB',
  minSpace: 50
});

const compression = ref({
  level: 'normal',
  excludeMedia: true
});

function toggleAutoBackup() {
  autoBackupEnabled.value = !autoBackupEnabled.value;
}

function addSchedule() {
  backupSchedules.value.push({
    frequency: 'daily',
    time: '00:00'
  });
}

function removeSchedule(index: number) {
  backupSchedules.value.splice(index, 1);
}

function saveSettings() {
  // Implement settings save
  console.log('Saving backup settings:', {
    enabled: autoBackupEnabled.value,
    schedules: backupSchedules.value,
    retention: retention.value,
    compression: compression.value
  });
}
</script>