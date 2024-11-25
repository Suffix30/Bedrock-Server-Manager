<template>
  <div class="card p-6">
    <h2 class="text-2xl font-bold mb-6 text-[#00D1FF]">Two-Factor Authentication</h2>
    
    <div class="space-y-6">
      <div v-if="!tfaEnabled" class="space-y-4">
        <div class="bg-[#0F172A] p-6 rounded-lg border border-gray-800 text-center">
          <div class="mb-4">
            <div class="w-48 h-48 mx-auto bg-white p-4 rounded-lg">
              <!-- QR Code would be generated here -->
              <div class="w-full h-full bg-gray-200 rounded"></div>
            </div>
          </div>
          
          <p class="text-gray-300 mb-4">
            Scan this QR code with your authenticator app to enable 2FA
          </p>
          
          <div class="max-w-xs mx-auto space-y-4">
            <input 
              v-model="verificationCode"
              type="text"
              placeholder="Enter verification code"
              class="w-full text-center tracking-widest"
              maxlength="6"
            />
            
            <button @click="enableTFA" class="btn btn-primary w-full">
              Enable 2FA
            </button>
          </div>
        </div>
        
        <div class="text-sm text-gray-400 text-center">
          Using an authenticator app adds an extra layer of security to your account
        </div>
      </div>

      <div v-else class="space-y-4">
        <div class="bg-green-900/20 border border-green-700 p-4 rounded-lg">
          <div class="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-green-400">Two-factor authentication is enabled</span>
          </div>
        </div>

        <div class="flex justify-end">
          <button @click="disableTFA" class="btn btn-secondary">
            Disable 2FA
          </button>
        </div>
      </div>

      <!-- Backup Codes -->
      <div v-if="tfaEnabled" class="space-y-4">
        <h3 class="text-lg font-medium text-gray-100">Backup Codes</h3>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="grid grid-cols-2 gap-2">
            <div v-for="code in backupCodes" 
                 :key="code"
                 class="font-mono text-sm text-gray-400">
              {{ code }}
            </div>
          </div>
        </div>
        <p class="text-sm text-gray-400">
          Save these backup codes in a secure place. You can use them to access your account if you lose your authenticator device.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tfaEnabled = ref(false);
const verificationCode = ref('');
const backupCodes = ref([
  'ABCD-EFGH-IJKL',
  'MNOP-QRST-UVWX',
  'YZAB-CDEF-GHIJ',
  'KLMN-OPQR-STUV',
  'WXYZ-1234-5678',
  'ABCD-5678-EFGH'
]);

function enableTFA() {
  if (verificationCode.value.length === 6) {
    tfaEnabled.value = true;
  }
}

function disableTFA() {
  tfaEnabled.value = false;
  verificationCode.value = '';
}
</script>