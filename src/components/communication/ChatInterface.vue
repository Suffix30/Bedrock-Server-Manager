<template>
  <div class="card p-6">
    <h2 class="text-2xl font-bold mb-6 text-[#00D1FF]">In-Game Chat</h2>
    
    <div class="space-y-4">
      <!-- Chat Window -->
      <div class="h-96 bg-[#0F172A] rounded-lg border border-gray-800 flex flex-col">
        <!-- Chat Messages -->
        <div ref="chatWindow" class="flex-1 overflow-y-auto p-4 space-y-2">
          <div v-for="message in messages" 
               :key="message.id"
               :class="{
                 'opacity-75': message.type === 'system',
                 'text-yellow-400': message.type === 'command'
               }"
               class="text-sm">
            <span class="text-gray-500">[{{ formatTime(message.timestamp) }}]</span>
            <span v-if="message.type === 'system'" class="text-[#00D1FF]">
              {{ message.content }}
            </span>
            <span v-else>
              <span :style="{ color: message.playerColor }">{{ message.player }}</span>
              <span class="text-gray-300">: {{ message.content }}</span>
            </span>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="p-4 border-t border-gray-800">
          <div class="flex space-x-2">
            <input 
              v-model="newMessage"
              @keyup.enter="sendMessage"
              type="text"
              placeholder="Type a message..."
              class="flex-1"
            />
            <button @click="sendMessage" class="btn btn-primary">
              Send
            </button>
          </div>
          <!-- Quick Commands -->
          <div class="flex space-x-2 mt-2">
            <button 
              v-for="cmd in quickCommands"
              :key="cmd.command"
              @click="executeCommand(cmd.command)"
              class="text-xs px-2 py-1 rounded bg-[#1E293B] text-gray-400 hover:text-gray-300"
            >
              {{ cmd.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Chat Settings -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Chat Settings</h3>
        <div class="space-y-2">
          <label class="flex items-center space-x-2">
            <input 
              v-model="settings.showTimestamps"
              type="checkbox"
              class="rounded border-gray-700"
            />
            <span class="text-sm text-gray-400">Show timestamps</span>
          </label>
          <label class="flex items-center space-x-2">
            <input 
              v-model="settings.showSystemMessages"
              type="checkbox"
              class="rounded border-gray-700"
            />
            <span class="text-sm text-gray-400">Show system messages</span>
          </label>
          <label class="flex items-center space-x-2">
            <input 
              v-model="settings.showPlayerColors"
              type="checkbox"
              class="rounded border-gray-700"
            />
            <span class="text-sm text-gray-400">Show player colors</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';

interface ChatMessage {
  id: string;
  player?: string;
  playerColor?: string;
  content: string;
  timestamp: Date;
  type: 'chat' | 'system' | 'command';
}

const chatWindow = ref<HTMLElement | null>(null);
const newMessage = ref('');
const messages = ref<ChatMessage[]>([]);
const settings = ref({
  showTimestamps: true,
  showSystemMessages: true,
  showPlayerColors: true
});

const quickCommands = [
  { name: 'Time Day', command: '/time set day' },
  { name: 'Weather Clear', command: '/weather clear' },
  { name: 'List Players', command: '/list' }
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function sendMessage() {
  if (!newMessage.value.trim()) return;

  const isCommand = newMessage.value.startsWith('/');
  
  messages.value.push({
    id: Date.now().toString(),
    player: isCommand ? undefined : 'Admin',
    playerColor: isCommand ? undefined : '#00D1FF',
    content: newMessage.value,
    timestamp: new Date(),
    type: isCommand ? 'command' : 'chat'
  });

  // Simulate response for commands
  if (isCommand) {
    setTimeout(() => {
      messages.value.push({
        id: Date.now().toString(),
        content: `Executed command: ${newMessage.value}`,
        timestamp: new Date(),
        type: 'system'
      });
    }, 500);
  }

  newMessage.value = '';
  scrollToBottom();
}

function executeCommand(command: string) {
  newMessage.value = command;
  sendMessage();
}

function scrollToBottom() {
  nextTick(() => {
    if (chatWindow.value) {
      chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
    }
  });
}

// Simulate some chat activity
onMounted(() => {
  const sampleMessages = [
    { player: 'Steve', content: 'Hello everyone!', color: '#55FF55' },
    { player: 'Alex', content: 'Hi Steve!', color: '#FF5555' },
    { type: 'system', content: 'Player Notch joined the game' },
    { player: 'Notch', content: 'Anyone want to trade?', color: '#FFAA00' }
  ];

  sampleMessages.forEach((msg, index) => {
    setTimeout(() => {
      messages.value.push({
        id: Date.now().toString(),
        player: msg.player,
        playerColor: msg.color,
        content: msg.content,
        timestamp: new Date(),
        type: msg.type || 'chat'
      });
      scrollToBottom();
    }, index * 1000);
  });
});

watch(messages, scrollToBottom);
</script>