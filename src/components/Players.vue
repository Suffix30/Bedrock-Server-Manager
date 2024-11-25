<template>
  <div class="space-y-6">
    <PlayerStatistics />
    <TempBanManager />
  </div>
</template>

<script setup lang="ts">
import PlayerStatistics from './players/PlayerStatistics.vue';
import TempBanManager from './players/TempBanManager.vue';
</script>