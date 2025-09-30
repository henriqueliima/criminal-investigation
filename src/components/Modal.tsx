import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

import Button from './Button'

interface ModalProps {
  children: ReactNode
  closeModal: () => void
  saveModal: () => void
  deleteModal?: () => void
  showDelete?: boolean
}

const Modal = ({
  children,
  closeModal,
  saveModal,
  deleteModal,
  showDelete = false,
}: ModalProps) => {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        className="w-96 rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex justify-end">
          <Button
            color="transparent"
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <X />
          </Button>
        </div>

        {children}

        <div className="mt-6 flex justify-end gap-2">
          {showDelete && deleteModal && (
            <Button
              color="secondary"
              onClick={deleteModal}
              className="rounded-lg px-4 py-2 text-black hover:opacity-70"
            >
              Excluir
            </Button>
          )}
          <Button
            onClick={saveModal}
            className="rounded-lg bg-brand-background px-4 py-2 text-white hover:opacity-70"
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default Modal
