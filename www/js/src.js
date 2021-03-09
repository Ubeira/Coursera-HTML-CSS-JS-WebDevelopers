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
  //  data.hourly.map((hour) => {
  //    todayArray = [
  //      ...todayArray,
  //      { hours: new Date(hour.dt * 1000).getHours(), temp: hour.temp },
  //    ];

  console.log(min, max);
  console.log(todayArray);
  //Creo un canvas donde pondré la gráfica
  const canvas = document.createElement('canvas');
  updateCanvas(canvas, todayArray);
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

const canvasPadding = 20;

function updateCanvas(canvas, dataArray) {
  const wid = window.innerWidth;
  const hei = canvas.height;
  const context = canvas.getContext('2d');
  //Fondo del canvas
  context.fillStyle = 'lightblue';
  context.strokeStyle = 'black';
  context.fillRect(0, 0, wid, hei);
  context.font = '10p Verdana,sans-serif';
  context.fillStyle = '#999999';

  context.moveTo(canvasPadding, canvasPadding);
  context.lineTo(canvasPadding, hei - canvasPadding);
  context.lineTo(wid - canvasPadding, hei - canvasPadding);
  fillCanvas(context);
}
