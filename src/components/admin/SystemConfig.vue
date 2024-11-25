<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">System Configuration</h2>
      <button @click="saveConfig" class="btn btn-primary">
        Save Changes
      </button>
    </div>

    <div class="space-y-6">
      <!-- Performance Settings -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Performance</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Memory Allocation</div>
              <div class="text-sm text-gray-400">
                Server memory limit
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="config.performance.memory"
                type="number"
                class="w-24 text-center"
                min="1024"
              />
              <span class="text-sm text-gray-400">MB</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">View Distance</div>
              <div class="text-sm text-gray-400">
                Maximum chunk render distance
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="config.performance.viewDistance"
                type="number"
                class="w-20 text-center"
                min="4"
                max="32"
              />
              <span class="text-sm text-gray-400">chunks</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Entity Processing</div>
              <div class="text-sm text-gray-400">
                Entity simulation distance
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="config.performance.entityDistance"
                type="number"
                class="w-20 text-center"
                min="2"
                max="16"
              />
              <span class="text-sm text-gray-400">chunks</span>
            </div>
          </div>
        </div>
      </div>

      <!-- World Settings -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">World Settings</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Spawn Protection</div>
              <div class="text-sm text-gray-400">
                Protected radius around spawn
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="config.world.spawnProtection"
                type="number"
                class="w-20 text-center"
                min="0"
              />
              <span class="text-sm text-gray-400">blocks</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Max Build Height</div>
              <div class="text-sm text-gray-400">
                Maximum building altitude
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="config.world.maxBuildHeight"
                type="number"
                class="w-20 text-center"
                min="64"
                max="512"
              />
              <span class="text-sm text-gray-400">blocks</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">World Border</div>
              <div class="text-sm text-gray-400">
                World border radius
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="config.world.borderSize"
                type="number"
                class="w-24 text-center"
                min="1000"
              />
              <span class="text-sm text-gray-400">blocks</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Server Settings -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Server Settings</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Max Players</div>
              <div class="text-sm text-gray-400">
                Maximum concurrent players
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="config.server.maxPlayers"
                type="number"
                class="w-20 text-center"
                min="1"
              />
              <span class="text-sm text-gray-400">players</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Server Port</div>
              <div class="text-sm text-gray-400">
                Server network port
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="config.server.port"
                type="number"
                class="w-24 text-center"
                min="1024"
                max="65535"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Server MOTD</div>
              <div class="text-sm text-gray-400">
                Message of the day
              </div>
            </div>
            <input 
              v-model="config.server.motd"
              type="text"
              class="w-64"
              placeholder="Enter server MOTD"
            />
          </div>
        </div>
      </div>

      <!-- Optimization Settings -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Optimization</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Chunk Generation</div>
              <div class="text-sm text-gray-400">
                Pre-generate chunks
              </div>
            </div>
            <button 
              @click="config.optimization.preGenerate = !config.optimization.preGenerate"
              :class="[
                'btn',
                config.optimization.preGenerate ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ config.optimization.preGenerate ? 'Enabled' : 'Disabled' }}
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Chunk Caching</div>
              <div class="text-sm text-gray-400">
                Cache generated chunks
              </div>
            </div>
            <button 
              @click="config.optimization.chunkCache = !config.optimization.chunkCache"
              :class="[
                'btn',
                config.optimization.chunkCache ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ config.optimization.chunkCache ? 'Enabled' : 'Disabled' }}
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Network Compression</div>
              <div class="text-sm text-gray-400">
                Compress network packets
              </div>
            </div>
            <select 
              v-model="config.optimization.compression"
              class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="off">Off</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface SystemConfig {
  performance: {
    memory: number;
    viewDistance: number;
    entityDistance: number;
  };
  world: {
    spawnProtection: number;
    maxBuildHeight: number;
    borderSize: number;
  };
  server: {
    maxPlayers: number;
    port: number;
    motd: string;
  };
  optimization: {
    preGenerate: boolean;
    chunkCache: boolean;
    compression: 'off' | 'low' | 'medium' | 'high';
  };
}

const config = ref<SystemConfig>({
  performance: {
    memory: 4096,
    viewDistance: 10,
    entityDistance: 6
  },
  world: {
    spawnProtection: 16,
    maxBuildHeight: 256,
    borderSize: 10000
  },
  server: {
    maxPlayers: 20,
    port: 19132,
    motd: 'Welcome to the server!'
  },
  optimization: {
    preGenerate: true,
    chunkCache: true,
    compression: 'medium'
  }
});

function saveConfig() {
  // Implement config save
  console.log('Saving system configuration:', config.value);
}
</script>