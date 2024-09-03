'use client'
import * as monaco from 'monaco-editor'
import { useTheme } from 'next-themes'
const cssVariables = ['--background', '--foreground', '--primary', '--secondary', '--muted', '--accent', '--border']

export const useEditorTheme = () => {
  const { theme, systemTheme } = useTheme()
  const setTheme = (monacoInstance: typeof monaco) => {
    const getColorFromVariable = (variable: string) => {
      const hslColor = getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
      const rgbColor = hslToRgb(hslColor)
      return rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b)
    }

    const colors = cssVariables.reduce(
      (acc, variable) => {
        acc[variable] = getColorFromVariable(variable)
        return acc
      },
      {} as Record<string, string>
    )

    const base = theme === 'system' ? (systemTheme === 'dark' ? 'vs-dark' : 'vs') : theme === 'dark' ? 'vs-dark' : 'vs'

    monacoInstance.editor.defineTheme('myDarkTheme', {
      base: base,
      inherit: true,
      rules: [],
      colors: {
        'editor.background': colors['--background'],
        'editor.foreground': colors['--foreground'],
        'editor.lineHighlightBackground': colors['--background'],
        'editorCursor.foreground': '#d4d4d4',
        'editorWhitespace.foreground': '#3a3a3a',
        'editorIndentGuide.background': '#404040',
        'editor.selectionBackground': colors['--secondary'],
        'editor.inactiveSelectionBackground': colors['--muted'],
        focusBorder: `${colors['--border']}00`, // Appending '00' for full transparency
      },
    })
    monacoInstance.editor.setTheme('myDarkTheme')
  }

  return { setTheme }
}

// Helper function to convert HSL to RGB
function hslToRgb(hsl: string): { r: number; g: number; b: number } {
  const [h, s, l] = hsl.split(' ').map(parseFloat)
  if (isNaN(h) || isNaN(s) || isNaN(l)) {
    console.error('Invalid HSL values:', hsl)
    return { r: 0, g: 0, b: 0 }
  }
  const hue = h / 360
  const saturation = s / 100
  const lightness = l / 100
  let r, g, b

  if (saturation === 0) {
    r = g = b = lightness
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation
    const p = 2 * lightness - q
    r = hue2rgb(p, q, hue + 1 / 3)
    g = hue2rgb(p, q, hue)
    b = hue2rgb(p, q, hue - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

// Helper function to convert RGB to Hex
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return '#' + toHex(r) + toHex(g) + toHex(b)
}
