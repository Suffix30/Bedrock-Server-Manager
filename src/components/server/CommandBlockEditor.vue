<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Command Block Editor</h2>
      <button @click="createNewBlock" class="btn btn-primary">
        New Command Block
      </button>
    </div>

    <div class="space-y-6">
      <!-- Command Block List -->
      <div class="space-y-4">
        <div v-for="block in commandBlocks" 
             :key="block.id"
             class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="flex items-start justify-between">
            <div class="space-y-4 flex-1 mr-4">
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <span class="text-gray-400">Type:</span>
                  <select 
                    v-model="block.type"
                    class="bg-[#1E293B] border border-gray-700 rounded-lg px-3 py-1"
                  >
                    <option value="impulse">Impulse</option>
                    <option value="chain">Chain</option>
                    <option value="repeat">Repeat</option>
                  </select>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-gray-400">Condition:</span>
                  <select 
                    v-model="block.conditional"
                    class="bg-[#1E293B] border border-gray-700 rounded-lg px-3 py-1"
                  >
                    <option :value="false">Unconditional</option>
                    <option :value="true">Conditional</option>
                  </select>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-gray-400">Redstone:</span>
                  <select 
                    v-model="block.redstone"
                    class="bg-[#1E293B] border border-gray-700 rounded-lg px-3 py-1"
                  >
                    <option value="always">Always Active</option>
                    <option value="redstone">Needs Redstone</option>
                  </select>
                </div>
              </div>

              <div class="flex space-x-4">
                <div class="flex-1">
                  <input 
                    v-model="block.command"
                    type="text"
                    class="w-full font-mono"
                    placeholder="Enter command..."
                  />
                </div>
                <button 
                  @click="testCommand(block)"
                  class="btn btn-secondary"
                  :disabled="!block.command"
                >
                  Test
                </button>
              </div>

              <div v-if="block.type === 'repeat'" class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <span class="text-gray-400">Delay:</span>
                  <input 
                    v-model.number="block.delay"
                    type="number"
                    min="0"
                    class="w-20 text-center"
                  />
                  <span class="text-gray-400">ticks</span>
                </div>
              </div>
            </div>

            <div class="flex space-x-2">
              <button 
                @click="duplicateBlock(block)"
                class="text-[#00D1FF] hover:text-[#00B8E6]"
              >
                Duplicate
              </button>
              <button 
                @click="deleteBlock(block.id)"
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
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface CommandBlock {
  id: string;
  type: 'impulse' | 'chain' | 'repeat';
  command: string;
  conditional: boolean;
  redstone: 'always' | 'redstone';
  delay?: number;
}

const commandBlocks = ref<CommandBlock[]>([
  {
    id: '1',
    type: 'impulse',
    command: 'say Hello World',
    conditional: false,
    redstone: 'always'
  },
  {
    id: '2',
    type: 'repeat',
    command: 'time add 1',
    conditional: false,
    redstone: 'always',
    delay: 20
  }
]);

function createNewBlock() {
  commandBlocks.value.push({
    id: Date.now().toString(),
    type: 'impulse',
    command: '',
    conditional: false,
    redstone: 'always'
  });
}

function duplicateBlock(block: CommandBlock) {
  commandBlocks.value.push({
    ...block,
    id: Date.now().toString()
  });
}

function deleteBlock(id: string) {
  commandBlocks.value = commandBlocks.value.filter(block => block.id !== id);
}

function testCommand(block: CommandBlock) {
  // Implement command testing logic
  console.log('Testing command:', block.command);
}
</script>