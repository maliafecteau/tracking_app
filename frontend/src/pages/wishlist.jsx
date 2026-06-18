import Base from './base'

export default function Wishlist() {
  return (
    <Base title="Wishlist" header="Your Wishlist">
      <p>Here you can view and manage your wishlist items.</p>
      <table className="wishlist-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>New Laptop</td>
            <td>$1200.00</td>
            <td>Need</td>
          </tr>
          <tr>
            <td>Headphones</td>
            <td>$200.00</td>
            <td>Want - Low</td>
          </tr>
          <tr>
            <td>Smartphone</td>
            <td>$800.00</td>
            <td>Want - High</td>
          </tr>
        </tbody>
      </table>
    </Base>
  )
}
