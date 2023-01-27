import './component.scss'

type Props = React.HTMLAttributes<HTMLDivElement>

export const Table = ({ children, ...rest }: Props) => (
  <table className="table" {...rest}>
    {children}
  </table>
)
