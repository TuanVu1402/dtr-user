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
