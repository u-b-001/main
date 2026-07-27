'use client'

import React, { useCallback, useState, useRef, useEffect } from 'react'
import { $patchStyleText } from '@lexical/selection'
import { $getSelection, $isRangeSelection, LexicalEditor } from 'lexical'
import { ChevronDown, Type } from 'lucide-react'

interface ToolbarProps {
  editor: LexicalEditor
  anchorElem?: HTMLElement
  item?: any
}

const PRESET_FONT_SIZES = [
  { name: '10px', value: '10px' },
  { name: '12px', value: '12px' },
  { name: '14px', value: '14px' },
  { name: '16px (Default)', value: '16px' },
  { name: '18px', value: '18px' },
  { name: '20px', value: '20px' },
  { name: '24px', value: '24px' },
  { name: '28px', value: '28px' },
  { name: '32px', value: '32px' },
  { name: '36px', value: '36px' },
  { name: '48px', value: '48px' },
  { name: '64px', value: '64px' },
  { name: '72px', value: '72px' },
]

function useOnClickOutside(ref: React.RefObject<HTMLElement | null>, handler: (event: MouseEvent | TouchEvent) => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      handler(event)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

export const FontSizePicker: React.FC<ToolbarProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [customSize, setCustomSize] = useState('')
  const popoverRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(popoverRef, () => setIsOpen(false))

  const applyFontSize = useCallback((fontSize: string | null) => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { 'font-size': fontSize })
      }
    })
    setIsOpen(false)
  }, [editor])

  const handleCustomApply = useCallback(() => {
    if (!customSize.trim()) return
    let value = customSize.trim()
    // Append px if only numbers are entered
    if (/^\d+(\.\d+)?$/.test(value)) {
      value += 'px'
    }
    applyFontSize(value)
    setCustomSize('')
  }, [customSize, applyFontSize])

  return (
    <div style={{ display: 'flex', alignItems: 'center', position: 'relative', margin: '0 2px' }} ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px 6px',
          border: 'none',
          background: isOpen ? 'var(--theme-elevation-150, rgba(0,0,0,0.1))' : 'transparent',
          cursor: 'pointer',
          borderRadius: '4px',
          gap: '4px',
        }}
        title="Font Size"
        type="button"
      >
        <div style={{ display: 'flex', alignItems: 'baseline', color: 'var(--theme-text)' }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', lineHeight: 1 }}>A</span>
          <span style={{ fontSize: '15px', fontWeight: 'bold', lineHeight: 1 }}>A</span>
        </div>
        <ChevronDown size={12} style={{ color: 'var(--theme-text)' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '4px',
            backgroundColor: 'var(--theme-bg, #ffffff)',
            border: '1px solid var(--theme-elevation-200, #ccc)',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '8px',
            zIndex: 1000,
            width: '210px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--theme-elevation-500, #666)', marginBottom: '2px' }}>
            Select Font Size
          </div>

          <div
            style={{
              maxHeight: '180px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFontSize(null)}
              style={{
                textAlign: 'left',
                padding: '6px 8px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '13px',
                borderRadius: '4px',
                color: 'var(--theme-elevation-600, #888)',
                fontStyle: 'italic',
              }}
              type="button"
            >
              Reset / Default Size
            </button>

            {PRESET_FONT_SIZES.map((font) => (
              <button
                key={font.value}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFontSize(font.value)}
                style={{
                  textAlign: 'left',
                  padding: '6px 8px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '13px',
                  borderRadius: '4px',
                  color: 'var(--theme-text, #000)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                type="button"
              >
                <span>{font.name}</span>
                <span style={{ fontSize: '11px', color: 'var(--theme-elevation-400, #999)' }}>{font.value}</span>
              </button>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--theme-elevation-150, #eee)', paddingTop: '6px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <input
                type="text"
                placeholder="Custom size (e.g. 18px or 1.5rem)"
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    e.stopPropagation()
                    handleCustomApply()
                  }
                }}
                style={{
                  flex: 1,
                  padding: '4px 6px',
                  fontSize: '12px',
                  border: '1px solid var(--theme-elevation-200, #ccc)',
                  borderRadius: '4px',
                  outline: 'none',
                  background: 'var(--theme-input-bg, #fff)',
                  color: 'var(--theme-text, #000)',
                }}
              />
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleCustomApply}
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  backgroundColor: 'var(--theme-primary-500, #0070f3)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
