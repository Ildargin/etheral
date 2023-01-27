import clsx from 'clsx'
import { FlexBox } from '../../components'
import './component.scss'

type Props = React.HTMLAttributes<HTMLInputElement> & {
  type?: 'text' | 'password'
  value?: string
  invertColor?: boolean
}

const InputBase = ({
  children,
  className,
  onChange,
  placeholder,
  type = 'text',
  invertColor = false,
  ...rest
}: Props) => (
  <>
    <input
      type={type}
      className={clsx(className, invertColor && 'invert-color')}
      placeholder={placeholder}
      onChange={onChange}
      {...rest}
    />
  </>
)

export const Input = ({ children, ...rest }: Props) => {
  return children ? (
    <FlexBox direction="col">
      <span style={{ fontSize: 16, margin: '10px 15px' }}>{children}</span>
      <InputBase {...rest} />
    </FlexBox>
  ) : (
    <InputBase {...rest} />
  )
}
