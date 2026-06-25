'use client'

import React from 'react'
import { SelectField } from '@payloadcms/ui'

export default function IconPickerField(props: any) {
  return (
    <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px', marginBottom: '10px' }}>
      <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>✨ Icon Picker</p>
      <SelectField {...props} />
    </div>
  )
}
