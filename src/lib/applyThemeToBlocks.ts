import type { Payload } from 'payload'
import { getPreset, themePresets, type ThemePreset } from '../globals/themePresets'

/**
 * Translate layout names from themePresets.ts to the actual database/config enum values
 */
function translateLayout(blockType: string, layout: string): string {
  if (blockType === 'hero') {
    if (layout === 'mosaiFullscreen') return 'mosiaFullscreen'
    if (layout === 'mosaiClassicHero') return 'fullWidth'
    return layout
  }
  if (blockType === 'featuredCards') {
    if (layout === 'mosaiService') return 'bordered'
    if (layout === 'classic') return 'standard'
    if (layout === 'mosaiClassicCards') return 'red'
    return layout
  }
  return layout
}

/**
 * Layout mapping rules: maps block layouts between themes.
 */
function getLayoutMappings(preset: ThemePreset, targetTheme: string) {
  const getFromLayouts = (blockName: keyof ThemePreset['layouts'], blockType: string) => {
    const rawToLayout = preset.layouts[blockName]
    if (typeof rawToLayout !== 'string') return []
    const toLayout = translateLayout(blockType, rawToLayout)
    const otherLayouts = new Set<string>()
    for (const [name, p] of Object.entries(themePresets)) {
      if (name !== targetTheme) {
        const otherVal = p.layouts[blockName]
        if (typeof otherVal === 'string') {
          const translated = translateLayout(blockType, otherVal)
          if (translated !== toLayout) {
            otherLayouts.add(translated)
          }
        }
      }
    }
    return Array.from(otherLayouts)
  }

  return {
    hero: {
      fromLayouts: getFromLayouts('hero', 'hero'),
      toLayout: translateLayout('hero', preset.layouts.hero),
      extraProps: preset.layouts.hero === 'split'
        ? { split_theme: 'light', split_direction: 'textLeft' }
        : {},
    },
    featuredCards: {
      fromLayouts: getFromLayouts('featureCards', 'featuredCards'),
      toLayout: translateLayout('featuredCards', preset.layouts.featureCards),
      extraProps: {},
    },
  }
}

/**
 * Map block slug to the DB column name for its layout field.
 */
const blockLayoutColumns: Record<string, string> = {
  hero: 'layout',
  featuredCards: 'card_style',
}

/**
 * Map block slug to its DB table suffix (used in pages_blocks_xxx, news_blocks_xxx, etc.)
 */
const blockTableSuffixes: Record<string, string> = {
  hero: 'hero',
  featuredCards: 'featured_cards',
}

/** All parent collections that have layout blocks */
const parentTables = ['pages', 'news']

/**
 * Apply theme layout overrides to all blocks in the database.
 * This directly updates the block tables via SQL for speed and reliability.
 */
export async function applyThemeToBlocks(payload: Payload, themeName: string) {
  const preset = getPreset(themeName)
  const mappings = getLayoutMappings(preset, themeName)
  const db = (payload.db as any).pool

  let totalUpdated = 0

  for (const [blockType, mapping] of Object.entries(mappings)) {
    const tableSuffix = blockTableSuffixes[blockType]
    const layoutCol = blockLayoutColumns[blockType]
    if (!tableSuffix || !layoutCol) continue

    for (const parentTable of parentTables) {
      const tableName = `${parentTable}_blocks_${tableSuffix}`

      // Check if table exists
      try {
        const tableCheck = await db.query(
          `SELECT 1 FROM information_schema.tables WHERE table_name = $1 LIMIT 1`,
          [tableName]
        )
        if (tableCheck.rows.length === 0) continue
      } catch {
        continue
      }

      // Update layout column for matching rows
      const fromValues = mapping.fromLayouts
      try {
        // Get the actual enum type name from the schema
        const typeInfo = await db.query(
          `SELECT data_type, udt_name FROM information_schema.columns WHERE table_name = $1 AND column_name = $2`,
          [tableName, layoutCol]
        )
        const isEnum = typeInfo.rows[0]?.data_type === 'USER-DEFINED'
        const enumName = typeInfo.rows[0]?.udt_name

        let result
        if (isEnum) {
          result = await db.query(
            `UPDATE "${tableName}" SET "${layoutCol}" = $1::text::"${enumName}" WHERE "${layoutCol}"::text = ANY($2::text[])`,
            [mapping.toLayout, fromValues]
          )
        } else {
          result = await db.query(
            `UPDATE "${tableName}" SET "${layoutCol}" = $1 WHERE "${layoutCol}" = ANY($2::text[])`,
            [mapping.toLayout, fromValues]
          )
        }
        totalUpdated += result.rowCount || 0

        // Apply extra props if any
        for (const [col, val] of Object.entries(mapping.extraProps)) {
          const colCheck = await db.query(
            `SELECT data_type, udt_name FROM information_schema.columns WHERE table_name = $1 AND column_name = $2 LIMIT 1`,
            [tableName, col]
          )
          if (colCheck.rows.length === 0) continue

          const colIsEnum = colCheck.rows[0]?.data_type === 'USER-DEFINED'
          const colEnumName = colCheck.rows[0]?.udt_name

          if (colIsEnum && typeof val === 'string') {
            await db.query(
              `UPDATE "${tableName}" SET "${col}" = $1::text::"${colEnumName}" WHERE "${layoutCol}"::text = $2`,
              [val, mapping.toLayout]
            )
          } else {
            await db.query(
              `UPDATE "${tableName}" SET "${col}" = $1 WHERE "${layoutCol}"::text = $2`,
              [typeof val === 'boolean' ? val : String(val), mapping.toLayout]
            )
          }
        }
      } catch (e: any) {
        payload.logger.warn(`[Theme] Could not update ${tableName}.${layoutCol}: ${e.message}`)
      }
    }
  }

  payload.logger.info(`[Theme] Applied "${themeName}" theme to ${totalUpdated} block(s) across all collections`)
  return totalUpdated
}
