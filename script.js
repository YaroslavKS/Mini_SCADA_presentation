const tempEl = document.getElementById("temperature");
const pressureEl = document.getElementById("pressure");
const speedEl = document.getElementById("speed");

const statusEls = document.querySelectorAll(".status");
const statusTempEl = statusEls[0];
const statusPressureEl = statusEls[1];
const statusSpeedEl = statusEls[2];

const MAX_POINTS = 35;
let isPaused = false;

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createChart(ctx, label, borderColor, suggestedMax) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label,
        data: [],
        borderColor,
        tension: 0.3,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: []
      }]
    },
    options: {
      animation: false,
      responsive: true,
      interaction: {
        mode: 'nearest',
        intersect: false
      },
      onHover(event, activeElements) {
        isPaused = activeElements.length > 0;
      },
      scales: {
        x: { display: true },
        y: {
          beginAtZero: true,
          suggestedMax
        }
      },
      plugins: {
        tooltip: { enabled: true },
        legend: { position: 'top' }
      }
    }
  });
}

const tempChart = createChart(document.getElementById("chart"), 'Temperature (°C)', 'red', 160);
const pressureChart = createChart(document.getElementById("chart2"), 'Pressure (kPa)', 'blue', 450);
const speedChart = createChart(document.getElementById("chart3"), 'Turbine Speed (RPM)', 'green', 3500);

["chart", "chart2", "chart3"].forEach(id =>
  document.getElementById(id).addEventListener("mouseout", () => isPaused = false)
);

function update() {
  if (isPaused) return;

  const temp = getRandom(110, 210);
  const pressure = getRandom(200, 400);
  const speed = getRandom(1000, 3000);

  statusTempEl.textContent = (temp < 125 || temp > 195) ? "⚠️ Warning!" : "✅ Normal";
  statusPressureEl.textContent = (pressure < 220 || pressure > 380) ? "⚠️ Warning!" : "✅ Normal";
  statusSpeedEl.textContent = (speed < 1200 || speed > 2800) ? "⚠️ Warning!" : "✅ Normal";

  tempEl.textContent = temp;
  pressureEl.textContent = pressure;
  speedEl.textContent = speed;

  const time = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true
  });

  tempChart.data.labels.push(time);
  tempChart.data.datasets[0].data.push(temp);
  tempChart.data.datasets[0].pointBackgroundColor.push(
    (temp < 125 || temp > 195) ? 'red' : 'green'
  );
  if (tempChart.data.labels.length > MAX_POINTS) {
    tempChart.data.labels.shift();
    tempChart.data.datasets[0].data.shift();
    tempChart.data.datasets[0].pointBackgroundColor.shift();
  }
  tempChart.update();

  const tempData = tempChart.data.datasets[0].data;
  const avgTemp = tempData.length ? tempData.reduce((sum, val) => sum + val, 0) / tempData.length : 0;
  document.getElementById("avg-temp").textContent = avgTemp.toFixed(1);

  pressureChart.data.labels.push(time);
  pressureChart.data.datasets[0].data.push(pressure);
  pressureChart.data.datasets[0].pointBackgroundColor.push(
    (pressure < 220 || pressure > 380) ? 'red' : 'green'
  );
  if (pressureChart.data.labels.length > MAX_POINTS) {
    pressureChart.data.labels.shift();
    pressureChart.data.datasets[0].data.shift();
    pressureChart.data.datasets[0].pointBackgroundColor.shift();
  }
  pressureChart.update();

  const pressureData = pressureChart.data.datasets[0].data;
  const avgPressure = pressureData.length ? pressureData.reduce((sum, val) => sum + val, 0) / pressureData.length : 0;
  document.getElementById("avg-pressure").textContent = avgPressure.toFixed(1);

  speedChart.data.labels.push(time);
  speedChart.data.datasets[0].data.push(speed);
  speedChart.data.datasets[0].pointBackgroundColor.push(
    (speed < 1200 || speed > 2800) ? 'red' : 'green'
  );
  if (speedChart.data.labels.length > MAX_POINTS) {
    speedChart.data.labels.shift();
    speedChart.data.datasets[0].data.shift();
    speedChart.data.datasets[0].pointBackgroundColor.shift();
  }
  speedChart.update();

  const speedData = speedChart.data.datasets[0].data;
  const avgSpeed = speedData.length ? speedData.reduce((sum, val) => sum + val, 0) / speedData.length : 0;
  document.getElementById("avg-speed").textContent = avgSpeed.toFixed(1);

  updateDiagram(temp, pressure, speed);
}

function updateDiagram(temp, pressure, speed) {
  const tempStatus = document.getElementById("sensor-temp-status");
  const pressureStatus = document.getElementById("sensor-pressure-status");
  const speedStatus = document.getElementById("sensor-speed-status");

  function setStatus(el, isWarning) {
    el.textContent = isWarning ? "⚠️ Warning" : "✅ OK";
    el.classList.toggle("warning", isWarning);
  }

  setStatus(tempStatus, temp < 125 || temp > 195);
  setStatus(pressureStatus, pressure < 220 || pressure > 380);
  setStatus(speedStatus, speed < 1200 || speed > 2800);
}

setInterval(update, 2000);
