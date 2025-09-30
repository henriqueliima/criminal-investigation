import type { ReactNode } from 'react'

interface ButtonProps {
  onClick: () => void
  children: ReactNode
}

const Button = ({ onClick, children }: ButtonProps) => {
  return (
    <button
      className="border bg-brand-background px-4 py-2 text-white"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
