<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Announcements</h2>
      <button @click="showNewAnnouncement = true" class="btn btn-primary">
        New Announcement
      </button>
    </div>

    <div class="space-y-4">
      <!-- Announcements List -->
      <div v-for="announcement in announcements" 
           :key="announcement.id"
           class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-gray-100 font-medium">{{ announcement.title }}</span>
              <span :class="{
                'bg-green-900 text-green-400': announcement.type === 'info',
                'bg-yellow-900 text-yellow-400': announcement.type === 'warning',
                'bg-red-900 text-red-400': announcement.type === 'alert'
              }" class="px-2 py-0.5 rounded text-xs">
                {{ announcement.type }}
              </span>
            </div>
            <p class="text-gray-400 mt-2">{{ announcement.message }}</p>
            <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span>{{ formatDate(announcement.scheduledFor) }}</span>
              <span>{{ announcement.repeat ? 'Repeating' : 'One-time' }}</span>
            </div>
          </div>
          <button @click="deleteAnnouncement(announcement.id)" 
                  class="text-red-500 hover:text-red-400">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- New Announcement Modal -->
    <div v-if="showNewAnnouncement" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-[#1E293B] p-6 rounded-xl w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">New Announcement</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Title</label>
            <input 
              v-model="newAnnouncement.title"
              type="text"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Message</label>
            <textarea 
              v-model="newAnnouncement.message"
              rows="3"
              class="w-full bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Type</label>
            <select 
              v-model="newAnnouncement.type"
              class="w-full bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="alert">Alert</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Schedule For</label>
            <input 
              v-model="newAnnouncement.scheduledFor"
              type="datetime-local"
              class="w-full bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
            />
          </div>

          <div class="flex items-center space-x-2">
            <input 
              v-model="newAnnouncement.repeat"
              type="checkbox"
              class="rounded border-gray-700"
            />
            <label class="text-sm text-gray-400">Repeat announcement</label>
          </div>

          <div class="flex justify-end space-x-3">
            <button @click="showNewAnnouncement = false" class="btn btn-secondary">
              Cancel
            </button>
            <button @click="createAnnouncement" class="btn btn-primary">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { format } from 'date-fns';

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert';
  scheduledFor: string;
  repeat: boolean;
}

const showNewAnnouncement = ref(false);
const announcements = ref<Announcement[]>([
  {
    id: '1',
    title: 'Server Maintenance',
    message: 'Server will be down for maintenance on Sunday at 2 AM UTC',
    type: 'warning',
    scheduledFor: '2024-03-10T02:00',
    repeat: false
  }
]);

const newAnnouncement = ref({
  title: '',
  message: '',
  type: 'info',
  scheduledFor: '',
  repeat: false
});

function createAnnouncement() {
  announcements.value.push({
    id: Date.now().toString(),
    ...newAnnouncement.value
  } as Announcement);
  
  showNewAnnouncement.value = false;
  newAnnouncement.value = {
    title: '',
    message: '',
    type: 'info',
    scheduledFor: '',
    repeat: false
  };
}

function deleteAnnouncement(id: string) {
  announcements.value = announcements.value.filter(a => a.id !== id);
}

function formatDate(date: string): string {
  return format(new Date(date), 'MMM d, yyyy HH:mm');
}
</script>