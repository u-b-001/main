'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'

export default function ColorPickerField(props: any) {
  const { value, setValue } = useField<string>({ path: props.path })
  
  return (
    <div className="field-type" style={{ marginBottom: '10px' }}>
      <label style={{ display: 'block', marginBottom: '5px' }}>{props.label || 'Select Color'}</label>
      <input 
        type="color" 
        value={value || '#000000'} 
        onChange={(e) => setValue(e.target.value)}
        style={{ width: '100%', height: '40px', padding: '0', cursor: 'pointer' }}
      />
    </div>
  )
}
