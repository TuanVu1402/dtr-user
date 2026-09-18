/** Booking / giao dịch chỉ nộp mô tả, không có ảnh minh chứng. */
export function isTextOnlyEvidence(categoryLabel: string): boolean {
  const n = categoryLabel.toLowerCase()
  return n.includes('booking') || n.includes('giao dịch') || n.includes('giaodich')
}

/** Gỡ ảnh giả / ảnh cũ khỏi hạng mục chỉ ghi nhận bằng mô tả. */
export function stripTextOnlyPhotos<T extends { categoryLabel: string; imageDataUrl?: string; appealImageDataUrl?: string }>(
  submission: T,
): T {
  if (!isTextOnlyEvidence(submission.categoryLabel)) return submission
  if (!submission.imageDataUrl && !submission.appealImageDataUrl) return submission
  return { ...submission, imageDataUrl: undefined, appealImageDataUrl: undefined }
}

/** Hiển thị số điểm theo kiểu Việt Nam, ví dụ 0.5 -> "0,5". */
export function formatPoints(points: number): string {
  return points.toString().replace('.', ',')
}

/** Chuyển tên có dấu thành chuỗi không dấu, dùng để gợi ý email mặc định. */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
}
