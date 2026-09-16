const fieldInputClass =
  "w-full rounded-[10px] border border-[rgba(37,99,235,0.25)] bg-(--surface-tint) px-3.5 py-[11px] font-['Open_Sans',sans-serif] text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--gold) focus:outline-none"

export const authFieldStyles = {
  fieldInputClass,
  fieldLabelClass: 'text-[12.5px] font-bold text-(--text-secondary)',
  authSubmitClass:
    "min-h-[46px] cursor-pointer rounded-[10px] border-none bg-[linear-gradient(90deg,var(--gold-deep),var(--gold))] px-5 py-[13px] font-['Open_Sans',sans-serif] text-sm font-bold text-(--on-gold) shadow-[0_6px_16px_rgba(169,127,47,0.25)] transition-[transform,box-shadow] duration-150 hover:-translate-y-px hover:shadow-[0_10px_22px_rgba(169,127,47,0.35)]",
  authLinkBtnClass: 'cursor-pointer border-none bg-none p-0 font-inherit font-bold text-(--gold-bright)',
  authSwitchClass: 'm-0 text-center text-[13.5px] text-(--text-tertiary)',
}
