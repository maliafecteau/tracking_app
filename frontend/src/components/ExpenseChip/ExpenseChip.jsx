import './ExpenseChip.css'
import OptionsBtn from '../OptionsBtn'
import React from 'react'

export default function ExpenseChip({ itemId, type, description, date, amount, category, onDelete, onCategoryChange }) {
    return (
        <div className={`record-chip ${type}`}>
            <section  className="chip-section">
                <h3>{description}</h3>
                <p>Date: {date}</p>
            </section>
            {type === 'income' ? (
            <section className="flex-section">
                <h4>+${amount.toFixed(2)}</h4>
                <OptionsBtn 
                    idKey={itemId}
                    itemType={type}
                    onDelete={onDelete}
                    />
            </section>
            ) : (
            <section className="flex-section">
                <p className="category-tag">{category}</p>
                <h4>-${amount.toFixed(2)}</h4>
                <OptionsBtn 
                idKey={itemId}
                itemType={type}
                onDelete={onDelete}
                onCategoryChange={onCategoryChange}
                    />
            </section>
            )}
                
        </div>
    )
}
