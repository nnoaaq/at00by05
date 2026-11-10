export const convertTime = (timestamp: number) => {
  const dateObj = new Date(timestamp);
  return dateObj.toLocaleDateString("fi-FI", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
