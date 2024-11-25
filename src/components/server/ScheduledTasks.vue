<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Scheduled Tasks</h2>
      <button @click="showAddTask = true" class="btn btn-primary">
        Add Task
      </button>
    </div>

    <div class="space-y-4">
      <div v-for="task in scheduledTasks" 
           :key="task.id"
           class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium text-gray-100">{{ task.name }}</h3>
            <p class="text-sm text-gray-400">{{ task.schedule }}</p>
          </div>
          
          <div class="flex items-center space-x-3">
            <button 
              @click="toggleTask(task.id)"
              :class="[
                'btn',
                task.enabled ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ task.enabled ? 'Enabled' : 'Disabled' }}
            </button>
            <button 
              @click="deleteTask(task.id)"
              class="text-red-500 hover:text-red-400"
            >
              Delete
            </button>
          </div>
        </div>
        
        <div class="mt-2 text-sm text-gray-400">
          Next run: {{ formatNextRun(task.nextRun) }}
        </div>
      </div>
    </div>

    <!-- Add Task Modal -->
    <div v-if="showAddTask" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-[#1E293B] p-6 rounded-xl w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Add Scheduled Task</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Task Name</label>
            <input 
              v-model="newTask.name"
              type="text"
              class="w-full"
              placeholder="e.g., Daily Restart"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Schedule</label>
            <select v-model="newTask.schedule" class="w-full bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2">
              <option value="0 0 * * *">Daily at midnight</option>
              <option value="0 */6 * * *">Every 6 hours</option>
              <option value="0 */12 * * *">Every 12 hours</option>
              <option value="0 0 * * 0">Weekly on Sunday</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Command</label>
            <input 
              v-model="newTask.command"
              type="text"
              class="w-full"
              placeholder="e.g., save-all"
            />
          </div>

          <div class="flex justify-end space-x-3">
            <button @click="showAddTask = false" class="btn btn-secondary">
              Cancel
            </button>
            <button @click="addTask" class="btn btn-primary">
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Task {
  id: string;
  name: string;
  schedule: string;
  command: string;
  enabled: boolean;
  nextRun: Date;
}

const showAddTask = ref(false);
const scheduledTasks = ref<Task[]>([
  {
    id: '1',
    name: 'Daily Restart',
    schedule: '0 0 * * *',
    command: 'restart',
    enabled: true,
    nextRun: new Date(Date.now() + 3600000)
  },
  {
    id: '2',
    name: 'Backup World',
    schedule: '0 */6 * * *',
    command: 'save-all',
    enabled: true,
    nextRun: new Date(Date.now() + 7200000)
  }
]);

const newTask = ref({
  name: '',
  schedule: '0 0 * * *',
  command: ''
});

function toggleTask(id: string) {
  const task = scheduledTasks.value.find(t => t.id === id);
  if (task) {
    task.enabled = !task.enabled;
  }
}

function deleteTask(id: string) {
  scheduledTasks.value = scheduledTasks.value.filter(t => t.id !== id);
}

function addTask() {
  scheduledTasks.value.push({
    id: Date.now().toString(),
    ...newTask.value,
    enabled: true,
    nextRun: new Date(Date.now() + 3600000)
  });
  showAddTask.value = false;
  newTask.value = {
    name: '',
    schedule: '0 0 * * *',
    command: ''
  };
}

function formatNextRun(date: Date): string {
  return new Date(date).toLocaleString();
}
</script>