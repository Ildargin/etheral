import clsx from 'clsx'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  scrollX?: boolean
  scrollY?: boolean
}

export const DataBoxContents = ({ children, scrollX = false, scrollY = false, ...rest }: Props) => (
  <div
    className={clsx(
      'data-box-contents',
      scrollX && 'data-box-contents-scroll-x',
      scrollY && 'data-box-contents-scroll-y',
    )}
    {...rest}
  >
    {children}
  </div>
)
