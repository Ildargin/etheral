type Props = React.HTMLAttributes<HTMLTableSectionElement>

export const TableHeader = ({ children, ...rest }: Props) => (
  <thead className="table-header" {...rest}>
    <tr className="table-header-row">{children}</tr>
  </thead>
)
