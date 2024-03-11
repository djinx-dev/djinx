export type ThemeColor = string | string[]

export type Theme = {
  colors: Record<string, ThemeColor>,
  fonts: Record<string, any>,
  rhythm?: (val: number | string, ctx?: string) => string,
  prefabs?: any,
}
