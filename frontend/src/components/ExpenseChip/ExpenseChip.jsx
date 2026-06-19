function ExpenseChip({ type, description, date, amount }) {
    return (
        <div className={`expense-chip ${type}`}>
            <h3>{description}</h3>
            <p>Date: {date}</p>
            <h4>-${amount.toFixed(2)}</h4>
        </div>
    )
}