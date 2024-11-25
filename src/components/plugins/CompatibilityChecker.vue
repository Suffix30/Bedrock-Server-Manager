<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Compatibility Checker</h2>
      <button @click="runCheck" class="btn btn-primary">
        Run Check
      </button>
    </div>

    <div class="space-y-6">
      <!-- Compatibility Status -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-medium">Compatibility Status</h3>
          <span :class="{
            'text-green-400': status === 'compatible',
            'text-yellow-400': status === 'warnings',
            'text-red-400': status === 'incompatible'
          }">{{ formatStatus(status) }}</span>
        </div>

        <div class="space-y-4">
          <div v-for="issue in issues" 
               :key="issue.id"
               :class="{
                 'bg-red-900/20 border-red-700': issue.severity === 'error',
                 'bg-yellow-900/20 border-yellow-700': issue.severity === 'warning',
                 'bg-blue-900/20 border-blue-700': issue.severity === 'info'
               }"
               class="p-4 rounded-lg border">
            <div class="flex items-start space-x-3">
              <div :class="{
                'text-red-400': issue.severity === 'error',
                'text-yellow-400': issue.severity === 'warning',
                'text-blue-400': issue.severity === 'info'
              }">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 class="font-medium text-gray-100">{{ issue.title }}</h4>
                <p class="text-sm text-gray-400 mt-1">{{ issue.description }}</p>
                <div class="flex items-center space-x-4 mt-2">
                  <span class="text-sm text-gray-500">Affects: {{ issue.affects.join(', ') }}</span>
                  <button 
                    v-if="issue.fixable"
                    @click="fixIssue(issue.id)"
                    class="text-[#00D1FF] hover:text-[#00B8E6] text-sm"
                  >
                    Fix Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Version Matrix -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Version Compatibility Matrix</h3>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-sm text-gray-400">
                <th class="p-2">Component</th>
                <th class="p-2">Current Version</th>
                <th class="p-2">Required Version</th>
                <th class="p-2">Status</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr v-for="component in versionMatrix" 
                  :key="component.name"
                  class="border-t border-gray-800">
                <td class="p-2 text-gray-100">{{ component.name }}</td>
                <td class="p-2 font-mono">{{ component.currentVersion }}</td>
                <td class="p-2 font-mono">{{ component.requiredVersion }}</td>
                <td class="p-2">
                  <span :class="{
                    'text-green-400': component.status === 'compatible',
                    'text-yellow-400': component.status === 'update-available',
                    'text-red-400': component.status === 'incompatible'
                  }">{{ formatComponentStatus(component.status) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Dependency Graph -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Dependency Graph</h3>
        <div class="space-y-2">
          <div v-for="item in dependencyGraph" 
               :key="item.name"
               class="pl-4 border-l-2"
               :class="{
                 'border-green-500': item.status === 'ok',
                 'border-red-500': item.status === 'error',
                 'border-yellow-500': item.status === 'warning'
               }">
            <div class="flex items-center justify-between">
              <span class="text-gray-100">{{ item.name }}</span>
              <span :class="{
                'text-green-400': item.status === 'ok',
                'text-red-400': item.status === 'error',
                'text-yellow-400': item.status === 'warning'
              }">{{ item.version }}</span>
            </div>
            <div v-if="item.dependencies?.length" class="ml-4 mt-2 space-y-2">
              <div v-for="dep in item.dependencies" 
                   :key="dep.name"
                   class="text-sm text-gray-400">
                → {{ dep.name }} ({{ dep.version }})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type Status = 'compatible' | 'warnings' | 'incompatible';
type ComponentStatus = 'compatible' | 'update-available' | 'incompatible';
type Severity = 'error' | 'warning' | 'info';

interface Issue {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  affects: string[];
  fixable: boolean;
}

interface VersionComponent {
  name: string;
  currentVersion: string;
  requiredVersion: string;
  status: ComponentStatus;
}

interface DependencyItem {
  name: string;
  version: string;
  status: 'ok' | 'error' | 'warning';
  dependencies?: {
    name: string;
    version: string;
  }[];
}

const status = ref<Status>('warnings');
const issues = ref<Issue[]>([
  {
    id: '1',
    title: 'Version Mismatch',
    description: 'Custom Mobs pack requires a newer version of the base pack',
    severity: 'warning',
    affects: ['Custom Mobs', 'Base Pack'],
    fixable: true
  },
  {
    id: '2',
    title: 'Missing Dependency',
    description: 'Advanced NPCs pack requires Custom Mobs pack',
    severity: 'error',
    affects: ['Advanced NPCs'],
    fixable: true
  }
]);

const versionMatrix = ref<VersionComponent[]>([
  {
    name: 'Base Pack',
    currentVersion: '1.0.0',
    requiredVersion: '1.1.0',
    status: 'update-available'
  },
  {
    name: 'Custom Mobs',
    currentVersion: '1.2.0',
    requiredVersion: '1.2.0',
    status: 'compatible'
  },
  {
    name: 'Advanced NPCs',
    currentVersion: '2.1.0',
    requiredVersion: '2.0.0',
    status: 'compatible'
  }
]);

const dependencyGraph = ref<DependencyItem[]>([
  {
    name: 'Base Pack',
    version: '1.0.0',
    status: 'warning'
  },
  {
    name: 'Custom Mobs',
    version: '1.2.0',
    status: 'ok',
    dependencies: [
      { name: 'Base Pack', version: '1.0.0' }
    ]
  },
  {
    name: 'Advanced NPCs',
    version: '2.1.0',
    status: 'error',
    dependencies: [
      { name: 'Base Pack', version: '1.0.0' },
      { name: 'Custom Mobs', version: '1.2.0' }
    ]
  }
]);

function runCheck() {
  // Implement compatibility check
  console.log('Running compatibility check');
}

function fixIssue(id: string) {
  // Implement issue fix
  console.log('Fixing issue:', id);
}

function formatStatus(status: Status): string {
  switch (status) {
    case 'compatible':
      return 'All Components Compatible';
    case 'warnings':
      return 'Warnings Found';
    case 'incompatible':
      return 'Incompatibilities Detected';
  }
}

function formatComponentStatus(status: ComponentStatus): string {
  switch (status) {
    case 'compatible':
      return 'Compatible';
    case 'update-available':
      return 'Update Available';
    case 'incompatible':
      return 'Incompatible';
  }
}
</script>