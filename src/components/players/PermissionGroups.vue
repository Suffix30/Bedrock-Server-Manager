<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Permission Groups</h2>
      <button @click="showNewGroup = true" class="btn btn-primary">
        New Group
      </button>
    </div>

    <div class="space-y-6">
      <!-- Group List -->
      <div class="bg-[#0F172A] rounded-lg border border-gray-800">
        <div class="p-4 border-b border-gray-800">
          <h3 class="font-medium">Permission Groups</h3>
        </div>

        <div class="divide-y divide-gray-800">
          <div v-for="group in groups" 
               :key="group.id"
               class="p-4">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center space-x-2">
                  <span class="text-gray-100 font-medium">{{ group.name }}</span>
                  <span :class="{
                    'bg-red-900 text-red-400': group.name === 'admin',
                    'bg-blue-900 text-blue-400': group.name === 'moderator',
                    'bg-green-900 text-green-400': group.name === 'vip',
                    'bg-gray-900 text-gray-400': group.name === 'default'
                  }" class="px-2 py-0.5 rounded-full text-xs">
                    {{ group.members.length }} members
                  </span>
                </div>
                <div class="mt-2 flex flex-wrap gap-2">
                  <span v-for="perm in group.permissions" 
                        :key="perm"
                        class="text-xs px-2 py-1 rounded-full bg-[#1E293B] text-gray-400">
                    {{ perm }}
                  </span>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <button 
                  @click="editGroup(group)"
                  class="text-[#00D1FF] hover:text-[#00B8E6]"
                >
                  Edit
                </button>
                <button 
                  v-if="group.name !== 'default'"
                  @click="deleteGroup(group.id)"
                  class="text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>

            <!-- Member List -->
            <div v-if="group.members.length" class="mt-4">
              <div class="text-sm text-gray-500 mb-2">Members:</div>
              <div class="flex flex-wrap gap-2">
                <div v-for="member in group.members" 
                     :key="member"
                     class="flex items-center space-x-1 bg-[#1E293B] px-2 py-1 rounded">
                  <span class="text-sm text-gray-300">{{ member }}</span>
                  <button 
                    @click="removeMember(group.id, member)"
                    class="text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Available Permissions -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Available Permissions</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="category in permissionCategories" 
               :key="category.name"
               class="space-y-2">
            <div class="text-sm text-gray-400">{{ category.name }}</div>
            <div class="space-y-1">
              <div v-for="perm in category.permissions" 
                   :key="perm"
                   class="text-sm text-gray-300">
                {{ perm }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Group Inheritance -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Group Inheritance</h3>
        <div class="space-y-2">
          <div v-for="group in groups" 
               :key="group.id"
               class="flex items-center justify-between py-2">
            <span class="text-gray-100">{{ group.name }}</span>
            <select 
              v-model="group.inheritsFrom"
              class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
              :disabled="group.name === 'admin'"
            >
              <option value="">No inheritance</option>
              <option v-for="parent in availableParents(group)" 
                      :key="parent.id"
                      :value="parent.id">
                Inherits from {{ parent.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface PermissionGroup {
  id: string;
  name: string;
  permissions: string[];
  members: string[];
  inheritsFrom?: string;
}

interface PermissionCategory {
  name: string;
  permissions: string[];
}

const showNewGroup = ref(false);

const groups = ref<PermissionGroup[]>([
  {
    id: '1',
    name: 'admin',
    permissions: ['*'],
    members: ['admin1']
  },
  {
    id: '2',
    name: 'moderator',
    permissions: ['kick', 'ban', 'mute'],
    members: ['mod1', 'mod2'],
    inheritsFrom: '1'
  },
  {
    id: '3',
    name: 'vip',
    permissions: ['color_chat', 'fly'],
    members: ['vip1']
  },
  {
    id: '4',
    name: 'default',
    permissions: ['chat', 'play'],
    members: ['player1', 'player2']
  }
]);

const permissionCategories = ref<PermissionCategory[]>([
  {
    name: 'General',
    permissions: ['chat', 'play', 'color_chat']
  },
  {
    name: 'Moderation',
    permissions: ['kick', 'ban', 'mute', 'unmute']
  },
  {
    name: 'World',
    permissions: ['teleport', 'fly', 'gamemode']
  }
]);

function editGroup(group: PermissionGroup) {
  // Implement group editing
  console.log('Editing group:', group.name);
}

function deleteGroup(id: string) {
  groups.value = groups.value.filter(g => g.id !== id);
}

function removeMember(groupId: string, member: string) {
  const group = groups.value.find(g => g.id === groupId);
  if (group) {
    group.members = group.members.filter(m => m !== member);
  }
}

function availableParents(group: PermissionGroup) {
  return groups.value.filter(g => 
    g.id !== group.id && 
    !isCircularInheritance(group.id, g.id)
  );
}

function isCircularInheritance(groupId: string, parentId: string): boolean {
  const parent = groups.value.find(g => g.id === parentId);
  if (!parent) return false;
  if (!parent.inheritsFrom) return false;
  if (parent.inheritsFrom === groupId) return true;
  return isCircularInheritance(groupId, parent.inheritsFrom);
}
</script>