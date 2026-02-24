import type { DialogApi, LoadingBarApi, MessageApi, ModalApi, NotificationApi } from 'naive-ui'

declare global {
  interface Window {
    $message: MessageApi
    $dialog: DialogApi
    $notification: NotificationApi
    $loadingBar: LoadingBarApi
    $modal: ModalApi
  }
}
