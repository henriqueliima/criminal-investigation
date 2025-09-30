import type { ChangeEventHandler, InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'ref'> {
  value?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  type?: 'text' | 'url' | 'email' | 'password' | 'number' | 'file'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Cole a URL do vídeo',
      type = 'text',
      autoFocus,
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary ${className ?? ''}`}
        {...rest}
      />
    )
  }
)

export default Input
