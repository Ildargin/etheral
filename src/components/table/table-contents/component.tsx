type Props = React.HTMLAttributes<HTMLTableSectionElement>

export const TableContents = ({ children, ...rest }: Props) => (
  <tbody className="table-contents" {...rest}>
    {children}
  </tbody>
)
