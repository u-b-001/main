'use client'

import React from 'react'
import { RelationshipField } from '@payloadcms/ui'

export default function HomePageSelectorField(props: any) {
  return (
    <div style={{ padding: '15px', border: '2px dashed #4CAF50', borderRadius: '8px', marginBottom: '10px' }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#4CAF50' }}>🏠 System Root Home Page Configuration</h4>
      <p style={{ fontSize: '14px', marginBottom: '15px' }}>
        Select the page that will act as the default entry point (`/`) for the system.
      </p>
      <RelationshipField {...props} />
    </div>
  )
}
