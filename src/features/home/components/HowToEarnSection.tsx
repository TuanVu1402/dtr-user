export default function HowToEarnSection() {
  const steps = [
    { title: 'Chọn hạng mục', detail: 'Tìm hoạt động bạn đã tham gia' },
    { title: 'Tải minh chứng', detail: 'Ảnh, clip hoặc quét QR tại chỗ' },
    { title: 'Chờ duyệt', detail: 'Admin xét duyệt và cộng điểm' },
  ]

  return (
    <section className="px-4 pt-4 md:px-6 md:pt-6 lg:px-6 lg:pt-6">
      <div className="mx-auto max-w-3xl rounded-xl border border-[var(--hairline)] bg-[var(--surface-1)] p-5 md:p-6 lg:p-8">
        <h2 className="m-0 mb-4 text-base font-semibold text-[var(--text-primary)] md:text-lg">
          Cách ghi điểm
        </h2>

        <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-4">
          {steps.map((step, index) => (
            <div className="flex items-center gap-3 md:flex-col md:text-center" key={step.title}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/[0.1] text-sm font-bold text-[var(--gold-bright)] md:h-10 md:w-10 md:text-base">
                {index + 1}
              </span>
              <div className="flex min-w-0 flex-col md:items-center">
                <span className="text-sm font-medium text-[var(--text-primary)] md:text-base">
                  {step.title}
                </span>
                <span className="text-xs text-[var(--text-muted)] md:text-sm">
                  {step.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
