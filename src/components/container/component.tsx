import './component.scss'

type Props = React.HTMLAttributes<HTMLDivElement>

export const Container = ({ children, ...rest }: Props) => (
  <div className="container" {...rest}>
    {children}
  </div>
)
