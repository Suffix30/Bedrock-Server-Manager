<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Connection Tracker</h2>
      <div class="flex items-center space-x-4">
        <select 
          v-model="filterType"
          class="bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
        >
          <option value="all">All Connections</option>
          <option value="active">Active Only</option>
          <option value="suspicious">Suspicious</option>
        </select>
        <button @click="refreshConnections" class="btn btn-primary">
          Refresh
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Active Connections -->
      <div class="bg-[#0F172A] rounded-lg border border-gray-800">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-sm text-gray-400 border-b border-gray-800">
                <th class="p-4">IP Address</th>
                <th class="p-4">Port</th>
                <th class="p-4">Protocol</th>
                <th class="p-4">Player</th>
                <th class="p-4">Connected</th>
                <th class="p-4">Status</th>
                <th class="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="conn in filteredConnections" 
                  :key="conn.id"
                  class="border-b border-gray-800 hover:bg-[#1E293B]">
                <td class="p-4 font-mono">{{ conn.ip }}</td>
                <td class="p-4">{{ conn.port }}</td>
                <td class="p-4 uppercase">{{ conn.protocol }}</td>
                <td class="p-4">{{ conn.player || '-' }}</td>
                <td class="p-4">{{ formatTimeAgo(conn.connectedAt) }}</td>
                <td class="p-4">
                  <span :class="{
                    'text-green-400': conn.status === 'active',
                    'text-yellow-400': conn.status === 'suspicious',
                    'text-red-400': conn.status === 'blocked'
                  }">{{ conn.status }}</span>
                </td>
                <td class="p-4">
                  <div class="flex items-center space-x-2">
                    <button 
                      v-if="conn.status !== 'blocked'"
                      @click="blockConnection(conn)"
                      class="text-red-500 hover:text-red-400"
                    >
                      Block
                    </button>
                    <button 
                      v-else
                      @click="unblockConnection(conn)"
                      class="text-[#00D1FF] hover:text-[#00B8E6]"
                    >
                      Unblock
                    </button>
                    <button 
                      @click="showDetails(conn)"
                      class="text-gray-400 hover:text-gray-300"
                    >
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Connection Statistics -->
      <div class="grid grid-cols-4 gap-4">
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Active Connections</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ stats.active }}</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Peak Connections</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ stats.peak }}</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Blocked IPs</div>
          <div class="text-2xl font-bold text-red-400">{{ stats.blocked }}</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Suspicious Activity</div>
          <div class="text-2xl font-bold text-yellow-400">{{ stats.suspicious }}</div>
        </div>
      </div>

      <!-- Connection History -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Connection History</h3>
        <div class="space-y-2">
          <div v-for="event in connectionHistory" 
               :key="event.id"
               class="flex items-center justify-between py-2">
            <div>
              <div class="flex items-center space-x-2">
                <span class="font-mono text-gray-100">{{ event.ip }}</span>
                <span :class="{
                  'text-green-400': event.type === 'connect',
                  'text-red-400': event.type === 'disconnect',
                  'text-yellow-400': event.type === 'suspicious'
                }">{{ event.type }}</span>
              </div>
              <div class="text-sm text-gray-400 mt-1">
                {{ formatTimeAgo(event.timestamp) }}
              </div>
            </div>
            <span class="text-sm text-gray-500">{{ event.details }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { formatDistanceToNow } from 'date-fns';

interface Connection {
  id: string;
  ip: string;
  port: number;
  protocol: 'tcp' | 'udp';
  player?: string;
  connectedAt: Date;
  status: 'active' | 'suspicious' | 'blocked';
}

interface ConnectionEvent {
  id: string;
  ip: string;
  type: 'connect' | 'disconnect' | 'suspicious';
  timestamp: Date;
  details: string;
}

const filterType = ref('all');

const connections = ref<Connection[]>([
  {
    id: '1',
    ip: '192.168.1.100',
    port: 19132,
    protocol: 'udp',
    player: 'Player1',
    connectedAt: new Date(Date.now() - 3600000),
    status: 'active'
  },
  {
    id: '2',
    ip: '192.168.1.101',
    port: 19132,
    protocol: 'udp',
    connectedAt: new Date(Date.now() - 1800000),
    status: 'suspicious'
  }
]);

const connectionHistory = ref<ConnectionEvent[]>([
  {
    id: '1',
    ip: '192.168.1.100',
    type: 'connect',
    timestamp: new Date(Date.now() - 3600000),
    details: 'Normal connection'
  },
  {
    id: '2',
    ip: '192.168.1.101',
    type: 'suspicious',
    timestamp: new Date(Date.now() - 1800000),
    details: 'Multiple failed auth attempts'
  }
]);

const stats = computed(() => ({
  active: connections.value.filter(c => c.status === 'active').length,
  peak: 10, // This would be tracked over time
  blocked: connections.value.filter(c => c.status === 'blocked').length,
  suspicious: connections.value.filter(c => c.status === 'suspicious').length
}));

const filteredConnections = computed(() => {
  if (filterType.value === 'all') return connections.value;
  return connections.value.filter(conn => conn.status === filterType.value);
});

function refreshConnections() {
  // Implement connection refresh
  console.log('Refreshing connections');
}

function blockConnection(conn: Connection) {
  conn.status = 'blocked';
  connectionHistory.value.unshift({
    id: Date.now().toString(),
    ip: conn.ip,
    type: 'disconnect',
    timestamp: new Date(),
    details: 'Manually blocked'
  });
}

function unblockConnection(conn: Connection) {
  conn.status = 'active';
  connectionHistory.value.unshift({
    id: Date.now().toString(),
    ip: conn.ip,
    type: 'connect',
    timestamp: new Date(),
    details: 'Manually unblocked'
  });
}

function showDetails(conn: Connection) {
  // Implement connection details modal
  console.log('Show details for:', conn);
}

function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}
</script>