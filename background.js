const DEBUG_MODE = false;

function debug(label, data) {
  if (DEBUG_MODE) {
    console.group(`DEBUG: ${label}`);
    console.log(data);
    console.groupEnd();
  }
}

debug("initDatabase0", null);

var db = null;

function initDatabase() {
  var request = indexedDB.open("myDatabase", 3);

  request.onerror = function (event) {
    console.error("Database opening error", event.target.error);
  };

  request.onupgradeneeded = function (event) {
    db = event.target.result;

    if (!db.objectStoreNames.contains("items")) {
      var objectStore = db.createObjectStore("items", { keyPath: "id" });
      objectStore.createIndex("count", "count", { unique: false });
      objectStore.add({ id: 1, count: 0 });
    }

  };

  request.onsuccess = function (event) {
    db = event.target.result;
  };
}

initDatabase();

function addDataToDatabase(callback) {
  var transaction = db.transaction(["items"], "readwrite");
  var objectStore = transaction.objectStore("items");

  var request = objectStore.get(1);

  request.onsuccess = function (event) {
    var data = event.target.result;
    if (data) {
      data.count += 1;
      var updateRequest = objectStore.put(data);

      updateRequest.onsuccess = function () {
        console.log("Data successfully updated");
        callback(true);
      };

      updateRequest.onerror = function () {
        console.error("Error updating data");
        callback(false);
      };
    } else {
      console.error("Item not found");
      callback(false);
    }
  };

  request.onerror = function (event) {
    console.error("Error fetching data", event);
    callback(false);
  };
}

function fetchDataFromDatabase(callback) {
  var transaction = db.transaction(["items"], "readonly");
  var objectStore = transaction.objectStore("items");
  var request = objectStore.getAll();

  request.onsuccess = function (event) {
    var data = event.target.result;
    debug("Data successfully fetched", data);
    callback(data);
  };

  request.onerror = function (event) {
    debug("Error", event.target.error);
  };
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  try {
    if (request.action === "addData") {
      addDataToDatabase(function (success, error) {
        if (success) {
          sendResponse({
            message: "Data successfully added"
          });
        } else {
          sendResponse({
            message: "Error adding data",
            error: error.toString()
          });
        }
      });
      return true;

    } else if (request.action === "fetchData") {

      fetchDataFromDatabase(function (data) {
        if (data) {
          sendResponse({
            message: "Data successfully retrieved",
            data: data
          });
        } else {
          sendResponse({
            message: "Error fetching data"
          });
        }
      });
      return true;
    }
  } catch (error) {
    debug("Error:", error);
    sendResponse({
      message: "Error in message listener"
    });
  }
});


