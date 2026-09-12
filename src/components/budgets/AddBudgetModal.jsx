// import { useState, useEffect } from 'react'
// import Modal from '../ui/Modal'
// import { validateBudgetForm } from '../../utils/budgetValidation'

// const ALL_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Health']

// // existingCategories = categories the user ALREADY has a budget for —
// // excluded from the picker in Add mode (the backend would reject a
// // duplicate anyway, but filtering here avoids a round-trip failure
// // for something the UI can prevent up front).
// function AddBudgetModal({ isOpen, onClose, onAddBudget, onUpdateBudget, budget, existingCategories }) {
//   const mode = budget ? 'edit' : 'add'

//   const availableCategories = mode === 'add'
//     ? ALL_CATEGORIES.filter((category) => !existingCategories.includes(category))
//     : ALL_CATEGORIES

//   const [formData, setFormData] = useState({ category: availableCategories[0] || '', limit: '' })
//   const [errors, setErrors] = useState({})
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [submitError, setSubmitError] = useState(null)

//   useEffect(() => {
//     if (budget) {
//       setFormData({ category: budget.category, limit: String(budget.limit) })
//     } else {
//       setFormData({ category: availableCategories[0] || '', limit: '' })
//     }
//     setErrors({})
//     setSubmitError(null)
//     // availableCategories is intentionally not a dependency — it's
//     // recomputed fresh each render from props, and including it would
//     // cause this effect to re-run on every render.
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [budget, isOpen])

//   function handleChange(event) {
//     const { name, value } = event.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   async function handleSubmit(event) {
//     event.preventDefault()
//     const validationErrors = validateBudgetForm(formData)
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors)
//       return
//     }

//     setSubmitError(null)
//     setIsSubmitting(true)

//     try {
//       const payload = { category: formData.category, limit: Number(formData.limit) }
//       if (mode === 'edit') {
//         await onUpdateBudget(budget._id, payload)
//       } else {
//         await onAddBudget(payload)
//       }
//       onClose()
//     } catch (error) {
//       setSubmitError(error)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title={mode === 'edit' ? 'Edit Budget' : 'Create Budget'}>
//       <form className="space-y-4" onSubmit={handleSubmit} noValidate>
//         <div>
//           <label htmlFor="category" className="block text-sm font-medium text-slate-700">
//             Category
//           </label>
//           <select
//             id="category"
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             disabled={mode === 'edit'}
//             className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:bg-gray-50 disabled:text-slate-400"
//           >
//             {availableCategories.map((category) => (
//               <option key={category} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
//           {errors.category && <p className="mt-1 text-xs text-rose-600">{errors.category}</p>}
//         </div>

//         <div>
//           <label htmlFor="limit" className="block text-sm font-medium text-slate-700">
//             Monthly Limit
//           </label>
//           <input
//             id="limit"
//             name="limit"
//             type="number"
//             value={formData.limit}
//             onChange={handleChange}
//             placeholder="0.00"
//             className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
//           />
//           {errors.limit && <p className="mt-1 text-xs text-rose-600">{errors.limit}</p>}
//         </div>

//         {submitError && (
//           <div role="alert" aria-live="polite" className="rounded-lg bg-rose-50 p-3">
//             <p className="text-sm font-medium text-rose-700">{submitError.message}</p>
//           </div>
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
//             className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Budget'}
//           </button>
//         </div>
//       </form>
//     </Modal>
//   )
// }

// export default AddBudgetModal










import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import { validateBudgetForm } from '../../utils/budgetValidation'
import { useSettings } from '../../context/SettingsContext'
import { CURRENCY_OPTIONS } from '../../utils/currency'
import { BUDGET_CATEGORIES } from '../../config/budgetConfig'

function AddBudgetModal({ isOpen, onClose, onAddBudget, onUpdateBudget, budget, existingCategories }) {
  const mode = budget ? 'edit' : 'add'

  const availableCategories = mode === 'add'
    ? BUDGET_CATEGORIES.filter((category) => !existingCategories.includes(category))
    : BUDGET_CATEGORIES

  const [formData, setFormData] = useState({ category: availableCategories[0] || '', limit: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const { settings } = useSettings()
  const currencySymbol =
    (CURRENCY_OPTIONS.find((c) => c.code === settings?.currency) || CURRENCY_OPTIONS[0]).symbol

  useEffect(() => {
    if (budget) {
      setFormData({ category: budget.category, limit: String(budget.limit) })
    } else {
      setFormData({ category: availableCategories[0] || '', limit: '' })
    }
    setErrors({})
    setSubmitError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budget, isOpen])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validateBudgetForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const payload = { category: formData.category, limit: Number(formData.limit) }
      if (mode === 'edit') {
        await onUpdateBudget(budget.id, payload)
      } else {
        await onAddBudget(payload)
      }
      onClose()
    } catch (error) {
      setSubmitError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'edit' ? 'Edit Budget' : 'Create Budget'}>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-text-secondary">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={mode === 'edit'}
            className="mt-1.5 w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-text-secondary focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-500/30 disabled:bg-surface-muted disabled:text-text-muted"
          >
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="limit" className="block text-sm font-medium text-text-secondary">
            Monthly Limit
          </label>
          <div className="relative mt-1.5">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
              {currencySymbol}
            </span>
            <input
              id="limit"
              name="limit"
              type="number"
              value={formData.limit}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full rounded-lg border border-border-strong bg-surface py-2 pl-7 pr-3 text-sm text-text-secondary placeholder:text-text-muted focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-500/30"
            />
          </div>
          {errors.limit && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.limit}</p>}
        </div>

        {submitError && (
          <div role="alert" aria-live="polite" className="rounded-lg bg-rose-50 dark:bg-rose-500/10 p-3">
            <p className="text-sm font-medium text-rose-700 dark:text-rose-400">{submitError.message}</p>
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
            {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Budget'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddBudgetModal