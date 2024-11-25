<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Server Console</h2>
      <div class="flex items-center space-x-2">
        <button @click="clearConsole" class="btn btn-secondary text-sm">
          Clear
        </button>
        <button 
          @click="autoScroll = !autoScroll"
          :class="[
            'btn text-sm',
            autoScroll ? 'btn-primary' : 'btn-secondary'
          ]"
        >
          Auto-scroll
        </button>
      </div>
    </div>

    <div class="space-y-4">
      <!-- Console Output -->
      <div 
        ref="consoleOutput"
        class="h-96 bg-[#0F172A] rounded-lg p-4 font-mono text-sm overflow-y-auto border border-gray-800"
      >
        <div v-for="(entry, index) in consoleHistory"
             :key="index"
             :class="{
               'text-red-400': entry.type === 'error',
               'text-yellow-400': entry.type === 'warning',
               'text-green-400': entry.type === 'success',
               'text-gray-300': entry.type === 'info'
             }"
             class="py-1"
        >
          <span class="text-gray-500">[{{ entry.timestamp.toLocaleTimeString() }}]</span>
          {{ entry.message }}
        </div>
      </div>

      <!-- Command Input -->
      <div class="flex space-x-2">
        <div class="relative flex-1">
          <input 
            v-model="currentCommand"
            @keyup.enter="executeCommand"
            @keyup.up="navigateHistory('up')"
            @keyup.down="navigateHistory('down')"
            type="text"
            placeholder="Enter command..."
            class="w-full pr-24"
          />
          <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <button 
              v-for="macro in quickMacros"
              :key="macro.name"
              @click="executeCommand(macro.command)"
              class="text-xs px-2 py-1 rounded bg-[#1E293B] text-gray-400 hover:text-gray-300"
            >
              {{ macro.name }}
            </button>
          </div>
        </div>
        <button @click="executeCommand" class="btn btn-primary">
          Execute
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const consoleOutput = ref<HTMLDivElement | null>(null);
const currentCommand = ref('');
const autoScroll = ref(true);
const commandHistory = ref<string[]>([]);
const historyIndex = ref(-1);

interface ConsoleEntry {
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
}

const consoleHistory = ref<ConsoleEntry[]>([]);

const quickMacros = [
  { name: 'Time Day', command: 'time set day' },
  { name: 'Weather Clear', command: 'weather clear' },
  { name: 'Save All', command: 'save-all' }
];

function executeCommand(command?: string) {
  const cmdToExecute = command || currentCommand.value;
  if (!cmdToExecute) return;

  // Add to history
  commandHistory.value.unshift(cmdToExecute);
  historyIndex.value = -1;

  // Simulate command execution
  addConsoleEntry({
    message: `> ${cmdToExecute}`,
    type: 'info'
  });

  // Clear input
  if (!command) {
    currentCommand.value = '';
  }
}

function addConsoleEntry({ message, type = 'info' }: { message: string, type?: ConsoleEntry['type'] }) {
  consoleHistory.value.push({
    message,
    type,
    timestamp: new Date()
  });

  if (autoScroll.value) {
    scrollToBottom();
  }
}

function scrollToBottom() {
  setTimeout(() => {
    if (consoleOutput.value) {
      consoleOutput.value.scrollTop = consoleOutput.value.scrollHeight;
    }
  }, 0);
}

function clearConsole() {
  consoleHistory.value = [];
}

function navigateHistory(direction: 'up' | 'down') {
  if (direction === 'up' && historyIndex.value < commandHistory.value.length - 1) {
    historyIndex.value++;
  } else if (direction === 'down' && historyIndex.value > -1) {
    historyIndex.value--;
  }

  if (historyIndex.value > -1) {
    currentCommand.value = commandHistory.value[historyIndex.value];
  } else {
    currentCommand.value = '';
  }
}

// Simulate some console activity
let activityInterval: NodeJS.Timer;

onMounted(() => {
  activityInterval = setInterval(() => {
    const messages = [
      { message: 'Player Steve joined the game', type: 'success' },
      { message: 'Saved the game', type: 'info' },
      { message: 'Can\'t keep up! Is the server overloaded?', type: 'warning' },
      { message: 'Exception in thread "Server" java.lang.OutOfMemoryError', type: 'error' }
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    addConsoleEntry(randomMessage);
  }, 5000);
});

onUnmounted(() => {
  clearInterval(activityInterval);
});

watch(autoScroll, (newValue) => {
  if (newValue) {
    scrollToBottom();
  }
});
</script>