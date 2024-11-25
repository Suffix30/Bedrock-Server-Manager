<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Server Controls</h2>
      <div class="flex items-center space-x-2">
        <div class="h-3 w-3 rounded-full" 
             :class="{
               'bg-red-500': store.serverStatus === 'stopped',
               'bg-yellow-500': ['starting', 'stopping'].includes(store.serverStatus),
               'bg-[#00D1FF]': store.serverStatus === 'running'
             }">
        </div>
        <span class="text-sm font-medium capitalize text-gray-300">{{ store.serverStatus }}</span>
      </div>
    </div>
    
    <div class="flex space-x-4">
      <button @click="store.startServer"
              :disabled="store.serverStatus !== 'stopped'"
              class="btn btn-primary">
        Start Server
      </button>
      <button @click="store.stopServer"
              :disabled="store.serverStatus !== 'running'"
              class="btn btn-secondary">
        Stop Server
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useServerStore } from '../stores/serverStore';

const store = useServerStore();
</script>