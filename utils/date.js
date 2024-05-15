import dayjs from "dayjs";
import "dayjs/locale/ru";
import customParseFormat from "dayjs/plugin/customParseFormat";

if (dayjs?.locale) dayjs.locale("ru");
dayjs.extend(customParseFormat);

export { dayjs };

export const formatDate = (date, schema = "D MMMM YYYY") => {
  return dayjs(date).format(schema);
};

export const formatDateForInput = (rawDate) => {
  return dayjs(rawDate).format("DD.MM.YYYY");
};

export const serialize = (rawDate, schema) => {
  if (schema) {
    return dayjs(rawDate, schema);
  }

  return dayjs(rawDate);
};

export const toUnix = (rawDate) => {
  return dayjs(rawDate).unix();
};

export const getMonth = (rawDate) => {
  const month = dayjs(rawDate).format("MMMM");
  return `${month[0].toUpperCase()}${month.slice(1, month.length)}`;
};

export const getYear = (rawDate) => {
  return dayjs(rawDate).format("YYYY");
};
