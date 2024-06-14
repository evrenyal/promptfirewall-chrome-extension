$(document).ready(function() {

async function fetchDataAndShowData() {
  var wordsList = $('#word');

  if (!wordsList.length) {
    console.error('jQuery element not found');
    return;
  }

  wordsList.empty().append('<b>Loading data...</b>');

  try {
    const response = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action: "fetchData" }, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result);
        }
      });
    });

    console.log("Response from background script:", response);

    wordsList.empty();

    if (response && response.data) {

      response.data.forEach(item => {
        wordsList.append(`
  <div class="sensitive-data-container">
    <p class="sensitive-data-title">Sensitive Data Detected</p>
    <p class="sensitive-data-count">In total: ${item.count}</p>
  </div>
`);
      });
    } else {
      wordsList.append('<b>No data received</b>');
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    wordsList.empty().append(`<b>Error: ${error.message}</b>`);
  }
}

setTimeout(function() {
    fetchDataAndShowData();
}, 500); 



  var home = $('#home');
  var settingsButton = $('#settingsButton');
  var settingsContent = $('#settingsContent');
  var wordsList = $('#wordsList');
  var blockCheckbox = $('#blockCheckbox');
  var monitorCheckbox = $('#monitorCheckbox');

  home.on('click', function() {
    home.addClass('active');
    settingsButton.removeClass('active');
    settingsContent.removeClass('active');
  });

  settingsButton.on('click', function() {
    settingsButton.addClass('active');
    home.removeClass('active');
    settingsContent.addClass('active');
  });

  var blockStatus = null;
  var pluginStatus = null;

  chrome.storage.sync.get(null, function(items) {

    blockStatus = items.blockStatus;
    pluginStatus = items.pluginStatus;

if (blockStatus === 'enabled') {
  $('#blockCheckbox').prop('checked', true);
  $('#pluginCheckbox').prop('disabled', true); //plugin disable
  $('#syntheticCheckbox').prop('checked', false);
} else {
  $('#blockCheckbox').prop('checked', false);
  $('#pluginCheckbox').prop('disabled', true);
  $('#pluginCheckbox').prop('checked', false); 
  $('#syntheticCheckbox').prop('checked', true);  
}

/*if (pluginStatus === 'enabled' && blockStatus === 'enabled') {
  $('#pluginCheckbox').prop('checked', true);
  $('#syntheticCheckbox').prop('checked', false);  
  $('#syntheticCheckbox').prop('disabled', true);
} else {
  $('#pluginCheckbox').prop('checked', false);
}*/


  });

  $('#blockCheckbox').on('change', function() {

    if ($(this).is(':checked')) {

      //localStorage.setItem('blockStatus', 'enabled');
      chrome.storage.sync.set({ blockStatus: "enabled" }, function() {

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "reloadPage" });
        });

      }); 

    } else {

      chrome.storage.sync.set({ blockStatus: "disabled" }, function() {

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "reloadPage" });
        });

      }); 

    }

  });

  $('#pluginCheckbox').on('change', function() {

    if ($(this).is(':checked')) {

     chrome.storage.sync.set({ pluginStatus: "enabled" }, function() {

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "reloadPage" });
        });  

      }); 

    } else {

      chrome.storage.sync.set({ pluginStatus: "disabled" }, function() {

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "reloadPage" });
        }); 

      }); 

    }

  });

  $('#syntheticCheckbox').on('change', function() {

    if ($(this).is(':checked')) {

      chrome.storage.sync.set({ blockStatus: "disabled" }, function() {

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "reloadPage" });
        });  

      });  

    } else {

      chrome.storage.sync.set({ blockStatus: "enabled" }, function() {

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "reloadPage" });
        }); 

      }); 

    }

  });


});
