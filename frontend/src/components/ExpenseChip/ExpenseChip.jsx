import './ExpenseChip.css'
import OptionsBtn from '../OptionsBtn'
import react from 'React'

export default function ExpenseChip({ itemId, type, description, date, amount, category }) {
    return (
        <div className={`record-chip ${type}`}>
            <section  className="chip-section">
                <h3>{description}</h3>
                <p>Date: {date}</p>
            </section>
            <p className="category-tag">{category}</p>
            <h4>-${amount.toFixed(2)}</h4>
            <OptionsBtn 
                idKey={itemId}
                itemType={type}/>
        </div>
    )
}
