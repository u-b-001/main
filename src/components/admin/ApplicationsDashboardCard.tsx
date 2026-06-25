'use client'

import React from 'react'

export default function ApplicationsDashboardCard() {
  return (
    <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', background: '#fff' }}>
      <h3>Software Requests & Job Applications</h3>
      <p>Monitor and manage incoming user requests directly from here.</p>
      <a href="/admin/collections/jobApplications" style={{ color: 'blue', textDecoration: 'underline' }}>
        View Dashboard &rarr;
      </a>
    </div>
  )
}
