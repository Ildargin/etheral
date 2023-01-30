import { useNavigate } from 'react-router-dom'
import { Button } from '../button'

type Props = React.HTMLAttributes<HTMLButtonElement> & { link: string }
type Event = React.MouseEvent<HTMLButtonElement, MouseEvent>

export const RedirectButton = ({ link, ...baseProps }: Props) => {
  const navigate = useNavigate()

  const navigateToTx = (event: Event) => {
    if (baseProps.onClick) {
      baseProps.onClick(event)
    }
    navigate(link)
  }

  return <Button {...baseProps} onClick={navigateToTx} />
}
