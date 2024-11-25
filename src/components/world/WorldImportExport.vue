<template>
  <div class="card p-6">
    <h2 class="text-2xl font-bold mb-6 text-[#00D1FF]">World Import/Export</h2>
    
    <div class="space-y-6">
      <!-- Import Section -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Import World</h3>
        
        <div class="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center"
             @dragover.prevent="dragOver = true"
             @dragleave.prevent="dragOver = false"
             @drop.prevent="handleDrop"
             :class="{ 'border-[#00D1FF] bg-[#00D1FF]/5': dragOver || isUploading }">
          <div class="space-y-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div class="text-gray-300 font-medium">
              {{ isUploading ? 'Uploading...' : dragOver ? 'Drop world file here' : selectedFile ? selectedFile.name : 'Drag and drop world file here' }}
            </div>
            <div class="text-sm text-gray-400">
              Supports .mcworld files
            </div>
            <button @click="triggerFileInput" class="btn btn-secondary text-sm">
              Browse Files
            </button>
            <input 
              ref="fileInput"
              type="file"
              accept=".mcworld"
              class="hidden"
              @change="handleFileImport"
            />
          </div>

          <!-- Upload Progress -->
          <div v-if="isUploading" class="mt-4">
            <div class="w-full bg-gray-800 rounded-full h-2">
              <div class="bg-[#00D1FF] h-2 rounded-full transition-all duration-500"
                   :style="{ width: `${uploadProgress}%` }"></div>
            </div>
            <div class="text-sm text-gray-400 mt-2">
              {{ uploadProgress }}% complete
            </div>
          </div>
        </div>

        <!-- Status Message -->
        <div v-if="importStatus" :class="{
          'mt-4 p-4 rounded-lg': true,
          'bg-green-900/20 border border-green-700': importStatus.type === 'success',
          'bg-red-900/20 border border-red-700': importStatus.type === 'error'
        }">
          <div class="flex items-center space-x-2">
            <span :class="{
              'text-green-400': importStatus.type === 'success',
              'text-red-400': importStatus.type === 'error'
            }">{{ importStatus.message }}</span>
          </div>
        </div>

        <div class="mt-4">
          <div class="flex items-center space-x-2">
            <input 
              v-model="importOptions.backup"
              type="checkbox"
              class="rounded border-gray-700"
            />
            <span class="text-sm text-gray-400">
              Create backup before importing
            </span>
          </div>
        </div>
      </div>

      <!-- Rest of the template remains the same -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formatDistanceToNow } from 'date-fns';
import { useServerStore } from '../../stores/serverStore';

const store = useServerStore();
const fileInput = ref<HTMLInputElement | null>(null);
const dragOver = ref(false);
const isUploading = ref(false);
const uploadProgress = ref(0);
const selectedFile = ref<File | null>(null);

interface Activity {
  id: string;
  name: string;
  type: 'import' | 'export';
  timestamp: Date;
  size?: number;
  url?: string;
}

interface ImportStatus {
  type: 'success' | 'error';
  message: string;
}

const importOptions = ref({
  backup: true
});

const exportOptions = ref({
  format: 'mcworld',
  includePlayerData: true,
  includeAddons: true
});

const importStatus = ref<ImportStatus | null>(null);
const recentActivity = ref<Activity[]>([]);

function triggerFileInput() {
  fileInput.value?.click();
}

async function handleFileImport(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    selectedFile.value = input.files[0];
    await importWorld(input.files[0]);
  }
}

async function handleDrop(event: DragEvent) {
  dragOver.value = false;
  const file = event.dataTransfer?.files[0];
  if (file) {
    selectedFile.value = file;
    await importWorld(file);
  }
}

async function importWorld(file: File) {
  try {
    // Reset status
    importStatus.value = null;
    isUploading.value = true;
    uploadProgress.value = 0;

    // Validate file type
    if (!file.name.endsWith('.mcworld')) {
      throw new Error('Invalid file type. Only .mcworld files are supported.');
    }

    // Create backup if enabled
    if (importOptions.value.backup) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      uploadProgress.value = i;
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Add to recent activity
    recentActivity.value.unshift({
      id: Date.now().toString(),
      name: file.name,
      type: 'import',
      timestamp: new Date(),
      size: file.size
    });

    importStatus.value = {
      type: 'success',
      message: 'World imported successfully!'
    };

    store.addLog(`Imported world: ${file.name}`);

    // Clear file input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  } catch (error) {
    importStatus.value = {
      type: 'error',
      message: error instanceof Error ? error.message : 'Failed to import world'
    };
    store.addLog(`Failed to import world: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    isUploading.value = false;
    uploadProgress.value = 0;
  }
}

// Rest of the script remains the same
</script>