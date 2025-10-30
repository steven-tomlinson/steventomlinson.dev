(function(){
  const mstOffsetHours = 12; // Lamina1 MST is UTC+12
  const localElem = document.getElementById("localTime");
  const mstElem   = document.getElementById("mstTime");
  const diffElem  = document.getElementById("timeDiff");

  function pad2(n){ return n<10? "0"+n : n; }

  function updateTimes(){
    const now = new Date();
    // local time
    const localH = now.getHours();
    const localM = now.getMinutes();
    const localS = now.getSeconds();
    localElem.textContent = pad2(localH)+":"+pad2(localM)+":"+pad2(localS);

    // compute MST
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const mstTime = new Date(utc + (mstOffsetHours * 3600000));
    const h2 = mstTime.getHours();
    const m2 = mstTime.getMinutes();
    const s2 = mstTime.getSeconds();
    mstElem.textContent = pad2(h2)+":"+pad2(m2)+":"+pad2(s2);

    // compute difference between local and MST in hours/minutes
    const diffMs  = (localH*3600 + localM*60 + localS)*1000 - (h2*3600 + m2*60 + s2)*1000;
    const diffH   = Math.floor(diffMs / 3600000);
    const diffM   = Math.floor((Math.abs(diffMs) % 3600000) / 60000);
    const sign    = diffMs >= 0 ? "+" : "-";
    diffElem.textContent = sign + Math.abs(diffH) + "h " + diffM + "m";
  }

  updateTimes();
  setInterval(updateTimes, 1000);
})();
