import { useEffect, useState } from 'react'
import Base from './base'
import { apiFetch } from '../utils/api'

// bank page with a button to import transactions from the backend
export default function Bank() {
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadBankData() {
    setError('')
    setMessage('')

    if (!localStorage.getItem('token')) {
      setError('please log in before checking bank data')
      return
    }

    const [accountsRes, txRes] = await Promise.all([
      apiFetch('/api/bank/accounts'),
      apiFetch('/api/bank/transactions'),
    ])

    if (accountsRes.ok) {
      const accountsData = await accountsRes.json()
      setAccounts(accountsData)
    } else {
      const data = await accountsRes.json()
      setError(data.error || 'failed to load bank accounts')
    }

    if (txRes.ok) {
      const txData = await txRes.json()
      setTransactions(txData)
    } else {
      const data = await txRes.json()
      setError(data.error || 'failed to load bank transactions')
    }
  }

  useEffect(() => {
    loadBankData()
  }, [])

  async function handleImport() {
    setMessage('')
    setError('')

    const response = await apiFetch('/api/bank/import', { method: 'POST' })
    const data = await response.json()

    if (response.ok) {
      setMessage(`Imported ${data.imported} transactions (${data.skipped} skipped).`)
      loadBankData()
      return
    }

    setError(data.error || 'Unable to import transactions. Please log in first.')
  }

  return (
    <Base title="Bank" header="Bank Accounts">
      <section className="bank-accounts">
        <h2>Connected Accounts</h2>
        {accounts.length ? (
          <table>
            <thead>
              <tr>
                <th>Account</th>
                <th>Balance</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account._id || account.id || account.name}>
                  <td>{account.name || account.nickname || 'Account'}</td>
                  <td>${account.balance?.current?.toFixed?.(2) ?? '0.00'}</td>
                  <td>{account.type || account.account_type || 'Unknown'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No accounts found.</p>
        )}
      </section>

      <section className="bank-transactions">
        <h2>Recent Transactions</h2>
        <button className="other-btn" type="button" onClick={handleImport}>
          Import All Transactions
        </button>
        {message && <p className="form-success">{message}</p>}
        {error && <p className="form-error">{error}</p>}

        {transactions.length ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, index) => (
                <tr key={t._id || t.id || index}>
                  <td>{t.date?.slice?.(0, 10) ?? 'unknown'}</td>
                  <td>{t.description || t.merchant_name || 'transaction'}</td>
                  <td>${Math.abs(t.amount ?? 0).toFixed(2)}</td>
                  <td>{t.type || 'unknown'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions found.</p>
        )}
      </section>
    </Base>
  )
}
