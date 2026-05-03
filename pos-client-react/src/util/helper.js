import dayjs from "dayjs";
import "dayjs/locale/km";

export const dateClient = (date, format = "DD-MM-YYYY") => {
  if (date) {
    // កំណត់ប្រើភាសាខ្មែរ
    return dayjs(date).locale("km").format(format);
  }
  return null;
};
