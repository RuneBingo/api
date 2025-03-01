declare global {
  interface Number {
    second: number;
    seconds: number;
    minute: number;
    minutes: number;
    hour: number;
    hours: number;
    day: number;
    days: number;
    week: number;
    weeks: number;
    month: number;
    months: number;
    year: number;
    years: number;

    secondMs: number;
    secondsMs: number;
    minuteMs: number;
    minutesMs: number;
    hourMs: number;
    hoursMs: number;
    dayMs: number;
    daysMs: number;
    weekMs: number;
    weeksMs: number;
    monthMs: number;
    monthsMs: number;
    yearMs: number;
    yearsMs: number;
  }
}

Object.defineProperties(Number.prototype, {
  second: {
    get() {
      return (this as number).valueOf();
    },
  },
  seconds: {
    get() {
      return (this as number).valueOf();
    },
  },
  secondMs: {
    get() {
      return (this as number).valueOf() * 1000;
    },
  },
  secondsMs: {
    get() {
      return (this as number).valueOf() * 1000;
    },
  },
  minute: {
    get() {
      return (this as number).valueOf() * 60;
    },
  },
  minutes: {
    get() {
      return (this as number).valueOf() * 60;
    },
  },
  minuteMs: {
    get() {
      return (this as number).valueOf() * 60 * 1000;
    },
  },
  minutesMs: {
    get() {
      return (this as number).valueOf() * 60 * 1000;
    },
  },
  hour: {
    get() {
      return (this as number).valueOf() * 3600;
    },
  },
  hours: {
    get() {
      return (this as number).valueOf() * 3600;
    },
  },
  hourMs: {
    get() {
      return (this as number).valueOf() * 3600 * 1000;
    },
  },
  hoursMs: {
    get() {
      return (this as number).valueOf() * 3600 * 1000;
    },
  },
  day: {
    get() {
      return (this as number).valueOf() * 86400;
    },
  },
  days: {
    get() {
      return (this as number).valueOf() * 86400;
    },
  },
  dayMs: {
    get() {
      return (this as number).valueOf() * 86400 * 1000;
    },
  },
  daysMs: {
    get() {
      return (this as number).valueOf() * 86400 * 1000;
    },
  },
  week: {
    get() {
      return (this as number).valueOf() * 604800;
    },
  },
  weeks: {
    get() {
      return (this as number).valueOf() * 604800;
    },
  },
  weekMs: {
    get() {
      return (this as number).valueOf() * 604800 * 1000;
    },
  },
  weeksMs: {
    get() {
      return (this as number).valueOf() * 604800 * 1000;
    },
  },
  month: {
    get() {
      return (this as number).valueOf() * 2629746; // Approximation considering year leap (30.436875 days)
    },
  },
  months: {
    get() {
      return (this as number).valueOf() * 2629746;
    },
  },
  monthMs: {
    get() {
      return (this as number).valueOf() * 2629746 * 1000;
    },
  },
  monthsMs: {
    get() {
      return (this as number).valueOf() * 2629746 * 1000;
    },
  },
  year: {
    get() {
      return (this as number).valueOf() * 31556952; // Approximation considering year leap (365.2425 days)
    },
  },
  years: {
    get() {
      return (this as number).valueOf() * 31556952;
    },
  },
  yearMs: {
    get() {
      return (this as number).valueOf() * 31556952 * 1000;
    },
  },
  yearsMs: {
    get() {
      return (this as number).valueOf() * 31556952 * 1000;
    },
  },
});

export {};
