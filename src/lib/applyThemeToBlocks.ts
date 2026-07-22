import type { Payload } from 'payload'
import { getPreset, themePresets, type ThemePreset } from '../globals/themePresets'

/**
 * Translate layout names from themePresets.ts to the actual database/config enum values
 */
function translateLayout(blockType: string, layout: string): string {
  if (blockType === 'hero') {
    if (layout === 'mosaiFullscreen') return 'mosiaFullscreen'
    if (layout === 'mosaiClassicHero') return 'fullWidth'
    if (layout === 'default') return 'split'
    return layout
  }
  if (blockType === 'featuredCards') {
    if (layout === 'mosaiService') return 'bordered'
    if (layout === 'classic') return 'standard'
    if (layout === 'mosaiClassicCards') return 'red'
    if (layout === 'default') return 'standard'
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

  return {}
}

/**
 * Map block slug to the DB column name for its layout field.
 */
const blockLayoutColumns: Record<string, string> = {
  featuredCards: 'card_style',
  newsAndUpdates: 'layout',
  imageGallery: 'layout',
}

/**
 * Map block slug to its DB table suffix (used in pages_blocks_xxx, news_blocks_xxx, etc.)
 */
const blockTableSuffixes: Record<string, string> = {
  featuredCards: 'featured_cards',
  newsAndUpdates: 'news_and_updates',
  imageGallery: 'image_gallery',
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

  let homePageId: string | number | null = null
  try {
    const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
    const homePageValue = siteSettings?.homePage
    if (typeof homePageValue === 'string' && homePageValue.startsWith('pages:')) {
      const homePageSlug = homePageValue.replace('pages:', '')
      const homePageQuery = await db.query(
        `SELECT id FROM pages WHERE slug = $1 LIMIT 1`,
        [homePageSlug]
      )
      if (homePageQuery.rows.length > 0) {
        homePageId = homePageQuery.rows[0].id
      }
    }
  } catch (err) {
    payload.logger.error(`[Theme] Failed to get home page ID: ${(err as Error).message}`)
  }

  let totalUpdated = 0

  for (const [blockType, mapping] of Object.entries(mappings)) {
    const tableSuffix = blockTableSuffixes[blockType]
    const layoutCol = blockLayoutColumns[blockType]
    if (!tableSuffix || !layoutCol) continue

    for (const parentTable of parentTables) {
      if (blockType === 'imageGallery' && (!homePageId || parentTable !== 'pages')) {
        continue
      }

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
        let queryArgs: any[] = [mapping.toLayout, fromValues]
        let extraCondition = ''

        if (blockType === 'imageGallery' && homePageId) {
          extraCondition = ` AND "_parent_id" = $3`
          queryArgs.push(homePageId)
        }

        if (isEnum) {
          result = await db.query(
            `UPDATE "${tableName}" SET "${layoutCol}" = $1::text::"${enumName}" WHERE "${layoutCol}"::text = ANY($2::text[])${extraCondition}`,
            queryArgs
          )
        } else {
          result = await db.query(
            `UPDATE "${tableName}" SET "${layoutCol}" = $1 WHERE "${layoutCol}" = ANY($2::text[])${extraCondition}`,
            queryArgs
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
          
          let colQueryArgs: any[] = [val, mapping.toLayout]
          let colExtraCondition = ''
          
          if (blockType === 'imageGallery' && homePageId) {
            colExtraCondition = ` AND "_parent_id" = $3`
            colQueryArgs.push(homePageId)
          }

          if (colIsEnum && typeof val === 'string') {
            await db.query(
              `UPDATE "${tableName}" SET "${col}" = $1::text::"${colEnumName}" WHERE "${layoutCol}"::text = $2${colExtraCondition}`,
              colQueryArgs
            )
          } else {
            colQueryArgs[0] = typeof val === 'boolean' ? val : String(val)
            await db.query(
              `UPDATE "${tableName}" SET "${col}" = $1 WHERE "${layoutCol}"::text = $2${colExtraCondition}`,
              colQueryArgs
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
