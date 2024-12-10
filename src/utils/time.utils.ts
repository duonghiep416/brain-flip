export const parseDurationToMilliseconds = (duration: string): number => {
  const regex = /^(\d+)([smhd])$/; // Match số và đơn vị thời gian (s, m, h, d)
  const match = duration.match(regex);

  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const value = parseInt(match[1], 10); // Lấy số lượng thời gian
  const unit = match[2]; // Lấy đơn vị thời gian

  switch (unit) {
    case 's': // giây
      return value * 1000;
    case 'm': // phút
      return value * 60 * 1000;
    case 'h': // giờ
      return value * 60 * 60 * 1000;
    case 'd': // ngày
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`Invalid time unit in duration: ${unit}`);
  }
};
