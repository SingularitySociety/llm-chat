import { cdate } from "cdate";

export const getStatisticsPath = (uid: string) => {
  const now = cdate();

  const date = now.tz("Asia/Tokyo").format("YYYYMMDD");
  const path = `users/${uid}/statistics/${date}`;
  return path;
};
