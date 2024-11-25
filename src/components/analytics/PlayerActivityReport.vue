<template>
  <!-- Previous template code remains the same -->
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Chart from 'chart.js/auto';

const dateRange = ref({
  start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
});

const stats = ref({
  totalPlayers: 0,
  newPlayers: 0,
  peakPlayers: 0,
  avgPlayers: 0,
  totalPlaytime: 0,
  avgPlaytime: 0
});

const topPlayers = ref([
  { username: 'Steve', playtime: 3600 * 50, sessions: 25 },
  { username: 'Alex', playtime: 3600 * 42, sessions: 18 },
  { username: 'Notch', playtime: 3600 * 35, sessions: 15 }
]);

const activityChart = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

function formatHours(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  return `${hours}h`;
}

function generateReport() {
  // Simulate fetching report data
  stats.value = {
    totalPlayers: 150,
    newPlayers: 12,
    peakPlayers: 45,
    avgPlayers: 22,
    totalPlaytime: 3600 * 1200,
    avgPlaytime: 3600 * 8
  };

  updateChart();
}

function updateChart() {
  if (!activityChart.value) return;

  // Destroy existing chart instance if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Create new chart instance
  chartInstance = new Chart(activityChart.value, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Active Players',
        data: [25, 32, 28, 35, 42, 38, 30],
        borderColor: '#00D1FF',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      }
    }
  });
}

onMounted(() => {
  generateReport();
});

onUnmounted(() => {
  // Clean up chart instance when component is destroyed
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});
</script>