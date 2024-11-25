<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Command Templates</h2>
      <button @click="showNewTemplate = true" class="btn btn-primary">
        New Template
      </button>
    </div>

    <div class="space-y-6">
      <!-- Template Categories -->
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

      <!-- Template List -->
      <div class="space-y-4">
        <div v-for="template in filteredTemplates" 
             :key="template.id"
             class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-gray-100 font-medium">{{ template.name }}</span>
                <span class="text-sm text-gray-400">({{ template.variables.length }} variables)</span>
              </div>
              <div class="text-sm text-gray-400 mt-1 font-mono">{{ template.command }}</div>
              
              <!-- Variables -->
              <div v-if="template.variables.length" class="mt-4 space-y-2">
                <div v-for="variable in template.variables" 
                     :key="variable.name"
                     class="flex items-center space-x-2">
                  <span class="text-[#00D1FF] text-sm">${{ variable.name }}</span>
                  <input 
                    v-model="variable.value"
                    type="text"
                    :placeholder="variable.default"
                    class="text-sm bg-[#1E293B] border border-gray-700 rounded px-2 py-1"
                  />
                </div>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <button 
                @click="executeTemplate(template)"
                class="btn btn-primary"
              >
                Execute
              </button>
              <button 
                @click="editTemplate(template)"
                class="text-[#00D1FF] hover:text-[#00B8E6]"
              >
                Edit
              </button>
              <button 
                @click="deleteTemplate(template.id)"
                class="text-red-500 hover:text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Usage -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Recent Usage</h3>
        <div class="space-y-2">
          <div v-for="usage in recentUsage" 
               :key="usage.id"
               class="flex items-center justify-between py-2">
            <div>
              <div class="text-gray-100">{{ usage.templateName }}</div>
              <div class="text-sm text-gray-400 mt-1">
                {{ formatTimeAgo(usage.timestamp) }}
              </div>
            </div>
            <button 
              @click="reuse(usage)"
              class="text-[#00D1FF] hover:text-[#00B8E6]"
            >
              Use Again
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { formatDistanceToNow } from 'date-fns';

interface Variable {
  name: string;
  default: string;
  value?: string;
}

interface Template {
  id: string;
  name: string;
  command: string;
  category: string;
  variables: Variable[];
}

interface Usage {
  id: string;
  templateId: string;
  templateName: string;
  timestamp: Date;
  variables: Record<string, string>;
}

const showNewTemplate = ref(false);
const categories = ['General', 'World', 'Players', 'Game Rules'];
const currentCategory = ref('General');

const templates = ref<Template[]>([
  {
    id: '1',
    name: 'Give Items',
    command: 'give ${player} ${item} ${amount}',
    category: 'Players',
    variables: [
      { name: 'player', default: '@p' },
      { name: 'item', default: 'diamond' },
      { name: 'amount', default: '1' }
    ]
  },
  {
    id: '2',
    name: 'Teleport Player',
    command: 'tp ${player} ${x} ${y} ${z}',
    category: 'Players',
    variables: [
      { name: 'player', default: '@p' },
      { name: 'x', default: '0' },
      { name: 'y', default: '64' },
      { name: 'z', default: '0' }
    ]
  }
]);

const recentUsage = ref<Usage[]>([
  {
    id: '1',
    templateId: '1',
    templateName: 'Give Items',
    timestamp: new Date(Date.now() - 300000),
    variables: {
      player: '@p',
      item: 'diamond_sword',
      amount: '1'
    }
  }
]);

const filteredTemplates = computed(() => {
  return templates.value.filter(t => t.category === currentCategory.value);
});

function executeTemplate(template: Template) {
  let command = template.command;
  template.variables.forEach(variable => {
    command = command.replace(
      `\${${variable.name}}`, 
      variable.value || variable.default
    );
  });

  // Execute the command
  console.log('Executing command:', command);

  // Record usage
  recentUsage.value.unshift({
    id: Date.now().toString(),
    templateId: template.id,
    templateName: template.name,
    timestamp: new Date(),
    variables: Object.fromEntries(
      template.variables.map(v => [v.name, v.value || v.default])
    )
  });
}

function editTemplate(template: Template) {
  // Implement template editing
  console.log('Editing template:', template);
}

function deleteTemplate(id: string) {
  templates.value = templates.value.filter(t => t.id !== id);
}

function reuse(usage: Usage) {
  const template = templates.value.find(t => t.id === usage.templateId);
  if (template) {
    template.variables.forEach(variable => {
      variable.value = usage.variables[variable.name];
    });
    executeTemplate(template);
  }
}

function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}
</script>