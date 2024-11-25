<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Connection Limiter</h2>
      <button @click="applyLimits" class="btn btn-primary">
        Apply Limits
      </button>
    </div>

    <div class="space-y-6">
      <!-- Global Limits -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Global Limits</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Max Connections</div>
              <div class="text-sm text-gray-400">Per IP address</div>
            </div>
            <input 
              v-model="limits.maxConnections"
              type="number"
              class="w-24 text-center"
              min="1"
            />
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Connection Rate</div>
              <div class="text-sm text-gray-400">Connections per minute</div>
            </div>
            <input 
              v-model="limits.connectionRate"
              type="number"
              class="w-24 text-center"
              min="1"
            />
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Bandwidth Limit</div>
              <div class="text-sm text-gray-400">Per connection</div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="limits.bandwidth"
                type="number"
                class="w-24 text-center"
                min="1"
              />
              <select 
                v-model="limits.bandwidthUnit"
                class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
              >
                <option value="KB">KB/s</option>
                <option value="MB">MB/s</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Rate Limiting Rules -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-medium">Rate Limiting Rules</h3>
          <button @click="showAddRule = true" class="btn btn-secondary">
            Add Rule
          </button>
        </div>

        <div class="space-y-2">
          <div v-for="rule in rateLimitRules" 
               :key="rule.id"
               class="flex items-center justify-between py-2">
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-gray-100">{{ rule.name }}</span>
                <span class="text-sm text-gray-400">({{ formatRule(rule) }})</span>
              </div>
              <div class="text-sm text-gray-400 mt-1">
                Applies to: {{ rule.target }}
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <button 
                @click="toggleRule(rule.id)"
                :class="[
                  'btn',
                  rule.enabled ? 'btn-primary' : 'btn-secondary'
                ]"
              >
                {{ rule.enabled ? 'Enabled' : 'Disabled' }}
              </button>
              <button 
                @click="deleteRule(rule.id)"
                class="text-red-500 hover:text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Connection Pool -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Connection Pool</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Pool Size</div>
              <div class="text-sm text-gray-400">Maximum concurrent connections</div>
            </div>
            <input 
              v-model="pool.size"
              type="number"
              class="w-24 text-center"
              min="1"
            />
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Timeout</div>
              <div class="text-sm text-gray-400">Idle connection timeout</div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="pool.timeout"
                type="number"
                class="w-24 text-center"
                min="1"
              />
              <span class="text-sm text-gray-400">seconds</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Keep-Alive</div>
              <div class="text-sm text-gray-400">Connection keep-alive interval</div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="pool.keepAlive"
                type="number"
                class="w-24 text-center"
                min="1"
              />
              <span class="text-sm text-gray-400">seconds</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Current Status -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Active Connections</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ stats.activeConnections }}</div>
          <div class="text-sm text-gray-500">of {{ pool.size }} max</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Connection Rate</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ stats.connectionRate }}/min</div>
          <div class="text-sm text-gray-500">Peak: {{ stats.peakRate }}/min</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Rejected Connections</div>
          <div class="text-2xl font-bold text-red-400">{{ stats.rejectedConnections }}</div>
          <div class="text-sm text-gray-500">Last hour</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Pool Usage</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ stats.poolUsage }}%</div>
          <div class="text-sm text-gray-500">Average</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface RateLimitRule {
  id: string;
  name: string;
  target: string;
  limit: number;
  interval: number;
  enabled: boolean;
}

const limits = ref({
  maxConnections: 10,
  connectionRate: 60,
  bandwidth: 1,
  bandwidthUnit: 'MB'
});

const rateLimitRules = ref<RateLimitRule[]>([
  {
    id: '1',
    name: 'Player Connections',
    target: 'Player IPs',
    limit: 5,
    interval: 60,
    enabled: true
  },
  {
    id: '2',
    name: 'API Rate Limit',
    target: 'API Endpoints',
    limit: 100,
    interval: 60,
    enabled: true
  }
]);

const pool = ref({
  size: 100,
  timeout: 300,
  keepAlive: 60
});

const stats = ref({
  activeConnections: 45,
  connectionRate: 30,
  peakRate: 75,
  rejectedConnections: 12,
  poolUsage: 45
});

const showAddRule = ref(false);

function formatRule(rule: RateLimitRule): string {
  return `${rule.limit} per ${rule.interval}s`;
}

function toggleRule(id: string) {
  const rule = rateLimitRules.value.find(r => r.id === id);
  if (rule) {
    rule.enabled = !rule.enabled;
  }
}

function deleteRule(id: string) {
  rateLimitRules.value = rateLimitRules.value.filter(r => r.id !== id);
}

function applyLimits() {
  // Implement limit application
  console.log('Applying connection limits:', {
    limits: limits.value,
    rules: rateLimitRules.value,
    pool: pool.value
  });
}
</script>