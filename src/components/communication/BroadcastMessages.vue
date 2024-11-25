<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Broadcast Messages</h2>
      <button @click="showNewBroadcast = true" class="btn btn-primary">
        New Broadcast
      </button>
    </div>

    <div class="space-y-6">
      <!-- Active Broadcasts -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Active Broadcasts</h3>
        <div class="space-y-4">
          <div v-for="broadcast in activeBroadcasts" 
               :key="broadcast.id"
               class="flex items-start justify-between">
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-gray-100">{{ broadcast.message }}</span>
                <span :class="{
                  'bg-red-900 text-red-400': broadcast.priority === 'high',
                  'bg-yellow-900 text-yellow-400': broadcast.priority === 'medium',
                  'bg-blue-900 text-blue-400': broadcast.priority === 'low'
                }" class="px-2 py-0.5 rounded-full text-xs">
                  {{ broadcast.priority }}
                </span>
              </div>
              <div class="text-sm text-gray-400 mt-1">
                {{ formatInterval(broadcast.interval) }} • 
                {{ broadcast.remainingTime }} remaining
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <button 
                @click="pauseBroadcast(broadcast.id)"
                :class="[
                  'btn',
                  broadcast.paused ? 'btn-secondary' : 'btn-primary'
                ]"
              >
                {{ broadcast.paused ? 'Resume' : 'Pause' }}
              </button>
              <button 
                @click="stopBroadcast(broadcast.id)"
                class="text-red-500 hover:text-red-400"
              >
                Stop
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Broadcast Templates -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-medium">Templates</h3>
          <button @click="showNewTemplate = true" class="btn btn-secondary">
            Add Template
          </button>
        </div>

        <div class="space-y-2">
          <div v-for="template in broadcastTemplates" 
               :key="template.id"
               class="flex items-center justify-between py-2">
            <div>
              <div class="text-gray-100">{{ template.name }}</div>
              <div class="text-sm text-gray-400 mt-1">
                {{ template.message }}
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button 
                @click="useBroadcastTemplate(template)"
                class="text-[#00D1FF] hover:text-[#00B8E6]"
              >
                Use
              </button>
              <button 
                @click="deleteTemplate(template.id)"
                class="text-red-500 hover:text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Broadcast History -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">History</h3>
        <div class="space-y-2">
          <div v-for="broadcast in broadcastHistory" 
               :key="broadcast.id"
               class="text-sm">
            <span class="text-gray-300">{{ broadcast.message }}</span>
            <span class="text-gray-500 ml-2">
              {{ formatTimeAgo(broadcast.timestamp) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formatDistanceToNow } from 'date-fns';

interface Broadcast {
  id: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  interval: number;
  remainingTime: string;
  paused: boolean;
  timestamp?: Date;
}

interface BroadcastTemplate {
  id: string;
  name: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  interval: number;
}

const showNewBroadcast = ref(false);
const showNewTemplate = ref(false);

const activeBroadcasts = ref<Broadcast[]>([
  {
    id: '1',
    message: 'Server will restart in 30 minutes',
    priority: 'high',
    interval: 300,
    remainingTime: '28:45',
    paused: false
  },
  {
    id: '2',
    message: 'Welcome to the server!',
    priority: 'low',
    interval: 900,
    remainingTime: '12:30',
    paused: true
  }
]);

const broadcastTemplates = ref<BroadcastTemplate[]>([
  {
    id: '1',
    name: 'Server Restart',
    message: 'Server will restart in {time}',
    priority: 'high',
    interval: 300
  },
  {
    id: '2',
    name: 'Welcome Message',
    message: 'Welcome to the server! Need help? Ask an admin.',
    priority: 'low',
    interval: 900
  }
]);

const broadcastHistory = ref<Broadcast[]>([
  {
    id: '3',
    message: 'Server maintenance completed',
    priority: 'medium',
    interval: 0,
    remainingTime: '',
    paused: false,
    timestamp: new Date(Date.now() - 3600000)
  }
]);

function pauseBroadcast(id: string) {
  const broadcast = activeBroadcasts.value.find(b => b.id === id);
  if (broadcast) {
    broadcast.paused = !broadcast.paused;
  }
}

function stopBroadcast(id: string) {
  const broadcast = activeBroadcasts.value.find(b => b.id === id);
  if (broadcast) {
    broadcast.timestamp = new Date();
    broadcastHistory.value.unshift(broadcast);
    activeBroadcasts.value = activeBroadcasts.value.filter(b => b.id !== id);
  }
}

function useBroadcastTemplate(template: BroadcastTemplate) {
  const newBroadcast: Broadcast = {
    id: Date.now().toString(),
    message: template.message,
    priority: template.priority,
    interval: template.interval,
    remainingTime: formatInterval(template.interval),
    paused: false
  };
  activeBroadcasts.value.push(newBroadcast);
}

function deleteTemplate(id: string) {
  broadcastTemplates.value = broadcastTemplates.value.filter(t => t.id !== id);
}

function formatInterval(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `Every ${minutes} minutes`;
}

function formatTimeAgo(date: Date | undefined): string {
  if (!date) return '';
  return formatDistanceToNow(date, { addSuffix: true });
}
</script>