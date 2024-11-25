<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Quick Commands</h2>
      <button @click="showAddCommand = true" class="btn btn-primary">
        Add Command
      </button>
    </div>

    <div class="space-y-6">
      <!-- Command Categories -->
      <div class="flex space-x-4">
        <button 
          v-for="category in categories"
          :key="category"
          @click="currentCategory = category"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            currentCategory === category
              ? 'bg-[#00D1FF] text-[#0F172A]'
              : 'bg-[#1E293B] text-gray-400 hover:text-gray-300'
          ]"
        >
          {{ category }}
        </button>
      </div>

      <!-- Command Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="command in filteredCommands" 
             :key="command.id"
             class="bg-[#0F172A] p-4 rounded-lg border border-gray-800 hover:border-[#00D1FF] transition-colors">
          <div class="flex items-start justify-between">
            <div>
              <div class="text-gray-100 font-medium">{{ command.name }}</div>
              <div class="text-sm text-gray-400 mt-1 font-mono">{{ command.command }}</div>
            </div>
            <div class="flex items-center space-x-2">
              <button 
                @click="executeCommand(command)"
                class="text-[#00D1FF] hover:text-[#00B8E6]"
              >
                Run
              </button>
              <button 
                @click="editCommand(command)"
                class="text-gray-400 hover:text-gray-300"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Executions -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Recent Executions</h3>
        <div class="space-y-2">
          <div v-for="execution in recentExecutions" 
               :key="execution.id"
               class="flex items-center justify-between py-2">
            <div>
              <div class="text-gray-100">{{ execution.command }}</div>
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
import { ref, computed } from 'vue';
import { formatDistanceToNow } from 'date-fns';

interface QuickCommand {
  id: string;
  name: string;
  command: string;
  category: string;
}

interface CommandExecution {
  id: string;
  command: string;
  timestamp: Date;
  status: 'success' | 'error';
}

const showAddCommand = ref(false);
const categories = ['General', 'World', 'Players', 'Game Rules'];
const currentCategory = ref('General');

const commands = ref<QuickCommand[]>([
  {
    id: '1',
    name: 'Day Time',
    command: 'time set day',
    category: 'World'
  },
  {
    id: '2',
    name: 'Clear Weather',
    command: 'weather clear',
    category: 'World'
  },
  {
    id: '3',
    name: 'Heal All',
    command: 'effect @a instant_health 1 255',
    category: 'Players'
  },
  {
    id: '4',
    name: 'Keep Inventory',
    command: 'gamerule keepInventory true',
    category: 'Game Rules'
  },
  {
    id: '5',
    name: 'Save World',
    command: 'save-all',
    category: 'General'
  },
  {
    id: '6',
    name: 'List Players',
    command: 'list',
    category: 'Players'
  }
]);

const recentExecutions = ref<CommandExecution[]>([
  {
    id: '1',
    command: 'time set day',
    timestamp: new Date(Date.now() - 300000),
    status: 'success'
  },
  {
    id: '2',
    command: 'weather clear',
    timestamp: new Date(Date.now() - 600000),
    status: 'success'
  }
]);

const filteredCommands = computed(() => {
  return commands.value.filter(cmd => cmd.category === currentCategory.value);
});

function executeCommand(command: QuickCommand) {
  // Implement command execution
  console.log('Executing command:', command.command);
  
  recentExecutions.value.unshift({
    id: Date.now().toString(),
    command: command.command,
    timestamp: new Date(),
    status: 'success'
  });
}

function editCommand(command: QuickCommand) {
  // Implement command editing
  console.log('Editing command:', command);
}

function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}
</script>