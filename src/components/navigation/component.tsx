import { Link } from 'react-router-dom'
import { AddressBox } from './address-box'
import './component.scss'

export const Navigation = () => {
  return (
    <nav className="navigation">
      <Link to="/">Etheral</Link>

      <AddressBox className="connect-btn" />
    </nav>
  )
}
