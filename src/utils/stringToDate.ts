export function stringToDate(
  _date: string,
  _format: string,
  _delimiter: string
) {
  var formatLowerCase = _format.toLowerCase();
  var formatItems = formatLowerCase.split(_delimiter);
  var dateItems = _date.split(_delimiter);
  var monthIndex = formatItems.indexOf("mm");
  var dayIndex = formatItems.indexOf("dd");
  var yearIndex = formatItems.indexOf("yyyy");
  var month = parseInt(dateItems[monthIndex]);
  month -= 1;
  var formatedDate = new Date(
    Number.parseInt(dateItems[yearIndex]),
    month,
    Number.parseInt(dateItems[dayIndex])
  );
  return formatedDate;
}
