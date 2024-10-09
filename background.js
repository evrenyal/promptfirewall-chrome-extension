const DEBUG_MODE = false;

function debug(label, data) {
  if (DEBUG_MODE) {
    console.group(`DEBUG: ${label}`);
    console.log(data);
    console.groupEnd();
  }
}

debug("initDatabase", null);

//encryption

var extpass = "";

chrome.storage.local.get(['savedData'], function(result) {
    if (result.savedData) {
        extpass = result.savedData;
        debug('Password:', extpass);
    } else {
        debug('No password found');
    }
});

async function encryptText(text, password) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt"]
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        enc.encode(text)
    );

    return {
        iv: Array.from(iv),
        salt: Array.from(salt),
        data: Array.from(new Uint8Array(encrypted))
    };
}

async function decryptText(encrypted, password) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    const salt = new Uint8Array(encrypted.salt);
    const key = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["decrypt"]
    );

    const iv = new Uint8Array(encrypted.iv);
    const encryptedData = new Uint8Array(encrypted.data);

    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encryptedData
    );

    return new TextDecoder().decode(decrypted);
}


//end encryption

var db = null;

function initDatabase() {
  var request = indexedDB.open("myDatabase", 4);

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

    if (!db.objectStoreNames.contains("words")) {  // 
      var wordStore = db.createObjectStore("words", { keyPath: "id", autoIncrement: true });
      wordStore.createIndex("word", "word", { unique: false });
    }

  };

  request.onsuccess = function (event) {
    db = event.target.result;
  };
}

initDatabase();

function addWordToDatabase(word, callback) {
    encryptText(word, extpass).then(encrypted => {
        var transaction = db.transaction(["words"], "readwrite");
        var objectStore = transaction.objectStore("words");
        var request = objectStore.add({ word: encrypted });

        request.onsuccess = function () {
            debug("Word added successfully", encrypted);
            callback(true);
        };

        request.onerror = function () {
            console.error("Error adding encrypted word");
            callback(false);
        };
    });
}

function deleteWordFromDatabase(id, callback) {
  var transaction = db.transaction(["words"], "readwrite");
  var objectStore = transaction.objectStore("words");
  var request = objectStore.delete(id);

  request.onsuccess = function () {
    debug("Word deleted successfully", id);
    callback(true);
  };

  request.onerror = function () {
    console.error("Error deleting word");
    callback(false);
  };
}

function fetchWordsFromDatabase(callback) {
    var transaction = db.transaction(["words"], "readonly");
    var objectStore = transaction.objectStore("words");
    var request = objectStore.getAll();

    request.onsuccess = async function (event) {
        var data = event.target.result;
        const decryptedWords = [];
        for (const item of data) {
            const decrypted = await decryptText(item.word, extpass);
            decryptedWords.push({ id: item.id, word: decrypted });
        }
        debug("Words successfully decrypted", decryptedWords);
        callback(decryptedWords);
    };

    request.onerror = function (event) {
        debug("Error fetching words", event.target.error);
    };
}

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

    } else if (request.action === "addWord") { 
      addWordToDatabase(request.word, function (success) {
        if (success) {
          sendResponse({ message: "Word successfully added" });
        } else {
          sendResponse({ message: "Error adding word" });
        }
      });
      return true;

    } else if (request.action === "deleteWord") {
      deleteWordFromDatabase(request.id, function (success) {
        if (success) {
          sendResponse({ message: "Word successfully deleted" });
        } else {
          sendResponse({ message: "Error deleting word" });
        }
      });
      return true;

    } else if (request.action === "fetchWords") { 
      fetchWordsFromDatabase(function (data) {
        sendResponse({ words: data });
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



