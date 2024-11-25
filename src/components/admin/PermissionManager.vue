<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Permission Manager</h2>
      <button @click="showNewRole = true" class="btn btn-primary">
        Create Role
      </button>
    </div>

    <div class="space-y-6">
      <!-- Roles List -->
      <div class="bg-[#0F172A] rounded-lg border border-gray-800">
        <div class="p-4 border-b border-gray-800">
          <h3 class="font-medium">Roles</h3>
        </div>

        <div class="divide-y divide-gray-800">
          <div v-for="role in roles" 
               :key="role.id"
               class="p-4">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center space-x-2">
                  <span class="text-gray-100 font-medium">{{ role.name }}</span>
                  <span :class="{
                    'bg-red-900 text-red-400': role.level === 'admin',
                    'bg-blue-900 text-blue-400': role.level === 'moderator',
                    'bg-green-900 text-green-400': role.level === 'vip',
                    'bg-gray-900 text-gray-400': role.level === 'default'
                  }" class="px-2 py-0.5 rounded-full text-xs">
                    {{ role.level }}
                  </span>
                </div>
                <div class="mt-2 flex flex-wrap gap-2">
                  <span v-for="perm in role.permissions" 
                        :key="perm"
                        class="text-xs px-2 py-1 rounded-full bg-[#1E293B] text-gray-400">
                    {{ perm }}
                  </span>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <button 
                  @click="editRole(role)"
                  class="text-[#00D1FF] hover:text-[#00B8E6]"
                >
                  Edit
                </button>
                <button 
                  v-if="role.level !== 'default'"
                  @click="deleteRole(role.id)"
                  class="text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>

            <!-- Role Members -->
            <div v-if="role.members.length" class="mt-4">
              <div class="text-sm text-gray-500 mb-2">Members:</div>
              <div class="flex flex-wrap gap-2">
                <div v-for="member in role.members" 
                     :key="member"
                     class="flex items-center space-x-1 bg-[#1E293B] px-2 py-1 rounded">
                  <span class="text-sm text-gray-300">{{ member }}</span>
                  <button 
                    @click="removeMember(role.id, member)"
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

      <!-- Permission Categories -->
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

      <!-- Role Inheritance -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Role Inheritance</h3>
        <div class="space-y-2">
          <div v-for="role in roles" 
               :key="role.id"
               class="flex items-center justify-between py-2">
            <span class="text-gray-100">{{ role.name }}</span>
            <select 
              v-model="role.inheritsFrom"
              class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
              :disabled="role.level === 'admin'"
            >
              <option value="">No inheritance</option>
              <option v-for="parent in availableParents(role)" 
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

interface Role {
  id: string;
  name: string;
  level: 'admin' | 'moderator' | 'vip' | 'default';
  permissions: string[];
  members: string[];
  inheritsFrom?: string;
}

interface PermissionCategory {
  name: string;
  permissions: string[];
}

const showNewRole = ref(false);

const roles = ref<Role[]>([
  {
    id: '1',
    name: 'Administrator',
    level: 'admin',
    permissions: ['*'],
    members: ['admin1']
  },
  {
    id: '2',
    name: 'Moderator',
    level: 'moderator',
    permissions: ['kick', 'ban', 'mute'],
    members: ['mod1', 'mod2'],
    inheritsFrom: '1'
  },
  {
    id: '3',
    name: 'VIP',
    level: 'vip',
    permissions: ['color_chat', 'fly'],
    members: ['vip1']
  },
  {
    id: '4',
    name: 'Default',
    level: 'default',
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

function editRole(role: Role) {
  // Implement role editing
  console.log('Editing role:', role.name);
}

function deleteRole(id: string) {
  roles.value = roles.value.filter(r => r.id !== id);
}

function removeMember(roleId: string, member: string) {
  const role = roles.value.find(r => r.id === roleId);
  if (role) {
    role.members = role.members.filter(m => m !== member);
  }
}

function availableParents(role: Role) {
  return roles.value.filter(r => 
    r.id !== role.id && 
    !isCircularInheritance(role.id, r.id)
  );
}

function isCircularInheritance(roleId: string, parentId: string): boolean {
  const parent = roles.value.find(r => r.id === parentId);
  if (!parent) return false;
  if (!parent.inheritsFrom) return false;
  if (parent.inheritsFrom === roleId) return true;
  return isCircularInheritance(roleId, parent.inheritsFrom);
}
</script>