<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Plugin Manager</h2>
      <button @click="showAddPlugin = true" class="btn btn-primary">
        Add Plugin
      </button>
    </div>

    <div class="space-y-4">
      <div v-for="plugin in store.plugins" 
           :key="plugin.id"
           class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-gray-100">{{ plugin.name }}</h3>
            <p class="text-sm text-gray-400">Version {{ plugin.version }}</p>
          </div>
          
          <div class="flex items-center space-x-3">
            <button 
              @click="togglePlugin(plugin.id)"
              :class="[
                'btn',
                plugin.enabled ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ plugin.enabled ? 'Enabled' : 'Disabled' }}
            </button>
            <button 
              @click="showPluginConfig(plugin)"
              class="text-[#00D1FF] hover:text-[#00B8E6]"
            >
              Configure
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Plugin Modal -->
    <div v-if="showAddPlugin" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-[#1E293B] p-6 rounded-xl w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Add Plugin</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Plugin File</label>
            <input 
              type="file" 
              accept=".jar,.zip"
              class="w-full bg-[#0F172A] rounded-lg p-2 border border-gray-700"
            >
          </div>
          <div class="flex justify-end space-x-3">
            <button @click="showAddPlugin = false" class="btn btn-secondary">
              Cancel
            </button>
            <button @click="uploadPlugin" class="btn btn-primary">
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMainStore } from '../../stores/mainStore';

const store = useMainStore();
const showAddPlugin = ref(false);

function togglePlugin(id: string) {
  const plugin = store.plugins.find(p => p.id === id);
  if (plugin) {
    plugin.enabled = !plugin.enabled;
  }
}

function showPluginConfig(plugin: any) {
  // Implement plugin configuration modal
}

function uploadPlugin() {
  // Implement plugin upload logic
  showAddPlugin.value = false;
}
</script>