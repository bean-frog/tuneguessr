var debugMode = false;
var metalMode = false;

function debugMessage(content) {
	if (debugMode = true) {
		console.log('[DEBUG]:' + content)
	} else {
		return;
	}
}
//game init
document.addEventListener('DOMContentLoaded', function() {
	if (!localStorage.getItem('tuneguessr-newuser?')) {
		onboarding();
	} else {
		returningUser();
		updateStats();
	}
	const zoomControl = document.querySelector('.svgMap-map-controls-wrapper');
	if (zoomControl) {
		zoomControl.style.right = '0';
		zoomControl.style.left = 'unset';
	}
});
document.addEventListener('DOMContentLoaded', function() {
	let metalmodecheck = document.getElementById('metalmodecheck')
	metalmodecheck.addEventListener('change', function() {
		if (this.checked) {
			metalMode = true;
			distinguish();
      console.log('metal mode: ' + metalMode)
		} else if (!this.checked) {
			metalMode = false;
			distinguish();
      console.log('metal mode: ' + metalMode)
		}
	});
	const countries = document.querySelectorAll('.svgMap-country');

	function distinguish() {
		countries.forEach(function(country) {
			const countryCode = country.id.slice(-2);
			const countryList = metalMode == true ? countriesMetalMode : trimmedCountryNamesEN;
			if (countryList.hasOwnProperty(countryCode)) {
				country.style.fill = '#464646';
			} else {
				country.style.fill = '#909090';
			}
		});
	}

	function dontDistinguish() {
		countries.forEach(function(country) {
			country.style.fill = "#464646"
		});
	}
	const lsDistinguish = localStorage.getItem('tuneguessr-distinguishUnused');
	if (lsDistinguish == true) {
		distinguish();
	} else if (lsDistinguish == false) {
		dontDistinguish();
	}
	const checkbox = document.getElementById('distinguishPossibleCountries');
	if (checkbox.checked) {
		distinguish();
		localStorage.setItem('tuneguessr-distinguishUnused', true);
	} else {
		dontDistinguish();
		localStorage.setItem('tuneguessr-distinguishUnused', false);
	}
	checkbox.addEventListener('change', function() {
		if (this.checked) {
			distinguish();
		} else if (!this.checked) {
			dontDistinguish()
		}
	});

});
//selected country display
function keepLastTwo(str) {
	return str.slice(-2);
}
let currentSel;

function logId(event) {
	if (event.target.classList.contains("svgMap-country")) {
		currentSel = keepLastTwo(event.target.id.toLowerCase())
		console.log(`Clicked country ID: ${currentSel}`);
		document.getElementById('selected').style.display = "block";
		document.getElementById('selected').src = `https://cdn.jsdelivr.net/gh/hampusborgos/country-flags/png100px/${currentSel}.png`
		document.getElementById('selName').textContent = isoToName(currentSel.toUpperCase());
	}

}
document.addEventListener("click", logId);


function onboarding() {
	onboardingModal.showModal();
	document.getElementById('finishOb').addEventListener('click', function() {
		localStorage.setItem('tuneguessr-newuser?', "false");
		localStorage.setItem('tuneguessr-username', document.getElementById('unameInput').value.trim());
		setTimeout(function() {
			returningUser("noback");
		}, 200)
	});
}

function returningUser(back) {
	const username = localStorage.getItem('tuneguessr-username');
	const titleText = back === "noback" ? `Welcome, ${username}!` : `Welcome back, ${username}!`;
	document.getElementById('ruModal-content').innerHTML = `
    <h3 class="font-bold text-lg">${titleText}</h3>
	<h1 class="text-md"><i class="fas fa-book mr-2 fa-xl"></i>Need help? Check out the <a target="_blank" class='underline' href="https://bean-frog.github.io/blog/index.html?articleId=4">Guide</a></h1>

    <div class="modal-action">
      <form method="dialog">
        <button onclick='begingame();' class="btn">Start Game</button>
      </form>
    </div>
  `;
	returningUserModal.showModal();
}

function wipeStats() {
	if (window.confirm("This action is irreversable! Do you want to continue?")) {
		localStorage.setItem('tuneguessr-incorrect', '');
	localStorage.setItem('tuneguessr-correct', '');
	localStorage.setItem('tuneguessr-total', '');
	updateStats()
	} else {
		alert("canceled, be careful next time");
	}
}

function changeUsername(newName) {
	if (newName && !newName == '') {
		localStorage.setItem('tuneguessr-username', newName)
	} else {
		alert('no name provided')
	}
}

function hideCheck() {
	document.getElementById('checkarea').style.visibility = 'hidden';
}

function showCheck() {
	document.getElementById('checkarea').style.visibility = 'visible';
}

const lastCountries = [];
function getRandomCountryISO() {
	const countryList = metalMode == true ? countriesMetalMode : trimmedCountryNamesEN;
  const countries = Object.keys(countryList);
  const arrLength = metalMode == true ? 3 : 55; 
  while (lastCountries.length >= arrLength) {
    lastCountries.shift();
  }
  let randomCountry;
  do {
    const randomIndex = Math.floor(Math.random() * countries.length);
    randomCountry = countries[randomIndex];
  } while (lastCountries.includes(randomCountry));
  lastCountries.push(randomCountry);
  localStorage.setItem('TCCBPDCBLAT', randomCountry);
  return randomCountry;
}
function isoToName(iso) {
	if (iso in svgMapCountryNamesEN) {
		return svgMapCountryNamesEN[iso];
	} else {
		return 'Unknown :(';
	}
}

function clearSel() {
	document.getElementById('selected').removeAttribute('src');
	document.getElementById('selName').textContent = "";
	document.getElementById('selected').style.display = "none";
}

function begingame() {
	console.log('start game called')
	clearSel();
	showCheck();
	const randomCountryISO = getRandomCountryISO();
	console.log(`Random Country: ${randomCountryISO} (${isoToName(randomCountryISO)})`);
	document.getElementById('status').style.backgroundColor = "white";
	document.getElementById('status').innerHTML = "";
	let audio = document.getElementById('tuneguessr-audio');
	const audioSrc = metalMode == true ? `../audio/${localStorage.getItem('TCCBPDCBLAT')}-metal.mp3` : `../audio/${localStorage.getItem('TCCBPDCBLAT')}.mp3`;
	audio.src = audioSrc;
	audio.play();
};
function playSong(iso) {
	/* yt api code
	(this would cause delays on low end machines)

	// init this stuff earlier (dom loaded)
var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// actual player stuff
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '0',
          width: '0',
          videoId: 'M7lc1UVf-VE',
          playerVars: {
            'playsinline': 1
          },
          events: {
            'onReady': onPlayerReady,
          }
        });
      };
      function onPlayerReady(event) {
        event.target.playVideo();
      }
	*/
}
//LS stats functions
function incorrectGuess() {
	let lsIncorrect = localStorage.getItem('tuneguessr-incorrect');
	lsIncorrect = (parseInt(lsIncorrect, 10) || 0) + 1;
	localStorage.setItem('tuneguessr-incorrect', lsIncorrect);
	document.getElementById('status').style.backgroundColor = '#dc2626';
	document.getElementById('status').innerHTML = `
  <p>You absolute donkey that's wrong</p>
  <p>The correct answer was ${localStorage.getItem('TCCBPDCBLAT')} (${isoToName(localStorage.getItem('TCCBPDCBLAT'))})</p>
  <button class="btn my-4 px-4 py-2 bg-blue-500 text-white rounded"id="next" onclick="begingame()">Next</button>
  `
	hideCheck();
	document.getElementById('tuneguessr-audio').pause();
}

function correctGuess() {
	let lsCorrect = localStorage.getItem('tuneguessr-correct');
	lsCorrect = (parseInt(lsCorrect, 10) || 0) + 1;
	localStorage.setItem('tuneguessr-correct', lsCorrect);
	document.getElementById('status').style.backgroundColor = '#16a34a';
	document.getElementById('status').innerHTML = `
  <p>Correct! Good job!</p>
  <button class="btn my-4 px-4 py-2 bg-blue-500 text-white rounded" id="next" onclick="begingame()">Next</button>
  `
	hideCheck();
	document.getElementById('tuneguessr-audio').pause();
}

function totalGuess() {
	let lsTotal = localStorage.getItem('tuneguessr-total');
	lsTotal = (parseInt(lsTotal, 10) || 0) + 1;
	localStorage.setItem('tuneguessr-total', lsTotal);
}

function updateStats() {
	let lsIncorrect = localStorage.getItem('tuneguessr-incorrect');
	let lsCorrect = localStorage.getItem('tuneguessr-correct');
	let lsTotal = localStorage.getItem('tuneguessr-total');
	let template = `
 <h1 class="text-2xl mt-6">${localStorage.getItem('tuneguessr-username')}'s Statistics</h1>
 <ul>
  <li>Total Guesses: ${lsTotal}</li>
  <li>Total Correct Guesses: ${lsCorrect}</li>
  <li>Total Incorrect Guesses: ${lsIncorrect}</li>
  <li>Percent Correct Guesses: ${Math.round((lsCorrect / lsTotal) * 100)}%</li>
 </ul>
 `
	document.getElementById('statsDiv').innerHTML = template;
}

function makeGuess() {
	totalGuess();
	if (currentSel.toLowerCase() === localStorage.getItem('TCCBPDCBLAT').toLowerCase()) {
		correctGuess();
	} else {
		incorrectGuess();
	}
	updateStats();
}
document.getElementById('check').addEventListener('click', makeGuess);

document.addEventListener('keydown', e => {
	if (e.code == "Enter") {
		e.preventDefault();
		return;
	}
	if (e.code == 'Space') {
		e.preventDefault()
		e.stopImmediatePropagation();
		e.stopPropagation();
		if (document.getElementById('next')) {
			begingame();
		} else {
			makeGuess();
		}
	} else {
		return;
	}
});
document.addEventListener('keyup', e => {
	if (e.code == 'Space' || e.code == 'Enter') {
		e.preventDefault() // - \
		e.stopImmediatePropagation(); //    > super hacky fix to stop that goofy ah issue where begingame() was being called due to default events. may cause error?
		e.stopPropagation(); // - /
	} else {
		return;
	}
});
const tgaudio = document.getElementById('tuneguessr-audio')
    const playPauseButton = document.getElementById("playPauseButton");
    const icon = document.getElementById("icon");

    function toggleAudio() {
      if (tgaudio.paused) {
        tgaudio.play();
        icon.className = 'fa fa-pause';
      } else {
        tgaudio.pause();
        icon.className = 'fa fa-play';
      }
    }
	function replayAudio() {
		tgaudio.pause();
        icon.className = 'fa fa-play';
		tgaudio.currentTime = 0;
		toggleAudio();
		tgaudio.play();
        icon.className = 'fa fa-pause';
	  }