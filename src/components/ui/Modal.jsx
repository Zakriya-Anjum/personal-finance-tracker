import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

function Modal({ isOpen, onClose, title, children }) {
  const dialogRef = useRef(null)
  const previouslyFocusedRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // V6.13 — basic focus management, no external dependency. On open:
  // remember whatever had focus before the modal appeared (almost
  // always the button that triggered it) and move focus to the first
  // MEANINGFUL focusable element inside the dialog — deliberately
  // skipping the header's Close (X) button, since landing there first
  // reads as "here's how to leave" rather than "here's what to do."
  // For a form modal that's the first field; for ConfirmDialog (no
  // fields) it naturally lands on Cancel, which is also the safer
  // default for a destructive action.
  //
  // On close: return focus to whatever was remembered — but only if
  // it's still actually attached to the document. It might not be:
  // confirming a delete removes the very row (and its Delete button)
  // that opened the confirmation dialog, as a direct side effect of
  // the deletion itself. Focusing a detached element is unreliable
  // across browsers, so this is checked explicitly rather than
  // assumed away — if the trigger is gone, focus is simply left where
  // the browser puts it by default, rather than throwing or silently
  // failing.
  useEffect(() => {
    if (!isOpen) return

    previouslyFocusedRef.current = document.activeElement

    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

    const focusableElements = dialogRef.current
      ? Array.from(dialogRef.current.querySelectorAll(focusableSelector))
      : []

    const target =
      focusableElements.find((element) => element.getAttribute('aria-label') !== 'Close') ||
      dialogRef.current

    target?.focus()

    return () => {
      const previouslyFocused = previouslyFocusedRef.current
      if (previouslyFocused && document.body.contains(previouslyFocused)) {
        previouslyFocused.focus()
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-lg dark:shadow-2xl dark:shadow-black/40 focus:outline-none"
      >
        <div className="flex items-center justify-between">
          <h2 id="modal-title" className="text-lg font-semibold text-text-primary">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-text-muted transition-colors hover:bg-surface-hover hover:text-text-secondary"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </div>
  )
}

export default Modal