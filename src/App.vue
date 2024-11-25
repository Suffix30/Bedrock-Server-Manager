<template>
  <div class="min-h-screen bg-[#0F172A] p-8">
    <header class="max-w-7xl mx-auto mb-8">
      <h1 class="text-3xl font-bold text-[#00D1FF]">Minecraft Bedrock Server Manager</h1>
    </header>
    
    <main class="max-w-7xl mx-auto space-y-8">
      <div class="flex gap-4">
        <nav class="w-64 card p-4 space-y-2">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            class="w-full text-left px-4 py-2 rounded-lg transition-colors duration-200"
            :class="currentTab === tab.id 
              ? 'bg-[#00D1FF] text-[#0F172A] font-medium' 
              : 'text-gray-300 hover:bg-[#2E3B4B]'"
            @click="currentTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </nav>
        
        <div class="flex-1 space-y-6">
          <!-- Dashboard -->
          <template v-if="currentTab === 'dashboard'">
            <QuickActions />
            <ServerControls />
            <ServerStats />
            <NetworkStats />
            <PlayerLatency />
            <PerformanceGraph />
            <PerformanceAlerts />
            <ServerLogs />
          </template>

          <!-- Server Configuration -->
          <template v-if="currentTab === 'config'">
            <ServerConfiguration />
            <GameRules />
            <ScheduledTasks />
            <AutoRestartConfig />
            <MaintenanceScheduler />
          </template>

          <!-- Security -->
          <template v-if="currentTab === 'security'">
            <BruteForceProtection />
            <SessionManager />
            <TwoFactorAuth />
            <IPBanManager />
            <AccessControl />
            <SecurityAlerts />
          </template>

          <!-- Analytics -->
          <template v-if="currentTab === 'analytics'">
            <PlayerActivityReport />
            <ResourceUsageTrends />
            <EventLogs />
            <ServerMetrics />
            <AnalyticsExport />
          </template>

          <!-- Communication -->
          <template v-if="currentTab === 'communication'">
            <ChatInterface />
            <ChatModeration />
            <MailSystem />
            <Announcements />
            <BroadcastMessages />
            <DiscordIntegration />
          </template>

          <!-- World Management -->
          <template v-if="currentTab === 'world'">
            <WorldManager />
            <WorldBackups />
            <BackupScheduler />
            <WorldImportExport />
            <SeedManager />
          </template>

          <!-- Add-ons -->
          <template v-if="currentTab === 'addons'">
            <AddOnManager />
            <PluginManager />
            <ResourcePackManager />
            <BehaviorPackManager />
            <CompatibilityChecker />
          </template>

          <!-- Commands -->
          <template v-if="currentTab === 'commands'">
            <CommandBlockEditor />
            <CommandMacros />
            <ScheduledCommands />
            <CommandHistory />
            <QuickCommands />
            <CommandTemplates />
          </template>

          <!-- Monitoring -->
          <template v-if="currentTab === 'monitoring'">
            <NetworkMonitor />
            <ResourceGraph />
            <ConnectionTracker />
            <BandwidthMonitor />
            <TrafficAnalyzer />
            <ConnectionLimiter />
          </template>

          <!-- Players -->
          <template v-if="currentTab === 'players'">
            <PlayerStatistics />
            <SecurityManager />
            <TempBanManager />
            <WhitelistManager />
            <PermissionGroups />
            <PlayTimeTracker />
          </template>

          <!-- Admin -->
          <template v-if="currentTab === 'admin'">
            <AdminLogs />
            <ActionHistory />
            <PermissionManager />
            <SecuritySettings />
            <SystemConfig />
            <MaintenanceTools />
          </template>

          <!-- Settings -->
          <template v-if="currentTab === 'settings'">
            <Settings />
            <ThemeSettings />
            <NotificationSettings />
          </template>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import QuickActions from './components/dashboard/QuickActions.vue';
import ServerControls from './components/ServerControls.vue';
import ServerStats from './components/ServerStats.vue';
import NetworkStats from './components/dashboard/NetworkStats.vue';
import PlayerLatency from './components/dashboard/PlayerLatency.vue';
import PerformanceGraph from './components/dashboard/PerformanceGraph.vue';
import PerformanceAlerts from './components/dashboard/PerformanceAlerts.vue';
import ServerLogs from './components/ServerLogs.vue';
import ServerConfiguration from './components/server/ServerConfiguration.vue';
import GameRules from './components/server/GameRules.vue';
import ScheduledTasks from './components/server/ScheduledTasks.vue';
import AutoRestartConfig from './components/server/AutoRestartConfig.vue';
import MaintenanceScheduler from './components/server/MaintenanceScheduler.vue';
import BruteForceProtection from './components/security/BruteForceProtection.vue';
import SessionManager from './components/security/SessionManager.vue';
import TwoFactorAuth from './components/security/TwoFactorAuth.vue';
import IPBanManager from './components/security/IPBanManager.vue';
import AccessControl from './components/security/AccessControl.vue';
import SecurityAlerts from './components/security/SecurityAlerts.vue';
import PlayerActivityReport from './components/analytics/PlayerActivityReport.vue';
import ResourceUsageTrends from './components/analytics/ResourceUsageTrends.vue';
import EventLogs from './components/analytics/EventLogs.vue';
import ServerMetrics from './components/analytics/ServerMetrics.vue';
import AnalyticsExport from './components/analytics/AnalyticsExport.vue';
import ChatInterface from './components/communication/ChatInterface.vue';
import ChatModeration from './components/communication/ChatModeration.vue';
import MailSystem from './components/communication/MailSystem.vue';
import Announcements from './components/communication/Announcements.vue';
import BroadcastMessages from './components/communication/BroadcastMessages.vue';
import DiscordIntegration from './components/communication/DiscordIntegration.vue';
import WorldManager from './components/world/WorldManager.vue';
import WorldBackups from './components/WorldBackups.vue';
import BackupScheduler from './components/world/BackupScheduler.vue';
import WorldImportExport from './components/world/WorldImportExport.vue';
import SeedManager from './components/world/SeedManager.vue';
import AddOnManager from './components/plugins/AddOnManager.vue';
import PluginManager from './components/plugins/PluginManager.vue';
import ResourcePackManager from './components/plugins/ResourcePackManager.vue';
import BehaviorPackManager from './components/plugins/BehaviorPackManager.vue';
import CompatibilityChecker from './components/plugins/CompatibilityChecker.vue';
import CommandBlockEditor from './components/server/CommandBlockEditor.vue';
import CommandMacros from './components/server/CommandMacros.vue';
import ScheduledCommands from './components/server/ScheduledCommands.vue';
import CommandHistory from './components/server/CommandHistory.vue';
import QuickCommands from './components/server/QuickCommands.vue';
import CommandTemplates from './components/server/CommandTemplates.vue';
import NetworkMonitor from './components/monitoring/NetworkMonitor.vue';
import ResourceGraph from './components/monitoring/ResourceGraph.vue';
import ConnectionTracker from './components/monitoring/ConnectionTracker.vue';
import BandwidthMonitor from './components/monitoring/BandwidthMonitor.vue';
import TrafficAnalyzer from './components/monitoring/TrafficAnalyzer.vue';
import ConnectionLimiter from './components/monitoring/ConnectionLimiter.vue';
import PlayerStatistics from './components/players/PlayerStatistics.vue';
import SecurityManager from './components/players/SecurityManager.vue';
import TempBanManager from './components/players/TempBanManager.vue';
import WhitelistManager from './components/players/WhitelistManager.vue';
import PermissionGroups from './components/players/PermissionGroups.vue';
import PlayTimeTracker from './components/players/PlayTimeTracker.vue';
import AdminLogs from './components/admin/AdminLogs.vue';
import ActionHistory from './components/admin/ActionHistory.vue';
import PermissionManager from './components/admin/PermissionManager.vue';
import SecuritySettings from './components/admin/SecuritySettings.vue';
import SystemConfig from './components/admin/SystemConfig.vue';
import MaintenanceTools from './components/admin/MaintenanceTools.vue';
import Settings from './components/Settings.vue';
import ThemeSettings from './components/settings/ThemeSettings.vue';
import NotificationSettings from './components/settings/NotificationSettings.vue';

const tabs = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'world', name: 'World' },
  { id: 'addons', name: 'Add-ons' },
  { id: 'config', name: 'Configuration' },
  { id: 'security', name: 'Security' },
  { id: 'commands', name: 'Commands' },
  { id: 'monitoring', name: 'Monitoring' },
  { id: 'analytics', name: 'Analytics' },
  { id: 'communication', name: 'Communication' },
  { id: 'players', name: 'Players' },
  { id: 'admin', name: 'Admin' },
  { id: 'settings', name: 'Settings' }
] as const;

const currentTab = ref<typeof tabs[number]['id']>('dashboard');

// Listen for theme changes
onMounted(() => {
  window.addEventListener('themechange', () => {
    // Force a re-render of the entire app
    nextTick(() => {
      document.body.style.display = 'none';
      document.body.offsetHeight; // Force a reflow
      document.body.style.display = '';
    });
  });
});
</script>