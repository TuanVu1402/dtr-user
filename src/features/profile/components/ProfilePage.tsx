import { useMemo, useState } from 'react'
import { UserNavbar, Footer } from '@/components'
import { CURRENT_USER_NAME } from '@/data/currentUser'
import { categories, pointBreakdown } from '@/data/dtrData'
import { useSubmissions } from '@/context/SubmissionsContext'
import { ProfileForm, PasswordForm, ProfileStats, PointsBreakdown } from './'

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
  const [passwordOpen, setPasswordOpen] = useState(false)

  return (
    <div className="min-h-svh bg-[var(--bg-1)] pb-16">
      <UserNavbar active="profile" />

      <div className="px-4 pt-6 md:px-6 md:pt-8 lg:px-8">
        <div className="mx-auto max-w-3xl lg:max-w-4xl xl:max-w-5xl">
          <h1 className="text-xl font-semibold text-[var(--text-primary)] md:text-2xl lg:text-3xl">Hồ sơ cá nhân</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)] md:text-base">Xem thành tích và cập nhật thông tin tài khoản.</p>

          <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-[var(--hairline)] bg-[var(--surface-1)] px-4 py-3 md:mt-6 md:px-6 md:py-4 lg:px-8 lg:py-5">
            <div>
              <div className="text-sm font-medium text-[var(--text-primary)] md:text-base lg:text-lg">{tierName}</div>
              <div className="text-xs text-[var(--text-muted)] md:text-sm lg:text-base">
                Còn <b className="text-[var(--gold-bright)]">{pointsToNextTier} điểm</b> để lên hạng
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[var(--gold-bright)] md:text-3xl lg:text-4xl">{totalPoints}</div>
              <div className="text-xs text-[var(--text-muted)] md:text-sm lg:text-base">điểm DTR</div>
            </div>
          </div>

          <div className="pt-5 md:pt-6">
            <ProfileStats
              approvedCount={approvedCount}
              pendingCount={pendingCount}
              approvalRate={approvalRate}
            />
          </div>

          <div className="pt-5 md:pt-6">
            <PointsBreakdown
              categories={categories}
              pointBreakdown={pointBreakdown}
              entries={myEntries}
            />
          </div>

          <div className="flex flex-col gap-4 pt-5 md:pt-6 lg:gap-6">
            <ProfileForm
              initialName={CURRENT_USER_NAME}
              initialEmail="an.nguyen@dongtayland.com"
              initialPhone="0909 123 456"
              initialRoom={currentUser?.room ?? 'Phòng Kinh doanh 1'}
              avatarUrl={avatarUrl}
              onAvatarChange={setAvatarUrl}
              onChangePassword={() => setPasswordOpen(true)}
              onSave={() => {}}
            />
            <PasswordForm open={passwordOpen} onClose={() => setPasswordOpen(false)} onSave={() => {}} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
