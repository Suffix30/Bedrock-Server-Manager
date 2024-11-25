<template>
  <div class="card p-6">
    <h2 class="text-2xl font-bold mb-6 text-[#00D1FF]">Network Monitor</h2>
    
    <div class="space-y-6">
      <!-- Network Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Network In</div>
          <div class="text-lg font-medium text-[#00D1FF]">
            {{ formatBytes(store.networkStats.bytesInPerSecond) }}/s
          </div>
          <div class="text-xs text-gray-500">
            Total: {{ formatBytes(store.networkStats.totalBytesIn) }}
          </div>
        </div>
        
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Network Out</div>
          <div class="text-lg font-medium text-[#00D1FF]">
            {{ formatBytes(store.networkStats.bytesOutPerSecond) }}/s
          </div>
          <div class="text-xs text-gray-500">
            Total: {{ formatBytes(store.networkStats.totalBytesOut) }}
          </div>
        </div>
        
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Active Connections</div>
          <div class="text-lg font-medium text-[#00D1FF]">
            {{ store.networkStats.activeConnections }}
          </div>
          <div class="text-xs text-gray-500">
            Peak: {{ store.networkStats.peakConnections }}
          </div>
        </div>
        
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Banned IPs</div>
          <div class="text-lg font-medium text-[#00D1FF]">
            {{ store.networkStats.bannedIPs.size }}
          </div>
          <div class="text-xs text-gray-500">
            {{ store.networkStats.suspiciousIPs.size }} suspicious
          </div>
        </div>
      </div>

      <!-- Active Connections -->
      <div class="bg-[#0F172A] rounded-lg border border-gray-800">
        <div class="p-4 border-b border-gray-800">
          <h3 class="font-medium">Active Connections</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-sm text-gray-400">
                <th class="p-4">IP Address</th>
                <th class="p-4">Port</th>
                <th class="p-4">Protocol</th>
                <th class="p-4">Player</th>
                <th class="p-4">Connected</th>
                <th class="p-4">Traffic In</th>
                <th class="p-4">Traffic Out</th>
                <th class="p-4">Actions</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr v-for="conn in store.activeConnections" 
                  :key="conn.ip + conn.port"
                  class="border-t border-gray-800">
                <td class="p-4 font-mono">{{ conn.ip }}</td>
                <td class="p-4">{{ conn.port }}</td>
                <td class="p-4 uppercase">{{ conn.protocol }}</td>
                <td class="p-4">{{ conn.player || '-' }}</td>
                <td class="p-4">{{ formatTimeAgo(conn.connectedAt) }}</td>
                <td class="p-4">{{ formatBytes(conn.bytesIn) }}</td>
                <td class="p-4">{{ formatBytes(conn.bytesOut) }}</td>
                <td class="p-4">
                  <button 
                    @click="store.banIP(conn.ip)"
                    class="text-red-500 hover:text-red-400"
                  >
                    Ban IP
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Banned IPs -->
      <div class="bg-[#0F172A] rounded-lg border border-gray-800">
        <div class="p-4 border-b border-gray-800">
          <h3 class="font-medium">Banned IPs</h3>
        </div>
        <div class="p-4">
          <div class="space-y-2">
            <div v-for="ip of store.networkStats.bannedIPs" 
                 :key="ip"
                 class="flex items-center justify-between">
              <span class="font-mono">{{ ip }}</span>
              <button 
                @click="store.unbanIP(ip)"
                class="text-[#00D1FF] hover:text-[#00B8E6]"
              >
                Unban
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMonitoringStore } from '../../stores/monitoringStore';
import { formatDistanceToNow } from 'date-fns';

const store = useMonitoringStore();

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}
</script>