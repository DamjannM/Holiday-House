const header = document.querySelector(".header");
const aboutUs = document.querySelector("#about__us");
const nav = document.querySelector(".nav");
const navHeight = nav.getBoundingClientRect().height;
const googleMap = document.querySelector("gmp-map");
const form = document.getElementById("form");
const dataName = document.querySelector("#data-name");
const dataLastName = document.querySelector("#data-lastname");
const dataEmail = document.querySelector("#data-email");
const dataPhone = document.querySelector("#data-phone");
const dataNights = document.querySelector("#data-nights");
const checkInInput = document.querySelector("#dayin");
const checkOutInput = document.querySelector("#dayout");
const currentDate = document.querySelector(".current-date");
const daysTag = document.querySelector(".days");
const prevNextIcon = document.querySelectorAll(".icons span");
const logoutBtn = document.querySelector(".logout__btn");
const loginBtn = document.querySelector(".login__btn");
const inputAdmin = document.querySelector("#admin");
const inputPin = document.querySelector("#pin");
const login = document.querySelector("#login");

const admin1 = {
  owner: "Vladimir Blagoev",
  username: "VB",
  pin: 1234,
};

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

let admin = false;
let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();
let clientData = [];
let selectedDate = null;
let bookedArr = [];
let isSelectedCheckIn = true;
let twoLetterCheckInInputValue;
let twoLetterMonthInput;
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

getBooking();
getData();

// ADD LISTENER FOR DAYS IN CALENDAR
const addListener = function () {
  const day = document.querySelectorAll(".datum");

  day.forEach((cell) => {
    cell.addEventListener("click", function () {
      if (this.classList.contains("selected")) {
        this.classList.remove("selected");
      } else {
        day.forEach((c) => c.classList.remove("selected"));
        this.classList.add("selected");
      }

      selectedDate = cell.textContent;

      //CONECTING CALENDAR WITH CHECK IN/OUT INPUT
      if (!admin) {
        if (isSelectedCheckIn) {
          day.forEach((c) => c.classList.remove("checkin"));

          this.classList.add("checkin");

          checkInInput.value = `${selectedDate}-${currMonth + 1}-${currYear}`;
          checkOutInput.value = "";
          let indexOfFirstSlash = checkInInput.value.indexOf("-");
          let indexOfSecondSlash = checkInInput.value.indexOf("-", 3);

          twoLetterCheckInInputValue = checkInInput.value.substring(0, 2);
          twoLetterMonthInput = checkInInput.value.substring(
            indexOfFirstSlash + 1,
            indexOfSecondSlash
          );
          //CLOSEST BOOKED DAY CLICKABLE AFTER CLICKING CHECKIN
          let nextElement = document.querySelectorAll(".booked");

          let nextBookedDay = Array.from(nextElement).find(
            (day) => +day.textContent > +selectedDate
          );
          //PREVENTION WHEN THERE IS NO BOOKED DAY AS NEXT ELEMENT
          if (nextBookedDay !== null && nextBookedDay !== undefined) {
            nextBookedDay.style.pointerEvents = "auto";
            nextBookedDay.style.cursor = "pointer";
          }

          // IF CHECKIN DAY IS 1 DIGIT NUMBER REMOVE -
          if (twoLetterCheckInInputValue.includes("-")) {
            twoLetterCheckInInputValue = twoLetterCheckInInputValue.substring(
              0,
              1
            );
          }
          isSelectedCheckIn = false;
        } else if (!isSelectedCheckIn) {
          console.log(currMonth + 1, twoLetterMonthInput);

          if (currMonth + 1 > +twoLetterMonthInput) {
            checkOutInput.value = `${selectedDate}-${
              currMonth + 1
            }-${currYear}`;
            this.classList.add("checkin");
            isSelectedCheckIn = true;
          } else if (+selectedDate > +twoLetterCheckInInputValue) {
            checkOutInput.value = `${selectedDate}-${
              currMonth + 1
            }-${currYear}`;
            this.classList.add("checkin");
            isSelectedCheckIn = true;
          } else {
            alert("Check-out date must be after Check-In date!!");
          }
        }
      }

      // RENDERING DATA FOR SELECTED DATE
      if (
        clientData.some(
          (day) => day.dayin === `${selectedDate}-${currMonth + 1}-${currYear}`
        )
      ) {
        const index = clientData.findIndex(
          (day) => day.dayin === `${selectedDate}-${currMonth + 1}-${currYear}`
        );
        dataName.value = clientData[index].fname;
        dataLastName.value = clientData[index].lname;
        dataEmail.value = clientData[index].email;
        dataPhone.value = clientData[index].phone;
        inSlashIndex = clientData[index].dayin.indexOf("-");
        outSlashIndex = clientData[index].dayout.indexOf("-");
        console.log(outSlashIndex);
        dataNights.value =
          clientData[index].dayout.substring(0, outSlashIndex) -
          clientData[index].dayin.substring(0, inSlashIndex);
      } else {
        dataName.value = null;
        dataLastName.value = null;
        dataEmail.value = null;
        dataPhone.value = null;
        dataNights.value = null;
      }
    });
  });
};

//SELECTING CHECK IN/OUT INPUT FIELD
checkInInput.addEventListener("click", () => (isSelectedCheckIn = true));
checkOutInput.addEventListener("click", () => (isSelectedCheckIn = false));

// FUNCTION FOR RENDERING CALENDAR
const renderCalendar = () => {
  let firstDayofMonth = new Date(currYear, currMonth, 0).getDay(), //getting first day of month
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), //getting last date of month
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), //getting last day of month
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
    // check if current day is booked
    if (bookedArr.includes(`${i}-${currMonth}-${currYear}`)) {
      liTag += `<li class="${isToday} datum ${i} booked">${i}</li>`;
    } else {
      liTag += `<li class="${isToday} datum ${i}">${i}</li>`;
    }
  }

  // creating li of next month first days
  for (let i = lastDayofMonth; i < 7; i++) {
    liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
  }

  currentDate.innerHTML = `${months[currMonth]} ${currYear}`;
  daysTag.innerHTML = liTag;
  addListener();

  //IF DAY IS BOOKED ITS UNCLICKABLE FOR CLIENT
  if (!admin) {
    const booked = document.querySelectorAll(".booked");
    booked.forEach((day) => {
      day.style.pointerEvents = "none";
      day.style.cursor = "none";
    });
  }
};
renderCalendar();

//PREVIOUS AND NEXT MONTH BUTTONS FOR CALENDAR RENDER
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

//ADMIN BUTTONS
const reserveButton = document.querySelector("#reserved");
reserveButton.addEventListener("click", function () {
  daySelected = document.querySelector(".selected");
  daySelected.classList.add("booked");
  daySelected.classList.remove("selected");
  bookedArr.push(`${selectedDate}-${currMonth}-${currYear}`);
  saveBooking();
});
const openButton = document.querySelector("#open");
openButton.addEventListener("click", function () {
  daySelected = document.querySelector(".selected");
  daySelected.classList.remove("booked");
  daySelected.classList.remove("selected");
  const index = bookedArr.indexOf(`${selectedDate}-${currMonth}-${currYear}`);
  bookedArr.splice(index, 1);
  saveBooking();
});

// LOCAL STORAGE FOR CALENDAR
function saveBooking() {
  localStorage.setItem("booking", JSON.stringify(bookedArr));
}
function getBooking() {
  //check if events are already saved in local storage then return event else nothing
  if (localStorage.getItem("booking") === null) {
    return;
  }
  bookedArr.push(...JSON.parse(localStorage.getItem("booking")));
}

//LOCAL STORAGE FOR FORM DATA
function saveData() {
  localStorage.setItem("clientData", JSON.stringify(clientData));
}
function getData() {
  //check if events are already saved in local storage then return event else nothing
  if (localStorage.getItem("clientData") === null) {
    return;
  }
  clientData.push(...JSON.parse(localStorage.getItem("clientData")));
}
// FORM SUBMIT
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(event.target);
  const formObject = {};

  formData.forEach((value, key) => {
    formObject[key] = value;
  });
  const dateInFirstSlash = formObject.dayin.indexOf("-");
  const dateInSecondSlash = formObject.dayin.indexOf("-", 3);
  console.log(formObject.dayin);
  clientData.push(formObject);

  dateInMonth =
    formObject.dayin.substring(dateInFirstSlash + 1, dateInSecondSlash) - 1;

  bookedArr.push(
    formObject.dayin.substring(0, dateInFirstSlash + 1) +
      dateInMonth +
      formObject.dayin.substring(dateInSecondSlash)
  );
  form.reset();
  saveData();
  saveBooking();
  renderCalendar();
  alert("Vaša rezervacija je prihvacena");
});
//--------------------------\

// Event listener for map
googleMap.addEventListener("click", () => {
  window.open("https://maps.app.goo.gl/GVjUfC6sCryhJA4e6");
});

// console.log(bookedArr);
// console.log(clientData);

//LOGIN FUNCTIONALITY

function loginFunction() {
  inputAdmin.value = "";
  inputPin.value = "";
  admin = true;
  inputAdmin.classList.add("hidden");
  inputPin.classList.add("hidden");
  loginBtn.classList.add("hidden");
  form.classList.add("hidden");
  logoutBtn.classList.remove("hidden");
  renderCalendar();
}
loginBtn.addEventListener("click", () => {
  if (inputAdmin.value == admin1.username && inputPin.value == admin1.pin)
    loginFunction();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (inputAdmin.value == admin1.username && inputPin.value == admin1.pin)
      loginFunction();
  }
});

logoutBtn.addEventListener("click", () => {
  admin = false;
  inputAdmin.classList.remove("hidden");
  inputPin.classList.remove("hidden");
  loginBtn.classList.remove("hidden");
  form.classList.remove("hidden");
  logoutBtn.classList.add("hidden");
  renderCalendar();
});

//PHOTO SLIDER
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
