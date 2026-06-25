import React from 'react'

type Props = {
  text: string
  variant: string
  size?: string
}

export const StatusBadgeBlock: React.FC<Props> = ({
  text,
  variant,
  size = 'md',
}) => {
  const colors: Record<string, string> = {
    new: 'bg-green-100 text-green-700',
    trending: 'bg-orange-100 text-orange-700',
    featured: 'bg-purple-100 text-purple-700',
    popular: 'bg-pink-100 text-pink-700',
    hot: 'bg-red-100 text-red-700',
    recommended: 'bg-blue-100 text-blue-700',
    limited: 'bg-yellow-100 text-yellow-700',
    'coming-soon': 'bg-gray-100 text-gray-700',
    updated: 'bg-cyan-100 text-cyan-700',
  }

  const sizes: Record<string, string> = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${colors[variant]} ${sizes[size]}`}
    >
      {text}
    </span>
  )
}