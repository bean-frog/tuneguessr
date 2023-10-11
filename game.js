//selected country display
  function keepLastTwo(str) {
  return str.slice(-2); 
}
function logId(event) {
  if (event.target.classList.contains("svgMap-country")) {
    const currentSel = keepLastTwo(event.target.id.toLowerCase())
    console.log(`Clicked country ID: ${currentSel}`);
    document.getElementById('selected').src = `https://cdn.jsdelivr.net/gh/hampusborgos/country-flags/png250px/${currentSel}.png`
  }
}
document.addEventListener("click", logId);