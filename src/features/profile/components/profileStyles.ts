const fieldInputClass =
  "w-full rounded-[10px] border border-[rgba(37,99,235,0.25)] bg-(--surface-tint) px-3.5 py-[11px] font-['Open_Sans',sans-serif] text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--gold) focus:outline-none"

export const profileFieldStyles = {
  fieldInputClass,
  fieldLabelClass: 'text-[12.5px] font-bold text-(--text-secondary)',
  btnPrimaryClass:
    "min-h-11 cursor-pointer rounded-[10px] border-none bg-[linear-gradient(90deg,var(--gold-deep),var(--gold))] px-5 py-[11px] font-['Open_Sans',sans-serif] text-[13.5px] font-bold text-(--on-gold) shadow-[0_6px_16px_rgba(169,127,47,0.25)] transition-[transform,box-shadow,background,border-color] duration-150 hover:-translate-y-px hover:shadow-[0_10px_22px_rgba(169,127,47,0.35)]",
  statCardClass:
    'rounded-xl border border-[rgba(37,99,235,0.16)] bg-(--surface-1) px-5.5 py-5 shadow-[0_4px_14px_var(--shadow)] transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[0_14px_28px_var(--shadow-strong)]',
  profileCardClass:
    'flex flex-col gap-4 rounded-xl border border-[rgba(37,99,235,0.16)] bg-(--surface-1) p-6.5 shadow-[0_8px_24px_var(--shadow)]',
}
