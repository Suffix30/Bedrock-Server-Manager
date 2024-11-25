<template>
  <div class="space-y-6">
    <!-- Add-on Installation -->
    <div class="card p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-[#00D1FF]">Add-on Manager</h2>
        <button @click="showUploadModal = true" class="btn btn-primary">
          Upload Add-on
        </button>
      </div>

      <!-- Add-on Categories -->
      <div class="flex space-x-4 mb-6">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="currentTab = tab.id"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            currentTab === tab.id
              ? 'bg-[#00D1FF] text-[#0F172A]'
              : 'bg-[#1E293B] text-gray-400 hover:text-gray-300'
          ]"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Add-on List -->
      <div class="space-y-4">
        <div v-for="addon in filteredAddons" 
             :key="addon.id"
             class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 rounded-lg bg-[#1E293B] flex items-center justify-center">
                <img 
                  v-if="addon.icon"
                  :src="addon.icon"
                  :alt="addon.name"
                  class="w-8 h-8"
                />
                <div v-else 
                     class="w-8 h-8 rounded bg-[#2E3B4B] flex items-center justify-center text-[#00D1FF]">
                  {{ addon.name[0].toUpperCase() }}
                </div>
              </div>
              <div>
                <h3 class="font-medium text-gray-100">{{ addon.name }}</h3>
                <div class="flex items-center space-x-2 mt-1">
                  <span class="text-sm text-gray-400">v{{ addon.version }}</span>
                  <span class="text-sm px-2 py-0.5 rounded-full"
                        :class="{
                          'bg-green-900 text-green-400': addon.type === 'resource',
                          'bg-blue-900 text-blue-400': addon.type === 'behavior',
                          'bg-purple-900 text-purple-400': addon.type === 'plugin'
                        }">
                    {{ addon.type }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <button 
                v-if="addon.enabled"
                @click="toggleAddon(addon.id)"
                class="btn btn-primary"
              >
                Enabled
              </button>
              <button 
                v-else
                @click="toggleAddon(addon.id)"
                class="btn btn-secondary"
              >
                Disabled
              </button>
              <button 
                @click="showAddonSettings(addon)"
                class="text-[#00D1FF] hover:text-[#00B8E6]"
              >
                Configure
              </button>
              <button 
                @click="deleteAddon(addon.id)"
                class="text-red-500 hover:text-red-400"
              >
                Delete
              </button>
            </div>
          </div>

          <!-- Add-on Details -->
          <div class="mt-4 text-sm text-gray-400">
            {{ addon.description }}
          </div>

          <!-- Dependencies -->
          <div v-if="addon.dependencies?.length" class="mt-2">
            <div class="text-sm text-gray-500">Dependencies:</div>
            <div class="flex flex-wrap gap-2 mt-1">
              <span v-for="dep in addon.dependencies" 
                    :key="dep"
                    class="text-xs px-2 py-1 rounded-full bg-[#1E293B] text-gray-400">
                {{ dep }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-[#1E293B] p-6 rounded-xl w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Upload Add-on</h3>
        <div class="space-y-4">
          <!-- Upload Area -->
          <div class="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
            <div class="space-y-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div class="text-gray-300 font-medium">
                Drag and drop add-on files here
              </div>
              <div class="text-sm text-gray-400">
                Supports .mcpack, .mcaddon, and .zip files
              </div>
              <button @click="triggerFileInput" class="btn btn-secondary text-sm">
                Browse Files
              </button>
              <input 
                ref="fileInput"
                type="file"
                accept=".mcpack,.mcaddon,.zip"
                class="hidden"
                @change="handleFileUpload"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button @click="showUploadModal = false" class="btn btn-secondary">
              Cancel
            </button>
            <button 
              @click="uploadAddOn"
              class="btn btn-primary"
              :disabled="!selectedFile"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface AddOn {
  id: string;
  name: string;
  version: string;
  type: 'resource' | 'behavior' | 'plugin';
  description: string;
  enabled: boolean;
  icon?: string;
  dependencies?: string[];
}

const tabs = [
  { id: 'all', name: 'All' },
  { id: 'resource', name: 'Resource Packs' },
  { id: 'behavior', name: 'Behavior Packs' },
  { id: 'plugin', name: 'Plugins' }
];

const currentTab = ref('all');
const showUploadModal = ref(false);
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const addons = ref<AddOn[]>([
  {
    id: '1',
    name: 'HD Textures',
    version: '1.2.0',
    type: 'resource',
    description: 'High-resolution texture pack for enhanced graphics',
    enabled: true,
    dependencies: ['base-pack']
  },
  {
    id: '2',
    name: 'Custom Mobs',
    version: '2.1.0',
    type: 'behavior',
    description: 'Adds new custom mobs with unique behaviors',
    enabled: true,
    dependencies: ['base-pack', 'mob-resources']
  },
  {
    id: '3',
    name: 'Economy',
    version: '1.0.0',
    type: 'plugin',
    description: 'Adds player economy and shop system',
    enabled: false
  }
]);

const filteredAddons = computed(() => {
  if (currentTab.value === 'all') return addons.value;
  return addons.value.filter(addon => addon.type === currentTab.value);
});

function toggleAddon(id: string) {
  const addon = addons.value.find(a => a.id === id);
  if (addon) {
    addon.enabled = !addon.enabled;
  }
}

function showAddonSettings(addon: AddOn) {
  // Implement settings modal
  console.log('Show settings for:', addon.name);
}

function deleteAddon(id: string) {
  addons.value = addons.value.filter(a => a.id !== id);
}

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    selectedFile.value = input.files[0];
  }
}

function uploadAddOn() {
  if (selectedFile.value) {
    // Simulate upload
    const newAddon: AddOn = {
      id: Date.now().toString(),
      name: selectedFile.value.name.replace(/\.[^/.]+$/, ''),
      version: '1.0.0',
      type: 'resource',
      description: 'Newly uploaded add-on',
      enabled: false
    };
    addons.value.push(newAddon);
    showUploadModal.value = false;
    selectedFile.value = null;
  }
}
</script>