<template>
  <div class="card p-6">
    <h2 class="text-2xl font-bold mb-6 text-[#00D1FF]">Server Settings</h2>
    
    <div class="space-y-6">
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="space-y-4">
          <div class="flex flex-col space-y-2">
            <label class="text-sm font-medium text-gray-300">Server Name</label>
            <input 
              v-model="settings.serverName"
              type="text"
              class="bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:border-[#00D1FF] focus:ring-1 focus:ring-[#00D1FF] outline-none"
            />
          </div>

          <div class="flex flex-col space-y-2">
            <label class="text-sm font-medium text-gray-300">Server IP</label>
            <input 
              v-model="settings.serverIp"
              type="text"
              placeholder="Enter server IP address"
              class="bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:border-[#00D1FF] focus:ring-1 focus:ring-[#00D1FF] outline-none"
            />
          </div>

          <div class="flex flex-col space-y-2">
            <label class="text-sm font-medium text-gray-300">Server Port</label>
            <input 
              v-model.number="settings.port"
              type="number"
              class="bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:border-[#00D1FF] focus:ring-1 focus:ring-[#00D1FF] outline-none"
            />
          </div>

          <div class="flex flex-col space-y-2">
            <label class="text-sm font-medium text-gray-300">Max Players</label>
            <input 
              v-model.number="settings.maxPlayers"
              type="number"
              class="bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:border-[#00D1FF] focus:ring-1 focus:ring-[#00D1FF] outline-none"
            />
          </div>

          <div class="flex items-center space-x-2">
            <input 
              v-model="settings.allowCheats"
              type="checkbox"
              class="rounded border-gray-700 text-[#00D1FF] focus:ring-[#00D1FF]"
            />
            <label class="text-sm font-medium text-gray-300">Allow Cheats</label>
          </div>
        </div>

        <div class="flex justify-end space-x-4 mt-6">
          <button 
            @click="resetSettings"
            class="btn btn-secondary"
          >
            Reset
          </button>
          <button 
            @click="saveSettings"
            class="btn btn-primary"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { useServerStore } from '../stores/serverStore';

const store = useServerStore();

const settings = reactive({
  serverName: '',
  serverIp: '',
  port: 19132,
  maxPlayers: 10,
  allowCheats: false,
});

function saveSettings() {
  store.updateSettings({
    ...settings
  });
  store.addLog('Server settings updated');
}

function resetSettings() {
  // Load current settings from store
  const storeSettings = store.settings;
  settings.serverName = storeSettings.serverName;
  settings.serverIp = storeSettings.serverIp || '';
  settings.port = storeSettings.port;
  settings.maxPlayers = storeSettings.maxPlayers;
  settings.allowCheats = storeSettings.allowCheats;
  store.addLog('Server settings reset to previous values');
}

// Load settings when component mounts
onMounted(() => {
  resetSettings();
});
</script>