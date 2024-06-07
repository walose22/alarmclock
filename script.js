
const main_container = document.getElementById("main_container");
const Time_container = document.getElementById("Time-container");
const time_display = document.getElementById("time-display");
const inputFields = document.querySelectorAll('.input');
const submit_btn = document.getElementById("submit");
const alarm_data = document.getElementById("alarm-data");
const field1 = document.getElementById("field1");
const field2 = document.getElementById("field2");
const field3 = document.getElementById("field3");
const field4 = document.getElementById("field4");
let alarms = [];

inputFields.forEach(input => {
    if(input.id !== "field4"){
    input.addEventListener("input", () => {
        let val = parseInt(input.value);
        if (isNaN(val) || val < parseInt(input.min) || val > parseInt(input.max)) {
            input.value = '';
            alert("Enter correct format");
        }
    });
}});
inputFields.forEach(input => {
    if (input.id !== "field4") {
        input.addEventListener("input", () => {
            let val = parseInt(input.value);
            if (isNaN(val) || val < parseInt(input.min) || val > parseInt(input.max)) {
                input.value = '';
                alert("Enter correct format");
            }
        });
    }
});
field1.addEventListener("input", () => {
    let val = parseInt(field1.value);
    if (isNaN(val) || val < 0 || val > 25) {
        field1.value = '';
        alert("Enter correct format for hours");
    } else {
        if (val < 12) {
            field4.value = 'AM';
        } else {
            field4.value = 'PM';
        }
    }
});
function updateClock() {
    time_display.innerHTML = "";
    let { hours, minutes, milli, fulltime } = getTime();
    let timepara = document.createElement("p");
    time_display.appendChild(timepara);
    timepara.textContent = fulltime;
    checkAlarm();
}

function getTime() {
    const d = new Date();
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let milli = d.getMilliseconds();
    let fulltime = d.toLocaleTimeString();

    if (hours < 10) {
        field1.setAttribute("value", `0${hours}`);
    } else {
        field1.setAttribute("value", hours);
    }
    field2.setAttribute("value", "00");
    field3.setAttribute("value", "00");
    if (hours <= 11)
        field4.setAttribute("value", "AM");
    else
        field4.setAttribute("value", "PM");
    return { hours, minutes, milli, fulltime };
}

const interval = setInterval(updateClock, 1000);

submit_btn.addEventListener("click", createAlarm);

function createAlarm() {
    let { hours, minutes, milli, fulltime } = getTime();
    let alarm_name = `${field1.value}:${field2.value}:${field3.value}:${field4.value}`;

    if (!alarms.find(alarm => alarm.id === alarm_name)) {
        const alarm_div = document.createElement("div");
        alarm_div.setAttribute("id", alarm_name);
        alarm_div.setAttribute("class", "alarmsd");
        const alarmpara = document.createElement("p");
        const deletebtn = document.createElement("button");
        deletebtn.textContent = "Delete Alarm";
        deletebtn.setAttribute("class", "alarmbutton");
        alarmpara.textContent = alarm_name;
        alarm_div.appendChild(alarmpara);
        alarm_div.appendChild(deletebtn);
        alarm_data.appendChild(alarm_div);
        alarms.push({ id: alarm_name });
        deletebtn.addEventListener("click", deleteAlarm);
        saveAlarmsToLocalStorage();
    } else {
        alert("Alarm already exists");
    }
}

function deleteAlarm(event) {
    let div = event.target.parentElement;
    let alarmName = div.id;
    div.remove();
    alarms = alarms.filter(alarm => alarm.id !== alarmName);
    saveAlarmsToLocalStorage();
}

function saveAlarmsToLocalStorage() {
    localStorage.setItem('alarms', JSON.stringify(alarms));
}

function loadAlarmsFromLocalStorage() {
    const storedAlarms = localStorage.getItem('alarms');

    if (storedAlarms) {
        alarms = JSON.parse(storedAlarms);
        alarm_data.innerHTML = "";
        alarms.forEach(alarm => {
            createAlarmElement(alarm);
        });
    }
}

window.addEventListener('load', loadAlarmsFromLocalStorage);

function createAlarmElement(alarm) {
    const alarm_div = document.createElement("div");
    alarm_div.setAttribute("id", alarm.id);
    alarm_div.setAttribute("class", "alarmsd");
    const alarmpara = document.createElement("p");
    const deletebtn = document.createElement("button");
    deletebtn.textContent = "Delete Alarm";
    deletebtn.setAttribute("class", "alarmbutton");
    alarmpara.textContent = alarm.id;
    alarm_div.appendChild(alarmpara);
    alarm_div.appendChild(deletebtn);
    alarm_data.appendChild(alarm_div);
    deletebtn.addEventListener("click", deleteAlarm);
}
function checkAlarm() {
    let { hours, minutes } = getTime();
    let currentTime = `${hours}:${minutes}`;
    alarms.forEach(alarm => {
        let alarmParts = alarm.id.split(":");
        let alarmHours = parseInt(alarmParts[0]);
        let alarmMinutes = parseInt(alarmParts[1]);
        
        // Convert alarm hours to 24-hour format if needed
        if (alarmParts[3] === 'PM' && alarmHours < 12) {
            alarmHours += 12;
        } else if (alarmParts[3] === 'AM' && alarmHours === 12) {
            alarmHours = 0;
        }
        
        // Compare the hours and minutes of the alarm with the current time
        if (alarmHours === hours && alarmMinutes === minutes) {
            alert("Alarm is ringing");
        }
    });
    setTimeout(checkAlarm,60000);   
}
