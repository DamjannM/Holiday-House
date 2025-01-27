const header = document.querySelector(".header");
const aboutUs = document.querySelector("#about__us");
const nav = document.querySelector(".nav");
const navHeight = nav.getBoundingClientRect().height;

//STICKY NAVIGATION BAR
const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// CALENDAR

const currentDate = document.querySelector(".current-date");
daysTag = document.querySelector(".days");
prevNextIcon = document.querySelectorAll(".icons span");

let date = new Date();
currYear = date.getFullYear();
currMonth = date.getMonth();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const renderCalendar = () => {
  let firstDayofMonth = new Date(currYear, currMonth, 0).getDay(); //getting first day of month
  lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(); //getting last date of month
  lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(); //getting last day of month
  lastDayofLastMonth = new Date(currYear, currMonth, 0).getDate(); //getting last date of previous month
  let liTag = "";

  // creating li of last days of previous month
  for (let i = firstDayofMonth; i > 0; i--) {
    liTag += `<li class="inactive">${lastDayofLastMonth - i + 1}</li>`;
  }

  // creating li of all days of current month
  for (let i = 1; i <= lastDateofMonth; i++) {
    let isToday =
      i === date.getDate() &&
      currMonth === new Date().getMonth() &&
      currYear === new Date().getFullYear()
        ? "active"
        : "";
    liTag += `<li class="${isToday}">${i}</li>`;
  }

  // creating li of next month first days
  for (let i = lastDayofMonth; i < 7; i++) {
    liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
  }

  currentDate.innerHTML = `${months[currMonth]} ${currYear}`;
  daysTag.innerHTML = liTag;
};
renderCalendar();

prevNextIcon.forEach((icon) => {
  icon.addEventListener("click", () => {
    currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

    if (currMonth < 0 || currMonth > 11) {
      date = new Date(currYear, currMonth);
      currYear = date.getFullYear();
      currMonth = date.getMonth();
    } else {
      date = new Date();
    }
    renderCalendar();
  });
});
