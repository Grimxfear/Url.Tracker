let urls = [];
let times = [];
let title = [];
let webpage = [];
let min = 0;
let sec = 0;
let Interval;
let i = 1;
let a = 12;
let b = 19;
let c = 3;
let d = 5;
let e = 2;




function timer() {
  chrome.tabs.query({ active: true, status: "complete" }, function (tabs) {
    const tab = tabs[0];;
    if (!tab.url.startsWith("chrome-extension://") && !tab.url.startsWith("chrome://extensions/")) {
      clearInterval(Interval);
      Interval = setInterval(function () {
        sec++;
        if (sec > 59) {
          min++;
          sec = 0;
        }

      }, 1000);
    } else {
      clearInterval(Interval);
    }

  });
}

function active() {
  chrome.tabs.query({ active: true, status: "complete" }, function (tabs) {
    const tab = tabs[0];
    if (tab && !tab.url.startsWith("chrome-extension://") && !tab.url.startsWith("chrome://extensions/")) {
      if (sec <= 9) {
        const time = min + ':0' + sec;
        times.unshift(time);
        min = 0;
        sec = 0;
      } else {
        const time = min + ':' + sec;
        times.unshift(time);
        min = 0;
        sec = 0;
      }
      console.log("entry");
    } else {
    }
  });
}

function grab() {
  chrome.tabs.query({ active: true, status: "complete" }, function (tabs) {
    const tab = tabs[0];
    if (tab && !tab.url.startsWith("chrome-extension://") && !tab.url.startsWith("chrome://extensions/")) {
      var url = new URL(tab.url);
      var domain = url.hostname;
      urls.unshift(tab.url);
      title.unshift(tab.title.split("-", 1));
      webpage.unshift(domain);

    }
  });
}

  function trackTopFiveDomains() {
    const domainTimes = {};
    const timeToSeconds={}
    if (webpage.length >= 1) {
      for (let i = 1; i < webpage.length; i++) {
        const domain = webpage[i];
        const time = times[i - 1];
        if (domainTimes[domain]) {
          domainTimes[domain] += convert(time);
          timeToSeconds[domain] += convert(time);

        } else {
          domainTimes[domain] = convert(time);
          timeToSeconds[domain] += convert(time);

        }
      }
      const sortedTimes = Object.keys(domainTimes).sort((a, b) => domainTimes[b] - domainTimes[a]);

      const sortedDomains = Object.keys(domainTimes).sort((a, b) => domainTimes[b] - domainTimes[a]);

      for (let i = 0; i < Math.min(5, sortedDomains.length); i++) {
        const domain = sortedDomains[i];
        const timeSpent = formatTimeFromSeconds(domainTimes[domain]);
        document.getElementById('top' + i).innerHTML = domain;
        document.getElementById('ttop' + i).innerHTML = timeSpent;
      }
      const topDomains = sortedDomains.slice(0, 5);
      const timeSorted = topDomains.map(domain => domainTimes[domain]);

      const data = {
        labels: topDomains,
        datasets: [{
          data: timeSorted,
          backgroundColor: [
            'rgba(4, 67, 137, 0.2)',
            'rgba(117, 77, 32, 0.2)',
            'rgba(47, 135, 235, 0.2)',
            'rgba(139, 186, 240, 0.2)',
            'rgba(224, 139, 40, 0.2)'
          ],
          hoverOffset: 4,
          borderColor: [
            'rgba(4, 67, 137, 0.2)',
            'rgba(117, 77, 32, 0.2)',
            'rgba(47, 135, 235, 0.2)',
            'rgba(139, 186, 240, 0.2)',
            'rgba(224, 139, 40, 0.2)'
          ],
          borderWidth: 1
        }]
      };
    
      myPieChart.data = data;
      myPieChart.update();
      myPieChart.resize();

    }
  }

function convert(time) {
  const [min, sec] = time.split(':').map(Number);
  return min * 60 + sec;
}

function formatTimeFromSeconds(seconds) {
  const hours = Math.floor(seconds / 60);
  const min = Math.floor((seconds%60));

  return `${hours}:${min < 10 ? '0' : ''}${min}`;
}


function search() {

  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("directory");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("a")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

console.log = (message) => {

  if (webpage.length > 5) {
    let table = document.getElementById("directory");
    let row = table.insertRow(-1); 
    let c1 = row.insertCell(0);
    c1.id = "recent" + webpage.length;
    let c2 = row.insertCell(1);
    let c3 = row.insertCell(2);
    c3.id = "time" + webpage.length;
    c1.innerHTML = "";
    c2.innerHTML = "<a id='title" + webpage.length + "' target='_blank' href=''></a></td>";
    c3.innerHTML = "";
  }

  for (let i = 1; i <= webpage.length; i++) {
    document.getElementById('recent' + i).innerHTML = webpage[i].toString();
    document.getElementById('title' + i).innerHTML = title[i].toString();
    document.getElementById("title" + i).href = urls[i].toString();
    document.getElementById("time" + i).innerHTML = times[i - 1].toString();
  }
};


let myPieChart; 

document.addEventListener('DOMContentLoaded', function () {
  i = 2;
  const data = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        'rgba(4, 67, 137, 0.2)',
        'rgba(117, 77, 32, 0.2)',
        'rgba(47, 135, 235, 0.2)',
        'rgba(139, 186, 240, 0.2)',
        'rgba(224, 139, 40, 0.2)'
      ],
      hoverOffset: 4,
      borderColor: [
        'rgba(4, 67, 137, 0.2)',
        'rgba(117, 77, 32, 0.2)',
        'rgba(47, 135, 235, 0.2)',
        'rgba(139, 186, 240, 0.2)',
        'rgba(224, 139, 40, 0.2)'
      ],
      borderWidth: 1
    }]
  };

  const ctx = document.getElementById('myPieChart').getContext('2d');

  myPieChart = new Chart(ctx, {
    type: 'pie',
    data: data,
    options: {
      
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            var dataset = data.datasets[tooltipItem.datasetIndex];
            var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
              return previousValue + currentValue;
            });
            var currentValue = dataset.data[tooltipItem.index];
            var percentage = ((currentValue / total) * 100).toFixed(2) + '%';
            return percentage;
          }
        }
      },
      plugins: {
        emptyDoughnut: {
          color: 'rgba(255, 128, 0, 0.5)',
          width: 2,
          radiusDecrease: 20
        },
        legend: {
          display: false,
        }
      },
    }
  });
});

window.addEventListener('resize', function() {
  myPieChart.resize();
});





chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === "loading") {

    timer();
    grab();
    active();
    trackTopFiveDomains();
  }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  timer();
  grab();
  active();
  trackTopFiveDomains();
});

function search() {
  var input, filter, table, tr, td1, td2, i, txtValue1, txtValue2;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("directory");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
      td1 = tr[i].getElementsByTagName("td")[0]; 
      td2 = tr[i].getElementsByTagName("td")[1]; 

      if (td1 && td2) {
          txtValue1 = td1.textContent || td1.innerText;
          txtValue2 = td2.textContent || td2.innerText;

          if (txtValue1.toUpperCase().indexOf(filter) > -1 || txtValue2.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
            
          }
      }       
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('myInput').addEventListener('keyup', search);
}); 