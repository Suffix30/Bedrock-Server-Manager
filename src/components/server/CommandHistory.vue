<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Command History</h2>
      <div class="flex items-center space-x-4">
        <select 
          v-model="filterType"
          class="bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
        >
          <option value="all">All Commands</option>
          <option value="success">Successful</option>
          <option value="error">Failed</option>
        </select>
        <button @click="clearHistory" class="btn btn-secondary">
          Clear History
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Command List -->
      <div class="bg-[#0F172A] rounded-lg border border-gray-800">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-sm text-gray-400 border-b border-gray-800">
                <th class="p-4">Timestamp</th>
                <th class="p-4">Command</th>
                <th class="p-4">Executor</th>
                <th class="p-4">Status</th>
                <th class="p-4">Response</th>
                <th class="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="command in filteredCommands" 
                  :key="command.id"
                  class="border-b border-gray-800 hover:bg-[#1E293B]">
                <td class="p-4 text-sm font-mono text-gray-400">
                  {{ formatDate(command.timestamp) }}
                </td>
                <td class="p-4">
                  <span class="font-mono text-gray-100">{{ command.command }}</span>
                </td>
                <td class="p-4 text-gray-300">{{ command.executor }}</td>
                <td class="p-4">
                  <span :class="{
                    'text-green-400': command.status === 'success',
                    'text-red-400': command.status === 'error'
                  }">{{ command.status }}</span>
                </td>
                <td class="p-4 text-sm text-gray-400">
                  {{ command.response }}
                </td>
                <td class="p-4">
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="rerunCommand(command)"
                      class="text-[#00D1FF] hover:text-[#00B8E6]"
                    >
                      Rerun
                    </button>
                    <button 
                      @click="saveCommand(command)"
                      class="text-gray-400 hover:text-gray-300"
                    >
                      Save
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Statistics -->
      <div class="grid grid-cols-4 gap-4">
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Total Commands</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ stats.total }}</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Success Rate</div>
          <div class="text-2xl font-bold text-green-400">{{ stats.successRate }}%</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Most Used</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ stats.mostUsed }}</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Average Response Time</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ stats.avgResponseTime }}ms</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { format } from 'date-fns';

interface Command {
  id: string;
  command: string;
  executor: string;
  timestamp: Date;
  status: 'success' | 'error';
  response: string;
}

const filterType = ref('all');

const commandHistory = ref<Command[]>([
  {
    id: '1',
    command: 'time set day',
    executor: 'Admin',
    timestamp: new Date(Date.now() - 300000),
    status: 'success',
    response: 'Set the time to 1000'
  },
  {
    id: '2',
    command: 'give @p diamond 64',
    executor: 'Admin',
    timestamp: new Date(Date.now() - 600000),
    status: 'success',
    response: 'Gave 64 diamond to Player1'
  },
  {
    id: '3',
    command: 'tp @p 100 100 100',
    executor: 'Moderator',
    timestamp: new Date(Date.now() - 900000),
    status: 'error',
    response: 'Player not found'
  }
]);

const filteredCommands = computed(() => {
  if (filterType.value === 'all') return commandHistory.value;
  return commandHistory.value.filter(cmd => cmd.status === filterType.value);
});

const stats = computed(() => {
  const total = commandHistory.value.length;
  const successful = commandHistory.value.filter(cmd => cmd.status === 'success').length;
  
  // Count command usage
  const commandCounts = new Map<string, number>();
  commandHistory.value.forEach(cmd => {
    const count = commandCounts.get(cmd.command) || 0;
    commandCounts.set(cmd.command, count + 1);
  });
  
  // Find most used command
  let mostUsed = '';
  let maxCount = 0;
  commandCounts.forEach((count, command) => {
    if (count > maxCount) {
      maxCount = count;
      mostUsed = command;
    }
  });

  return {
    total,
    successRate: total ? Math.round((successful / total) * 100) : 0,
    mostUsed: mostUsed || 'N/A',
    avgResponseTime: 150 // Simulated average response time
  };
});

function clearHistory() {
  commandHistory.value = [];
}

function rerunCommand(command: Command) {
  // Implement command re-execution
  console.log('Rerunning command:', command.command);
}

function saveCommand(command: Command) {
  // Implement saving command to templates/macros
  console.log('Saving command:', command.command);
}

function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy HH:mm:ss');
}
</script>