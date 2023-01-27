type Props = React.HTMLAttributes<HTMLTableRowElement>

export const TableRow = ({ children, ...rest }: Props) => (
  <tr className="table-contents-row" {...rest}>
    {children}
  </tr>
)
