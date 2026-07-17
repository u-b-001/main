'use client'

import React, { useCallback, useState, useRef, useEffect } from 'react'
import { $patchStyleText } from '@lexical/selection'
import { $getSelection, $isRangeSelection, LexicalEditor } from 'lexical'
import { ChevronDown, PaintBucket, Type } from 'lucide-react'

interface ToolbarProps {
  editor: LexicalEditor
  anchorElem?: HTMLElement
  item?: any
}

const THEME_COLORS = [
  ['#ffffff', '#000000', '#e7e6e6', '#44546a', '#4472c4', '#ed7d31', '#a5a5a5', '#ffc000', '#5b9bd5', '#70ad47'],
  ['#f2f2f2', '#7f7f7f', '#d0cece', '#d6dce4', '#d9e2f3', '#fbe5d5', '#ededed', '#fff2cc', '#deebf6', '#e2efd9'],
  ['#d8d8d8', '#595959', '#aeaaaa', '#adb9ca', '#b4c6e7', '#f7cbac', '#dbdbdb', '#ffe599', '#bdd7ee', '#c5e0b3'],
  ['#bfbfbf', '#3f3f3f', '#757070', '#8496b0', '#8eaadb', '#f4b083', '#c9c9c9', '#ffd966', '#9cc2e5', '#a8d08d'],
  ['#a5a5a5', '#262626', '#3a3838', '#323f4f', '#2f5496', '#c55a11', '#7b7b7b', '#bf8f00', '#2e74b5', '#538135'],
  ['#7f7f7f', '#0c0c0c', '#171616', '#222a35', '#1f3864', '#833c0b', '#525252', '#7f5f00', '#1e4e79', '#375623'],
]

const STANDARD_COLORS = [
  '#c00000', '#ff0000', '#ffc000', '#ffff00', '#92d050', '#00b050', '#00b0f0', '#0070c0', '#002060', '#7030a0'
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

const ColorPickerComponent = ({ 
  editor, 
  type, 
}: { 
  editor: LexicalEditor, 
  type: 'text' | 'bg', 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [color, setColor] = useState(type === 'text' ? '#000000' : '#ffffff')
  const popoverRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useOnClickOutside(popoverRef, () => setIsOpen(false))

  const applyColor = useCallback((newColor: string | null, closePicker = true) => {
    if (newColor) setColor(newColor)
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        if (type === 'text') {
          $patchStyleText(selection, { color: newColor || 'inherit' })
        } else {
          $patchStyleText(selection, { 'background-color': newColor || 'transparent' })
        }
      }
    })
    if (closePicker) {
      setIsOpen(false)
    }
  }, [editor, type])

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
          gap: '2px'
        }}
        title={type === 'text' ? "Text Color" : "Background Color"}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {type === 'text' ? (
            <Type size={14} style={{ color: 'var(--theme-text)' }} />
          ) : (
            <PaintBucket size={14} style={{ color: 'var(--theme-text)' }} />
          )}
          <div style={{ width: '14px', height: '3px', backgroundColor: color, marginTop: '1px' }} />
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
            borderRadius: '4px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            padding: '12px',
            zIndex: 1000,
            width: 'max-content'
          }}
        >
          {/* Automatic */}
          <button 
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyColor(null)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              width: '100%', 
              background: 'none', 
              border: 'none', 
              padding: '4px 6px', 
              cursor: 'pointer',
              marginBottom: '8px',
              borderRadius: '2px',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-elevation-150, rgba(0,0,0,0.05))'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ width: '16px', height: '16px', border: '1px solid #ccc', marginRight: '8px', background: type === 'text' ? '#000' : 'transparent' }} />
            <span style={{ fontSize: '13px', color: 'var(--theme-text, #333)' }}>Automatic</span>
          </button>

          {/* Theme Colors */}
          <div style={{ fontSize: '12px', color: 'var(--theme-text, #666)', marginBottom: '6px', fontWeight: 500 }}>Theme Colors</div>
          
          {/* Base row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px', marginBottom: '4px' }}>
            {THEME_COLORS[0].map((c, colIndex) => (
              <button
                key={`base-${colIndex}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyColor(c)}
                style={{ width: '18px', height: '18px', backgroundColor: c, border: '1px solid rgba(0,0,0,0.1)', padding: 0, cursor: 'pointer', borderRadius: '2px' }}
                title={c}
              />
            ))}
          </div>

          {/* Shades rows */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
            {THEME_COLORS[0].map((_, colIndex) => (
              <div key={`col-${colIndex}`} style={{ display: 'flex', flexDirection: 'column' }}>
                {THEME_COLORS.slice(1).map((row, rowIndex) => (
                  <button
                    key={`shade-${rowIndex}-${colIndex}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyColor(row[colIndex])}
                    style={{ 
                      width: '18px', 
                      height: '14px', 
                      backgroundColor: row[colIndex], 
                      border: '1px solid rgba(0,0,0,0.1)', 
                      borderTop: rowIndex === 0 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                      padding: 0, 
                      cursor: 'pointer' 
                    }}
                    title={row[colIndex]}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Standard Colors */}
          <div style={{ fontSize: '12px', color: 'var(--theme-text, #666)', marginBottom: '6px', fontWeight: 500 }}>Standard Colors</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px', marginBottom: '12px' }}>
            {STANDARD_COLORS.map((c) => (
              <button
                key={c}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyColor(c)}
                style={{
                  width: '18px',
                  height: '18px',
                  backgroundColor: c,
                  border: '1px solid rgba(0,0,0,0.1)',
                  padding: 0,
                  cursor: 'pointer',
                  borderRadius: '2px'
                }}
                title={c}
              />
            ))}
          </div>

          {/* More Colors */}
          <div style={{ borderTop: '1px solid var(--theme-elevation-200, #eee)', paddingTop: '8px' }}>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                background: 'none',
                border: 'none',
                padding: '4px 6px',
                cursor: 'pointer',
                borderRadius: '2px',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-elevation-150, rgba(0,0,0,0.05))'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                marginRight: '8px'
              }} />
              <span style={{ fontSize: '13px', color: 'var(--theme-text, #333)' }}>More Colors...</span>
            </button>
            <input 
              type="color" 
              ref={fileInputRef}
              value={color}
              style={{ visibility: 'hidden', position: 'absolute', width: 0, height: 0 }}
              onChange={(e) => applyColor(e.target.value, false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export const TextColorPicker: React.FC<ToolbarProps> = ({ editor }) => {
  return <ColorPickerComponent editor={editor} type="text" />
}

export const BgColorPicker: React.FC<ToolbarProps> = ({ editor }) => {
  return <ColorPickerComponent editor={editor} type="bg" />
}
