export const formatDateForEasternTime = (date) => {
  let dateTime = new Date(date);
  let easternOffset = -240; // Eastern time is UTC-4
  if (dateTime.toString().includes("GMT-0500")) {
    easternOffset = -300; // Eastern time is UTC-5
  }
  const easternDateTime = new Date(
    dateTime.getTime() + easternOffset * 60 * 1000
  );
  return easternDateTime;
};
