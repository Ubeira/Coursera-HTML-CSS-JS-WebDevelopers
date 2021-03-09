function init() {
  console.log('Iniciado');
  weather();
}
//Selecciono el contenedor donde pondré mi información
const container = document.getElementById('principal');

//Creo un fragmento de documento
let deNode = document.createDocumentFragment();

//Para acceder a los datos desde cualquier funcion la declaro fuera
let data;

/**
 * @returns data: Object with data of Weather:{current,daily,hourly}
 */
function weather() {
  console.log('datos');
  /**
   * @param {pos} pos información dada por navigator.geolocation.getCurrentPostition
   * @return objeto con latitud y longitud
   */
  function success(pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    nextWeather(lat, lon);
    const coordenadas = { lat, lon };
    return coordenadas;
  }
  //Pedimos la posición por geolocalizacion
  navigator.geolocation.getCurrentPosition(success);

  async function nextWeather(lat, lon) {
    const apiKey = 'ac02c95825bad032592c02e18f66ee5f';
    const lang = window.navigator.language.slice(0, -3);
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&lang=${lang}&units=metric&appid=${apiKey}`
    );
    data = await response.json();
    console.log(data);
    return data;
  }
}

function today() {
  let todayArray = [];
  let max = { temp: -100, hour: '' };
  let min = { temp: 100, hour: '' };

  //  almaceno en un array de arrays el tiempo la temperatura
  for (let i = 0; i < 23; i++) {
    todayArray = [
      ...todayArray,
      {
        hours: new Date(data.hourly[i].dt * 1000).getHours(),
        temp: data.hourly[i].temp,
      },
    ];
    if (max.temp < data.hourly[i].temp) {
      max.temp = data.hourly[i].temp;
      max.hour = new Date(data.hourly[i].dt * 1000).getHours();
    }
    if (min.temp > data.hourly[i].temp) {
      min.temp = data.hourly[i].temp;
      min.hour = new Date(data.hourly[i].dt * 1000).getHours();
    }
  }
  //Creo un canvas donde pondré la gráfica
  const canvas = document.createElement('canvas');
  updateCanvas(canvas, todayArray, max, min);
  deNode.appendChild(canvas);
  container.appendChild(deNode);
}

function tomorrow() {
  console.log('mañana');
  console.log(data.hourly);
}

function week() {
  console.log(data.daily);
  console.log('semana');
}

const canvasPadding = 25;
let wid;
let hei;

function updateCanvas(canvas, dataArray, max, min) {
  const context = canvas.getContext('2d');
  wid = canvas.width;
  hei = canvas.height;
  //Fondo del canvas
  context.fillStyle = 'lightblue';
  context.strokeStyle = 'black';
  context.fillRect(0, 0, wid, hei);
  context.font = '10p Verdana,sans-serif';
  context.fillStyle = '#999999';

  context.moveTo(canvasPadding, canvasPadding);
  context.lineTo(canvasPadding, hei - canvasPadding);
  context.lineTo(wid - canvasPadding, hei - canvasPadding);
  fillCanvas(context, max, min, hei, wid);
  createBars(context, dataArray, max, min);
}
let graphWidth;
let graphHeight;
function fillCanvas(context, max, min, hei, wid) {
  //EjeY
  const yData = { min: min.temp - 2, max: max.temp + 2 };
  let steps = 6; //Math.ceil(yData.max - yData.min);
  const startY = canvasPadding;
  const endY = hei - canvasPadding;
  graphHeight = endY - startY;
  let currentY;
  let rangeLength = yData.max - yData.min;
  let stepSize = rangeLength / steps;

  context.textAlign = 'left';
  for (let i = 0; i < steps; i++) {
    currentY = startY + (i / steps) * graphHeight;
    console.log(yData.min + stepSize * (steps - i));
    context.moveTo(wid - canvasPadding, currentY);
    context.lineTo(canvasPadding, currentY);
    context.fillText(
      (yData.min + stepSize * (steps - i)).toFixed(1),
      0,
      currentY + 4
    );
  }
  currentY = startY + graphHeight;
  context.moveTo(canvasPadding, currentY);
  context.lineTo(canvasPadding / 2, currentY);
  //  context.fillText(yData.min, 0, currentY - 3);

  //EjeX
  const xData = { min: min.hour - 1, max: max.hour + 1 };
  steps = 10; // Math.ceil(xData.max - xData.min);
  const startX = canvasPadding;
  const endX = wid - canvasPadding;
  graphWidth = endX - startX;
  let currentX;
  rangeLength = xData.max - xData.min;
  stepSize = rangeLength / steps;
  context.textAlign = 'left';

  for (let i = 0; i < steps; i++) {
    currentX = startX + (i / steps) * graphWidth;
    context.moveTo(currentX, startY);
    context.lineTo(currentX, endY);
    context.fillText(
      `${(xData.min + stepSize * i).toFixed(0)} h`,
      currentX - 6,
      endY + canvasPadding / 2
    );
  }
  currentX = startX + graphWidth;
  context.moveTo(currentX, startY);
  context.lineTo(currentX, endY);
  //  context.fillText(xData.max, currentX - 3, endY + canvasPadding / 2);
  context.stroke();
}
function createBars(context, dataArray, max, min) {
  console.log('createBars');
  console.log(dataArray);
  const yDataLabel = 'T(ºC)';
  const xDataLabel = 'hora';
  const yDataRange = max.temp - min.temp;
  const xDataRange = max.hour - min.hour; //No estoy seguro de que sea correcto el rango...
  let yPos;
  let xPos;

  for (let i = 0; i < dataArray.length; i++) {
    xPos =
      canvasPadding +
      ((dataArray[i].hours - min.hour) / xDataRange) * graphWidth;
    yPos =
      hei -
      canvasPadding -
      ((dataArray[i].temp - min.temp) / yDataRange) * graphHeight;
    console.log(dataArray[i], min);
    if (dataArray[i].temp < 10) {
      context.fillStyle = 'blue';
    } else {
      context.fillStyle = 'red';
    }
    context.fillRect(xPos - 4, yPos - 4, 8, 8);
  }
}
