import type { CSSProperties } from 'vue'
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

export function useGlassSurface() {
  const appStore = useAppStore()

  const isGlassEnabled = computed(() => appStore.backgroundEnabled)
  const glassSurfaceStyle = computed<CSSProperties>(() => ({
    '--glass-blur-radius': `${appStore.cardBlurRadius}px`,
  }))

  return {
    isGlassEnabled,
    glassSurfaceStyle,
  }
}
