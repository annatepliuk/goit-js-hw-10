import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Отримуємо елементи
const startBtn = document.querySelector("[data-start]");
startBtn.disabled = true;
const input = document.querySelector("#datetime-picker");

const daysSpan = document.querySelector("[data-days]");
const hoursSpan = document.querySelector("[data-hours]");
const minutesSpan = document.querySelector("[data-minutes]");
const secondsSpan = document.querySelector("[data-seconds]");

// Стартові змінні
let userSelectedDate;
let timerId;

// Функції
function pad(value) {
  return String(value).padStart(2, "0");
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateUI({ days, hours, minutes, seconds }) {
  daysSpan.textContent = pad(days);
  hoursSpan.textContent = pad(hours);
  minutesSpan.textContent = pad(minutes);
  secondsSpan.textContent = pad(seconds);
}

// Flatpickr ініціалізація
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selected = selectedDates[0];
    if (selected <= Date.now()) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
      });
      startBtn.disabled = true;
      return;
    }

    userSelectedDate = selected;
    startBtn.disabled = false;
  },
};
flatpickr("#datetime-picker", options);


// Обробник кнопки Start
startBtn.addEventListener("click", () => {
  if (!userSelectedDate) return;

  startBtn.disabled = true;
  input.disabled = true;

  timerId = setInterval(() => {
    const timeLeft = userSelectedDate - Date.now();

    if (timeLeft <= 0) {
      clearInterval(timerId);
      updateUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      input.disabled = false;
      return;
    }

    const timeObj = convertMs(timeLeft);
    updateUI(timeObj);
  }, 1000);
});


