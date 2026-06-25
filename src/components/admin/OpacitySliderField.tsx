'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'

export default function OpacitySliderField(props: any) {
  const { value, setValue } = useField<number>({ path: props.path })
  
  return (
    <div className="field-type" style={{ marginBottom: '10px' }}>
      <label style={{ display: 'block', marginBottom: '5px' }}>
        {props.label || 'Opacity'} ({(value || 0)}%)
      </label>
      <input 
        type="range" 
        min="0" max="100" 
        value={value || 0} 
        onChange={(e) => setValue(Number(e.target.value))}
        style={{ width: '100%' }}
      />
    </div>
  )
}
