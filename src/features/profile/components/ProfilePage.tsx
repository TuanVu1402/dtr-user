import { useMemo, useState } from 'react'
import { UserNavbar, Footer } from '@/components'
import { CURRENT_USER_NAME } from '@/data/currentUser'
import { useSubmissions } from '@/context/SubmissionsContext'
import { ProfileForm, PasswordForm, ProfileStats } from './'

// Cùng số liệu minh hoạ với UserHomePage — trang này chưa có API thật nên khai báo lại tại chỗ.
const totalPoints = 128
const tierName = 'Hạng Kim Cương'
const nextTierAt = 160

export default function ProfilePage() {
  const { submissions, users } = useSubmissions()
  const myEntries = useMemo(
    () => submissions.filter((s) => s.userName === CURRENT_USER_NAME),
    [submissions],
  )
  const approvedCount = myEntries.filter((s) => s.status === 'approved').length
  const pendingCount = myEntries.filter((s) => s.status === 'pending').length
  const approvalRate = myEntries.length ? Math.round((approvedCount / myEntries.length) * 100) : 0
  const pointsToNextTier = Math.max(0, nextTierAt - totalPoints)

  const currentUser = users.find((u) => u.name === CURRENT_USER_NAME)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentUser?.avatarUrl ?? null)

  return (
    <div className="min-h-svh bg-[radial-gradient(1100px_480px_at_85%_-10%,var(--bg-glow),transparent_60%),linear-gradient(180deg,var(--bg-1)_0%,var(--bg-2)_40%,var(--bg-3)_100%)] pb-14 text-(--text-primary)">
      <UserNavbar active="profile" />

      <section className="flex flex-col items-start gap-3.5 px-11 pt-10 max-[900px]:px-6 max-[640px]:px-5">
        <div className="inline-flex items-center rounded-full bg-[linear-gradient(90deg,var(--gold-deep),var(--gold))] px-5 py-2 font-['Open_Sans',sans-serif] text-xs font-extrabold tracking-[1.6px] text-(--on-gold)">
          HỒ SƠ CỦA BẠN
        </div>
        <h1 className="m-0 font-['Open_Sans',sans-serif] text-[30px] font-extrabold tracking-[0.5px] text-(--text-primary)">
          Hồ sơ cá nhân
        </h1>
        <p className="m-0 text-sm font-medium text-(--text-tertiary)">
          Xem thành tích và cập nhật thông tin tài khoản DTR của bạn.
        </p>
      </section>

      <section className="flex flex-col gap-5 px-11 pt-6.5 max-[640px]:px-5">
        <div className="relative flex flex-wrap items-center gap-5 overflow-hidden rounded-xl border border-[rgba(37,99,235,0.28)] bg-(--surface-1) px-7.5 py-6.5 shadow-[0_16px_36px_var(--shadow)] before:pointer-events-none before:absolute before:-top-[120px] before:-right-[100px] before:h-[280px] before:w-[280px] before:rounded-full before:bg-[radial-gradient(circle,rgba(169,127,47,0.16),transparent_70%)] before:content-[''] dark:bg-[linear-gradient(135deg,rgba(37,99,235,0.1),color-mix(in_srgb,var(--surface-1)_40%,transparent))]">
          <div className="flex flex-col items-end gap-1 rounded-lg border border-[rgba(37,99,235,0.4)] bg-[rgba(37,99,235,0.14)] px-4.5 py-2.5 font-['Open_Sans',sans-serif] text-sm font-extrabold whitespace-nowrap text-(--gold-bright) max-[640px]:items-start">
            {tierName}
            <span className="font-['Open_Sans',sans-serif] text-[11.5px] font-semibold text-(--text-tertiary)">
              Còn <b className="text-(--gold-bright)">{pointsToNextTier} điểm</b> để lên Hạng Vương Miện
            </span>
          </div>
        </div>

        <ProfileStats
          totalPoints={totalPoints}
          approvedCount={approvedCount}
          pendingCount={pendingCount}
          approvalRate={approvalRate}
        />

        <div className="grid grid-cols-2 items-start gap-5 max-[960px]:grid-cols-1">
          <ProfileForm
            initialName={CURRENT_USER_NAME}
            initialEmail="an.nguyen@dtr.vn"
            initialPhone="0909 123 456"
            initialBranch="Chi nhánh Hà Nội"
            avatarUrl={avatarUrl}
            onAvatarChange={setAvatarUrl}
            onSave={() => {}}
          />

          <PasswordForm onSave={() => {}} />
        </div>
      </section>

      <Footer />
    </div>
  )
}
