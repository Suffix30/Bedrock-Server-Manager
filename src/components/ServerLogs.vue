<template>
  <div class="card p-6">
    <h2 class="text-2xl font-bold mb-4 text-[#00D1FF]">Server Logs</h2>
    <div class="h-96 overflow-y-auto bg-[#0F172A] rounded-lg p-4 border border-gray-800">
      <div v-for="(log, index) in store.logs" 
           :key="index" 
           class="text-sm font-mono text-gray-300 py-1">
        {{ log }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useServerStore } from '../stores/serverStore';

const store = useServerStore();
</script>