import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const button = tv({
  base: 'px-4 py-2 rounded-md font-medium',
  variants: {
    color: {
      primary: 'bg-brand-background text-white',
      secondary: 'bg-brand-primary text-gray-900',
      transparent: 'bg-transparent',
    },
  },
  defaultVariants: {
    color: 'primary',
  },
})

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    VariantProps<typeof button> {
  children: ReactNode
  className?: string
}

const Button = ({ children, color, className, ...rest }: ButtonProps) => {
  return (
    <button className={button({ color, className })} {...rest}>
      {children}
    </button>
  )
}

export default Button
