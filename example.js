import dayjs from "dayjs";

const date = dayjs();

console.log(date.format("YYYY-MM-DD A")); // 2024-09-21 AM
console.log(date.format("HH:mm:ss A")); // 03:45:02 AM

console.log(date.format("YYYY-MM-DD HH:mm:ss")); // 2024-09-21 03:45:02
console.log(date.format("YYYY/MM/DD HH:mm:ss")); // 2024/09/21 03:45:02
console.log(date.format("dddd, MMMM D, YYYY")); // Saturday, September 21, 2024

// Comparar si una fecha es el mismo día pero diferente hora:
console.log(dayjs("2024-09-20 12:00:00").isSame("2024-09-20 18:00:00", "day")); // true
console.log(dayjs("2024-09-20 12:00:00").isSame("2024-09-21 18:00:00", "day")); // false
