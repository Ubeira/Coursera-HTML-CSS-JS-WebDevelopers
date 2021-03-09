function init() {
  console.log('Iniciado');
  weather();
}
let data;
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
  console.log('hoy');
  console.log(data.hourly);
}

function tomorrow() {
  console.log('mañana');
  console.log(data.hourly);
}

function week() {
  console.log(data.daily);
  console.log('semana');
}
