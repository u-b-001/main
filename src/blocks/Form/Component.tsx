'use client'
import React, { useState } from 'react'

type FieldDef = {
  label: string
  name: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'number' | 'select' | 'checkbox'
  placeholder?: string
  required?: boolean
  width?: 'full' | 'half'
  options?: { label: string; value: string }[]
}

type FormProps = {
  heading?: string
  description?: string
  fields: FieldDef[]
  submitLabel?: string
  submitEndpoint: string
  successMessage?: string
  errorMessage?: string
}

export const FormBlockComponent: React.FC<FormProps> = ({
  heading,
  description,
  fields,
  submitLabel = 'Submit',
  submitEndpoint,
  successMessage = 'Thanks! We\u2019ll get back to you soon.',
  errorMessage = 'Something went wrong. Please try again.',
}) => {
  const [values, setValues] = useState<Record<string, any>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (name: string, value: any) =>
    setValues((prev) => ({ ...prev, [name]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch(submitEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
      setValues({})
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <section className="py-16 px-6 max-w-xl mx-auto text-center">
        <p className="text-green-600 font-medium">{successMessage}</p>
      </section>
    )
  }

  return (
    <section className="py-16 px-6 max-w-xl mx-auto">
      {heading && <h2 className="text-2xl font-bold mb-2">{heading}</h2>}
      {description && <p className="text-gray-500 mb-6">{description}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {fields.map((field, i) => {
          const span = field.width === 'half' ? 'col-span-1' : 'col-span-2'
          return (
            <div key={i} className={`flex flex-col gap-1 ${span}`}>
              <label className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  required={field.required}
                  placeholder={field.placeholder}
                  value={values[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="border rounded-md p-2 min-h-[100px]"
                />
              ) : field.type === 'select' ? (
                <select
                  required={field.required}
                  value={values[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="border rounded-md p-2"
                >
                  <option value="">Select...</option>
                  {field.options?.map((opt, j) => (
                    <option key={j} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  checked={!!values[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.checked)}
                  className="w-5 h-5"
                />
              ) : (
                <input
                  type={field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={values[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="border rounded-md p-2"
                />
              )}
            </div>
          )
        })}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="col-span-2 px-6 py-3 rounded-md bg-black text-white font-medium disabled:opacity-50"
        >
          {status === 'loading' ? 'Sending...' : submitLabel}
        </button>

        {status === 'error' && (
          <p className="col-span-2 text-red-600 text-sm">{errorMessage}</p>
        )}
      </form>
    </section>
  )
}