import type { Toast } from '@contexts'

export type ToastContainerProps = {
  messages: Toast[]
  handleClose: (id: string) => void
}
