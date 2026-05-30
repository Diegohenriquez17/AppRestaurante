export function SyncBanner({ text, warning = false }) {
  return <div className={warning ? 'sync-banner sync-banner-warning' : 'sync-banner'}>{text}</div>
}
