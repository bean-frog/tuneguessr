document.getElementById('enter').onclick = function() {
    document.getElementById('btndiv').style.display = 'none';
    let frame = document.createElement('iframe');
    frame.src = './pages/menu.html';
    frame.style.height = '100vh';
    frame.style.width = '100vw';
    frame.id = 'menu'
    document.body.appendChild(frame);
    let audio = document.getElementById('menumusic');
    audio.play();
    localStorage.setItem('mmOn?', 'true')
    let menuMusicStop = setInterval(function(){
        if (localStorage.getItem('mmOn?') === 'false') {
            audio.pause();
            clearInterval(menuMusicStop)
        }
    },500)
}

