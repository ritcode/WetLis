let SpeechRecognition = window.webkitSpeechRecognition || SpeechRecognition;
let voices = [];


let welcomeMsg = new SpeechSynthesisUtterance("Hi, This is weather listener web app that informs visually impaired users of weather information, press and hold the button in the middle of the screen and speak a city or state or country name or say my location then let go of the button");
window.speechSynthesis.speak(welcomeMsg);


let recognition = new SpeechRecognition();


var textbox = document.getElementById('textbox');
const instructions = document.getElementById('instructions');
let btnStart = document.getElementById('btnStart');

var Content = '';

recognition.continuous = true;


recognition.onstart = function() {
  textbox.value = '';
}

recognition.onresult = function(event) {

  let current = event.resultIndex;

  let transcript = event.results[current][0].transcript;

  Content += transcript;
  textbox.value = Content;
  let loc = textbox.value;
  getWeather(loc);

  Content = '';


}

recognition.onerror = function(event) {
  if (event.error == 'no-speech') {
    instructions.text('Try again.');
  }
}


// textbox.onchange = function() {
//   console.log("changed")
// }

// recognition.onspeechend = function() {
//   console.log("ended")
// }



btnStart.addEventListener("touchstart", function (e) {
  if (Content.length) {
    Content += ' ';
  }
  recognition.start();
});
btnStart.addEventListener("touchend",
  function (e) {
    recognition.stop();
  });


btnStart.addEventListener("mousedown", function (e) {
  if (Content.length) {
    Content += ' ';
  }
  recognition.start();
});
btnStart.addEventListener("mouseup",
  function (e) {
    recognition.stop();
  });

// var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// if (isMobile) {
//   // btnStart.addEventListener("touchstart", function (e) {
//   //   if (Content.length) {
//   //     Content += ' ';
//   //   }
//   //   recognition.start();
//   // });
//   // btnStart.addEventListener("touchend",
//   //   function (e) {

//   //     recognition.stop();
//   //   });
//   //   // IF mobile used with mouse
//   // btnStart.addEventListener("mousedown", function (e) {
//   //   if (Content.length) {
//   //     Content += ' ';
//   //   }
//   //   recognition.start();
//   // });
//   // btnStart.addEventListener("mouseup",
//   //   function (e) {
//   //     if (Content.length) {
//   //       Content += ' ';
//   //     }
//   //     recognition.stop();
//   //   });
// } else {
//   btnStart.addEventListener("mousedown", function (e) {
//     if (Content.length) {
//       Content += ' ';
//     }
//     recognition.start();
//   });
//   btnStart.addEventListener("mouseup",
//     function (e) {
//       recognition.stop();
//     });
// }


function getWeather(loc) {

  let key = "3dfeeaae4c096b0100e245f3f17c2355";
  if (loc == "my location") {

    if (!navigator.geolocation) {
      Alert('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }

    function success(position) {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;

      fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=" + key)
      .then(function(res) {
        return res.json()
      })
      .then(function (result) {
        console.log(result)
        showWeather(result);
      })
      .catch(function () {
        let err_message = new SpeechSynthesisUtterance("Unable to get weather of your location.");
        window.speechSynthesis.speak(err_message);
      });

      // fetch("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + lat + "&longitude=" + long + "&localityLanguage=en")
      // .then(function(res) {
      // return res.json()
      // })
      // .then(function (result) {
      //   console.log(result.locality)
      // })
      // .catch(function () {
      //   let err_message = new SpeechSynthesisUtterance("can't locate You");
      //   window.speechSynthesis.speak(err_message);
      // });
    }

    function error() {
      let err_message = new SpeechSynthesisUtterance('Unable to retrieve your location');
      window.speechSynthesis.speak(err_message);
    }

  } else {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + loc + "&appid=" + key)
    .then(function(res) {
      return res.json()
    })
    .then(function (result) {
      showWeather(result);
    })
    .catch(function () {
      let err_message = new SpeechSynthesisUtterance("Invalid Location name, please try again.");
      window.speechSynthesis.speak(err_message);
    });
  }
}


window.onload = function () {
  getWeather("Siliguri");
  disableSelection(document.getElementById('label'));

};


function showWeather(d) {
  let temp = Math.round(d.main.temp - 273.15);
  let feels_like = Math.round(d.main.feels_like - 273.15);
  let humidity = d.main.humidity; //in percent
  let city = d.name;
  let condition = d.weather[0].description;
  let id = d.weather[0].id;

  document.getElementById("description").innerHTML = condition;
  document.getElementById("temp").innerHTML = temp + "&deg;C";
  document.getElementById("feelsLike").innerHTML = "Feels like : " + feels_like + "&deg;C";
  document.getElementById("location").innerHTML = city;
  document.getElementById("humidity").innerHTML = "Humidity : " + humidity + " %";

  let moreDetails = ""
  //customized message
  if (id >= 200 && id <= 232) {
    moreDetails = "Thunderstorm Alert!!! You might wanna stay home today.";
  } else if (id >= 300 && id <= 531) {
    moreDetails = "It might rain today!!! Do not forget your umbrella.";
  } else if (id >= 600 && id <= 622) {
    moreDetails = "Chances of snow!!! Stay safe out there. Consider a jacket.";
  } else if (id >= 731 && id <= 771) {
    moreDetails = "Atmosphere not well today. Consider mask and Stay safe.";
  } else if (id === 781) {
    moreDetails = "Stay home. There's tornado outside.";
  } else {
    moreDetails = "Have a great day.";
  }


  let to_speak = new SpeechSynthesisUtterance("Today in " + city + "it is " + temp + "degrees celcius. feels like " + feels_like + "degree, with humidity " + humidity + " percent and " + condition + ". " + moreDetails);
  window.speechSynthesis.speak(to_speak);


  var iconcode = d.weather[0].icon;
  var iconurl = "http://openweathermap.org/img/wn/" + iconcode + "@2x.png";
  document.getElementById("wicon").src = iconurl;
}

//to disable unnecessary selection of text
function disableSelection(element) {
  if (typeof element.onselectstart != 'undefined') {
    element.onselectstart = function() {
      return false;
    };
  } else if (typeof element.style.MozUserSelect != 'undefined') {
    element.style.MozUserSelect = 'none';
  } else {
    element.onmousedown = function() {
      return false;
    };
  }
}

//get voices list
function setVoices() {
  return new Promise(
    function (resolve, reject) {
      let synth = window.speechSynthesis;
      let id;

      id = setInterval(() => {
        if (synth.getVoices().length !== 0) {
          resolve(synth.getVoices());
          clearInterval(id);
        }
      },
        1);
    }
  )
}

let s = setVoices();
s.then((v) => {
  voices = v
});