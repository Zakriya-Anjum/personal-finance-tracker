// import { useState, useEffect } from 'react'
// import Modal from '../ui/Modal'
// import { validateTransactionForm } from '../../utils/transactionValidation'

// const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Health', 'Income']

// const initialFormState = {
//   title: '',
//   amount: '',
//   type: 'expense',
//   category: 'Food',
//   date: '',
//   notes: '',
// }

// // `transaction` is null in Add mode, and a real transaction object in
// // Edit mode. `mode` is derived from that — no separate prop needed,
// // since "is a transaction passed in?" already tells us everything.
// function AddTransactionModal({ isOpen, onClose, onAddTransaction, onUpdateTransaction, transaction }) {
//   const [formData, setFormData] = useState(initialFormState)
//   const [errors, setErrors] = useState({})
//   // Tracks whether a create/update request is currently in flight, so
//   // the submit button can be disabled — this prevents a user from
//   // double-clicking Submit and firing two backend requests for the
//   // same transaction.
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   // Holds a backend-level failure message (e.g. a network error, or a
//   // validation rule the backend enforces but the frontend didn't
//   // catch) — distinct from `errors`, which holds field-level messages
//   // from the frontend's own validateTransactionForm() check.
//   const [submitError, setSubmitError] = useState('')

//   const mode = transaction ? 'edit' : 'add'

//   // This modal instance is reused for every transaction the user might
//   // click Edit on — it doesn't remount between them. Without this effect,
//   // formData would still hold whatever was typed for the *previous*
//   // transaction (stale state) when a different one is opened. Running
//   // this whenever `transaction` or `isOpen` changes keeps the form in
//   // sync with whichever transaction (or blank form) it's currently meant
//   // to represent.
//   useEffect(() => {
//     if (transaction) {
//       setFormData({
//         title: transaction.title,
//         amount: transaction.amount,
//         type: transaction.isPositive ? 'income' : 'expense',
//         category: transaction.category,
//         // The <input type="date"> element requires an exact
//         // "YYYY-MM-DD" value to prefill correctly. transaction.date is
//         // now a short DISPLAY string ("Jul 28"), which the date input
//         // can't parse. transaction.rawDate carries the same date in
//         // the unambiguous ISO format the input actually needs.
//         date: transaction.rawDate,
//         notes: transaction.notes || '',
//       })
//     } else {
//       setFormData(initialFormState)
//     }
//     setErrors({})
//     setSubmitError('')
//   }, [transaction, isOpen])

//   function handleChange(event) {
//     const { name, value } = event.target
//     setFormData((prev) => ({ ...prev, [name]: value }))

//     if (errors[name]) {
//       const fieldErrors = validateTransactionForm({ ...formData, [name]: value })
//       setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }))
//     }
//   }

//   async function handleSubmit(event) {
//     event.preventDefault()
//     const validationErrors = validateTransactionForm(formData)

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors)
//       return
//     }

//     setSubmitError('')
//     setIsSubmitting(true)

//     try {
//       if (mode === 'edit') {
//         // Spread the original transaction first so id and any other
//         // existing fields carry over unchanged — only the fields
//         // actually present in the form get overwritten.
//         const updatedTransaction = {
//           ...transaction,
//           title: formData.title.trim(),
//           category: formData.category,
//           date: formData.date,
//           amount: Number(formData.amount).toFixed(2),
//           isPositive: formData.type === 'income',
//           notes: formData.notes,
//         }
//         // TransactionContext's updateTransaction() now performs a real
//         // backend request and can fail (network issue, validation
//         // rejected, etc.) — awaiting it means we only close the modal
//         // once the backend has actually confirmed the change.
//         await onUpdateTransaction(updatedTransaction)
//       } else {
//         const newTransaction = {
//           title: formData.title.trim(),
//           category: formData.category,
//           date: formData.date,
//           amount: Number(formData.amount).toFixed(2),
//           isPositive: formData.type === 'income',
//         }
//         await onAddTransaction(newTransaction)
//       }

//       onClose()
//     } catch (error) {
//       // The backend rejected the request (or the network failed) — the
//       // modal stays open and shows the failure instead of pretending
//       // the operation succeeded.
//       setSubmitError(error.message)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   function inputClasses(fieldName) {
//     const base =
//       'mt-1.5 w-full rounded-lg border px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2'
//     return errors[fieldName]
//       ? `${base} border-rose-400 focus:border-rose-400 focus:ring-rose-100`
//       : `${base} border-gray-200 focus:border-emerald-400 focus:ring-emerald-100`
//   }

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title={mode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}>
//       <form className="space-y-4" onSubmit={handleSubmit} noValidate>
//         <div>
//           <label htmlFor="title" className="block text-sm font-medium text-slate-700">
//             Transaction Title
//           </label>
//           <input
//             id="title"
//             name="title"
//             type="text"
//             value={formData.title}
//             onChange={handleChange}
//             placeholder="e.g. Grocery shopping"
//             className={inputClasses('title')}
//           />
//           {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="amount" className="block text-sm font-medium text-slate-700">
//               Amount
//             </label>
//             <input
//               id="amount"
//               name="amount"
//               type="number"
//               value={formData.amount}
//               onChange={handleChange}
//               placeholder="0.00"
//               className={inputClasses('amount')}
//             />
//             {errors.amount && <p className="mt-1 text-xs text-rose-600">{errors.amount}</p>}
//           </div>

//           <div>
//             <label htmlFor="type" className="block text-sm font-medium text-slate-700">
//               Type
//             </label>
//             <select
//               id="type"
//               name="type"
//               value={formData.type}
//               onChange={handleChange}
//               className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
//             >
//               <option value="expense">Expense</option>
//               <option value="income">Income</option>
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="category" className="block text-sm font-medium text-slate-700">
//               Category
//             </label>
//             <select
//               id="category"
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               className={inputClasses('category')}
//             >
//               {categories.map((category) => (
//                 <option key={category} value={category}>
//                   {category}
//                 </option>
//               ))}
//             </select>
//             {errors.category && <p className="mt-1 text-xs text-rose-600">{errors.category}</p>}
//           </div>

//           <div>
//             <label htmlFor="date" className="block text-sm font-medium text-slate-700">
//               Date
//             </label>
//             <input
//               id="date"
//               name="date"
//               type="date"
//               value={formData.date}
//               onChange={handleChange}
//               className={inputClasses('date')}
//             />
//             {errors.date && <p className="mt-1 text-xs text-rose-600">{errors.date}</p>}
//           </div>
//         </div>

//         <div>
//           <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
//             Notes <span className="text-slate-400">(optional)</span>
//           </label>
//           <textarea
//             id="notes"
//             name="notes"
//             rows={3}
//             value={formData.notes}
//             onChange={handleChange}
//             placeholder="Add any additional details..."
//             className="mt-1.5 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
//           />
//         </div>

//         {submitError && (
//           <p className="text-sm text-rose-600">{submitError}</p>
//         )}

//         <div className="flex items-center justify-end gap-3 pt-2">
//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Add Transaction'}
//           </button>
//         </div>
//       </form>
//     </Modal>
//   )
// }

// export default AddTransactionModal












import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import { validateTransactionForm } from '../../utils/transactionValidation'
import { useSettings } from '../../context/SettingsContext'
import { CURRENCY_OPTIONS } from '../../utils/currency'
import { BUDGET_CATEGORIES } from '../../config/budgetConfig'

// 'Income' is deliberately appended here rather than folded into
// budgetConfig.js's shared list — it's a transaction-only concept
// (you don't set a monthly limit on your own income), so it has no
// place in the category source of truth that AddBudgetModal also
// consumes. Every category BEFORE 'Income' still comes from the one
// shared array, so those six stay in sync automatically.
const categories = [...BUDGET_CATEGORIES, 'Income']

const initialFormState = {
  title: '',
  amount: '',
  type: 'expense',
  category: 'Food',
  date: '',
  notes: '',
}

function AddTransactionModal({ isOpen, onClose, onAddTransaction, onUpdateTransaction, transaction }) {
  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const { settings } = useSettings()
  const currencySymbol =
    (CURRENCY_OPTIONS.find((c) => c.code === settings?.currency) || CURRENCY_OPTIONS[0]).symbol

  const mode = transaction ? 'edit' : 'add'

  useEffect(() => {
    if (transaction) {
      setFormData({
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.isPositive ? 'income' : 'expense',
        category: transaction.category,
        date: transaction.rawDate,
        notes: transaction.notes || '',
      })
    } else {
      setFormData(initialFormState)
    }
    setErrors({})
    setSubmitError(null)
  }, [transaction, isOpen])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      const fieldErrors = validateTransactionForm({ ...formData, [name]: value })
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validateTransactionForm(formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitError(null)
    setIsSubmitting(true)

    try {
      if (mode === 'edit') {
        const updatedTransaction = {
          ...transaction,
          title: formData.title.trim(),
          category: formData.category,
          date: formData.date,
          amount: Number(formData.amount).toFixed(2),
          isPositive: formData.type === 'income',
          notes: formData.notes,
        }
        await onUpdateTransaction(updatedTransaction)
      } else {
        const newTransaction = {
          title: formData.title.trim(),
          category: formData.category,
          date: formData.date,
          amount: Number(formData.amount).toFixed(2),
          isPositive: formData.type === 'income',
        }
        await onAddTransaction(newTransaction)
      }

      onClose()
    } catch (error) {
      setSubmitError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  function inputClasses(fieldName) {
    const base =
      'mt-1.5 w-full rounded-lg border px-3 py-2 text-sm text-text-secondary bg-surface placeholder:text-text-muted focus:outline-none focus:ring-2'
    return errors[fieldName]
      ? `${base} border-rose-400 dark:border-rose-500/60 focus:border-rose-400 focus:ring-rose-100 dark:focus:ring-rose-500/30`
      : `${base} border-border-strong focus:border-emerald-400 focus:ring-emerald-100 dark:focus:ring-emerald-500/30`
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-text-secondary">
            Transaction Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Grocery shopping"
            className={inputClasses('title')}
          />
          {errors.title && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-text-secondary">
              Amount
            </label>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                {currencySymbol}
              </span>
              <input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className={`${inputClasses('amount')} !mt-0 pl-7`}
              />
            </div>
            {errors.amount && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.amount}</p>}
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-text-secondary">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-text-secondary focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-500/30"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-text-secondary">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputClasses('category')}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.category}</p>}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-text-secondary">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={inputClasses('date')}
            />
            {errors.date && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.date}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-text-secondary">
            Notes <span className="text-text-muted">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any additional details..."
            className="mt-1.5 w-full resize-none rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-text-secondary placeholder:text-text-muted focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-500/30"
          />
        </div>

        {submitError && (
          <div role="alert" aria-live="polite" className="rounded-lg bg-rose-50 dark:bg-rose-500/10 p-3">
            <p className="text-sm font-medium text-rose-700 dark:text-rose-400">{submitError.message}</p>
            {submitError.errors && submitError.errors.length > 0 && (
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-rose-600 dark:text-rose-400">
                {submitError.errors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border-strong px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddTransactionModal