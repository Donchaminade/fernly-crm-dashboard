export function FernMark({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M6 19c0-7.5 4.6-12.6 13-13.5-.6 7.7-5.6 12.8-13 13.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6 19 15 10M10.2 14.8l-.6-3.6M12.8 12.2l-.4-3M10.2 14.8l3.4.4M12.8 12.2l3 .2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
