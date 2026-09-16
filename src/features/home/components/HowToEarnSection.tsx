export default function HowToEarnSection() {
  const steps = [
    { title: 'Chọn hạng mục', detail: 'Tìm hoạt động bạn đã tham gia' },
    { title: 'Tải minh chứng', detail: 'Ảnh, clip hoặc quét QR tại chỗ' },
    { title: 'Chờ duyệt', detail: 'Admin xét duyệt và cộng điểm' },
  ]

  return (
    <section className="px-11 pt-10 max-[640px]:px-5">
      <div className="relative overflow-hidden rounded-xl border border-[rgba(37,99,235,0.2)] bg-(--surface-1) px-9 py-8 shadow-[0_14px_32px_var(--shadow)] dark:bg-[linear-gradient(135deg,rgba(37,99,235,0.1),color-mix(in_srgb,var(--surface-1)_45%,transparent))] max-[640px]:px-5 max-[640px]:py-6">
        <span className="pointer-events-none absolute top-0 left-0 h-full w-1 bg-[linear-gradient(180deg,var(--gold-deep),var(--gold))]" />
        <span className="pointer-events-none absolute -top-[110px] -right-[90px] h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.16),transparent_70%)]" />

        <div className="relative z-[1] flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex h-9 items-center gap-2 rounded-full bg-[linear-gradient(90deg,var(--gold-deep),var(--gold))] px-5 font-['Open_Sans',sans-serif] text-xs font-extrabold tracking-[1.6px] text-(--on-gold)">
              CÁCH GHI ĐIỂM
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <h1 className="m-0 max-w-[24ch] font-['Open_Sans',sans-serif] text-[34px] leading-[1.2] font-extrabold tracking-[0.3px] text-(--text-primary) max-[640px]:text-[26px]">
              Nộp minh chứng{' '}
              <span className="bg-[linear-gradient(90deg,var(--gold-deep),var(--gold-bright))] bg-clip-text text-transparent">
                nhận điểm DTR
              </span>
            </h1>
            <p className="m-0 max-w-[62ch] text-sm leading-[1.65] font-medium text-(--text-tertiary)">
              Chọn một hạng mục bên dưới và nộp minh chứng để admin xét duyệt điểm.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-(--hairline) pt-4.5 max-[760px]:grid-cols-1 max-[760px]:gap-2.5">
            {steps.map((step, index) => (
              <div className="flex items-center gap-3" key={step.title}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(37,99,235,0.3)] bg-[rgba(37,99,235,0.1)] font-['Open_Sans',sans-serif] text-[13px] font-extrabold text-(--gold-bright)">
                  {index + 1}
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="text-[13px] leading-[1.3] font-bold text-(--text-primary)">
                    {step.title}
                  </span>
                  <span className="text-[11.5px] leading-[1.35] text-(--text-tertiary)">
                    {step.detail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
