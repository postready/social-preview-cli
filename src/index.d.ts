export type ThemeName = 'dark' | 'light' | 'terminal' | 'gold';
export type PresetName = 'og' | 'twitter' | 'github' | 'banner' | 'compact' | 'square' | 'story';

export interface ThemeColors {
  bg: string;
  surface: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentText: string;
  dotGrid: string;
}

export interface PresetLayout {
  width: number;
  height: number;
  titleSize?: number;
  titleWrap?: number;
  subtitleSize?: number;
  subtitleWrap?: number;
  padding?: number;
}

export interface PreviewOptions {
  title?: string;
  subtitle?: string;
  badge?: string;
  author?: string;
  url?: string;
  tags?: string[];
  theme?: ThemeName;
  preset?: PresetName;
  customWidth?: number;
  customHeight?: number;
  showGrid?: boolean;
}

export declare const THEMES: Record<ThemeName, ThemeColors>;
export declare const AVAILABLE_THEMES: ThemeName[];

export declare const PRESETS: Record<PresetName, PresetLayout>;
export declare const AVAILABLE_PRESETS: PresetName[];

export declare function generateSvg(options?: PreviewOptions): string;
export declare function generatePng(options?: PreviewOptions): Uint8Array;
