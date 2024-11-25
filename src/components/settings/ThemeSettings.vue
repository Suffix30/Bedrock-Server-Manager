<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Theme Settings</h2>
      <div class="flex items-center space-x-4">
        <button @click="restoreDefaults" class="btn btn-secondary">
          Restore Defaults
        </button>
        <button @click="saveTheme" class="btn btn-primary">
          Save Changes
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Colors -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Colors</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Primary Color</div>
              <div class="text-sm text-gray-400">Main accent color</div>
            </div>
            <div class="relative">
              <input 
                v-model="theme.colors.primary"
                type="color"
                class="h-8 w-16 rounded bg-transparent cursor-pointer opacity-0 absolute inset-0 z-10"
              />
              <div 
                class="h-8 w-16 rounded border border-gray-700"
                :style="{ backgroundColor: theme.colors.primary }"
              ></div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Background Color</div>
              <div class="text-sm text-gray-400">Main background</div>
            </div>
            <div class="relative">
              <input 
                v-model="theme.colors.background"
                type="color"
                class="h-8 w-16 rounded bg-transparent cursor-pointer opacity-0 absolute inset-0 z-10"
              />
              <div 
                class="h-8 w-16 rounded border border-gray-700"
                :style="{ backgroundColor: theme.colors.background }"
              ></div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Card Color</div>
              <div class="text-sm text-gray-400">Component background</div>
            </div>
            <div class="relative">
              <input 
                v-model="theme.colors.card"
                type="color"
                class="h-8 w-16 rounded bg-transparent cursor-pointer opacity-0 absolute inset-0 z-10"
              />
              <div 
                class="h-8 w-16 rounded border border-gray-700"
                :style="{ backgroundColor: theme.colors.card }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Color Blind Mode -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Accessibility</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Color Blind Mode</div>
              <div class="text-sm text-gray-400">Adjust colors for color blindness</div>
            </div>
            <select 
              v-model="theme.accessibility.colorBlindMode"
              class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
              @change="applyColorBlindMode"
            >
              <option value="none">None</option>
              <option value="protanopia">Protanopia</option>
              <option value="deuteranopia">Deuteranopia</option>
              <option value="tritanopia">Tritanopia</option>
            </select>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">High Contrast</div>
              <div class="text-sm text-gray-400">Increase color contrast</div>
            </div>
            <button 
              @click="theme.accessibility.highContrast = !theme.accessibility.highContrast"
              :class="[
                'btn',
                theme.accessibility.highContrast ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ theme.accessibility.highContrast ? 'Enabled' : 'Disabled' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Font Settings -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Typography</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Font Family</div>
              <div class="text-sm text-gray-400">Interface font</div>
            </div>
            <select 
              v-model="theme.font.family"
              class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">System Default</option>
              <option value="'Inter', sans-serif">Inter</option>
              <option value="'Roboto Mono', monospace">Roboto Mono</option>
            </select>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Font Size</div>
              <div class="text-sm text-gray-400">Base text size</div>
            </div>
            <select 
              v-model="theme.font.size"
              class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="14px">Small</option>
              <option value="16px">Medium</option>
              <option value="18px">Large</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Interface Settings -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Interface</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Border Radius</div>
              <div class="text-sm text-gray-400">Corner roundness</div>
            </div>
            <select 
              v-model="theme.interface.borderRadius"
              class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="0">None</option>
              <option value="0.25rem">Small</option>
              <option value="0.5rem">Medium</option>
              <option value="1rem">Large</option>
            </select>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Animation Speed</div>
              <div class="text-sm text-gray-400">Transition duration</div>
            </div>
            <select 
              v-model="theme.interface.animationSpeed"
              class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="0s">None</option>
              <option value="0.15s">Fast</option>
              <option value="0.3s">Normal</option>
              <option value="0.5s">Slow</option>
            </select>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Interface Density</div>
              <div class="text-sm text-gray-400">Component spacing</div>
            </div>
            <select 
              v-model="theme.interface.density"
              class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="0.5rem">Compact</option>
              <option value="1rem">Comfortable</option>
              <option value="1.5rem">Spacious</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Theme {
  colors: {
    primary: string;
    background: string;
    card: string;
  };
  font: {
    family: string;
    size: string;
  };
  interface: {
    borderRadius: string;
    animationSpeed: string;
    density: string;
  };
  accessibility: {
    colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
    highContrast: boolean;
  };
}

const defaultTheme: Theme = {
  colors: {
    primary: '#00D1FF',
    background: '#0F172A',
    card: '#1E293B'
  },
  font: {
    family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    size: '16px'
  },
  interface: {
    borderRadius: '0.5rem',
    animationSpeed: '0.3s',
    density: '1rem'
  },
  accessibility: {
    colorBlindMode: 'none',
    highContrast: false
  }
};

const theme = ref<Theme>(JSON.parse(JSON.stringify(defaultTheme)));

function applyColorBlindMode() {
  const colors = { ...theme.value.colors };
  
  switch (theme.value.accessibility.colorBlindMode) {
    case 'protanopia':
      colors.primary = '#00B4D4';
      break;
    case 'deuteranopia':
      colors.primary = '#0095FF';
      break;
    case 'tritanopia':
      colors.primary = '#FF6B00';
      break;
  }

  theme.value.colors = colors;
  applyTheme();
}

function applyTheme() {
  const root = document.documentElement;
  const style = document.documentElement.style;
  
  // Apply colors
  style.setProperty('--color-primary', theme.value.colors.primary);
  style.setProperty('--color-bg-dark', theme.value.colors.background);
  style.setProperty('--color-bg-card', theme.value.colors.card);
  
  // Apply font settings
  style.setProperty('--font-family', theme.value.font.family);
  style.setProperty('--font-size', theme.value.font.size);
  
  // Apply interface settings
  style.setProperty('--border-radius', theme.value.interface.borderRadius);
  style.setProperty('--animation-speed', theme.value.interface.animationSpeed);
  style.setProperty('--spacing', theme.value.interface.density);

  // Apply high contrast if enabled
  if (theme.value.accessibility.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }

  // Apply CSS variables to all relevant selectors
  const css = `
    .card { border-radius: var(--border-radius) !important; }
    .btn { border-radius: var(--border-radius) !important; }
    input, select { border-radius: var(--border-radius) !important; }
  `;

  // Update or create style element
  let styleEl = document.getElementById('theme-styles');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'theme-styles';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = css;

  // Dispatch theme change event
  window.dispatchEvent(new Event('themechange'));
}

function saveTheme() {
  localStorage.setItem('theme', JSON.stringify(theme.value));
  applyTheme();
}

function restoreDefaults() {
  theme.value = JSON.parse(JSON.stringify(defaultTheme));
  saveTheme();
}

onMounted(() => {
  // Load saved theme or use defaults
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    theme.value = JSON.parse(savedTheme);
  }
  applyTheme();
});
</script>