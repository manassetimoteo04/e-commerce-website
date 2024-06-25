class FormatNumbers {
  constructor() {}
  formatCurrency(number) {
    const numb = number;
    const options = {
      style: "currency",
      currency: "AOA",
    };
    return new Intl.NumberFormat("pt-AO", options).format(numb);
  }
  formatDates = function (now = new Date()) {
    const calculateDifference = (date1, date2, unit) => {
      const millisecondsPerUnit = {
        minute: 1000 * 60,
        hour: 1000 * 60 * 60,
        day: 1000 * 60 * 60 * 24,
      };
      return Math.round(Math.abs(date1 - date2) / millisecondsPerUnit[unit]);
    };

    const diffInDays = calculateDifference(new Date(), now, "day");
    if (diffInDays === 0) {
      const diffInHours = calculateDifference(new Date(), now, "hour");
      if (diffInHours === 0) {
        const diffInMinutes = calculateDifference(new Date(), now, "minute");
        if (diffInMinutes === 0) return "Agora mesmo";
        return `Há ${diffInMinutes} min`;
      }
      return `Há ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`;
    }
    if (diffInDays === 1) return "Ontem";
    if (diffInDays <= 7) return `Há ${diffInDays} dias`;
    return new Intl.DateTimeFormat("pt-PT").format(now);
  };
}

const FORMAT_NUMBERS = new FormatNumbers();
export { FORMAT_NUMBERS };
