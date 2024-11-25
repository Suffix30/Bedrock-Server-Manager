<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Notification Settings</h2>
      <button @click="saveSettings" class="btn btn-primary">
        Save Changes
      </button>
    </div>

    <div class="space-y-6">
      <!-- General Notifications -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">General Notifications</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Server Status</div>
              <div class="text-sm text-gray-400">Server start/stop notifications</div>
            </div>
            <button 
              @click="toggleNotification('serverStatus')"
              :class="[
                'btn',
                notifications.serverStatus ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ notifications.serverStatus ? 'Enabled' : 'Disabled' }}
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Performance Alerts</div>
              <div class="text-sm text-gray-400">Server performance warnings</div>
            </div>
            <button 
              @click="toggleNotification('performance')"
              :class="[
                'btn',
                notifications.performance ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ notifications.performance ? 'Enabled' : 'Disabled' }}
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Backup Status</div>
              <div class="text-sm text-gray-400">Backup completion notifications</div>
            </div>
            <button 
              @click="toggleNotification('backup')"
              :class="[
                'btn',
                notifications.backup ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ notifications.backup ? 'Enabled' : 'Disabled' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Player Notifications -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Player Events</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Player Join/Leave</div>
              <div class="text-sm text-gray-400">Player connection events</div>
            </div>
            <button 
              @click="toggleNotification('playerJoinLeave')"
              :class="[
                'btn',
                notifications.playerJoinLeave ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ notifications.playerJoinLeave ? 'Enabled' : 'Disabled' }}
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Chat Messages</div>
              <div class="text-sm text-gray-400">In-game chat notifications</div>
            </div>
            <button 
              @click="toggleNotification('chat')"
              :class="[
                'btn',
                notifications.chat ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ notifications.chat ? 'Enabled' : 'Disabled' }}
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Player Reports</div>
              <div class="text-sm text-gray-400">Player report notifications</div>
            </div>
            <button 
              @click="toggleNotification('playerReports')"
              :class="[
                'btn',
                notifications.playerReports ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ notifications.playerReports ? 'Enabled' : 'Disabled' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delivery Methods -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Delivery Methods</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Browser Notifications</div>
              <div class="text-sm text-gray-400">Desktop notifications</div>
            </div>
            <button 
              @click="toggleDeliveryMethod('browser')"
              :class="[
                'btn',
                deliveryMethods.browser ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ deliveryMethods.browser ? 'Enabled' : 'Disabled' }}
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Email Notifications</div>
              <div class="text-sm text-gray-400">Email alerts</div>
            </div>
            <button 
              @click="toggleDeliveryMethod('email')"
              :class="[
                'btn',
                deliveryMethods.email ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ deliveryMethods.email ? 'Enabled' : 'Disabled' }}
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Discord Notifications</div>
              <div class="text-sm text-gray-400">Discord webhook alerts</div>
            </div>
            <button 
              @click="toggleDeliveryMethod('discord')"
              :class="[
                'btn',
                deliveryMethods.discord ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ deliveryMethods.discord ? 'Enabled' : 'Disabled' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface NotificationSettings {
  serverStatus: boolean;
  performance: boolean;
  backup: boolean;
  playerJoinLeave: boolean;
  chat: boolean;
  playerReports: boolean;
}

interface DeliveryMethods {
  browser: boolean;
  email: boolean;
  discord: boolean;
}

const notifications = ref<NotificationSettings>({
  serverStatus: true,
  performance: true,
  backup: true,
  playerJoinLeave: false,
  chat: false,
  playerReports: true
});

const deliveryMethods = ref<DeliveryMethods>({
  browser: true,
  email: false,
  discord: true
});

function toggleNotification(key: keyof NotificationSettings) {
  notifications.value[key] = !notifications.value[key];
}

function toggleDeliveryMethod(key: keyof DeliveryMethods) {
  deliveryMethods.value[key] = !deliveryMethods.value[key];
}

function saveSettings() {
  // Implement settings save
  console.log('Saving notification settings:', {
    notifications: notifications.value,
    deliveryMethods: deliveryMethods.value
  });
}
</script>