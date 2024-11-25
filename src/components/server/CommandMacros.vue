<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Command Macros</h2>
      <button @click="showNewMacro = true" class="btn btn-primary">
        New Macro
      </button>
    </div>

    <div class="space-y-6">
      <!-- Categories -->
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

      <!-- Macro List -->
      <div class="space-y-4">
        <div v-for="macro in filteredMacros" 
             :key="macro.id"
             class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-medium text-gray-100">{{ macro.name }}</h3>
              <div class="mt-4 space-y-2">
                <div v-for="(command, index) in macro.commands" 
                     :key="index"
                     class="font-mono text-sm text-gray-400">
                  $ {{ command }}
                </div>
              </div>
              
              <div v-if="macro.variables.length" class="mt-4">
                <h4 class="text-sm font-medium text-gray-400 mb-2">Variables:</h4>
                <div class="grid grid-cols-2 gap-2">
                  <div v-for="variable in macro.variables" 
                       :key="variable.name"
                       class="flex items-center space-x-2">
                    <span class="text-[#00D1FF] text-sm">${{ variable.name }}</span>
                    <span class="text-gray-500 text-sm">{{ variable.default }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex space-x-2">
              <button 
                @click="executeMacro(macro)"
                class="btn btn-secondary"
              >
                Execute
              </button>
              <button 
                @click="editMacro(macro)"
                class="text-[#00D1FF] hover:text-[#00B8E6]"
              >
                Edit
              </button>
              <button 
                @click="deleteMacro(macro.id)"
                class="text-red-500 hover:text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New/Edit Macro Modal -->
    <div v-if="showNewMacro || editingMacro" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-[#1E293B] p-6 rounded-xl w-full max-w-2xl">
        <h3 class="text-xl font-bold mb-4">
          {{ editingMacro ? 'Edit Macro' : 'New Macro' }}
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Name</label>
            <input 
              v-model="newMacroForm.name"
              type="text"
              class="w-full"
              placeholder="Enter macro name"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Category</label>
            <select 
              v-model="newMacroForm.category"
              class="w-full bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
            >
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Commands</label>
            <div class="space-y-2">
              <div v-for="(cmd, index) in newMacroForm.commands" 
                   :key="index"
                   class="flex space-x-2">
                <input 
                  v-model="newMacroForm.commands[index]"
                  type="text"
                  class="flex-1 font-mono"
                  placeholder="Enter command"
                />
                <button 
                  @click="newMacroForm.commands.splice(index, 1)"
                  class="text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
              <button 
                @click="newMacroForm.commands.push('')"
                class="btn btn-secondary w-full"
              >
                Add Command
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Variables</label>
            <div class="space-y-2">
              <div v-for="(variable, index) in newMacroForm.variables" 
                   :key="index"
                   class="flex space-x-2">
                <input 
                  v-model="variable.name"
                  type="text"
                  class="flex-1"
                  placeholder="Variable name"
                />
                <input 
                  v-model="variable.default"
                  type="text"
                  class="flex-1"
                  placeholder="Default value"
                />
                <button 
                  @click="newMacroForm.variables.splice(index, 1)"
                  class="text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
              <button 
                @click="newMacroForm.variables.push({ name: '', default: '' })"
                class="btn btn-secondary w-full"
              >
                Add Variable
              </button>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button 
              @click="cancelEdit"
              class="btn btn-secondary"
            >
              Cancel
            </button>
            <button 
              @click="saveMacro"
              class="btn btn-primary"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface MacroVariable {
  name: string;
  default: string;
}

interface Macro {
  id: string;
  name: string;
  category: string;
  commands: string[];
  variables: MacroVariable[];
}

const categories = ['General', 'Game Rules', 'Custom'];
const currentCategory = ref('General');
const showNewMacro = ref(false);
const editingMacro = ref<string | null>(null);

const macros = ref<Macro[]>([
  // General category examples
  {
    id: '1',
    name: 'Server Announcement',
    category: 'General',
    commands: [
      'title @a title ${title}',
      'title @a subtitle ${subtitle}',
      'say ${message}'
    ],
    variables: [
      { name: 'title', default: 'Announcement' },
      { name: 'subtitle', default: 'Please read' },
      { name: 'message', default: 'Important server message' }
    ]
  },
  {
    id: '2',
    name: 'Welcome Kit',
    category: 'General',
    commands: [
      'give ${player} iron_sword 1',
      'give ${player} iron_pickaxe 1',
      'give ${player} bread 32',
      'tell ${player} Welcome to the server! Here\'s your starter kit.'
    ],
    variables: [
      { name: 'player', default: '@p' }
    ]
  },
  {
    id: '3',
    name: 'Clear Inventory',
    category: 'General',
    commands: [
      'clear ${player}',
      'tell ${player} Your inventory has been cleared.'
    ],
    variables: [
      { name: 'player', default: '@p' }
    ]
  },

  // Game Rules category examples
  {
    id: '4',
    name: 'Peaceful Mode',
    category: 'Game Rules',
    commands: [
      'gamerule doDaylightCycle true',
      'gamerule doWeatherCycle true',
      'gamerule doMobSpawning false',
      'gamerule keepInventory true',
      'difficulty peaceful',
      'time set day',
      'weather clear'
    ],
    variables: []
  },
  {
    id: '5',
    name: 'Hardcore Mode',
    category: 'Game Rules',
    commands: [
      'gamerule doDaylightCycle true',
      'gamerule doWeatherCycle true',
      'gamerule doMobSpawning true',
      'gamerule keepInventory false',
      'gamerule naturalRegeneration false',
      'difficulty hard',
      'tell @a Server is now in Hardcore mode!'
    ],
    variables: []
  },
  {
    id: '6',
    name: 'Custom Game Rules',
    category: 'Game Rules',
    commands: [
      'gamerule keepInventory ${keepInventory}',
      'gamerule doMobSpawning ${mobSpawning}',
      'gamerule doDaylightCycle ${daylight}',
      'gamerule doWeatherCycle ${weather}',
      'difficulty ${difficulty}'
    ],
    variables: [
      { name: 'keepInventory', default: 'true' },
      { name: 'mobSpawning', default: 'true' },
      { name: 'daylight', default: 'true' },
      { name: 'weather', default: 'true' },
      { name: 'difficulty', default: 'normal' }
    ]
  },

  // Custom category examples
  {
    id: '7',
    name: 'Arena Setup',
    category: 'Custom',
    commands: [
      'fill ${x1} ${y1} ${z1} ${x2} ${y2} ${z2} barrier',
      'effect give @a[distance=..${radius}] resistance 999999 255 true',
      'give @a[distance=..${radius}] diamond_sword 1',
      'title @a[distance=..${radius}] title "Arena Battle"',
      'title @a[distance=..${radius}] subtitle "Fight!"'
    ],
    variables: [
      { name: 'x1', default: '~-10' },
      { name: 'y1', default: '~' },
      { name: 'z1', default: '~-10' },
      { name: 'x2', default: '~10' },
      { name: 'y2', default: '~10' },
      { name: 'z2', default: '~10' },
      { name: 'radius', default: '20' }
    ]
  },
  {
    id: '8',
    name: 'Parkour Challenge',
    category: 'Custom',
    commands: [
      'clear @p',
      'gamemode adventure @p',
      'tp @p ${startX} ${startY} ${startZ}',
      'effect give @p jump_boost ${jumpLevel} ${duration}',
      'title @p title "Parkour Challenge"',
      'title @p subtitle "${difficulty} Mode"'
    ],
    variables: [
      { name: 'startX', default: '0' },
      { name: 'startY', default: '100' },
      { name: 'startZ', default: '0' },
      { name: 'jumpLevel', default: '1' },
      { name: 'duration', default: '999999' },
      { name: 'difficulty', default: 'Easy' }
    ]
  },
  {
    id: '9',
    name: 'Team Setup',
    category: 'Custom',
    commands: [
      'team add ${teamName}',
      'team modify ${teamName} color ${teamColor}',
      'team modify ${teamName} prefix "${teamPrefix}"',
      'team modify ${teamName} friendlyFire ${friendlyFire}',
      'title @a title "Team ${teamName} Created"'
    ],
    variables: [
      { name: 'teamName', default: 'Red' },
      { name: 'teamColor', default: 'red' },
      { name: 'teamPrefix', default: '[RED] ' },
      { name: 'friendlyFire', default: 'false' }
    ]
  }
]);

const filteredMacros = computed(() => {
  return macros.value.filter(macro => macro.category === currentCategory.value);
});

const newMacroForm = ref({
  name: '',
  category: 'General',
  commands: [''],
  variables: []
});

function executeMacro(macro: Macro) {
  // Implement macro execution logic
  console.log('Executing macro:', macro.name);
}

function editMacro(macro: Macro) {
  editingMacro.value = macro.id;
  newMacroForm.value = {
    name: macro.name,
    category: macro.category,
    commands: [...macro.commands],
    variables: [...macro.variables]
  };
  showNewMacro.value = true;
}

function deleteMacro(id: string) {
  macros.value = macros.value.filter(macro => macro.id !== id);
}

function saveMacro() {
  if (editingMacro.value) {
    const index = macros.value.findIndex(m => m.id === editingMacro.value);
    if (index !== -1) {
      macros.value[index] = {
        ...macros.value[index],
        ...newMacroForm.value
      };
    }
  } else {
    macros.value.push({
      id: Date.now().toString(),
      ...newMacroForm.value
    });
  }
  cancelEdit();
}

function cancelEdit() {
  showNewMacro.value = false;
  editingMacro.value = null;
  newMacroForm.value = {
    name: '',
    category: 'General',
    commands: [''],
    variables: []
  };
}
</script>