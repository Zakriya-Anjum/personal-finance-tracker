import { useState, useEffect } from 'react'
import Modal from './Modal'

// A small, reusable replacement for window.confirm(), built on the
// existing Modal rather than a second modal system. This component
// deliberately knows NOTHING about what "confirming" actually does —
// it calls the onConfirm callback the caller provides and awaits it
// purely to know when to stop showing its own loading state. The
// caller (Transactions.jsx, Budgets.jsx) remains fully responsible
// for the real deletion logic, its own success/error handling, and
// deciding when the dialog should close — this component only
// presents the choice and reports what was chosen.
function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
}) {
  const [isConfirming, setIsConfirming] = useState(false)

  // Reset whenever the dialog is opened fresh (e.g. for a different
  // item) — same isOpen-keyed reset pattern already used by
  // AddTransactionModal/AddBudgetModal for their own form state.
  useEffect(() => {
    if (isOpen) setIsConfirming(false)
  }, [isOpen])

  async function handleConfirm() {
    setIsConfirming(true)
    try {
      await onConfirm()
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-sm text-text-secondary">{message}</p>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isConfirming}
          className="rounded-lg border border-border-strong px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isConfirming}
          className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isConfirming ? 'Deleting...' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

export default ConfirmDialog