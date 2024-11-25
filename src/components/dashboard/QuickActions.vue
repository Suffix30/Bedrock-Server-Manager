<template>
  <div class="card p-6">
    <h2 class="text-2xl font-bold mb-6 text-[#00D1FF]">Quick Actions</h2>
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <button 
        v-for="action in quickActions"
        :key="action.id"
        @click="executeAction(action)"
        :class="[
          'bg-[#0F172A] p-4 rounded-lg border border-gray-800 hover:border-[#00D1FF] transition-colors',
          action.id === 'maintenance' && maintenanceMode ? 'border-yellow-500' : ''
        ]"
      >
        <div class="text-center space-y-2">
          <div class="text-[#00D1FF] text-lg">{{ action.name }}</div>
          <div class="text-sm text-gray-400">{{ action.description }}</div>
        </div>
      </button>
    </div>

    <!-- Broadcast Modal -->
    <div v-if="showBroadcastModal" 
         class="fixed inset-0 z-50 flex items-center justify-center"
         @click="closeBroadcastModal">
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="bg-[#1E293B] p-6 rounded-xl w-full max-w-md relative z-50"
           @click.stop>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">Send Broadcast Message</h3>
          <button @click="closeBroadcastModal" 
                  class="text-gray-400 hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Message</label>
            <textarea 
              v-model="broadcastMessage"
              rows="3"
              class="w-full bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
              placeholder="Enter your broadcast message"
              @keydown.esc="closeBroadcastModal"
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <button @click="closeBroadcastModal" class="btn btn-secondary">
              Cancel
            </button>
            <button 
              @click="sendBroadcast"
              class="btn btn-primary"
              :disabled="!broadcastMessage.trim()"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMainStore } from '../../stores/mainStore';
import { useServerStore } from '../../stores/serverStore';

const mainStore = useMainStore();
const serverStore = useServerStore();

const showBroadcastModal = ref(false);
const broadcastMessage = ref('');
const maintenanceMode = ref(false);

const quickActions = computed(() => [
  {
    id: 'restart',
    name: 'Restart Server',
    description: 'Safely restart the server',
    action: async () => {
      await serverStore.stopServer();
      setTimeout(() => serverStore.startServer(), 2000);
      serverStore.addLog('Server restarted');
    }
  },
  {
    id: 'backup',
    name: 'Quick Backup',
    description: 'Create a backup now',
    action: () => {
      const backupName = `backup_${new Date().toISOString().split('T')[0]}`;
      mainStore.backups.push({
        id: Date.now().toString(),
        name: backupName,
        createdAt: new Date(),
        size: Math.random() * 1024 * 1024 * 1000,
        type: 'manual'
      });
      serverStore.addLog(`Created backup: ${backupName}`);
    }
  },
  {
    id: 'broadcast',
    name: 'Broadcast',
    description: 'Send a message to all players',
    action: () => {
      showBroadcastModal.value = true;
    }
  },
  {
    id: 'maintenance',
    name: maintenanceMode.value ? 'Exit Maintenance' : 'Maintenance Mode',
    description: maintenanceMode.value ? 'Resume normal operations' : 'Enable maintenance mode',
    action: () => {
      maintenanceMode.value = !maintenanceMode.value;
      const status = maintenanceMode.value ? 'enabled' : 'disabled';
      serverStore.addLog(`Maintenance mode ${status}`);
      
      if (maintenanceMode.value) {
        serverStore.players.forEach(player => {
          if (!player.username.includes('Admin')) {
            serverStore.kickPlayer(player.username);
          }
        });
      }
    }
  }
]);

function executeAction(action: { id: string; action: () => void }) {
  action.action();
}

function sendBroadcast() {
  if (broadcastMessage.value.trim()) {
    serverStore.addLog(`Broadcast: ${broadcastMessage.value}`);
    closeBroadcastModal();
  }
}

function closeBroadcastModal() {
  showBroadcastModal.value = false;
  broadcastMessage.value = '';
}
</script>