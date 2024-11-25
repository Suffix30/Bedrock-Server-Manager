<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Offline Mail</h2>
      <button @click="showNewMail = true" class="btn btn-primary">
        New Mail
      </button>
    </div>

    <div class="space-y-6">
      <!-- Mail List -->
      <div class="bg-[#0F172A] rounded-lg border border-gray-800">
        <div class="p-4 border-b border-gray-800">
          <div class="flex space-x-4">
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
              <span class="ml-2 px-2 py-0.5 rounded-full text-xs"
                    :class="currentTab === tab.id ? 'bg-[#0F172A] text-[#00D1FF]' : 'bg-[#0F172A]'">
                {{ getMailCount(tab.id) }}
              </span>
            </button>
          </div>
        </div>

        <div class="divide-y divide-gray-800">
          <div v-for="mail in filteredMail" 
               :key="mail.id"
               class="p-4 hover:bg-[#1E293B] transition-colors">
            <div class="flex items-center justify-between">
              <div>
                <div class="flex items-center space-x-2">
                  <span class="font-medium text-gray-100">
                    {{ currentTab === 'sent' ? mail.to : mail.from }}
                  </span>
                  <span v-if="mail.priority === 'high'"
                        class="px-2 py-0.5 rounded-full text-xs bg-red-900 text-red-400">
                    High Priority
                  </span>
                </div>
                <div class="text-sm text-gray-400 mt-1">{{ mail.subject }}</div>
                <div class="text-sm text-gray-500 mt-1">
                  {{ formatDate(mail.timestamp) }}
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <button 
                  v-if="!mail.read && currentTab === 'inbox'"
                  @click="markAsRead(mail.id)"
                  class="text-[#00D1FF] hover:text-[#00B8E6]"
                >
                  Mark as Read
                </button>
                <button 
                  @click="deleteMail(mail.id)"
                  class="text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Mail Modal -->
    <div v-if="showNewMail" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-[#1E293B] p-6 rounded-xl w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">New Mail</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">To</label>
            <input 
              v-model="newMail.to"
              type="text"
              class="w-full"
              placeholder="Enter player name"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Subject</label>
            <input 
              v-model="newMail.subject"
              type="text"
              class="w-full"
              placeholder="Enter subject"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Message</label>
            <textarea 
              v-model="newMail.message"
              rows="4"
              class="w-full bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
              placeholder="Enter your message"
            ></textarea>
          </div>

          <div class="flex items-center space-x-2">
            <input 
              v-model="newMail.priority"
              type="checkbox"
              class="rounded border-gray-700"
            />
            <label class="text-sm text-gray-400">High Priority</label>
          </div>

          <div class="flex justify-end space-x-3">
            <button @click="showNewMail = false" class="btn btn-secondary">
              Cancel
            </button>
            <button @click="sendMail" class="btn btn-primary">
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
import { format } from 'date-fns';

interface Mail {
  id: string;
  from: string;
  to: string;
  subject: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'normal' | 'high';
}

const tabs = [
  { id: 'inbox', name: 'Inbox' },
  { id: 'sent', name: 'Sent' }
];

const currentTab = ref('inbox');
const showNewMail = ref(false);
const mailbox = ref<Mail[]>([
  {
    id: '1',
    from: 'Steve',
    to: 'Admin',
    subject: 'Need help with building',
    message: 'Can you help me with my house design?',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
    priority: 'normal'
  },
  {
    id: '2',
    from: 'Admin',
    to: 'Alex',
    subject: 'Server maintenance',
    message: 'Server will be down for maintenance tonight.',
    timestamp: new Date(Date.now() - 7200000),
    read: true,
    priority: 'high'
  }
]);

const newMail = ref({
  to: '',
  subject: '',
  message: '',
  priority: false
});

const filteredMail = computed(() => {
  return mailbox.value.filter(mail => 
    currentTab.value === 'inbox' 
      ? mail.to === 'Admin'
      : mail.from === 'Admin'
  ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
});

function getMailCount(tab: string): number {
  if (tab === 'inbox') {
    return mailbox.value.filter(m => m.to === 'Admin' && !m.read).length;
  }
  return mailbox.value.filter(m => m.from === 'Admin').length;
}

function markAsRead(id: string) {
  const mail = mailbox.value.find(m => m.id === id);
  if (mail) {
    mail.read = true;
  }
}

function deleteMail(id: string) {
  mailbox.value = mailbox.value.filter(m => m.id !== id);
}

function sendMail() {
  if (!newMail.value.to || !newMail.value.subject || !newMail.value.message) return;

  mailbox.value.push({
    id: Date.now().toString(),
    from: 'Admin',
    to: newMail.value.to,
    subject: newMail.value.subject,
    message: newMail.value.message,
    timestamp: new Date(),
    read: false,
    priority: newMail.value.priority ? 'high' : 'normal'
  });

  showNewMail.value = false;
  newMail.value = {
    to: '',
    subject: '',
    message: '',
    priority: false
  };
}

function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy HH:mm');
}
</script>