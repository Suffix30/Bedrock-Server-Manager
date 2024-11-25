<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Security Settings</h2>
      <button @click="saveSettings" class="btn btn-primary">
        Save Changes
      </button>
    </div>

    <div class="space-y-6">
      <!-- Authentication Settings -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Authentication</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Two-Factor Authentication</div>
              <div class="text-sm text-gray-400">
                Require 2FA for admin accounts
              </div>
            </div>
            <button 
              @click="settings.auth.require2FA = !settings.auth.require2FA"
              :class="[
                'btn',
                settings.auth.require2FA ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ settings.auth.require2FA ? 'Required' : 'Optional' }}
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Session Timeout</div>
              <div class="text-sm text-gray-400">
                Automatically log out inactive users
              </div>
            </div>
            <select 
              v-model="settings.auth.sessionTimeout"
              class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Password Requirements</div>
              <div class="text-sm text-gray-400">
                Minimum password complexity
              </div>
            </div>
            <select 
              v-model="settings.auth.passwordStrength"
              class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="low">Basic</option>
              <option value="medium">Strong</option>
              <option value="high">Very Strong</option>
            </select>
          </div>
        </div>
      </div>

      <!-- IP Protection -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">IP Protection</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Rate Limiting</div>
              <div class="text-sm text-gray-400">
                Max login attempts per IP
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="settings.ip.maxAttempts"
                type="number"
                class="w-20 text-center"
                min="1"
              />
              <span class="text-sm text-gray-400">attempts</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Block Duration</div>
              <div class="text-sm text-gray-400">
                How long to block suspicious IPs
              </div>
            </div>
            <select 
              v-model="settings.ip.blockDuration"
              class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="1440">24 hours</option>
            </select>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Proxy Detection</div>
              <div class="text-sm text-gray-400">
                Block known proxy/VPN IPs
              </div>
            </div>
            <button 
              @click="settings.ip.blockProxy = !settings.ip.blockProxy"
              :class="[
                'btn',
                settings.ip.blockProxy ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ settings.ip.blockProxy ? 'Enabled' : 'Disabled' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Connection Security -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Connection Security</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Encryption</div>
              <div class="text-sm text-gray-400">
                Require encrypted connections
              </div>
            </div>
            <button 
              @click="settings.connection.requireEncryption = !settings.connection.requireEncryption"
              :class="[
                'btn',
                settings.connection.requireEncryption ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ settings.connection.requireEncryption ? 'Required' : 'Optional' }}
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">DDoS Protection</div>
              <div class="text-sm text-gray-400">
                Enable DDoS mitigation
              </div>
            </div>
            <button 
              @click="settings.connection.ddosProtection = !settings.connection.ddosProtection"
              :class="[
                'btn',
                settings.connection.ddosProtection ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ settings.connection.ddosProtection ? 'Enabled' : 'Disabled' }}
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Connection Throttling</div>
              <div class="text-sm text-gray-400">
                Limit connections per client
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="settings.connection.maxConnections"
                type="number"
                class="w-20 text-center"
                min="1"
              />
              <span class="text-sm text-gray-400">connections</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface SecuritySettings {
  auth: {
    require2FA: boolean;
    sessionTimeout: number;
    passwordStrength: 'low' | 'medium' | 'high';
  };
  ip: {
    maxAttempts: number;
    blockDuration: number;
    blockProxy: boolean;
  };
  connection: {
    requireEncryption: boolean;
    ddosProtection: boolean;
    maxConnections: number;
  };
}

const settings = ref<SecuritySettings>({
  auth: {
    require2FA: true,
    sessionTimeout: 30,
    passwordStrength: 'medium'
  },
  ip: {
    maxAttempts: 5,
    blockDuration: 30,
    blockProxy: true
  },
  connection: {
    requireEncryption: true,
    ddosProtection: true,
    maxConnections: 3
  }
});

function saveSettings() {
  // Implement settings save
  console.log('Saving security settings:', settings.value);
}
</script>