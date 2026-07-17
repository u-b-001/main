'use client'
import React, { useState } from 'react'

import RichText from '@/components/RichText'

type FieldDef = {
  label: string
  name: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'number' | 'select' | 'checkbox' | 'message' | 'date' | 'state' | 'country' | 'mediaCheckbox' | 'upload'
  placeholder?: string
  required?: boolean
  width?: 'full' | 'half'
  options?: { label: string; value: string }[]
  message?: any
  media?: any
  instructions?: any
}

type FormProps = {
  heading?: string
  content?: any
  formType?: 'custom' | 'collection'
  formFromCollection?: any
  fieldsPerPage?: number
  fields?: FieldDef[]
  submitLabel?: string
  submitEndpoint?: string
  successMessage?: string
  errorMessage?: string
}

export const FormBlockComponent: React.FC<FormProps> = ({
  heading,
  content,
  formType = 'custom',
  formFromCollection,
  fieldsPerPage = 4,
  fields = [],
  submitLabel = 'Submit',
  submitEndpoint = '',
  successMessage = 'Thanks! We\u2019ll get back to you soon.',
  errorMessage = 'Something went wrong. Please try again.',
}) => {
  const [values, setValues] = useState<Record<string, any>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const [currentPage, setCurrentPage] = useState(0)

  const isCollection = formType === 'collection' && formFromCollection && typeof formFromCollection === 'object'
  
  const activeContent = isCollection && formFromCollection?.description ? formFromCollection.description : content;

  const activeFields: FieldDef[] = isCollection 
    ? (formFromCollection.fields || []).map((f: any) => ({
        label: f.label || f.name,
        name: f.name,
        type: ['email', 'textarea', 'select', 'checkbox', 'number', 'message', 'date', 'state', 'country', 'mediaCheckbox', 'upload'].includes(f.blockType) 
          ? (f.blockType === 'state' || f.blockType === 'country' ? 'select' : f.blockType) 
          : 'text',
        required: f.required,
        width: f.width === 50 ? 'half' : 'full',
        options: f.options,
        message: f.message,
        media: f.media,
        instructions: f.instructions,
      }))
    : fields;

  const FIELDS_PER_PAGE = fieldsPerPage > 0 ? fieldsPerPage : 999
  const totalPages = Math.ceil(activeFields.length / FIELDS_PER_PAGE) || 1
  const currentFields = activeFields.slice(currentPage * FIELDS_PER_PAGE, (currentPage + 1) * FIELDS_PER_PAGE)

  const activeEndpoint = isCollection ? '/api/form-submissions' : submitEndpoint;
  const activeSubmitLabel = isCollection && formFromCollection.submitButtonLabel ? formFromCollection.submitButtonLabel : submitLabel;

  const handleChange = (name: string, value: any) =>
    setValues((prev) => ({ ...prev, [name]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      let hasFiles = false;
      Object.values(values).forEach(val => {
        if (val instanceof FileList || val instanceof File) hasFiles = true;
      });

      let fetchOptions: RequestInit = {
        method: 'POST',
      }

      if (hasFiles) {
        const formData = new FormData();
        if (isCollection) {
          Object.entries(values).forEach(([field, value]) => {
            if (value instanceof FileList) {
               for(let i = 0; i < value.length; i++) {
                 formData.append(field, value[i]);
               }
            } else if (value instanceof File) {
               formData.append(field, value);
            }
          });
          const jsonBody = {
            form: formFromCollection.id,
            submissionData: Object.entries(values).map(([field, value]) => ({ 
              field, 
              value: (value instanceof FileList || value instanceof File) ? undefined : value 
            })).filter(item => item.value !== undefined)
          }
          formData.append('_payload', JSON.stringify(jsonBody));
        } else {
          Object.entries(values).forEach(([field, value]) => {
            if (value instanceof FileList) {
               for(let i = 0; i < value.length; i++) {
                 formData.append(field, value[i]);
               }
            } else {
               formData.append(field, value);
            }
          });
        }
        fetchOptions.body = formData;
      } else {
        const bodyData = isCollection
          ? {
              form: formFromCollection.id,
              submissionData: Object.entries(values).map(([field, value]) => ({ field, value }))
            }
          : values;
        fetchOptions.headers = { 'Content-Type': 'application/json' };
        fetchOptions.body = JSON.stringify(bodyData);
      }

      const res = await fetch(activeEndpoint, fetchOptions)
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
      setValues({})
      setCurrentPage(0)
    } catch {
      setStatus('error')
    }
  }

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1)
    } else {
      await handleSubmit(e)
    }
  }

  if (status === 'success') {
    return (
      <section className="py-16 px-6 w-full max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-10 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Success!</h3>
          <p className="text-slate-600 dark:text-slate-400">{successMessage}</p>
          <button 
            onClick={() => setStatus('idle')}
            className="mt-8 px-6 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors"
          >
            Submit Another Response
          </button>
        </div>
      </section>
    )
  }

  const inputClasses = "w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm"

  return (
    <section className="py-16 px-6 w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 md:p-12">
        {(heading || activeContent) && (
          <div className="mb-10 text-center">
            {heading && <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{heading}</h2>}
            {activeContent && (
              <div className="text-slate-500 dark:text-slate-400 prose dark:prose-invert max-w-none prose-sm sm:prose-base mx-auto">
                {typeof activeContent === 'string' ? (
                  <p>{activeContent}</p>
                ) : (
                  <RichText data={activeContent} enableGutter={false} enableProse={false} />
                )}
              </div>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mb-10">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              <span>Step {currentPage + 1} of {totalPages}</span>
              <span>{Math.round(((currentPage + 1) / totalPages) * 100)}% Completed</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-black dark:bg-white h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <form onSubmit={onFormSubmit} className="grid grid-cols-2 gap-x-6 gap-y-8">
          {currentFields.map((field, i) => {
            const span = field.width === 'half' ? 'col-span-1' : 'col-span-2'
            
            if (field.type === 'message') {
              return (
                <div key={`${currentPage}-${i}`} className={`${span} prose dark:prose-invert max-w-none prose-sm sm:prose-base`}>
                  <RichText data={field.message} enableGutter={false} enableProse={false} />
                </div>
              )
            }

            return (
              <div key={`${currentPage}-${i}`} className={`flex flex-col gap-1.5 ${span}`}>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {field.type === 'mediaCheckbox' ? (
                  <div className="flex flex-col gap-4 p-6 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                    {field.instructions && (
                      <div className="prose dark:prose-invert max-w-none prose-sm">
                        <RichText data={field.instructions} enableGutter={false} enableProse={false} />
                      </div>
                    )}
                    {field.media && typeof field.media === 'object' && field.media.url && (
                       <img src={field.media.url} alt={field.media.alt || 'Payment details'} className="w-full max-w-md mx-auto rounded-lg" />
                    )}
                    <label className="flex items-center gap-3 p-3 mt-2 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-900">
                      <input
                        type="checkbox"
                        required={field.required}
                        checked={!!values[field.name]}
                        onChange={(e) => handleChange(field.name, e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300 text-black focus:ring-black dark:focus:ring-white"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{field.label}</span>
                    </label>
                  </div>
                ) : field.type === 'upload' ? (
                  <div className="flex flex-col gap-2 p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Upload 1 supported file. Max 10 MB.</p>
                    <label className="inline-flex w-max items-center justify-center gap-2 px-4 py-2 mt-1 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-blue-600 dark:text-blue-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {values[field.name]?.length > 0 ? `${values[field.name].length} file(s) selected` : 'Add file'}
                      </span>
                      <input
                        type="file"
                        required={field.required}
                        onChange={(e) => handleChange(field.name, e.target.files)}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : field.type === 'textarea' ? (
                  <textarea
                    required={field.required}
                    placeholder={field.placeholder}
                    value={values[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={`${inputClasses} min-h-[120px] resize-y`}
                  />
                ) : field.type === 'select' ? (
                  <select
                    required={field.required}
                    value={values[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={inputClasses}
                  >
                    <option value="">Select an option...</option>
                    {field.options?.map((opt, j) => (
                      <option key={j} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <input
                      type="checkbox"
                      required={field.required}
                      checked={!!values[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-black focus:ring-black dark:focus:ring-white"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{field.label}</span>
                  </label>
                ) : (
                  <input
                    type={field.type}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={values[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={inputClasses}
                  />
                )}
              </div>
            )
          })}

          <div className="col-span-2 flex items-center justify-between pt-6 mt-2 border-t border-slate-100 dark:border-slate-800">
            {currentPage > 0 ? (
              <button
                type="button"
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                Back
              </button>
            ) : <div />}
            
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-8 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2 shadow-lg shadow-black/10 dark:shadow-white/10"
            >
              {status === 'loading' && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {status === 'loading' 
                ? 'Sending...' 
                : (currentPage < totalPages - 1 ? 'Next Step' : activeSubmitLabel)}
            </button>
          </div>

          {status === 'error' && (
            <div className="col-span-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium text-center">
              {errorMessage}
            </div>
          )}
        </form>
      </div>
    </section>
  )
}