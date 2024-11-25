<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Scheduled Commands</h2>
      <button @click="showNewCommand = true" class="btn btn-primary">
        Schedule Command
      </button>
    </div>

    <div class="space-y-6">
      <!-- Active Schedules -->
      <div class="bg-[#0F172A] rounded-lg border border-gray-800">
        <div class="p-4 border-b border-gray-800">
          <h3 class="font-medium">Active Schedules</h3>
        </div>

        <div class="divide-y divide-gray-800">
          <div v-for="command in scheduledCommands" 
               :key="command.id"
               class="p-4">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center space-x-2">
                  <span class="text-gray-100 font-mono">{{ command.command }}</span>
                  <span :class="{
                    'bg-green-900 text-green-400': command.type === 'recurring',
                    'bg-blue-900 text-blue-400': command.type === 'one-time'
                  }" class="px-2 py-0.5 rounded-full text-xs">
                    {{ command.type }}
                  </span>
                </div>
                <div class="text-sm text-gray-400 mt-1">
                  {{ formatSchedule(command) }}
                </div>
                <div class="text-sm text-gray-500 mt-1">
                  Next run: {{ formatNextRun(command.nextRun) }}
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <button 
                  @click="toggleCommand(command.id)"
                  :class="[
                    'btn',
                    command.enabled ? 'btn-primary' : 'btn-secondary'
                  ]"
                >
                  {{ command.enabled ? 'Enabled' : 'Disabled' }}
                </button>
                <button 
                  @click="editCommand(command)"
                  class="text-[#00D1FF] hover:text-[#00B8E6]"
                >
                  Edit
                </button>
                <button 
                  @click="deleteCommand(command.id)"
                  class="text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Command History -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Execution History</h3>
        <div class="space-y-2">
          <div v-for="execution in commandHistory" 
               :key="execution.id"
               class="flex items-center justify-between py-2">
            <div>
              <div class="text-gray-100 font-mono">{{ execution.command }}</div>
              <div class="text-sm text-gray-400 mt-1">
                {{ formatTimeAgo(execution.timestamp) }}
              </div>
            </div>
            <span :class="{
              'text-green-400': execution.status === 'success',
              'text-red-400': execution.status === 'error'
            }">{{ execution.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formatDistanceToNow, format } from 'date-fns';

interface ScheduledCommand {
  id: string;
  command: string;
  type: 'recurring' | 'one-time';
  schedule: {
    type: 'interval' | 'cron';
    value: string;
  };
  enabled: boolean;
  nextRun: Date;
}

interface CommandExecution {
  id: string;
  command: string;
  timestamp: Date;
  status: 'success' | 'error';
}

const showNewCommand = ref(false);

const scheduledCommands = ref<ScheduledCommand[]>([
  {
    id: '1',
    command: 'say Server restart in 5 minutes',
    type: 'recurring',
    schedule: {
      type: 'cron',
      value: '0 */6 * * *'
    },
    enabled: true,
    nextRun: new Date(Date.now() + 3600000)
  },
  {
    id: '2',
    command: 'time set day',
    type: 'recurring',
    schedule: {
      type: 'interval',
      value: '3600'
    },
    enabled: false,
    nextRun: new Date(Date.now() + 7200000)
  }
]);

const commandHistory = ref<CommandExecution[]>([
  {
    id: '1',
    command: 'say Server restart in 5 minutes',
    timestamp: new Date(Date.now() - 3600000),
    status: 'success'
  },
  {
    id: '2',
    command: 'time set day',
    timestamp: new Date(Date.now() - 7200000),
    status: 'success'
  }
]);

function toggleCommand(id: string) {
  const command = scheduledCommands.value.find(c => c.id === id);
  if (command) {
    command.enabled = !command.enabled;
  }
}

function editCommand(command: ScheduledCommand) {
  // Implement command editing
  console.log('Editing command:', command);
}

function deleteCommand(id: string) {
  scheduledCommands.value = scheduledCommands.value.filter(c => c.id !== id);
}

function formatSchedule(command: ScheduledCommand): string {
  if (command.schedule.type === 'interval') {
    const seconds = parseInt(command.schedule.value);
    const minutes = Math.floor(seconds / 60);
    return `Every ${minutes} minutes`;
  } else {
    return `Cron: ${command.schedule.value}`;
  }
}

function formatNextRun(date: Date): string {
  return format(date, 'MMM d, yyyy HH:mm');
}

function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}
</script>