'use client'

import React, { useCallback, useState, useRef, useEffect } from 'react'
import { $patchStyleText } from '@lexical/selection'
import { $getSelection, $isRangeSelection, LexicalEditor } from 'lexical'
import { Type, ChevronDown } from 'lucide-react'

interface ToolbarProps {
  editor: LexicalEditor
  anchorElem?: HTMLElement
  item?: any
}

const FONTS = [
  { name: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { name: 'Comic Sans MS', value: '"Comic Sans MS", "Comic Sans", cursive' },
  { name: 'Courier New', value: '"Courier New", Courier, monospace' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Impact', value: 'Impact, fantasy' },
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { name: 'Trebuchet MS', value: '"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif' },
  { name: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
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

export const FontPicker: React.FC<ToolbarProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(popoverRef, () => setIsOpen(false))

  const applyFont = useCallback((fontFamily: string | null) => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { 'font-family': fontFamily })
      }
    })
    setIsOpen(false)
  }, [editor])

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
          gap: '4px'
        }}
        title="Font Family"
      >
        <span style={{ fontFamily: 'serif', fontWeight: 'bold', fontSize: '14px', color: 'var(--theme-text)', lineHeight: 1 }}>F</span>
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
            borderRadius: '4px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            padding: '8px',
            zIndex: 1000,
            width: '200px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
          <button 
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyFont(null)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              width: '100%', 
              background: 'none', 
              border: 'none', 
              padding: '6px 8px', 
              cursor: 'pointer',
              borderRadius: '2px',
              fontFamily: 'inherit',
              textAlign: 'left'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-elevation-150, rgba(0,0,0,0.05))'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontSize: '14px', color: 'var(--theme-text, #333)' }}>Default</span>
          </button>
          
          <div style={{ height: '1px', backgroundColor: 'var(--theme-elevation-200, #eee)', margin: '4px 0' }} />

          {FONTS.map((font) => (
            <button
              key={font.name}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFont(font.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                background: 'none',
                border: 'none',
                padding: '6px 8px',
                cursor: 'pointer',
                borderRadius: '2px',
                fontFamily: font.value,
                textAlign: 'left'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-elevation-150, rgba(0,0,0,0.05))'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span style={{ fontSize: '14px', color: 'var(--theme-text, #333)' }}>{font.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
