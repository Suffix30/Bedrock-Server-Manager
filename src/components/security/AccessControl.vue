<template>
  <div class="card p-6">
    <h2 class="text-2xl font-bold mb-6 text-[#00D1FF]">Access Control</h2>
    
    <div class="space-y-6">
      <!-- Access Rules -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-medium">Access Rules</h3>
          <button @click="showAddRule = true" class="btn btn-primary">
            Add Rule
          </button>
        </div>

        <div class="space-y-2">
          <div v-for="rule in accessRules" 
               :key="rule.id"
               class="flex items-center justify-between py-2">
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-gray-100">{{ rule.name }}</span>
                <span :class="{
                  'bg-green-900 text-green-400': rule.action === 'allow',
                  'bg-red-900 text-red-400': rule.action === 'deny'
                }" class="px-2 py-0.5 rounded-full text-xs">
                  {{ rule.action }}
                </span>
              </div>
              <div class="text-sm text-gray-400 mt-1">
                {{ formatRuleCondition(rule) }}
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

      <!-- Rate Limiting -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Rate Limiting</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-100">Connection Rate</div>
              <div class="text-sm text-gray-400">
                Maximum connections per IP
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="rateLimits.connections"
                type="number"
                class="w-20 text-center"
                min="1"
              />
              <span class="text-sm text-gray-400">per minute</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-100">Login Rate</div>
              <div class="text-sm text-gray-400">
                Maximum login attempts
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="rateLimits.logins"
                type="number"
                class="w-20 text-center"
                min="1"
              />
              <span class="text-sm text-gray-400">per hour</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Geolocation Rules -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-medium">Geolocation Rules</h3>
          <button @click="showAddGeoRule = true" class="btn btn-primary">
            Add Rule
          </button>
        </div>

        <div class="space-y-2">
          <div v-for="rule in geoRules" 
               :key="rule.id"
               class="flex items-center justify-between py-2">
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-gray-100">{{ rule.country }}</span>
                <span :class="{
                  'bg-green-900 text-green-400': rule.action === 'allow',
                  'bg-red-900 text-red-400': rule.action === 'deny'
                }" class="px-2 py-0.5 rounded-full text-xs">
                  {{ rule.action }}
                </span>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <button 
                @click="toggleGeoRule(rule.id)"
                :class="[
                  'btn',
                  rule.enabled ? 'btn-primary' : 'btn-secondary'
                ]"
              >
                {{ rule.enabled ? 'Enabled' : 'Disabled' }}
              </button>
              <button 
                @click="deleteGeoRule(rule.id)"
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

interface AccessRule {
  id: string;
  name: string;
  action: 'allow' | 'deny';
  condition: {
    type: 'ip' | 'time' | 'group';
    value: string;
  };
  enabled: boolean;
}

interface GeoRule {
  id: string;
  country: string;
  action: 'allow' | 'deny';
  enabled: boolean;
}

const accessRules = ref<AccessRule[]>([
  {
    id: '1',
    name: 'Admin IPs',
    action: 'allow',
    condition: {
      type: 'ip',
      value: '192.168.1.0/24'
    },
    enabled: true
  },
  {
    id: '2',
    name: 'Maintenance Hours',
    action: 'deny',
    condition: {
      type: 'time',
      value: '22:00-06:00'
    },
    enabled: false
  }
]);

const geoRules = ref<GeoRule[]>([
  {
    id: '1',
    country: 'United States',
    action: 'allow',
    enabled: true
  },
  {
    id: '2',
    country: 'China',
    action: 'deny',
    enabled: true
  }
]);

const rateLimits = ref({
  connections: 60,
  logins: 10
});

const showAddRule = ref(false);
const showAddGeoRule = ref(false);

function formatRuleCondition(rule: AccessRule): string {
  switch (rule.condition.type) {
    case 'ip':
      return `IP range: ${rule.condition.value}`;
    case 'time':
      return `Time: ${rule.condition.value}`;
    case 'group':
      return `Group: ${rule.condition.value}`;
    default:
      return '';
  }
}

function toggleRule(id: string) {
  const rule = accessRules.value.find(r => r.id === id);
  if (rule) {
    rule.enabled = !rule.enabled;
  }
}

function deleteRule(id: string) {
  accessRules.value = accessRules.value.filter(r => r.id !== id);
}

function toggleGeoRule(id: string) {
  const rule = geoRules.value.find(r => r.id === id);
  if (rule) {
    rule.enabled = !rule.enabled;
  }
}

function deleteGeoRule(id: string) {
  geoRules.value = geoRules.value.filter(r => r.id !== id);
}
</script>