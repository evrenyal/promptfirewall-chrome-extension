$(document).ready(function() {

    const DEBUG_MODE = false;

    function debug(label, data) {
        if (DEBUG_MODE) {
            console.group(`DEBUG: ${label}`);
            console.log(data);
            console.groupEnd();
        }
    }

    function containsEntitiesOrUnicode(input) {
        const htmlEntityPattern = /&#[0-9]+;|&#x[0-9A-Fa-f]+;|&[a-zA-Z]+;/g;
        const unicodePattern = /%[0-9A-Fa-f]{2}/g;

        return htmlEntityPattern.test(input) || unicodePattern.test(input);
    }

    function removeXSSCharacters(input) {
        return input.replace(/[&<>"'/]/g, '');
    }

    function sanitizeInput(input) {
        if (containsEntitiesOrUnicode(input)) {
            return "Invalid input: contains HTML entities or Unicode characters";
        }

        return removeXSSCharacters(input);
    }    

    document.getElementById('save').addEventListener('click', function() {
        const userInput = document.getElementById('userInput').value;
        const messageElement = document.getElementById('message');

        if (!userInput) {
            messageElement.textContent = 'Input cannot be empty. Please enter a valid key.';
            messageElement.style.color = 'red';
            return;
        }

        chrome.storage.local.set({ savedData: userInput }, function() {
            if (chrome.runtime.lastError) {
                messageElement.textContent = `Error: ${chrome.runtime.lastError.message}`;
                messageElement.style.color = 'red';
                console.error('Data could not be saved:', chrome.runtime.lastError);
            } else {
                messageElement.textContent = 'Encryption Key successfully added!';
                messageElement.style.color = 'green'; 
                console.log('Data has been saved:', userInput);
            }
        });
    });


    async function fetchDataAndShowData() {

        var wordsButton = $('#wordsButton'); 
        var wordsContent = $('#wordsContent'); 
        var wordInput = $('#wordInput');
        var addButton = $('#addButton');
        var lst = $('#lst');

    function loadWords() {
        chrome.runtime.sendMessage({ action: "fetchWords" }, function(response) {
            if (response.words && response.words.length > 0) {
                response.words.forEach(function(word) {
                    lst.append('<li>' + word.word + ' <button class="deleteWord" data-id="' + word.id + '">Delete</button></li>');
                });
            }
        });
    }

    addButton.on('click', function() {
        var word = sanitizeInput(wordInput.val());
        if (word) {
            chrome.runtime.sendMessage({ action: "addWord", word: word }, function(response) {
                if (response.message === "Word successfully added") {

                    chrome.runtime.sendMessage({ action: "fetchWords" }, function(response) {
                        if (response.words && response.words.length > 0) {
                            var lastAddedWord = response.words[response.words.length - 1];
                            lst.append('<li>' + lastAddedWord.word + ' <button class="deleteWord" data-id="' + lastAddedWord.id + '">Delete</button></li>');
                        }
                    });
                    wordInput.val(''); 
                }
            });
        }
    });

    lst.on('click', '.deleteWord', function() {
        var id = $(this).data('id');
        var listItem = $(this).parent();
        chrome.runtime.sendMessage({ action: "deleteWord", id: id }, function(response) {
            if (response.message === "Word successfully deleted") {
                listItem.remove(); 
            }
        });
    });

    wordsButton.on('click', function() {
        wordsButton.addClass('active');
        home.removeClass('active');
        settingsButton.removeClass('active');
        $('#functions-list').hide();
        settingsContent.removeClass('active');
        wordsContent.addClass('active');
    });

    loadWords();

        //end words
        
        var wordsList = $('#word');

        if (!wordsList.length) {
            console.error('jQuery element not found');
            return;
        }

        wordsList.empty().append('<b>Loading data...</b>');

        try {
            const response = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({
                    action: "fetchData"
                }, (result) => {
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
    var wordsContent = $('#wordsContent');
    var wordsButton = $('#wordsButton');

    home.on('click', function() {
        home.addClass('active');
        settingsButton.removeClass('active');
        settingsContent.removeClass('active');
        wordsButton.removeClass('active');
        $('#functions-list').show(); 
        $('#wordsContent').hide(); 
    });

    settingsButton.on('click', function() {
        settingsButton.addClass('active');
        home.removeClass('active');
        wordsButton.removeClass('active');
        $('#functions-list').hide(); 
        settingsContent.addClass('active'); 
        $('#wordsContent').hide(); 
    });

    wordsButton.on('click', function() {
        wordsButton.addClass('active');
        home.removeClass('active');
        settingsButton.removeClass('active');
        $('#functions-list').hide();  
        settingsContent.removeClass('active'); 
        $('#wordsContent').show();  
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
            chrome.storage.sync.set({
                blockStatus: "enabled"
            }, function() {

                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: "reloadPage"
                    });
                });

            });

        } else {

            chrome.storage.sync.set({
                blockStatus: "disabled"
            }, function() {

                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: "reloadPage"
                    });
                });

            });

        }

    });

    $('#pluginCheckbox').on('change', function() {

        if ($(this).is(':checked')) {

            chrome.storage.sync.set({
                pluginStatus: "enabled"
            }, function() {

                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: "reloadPage"
                    });
                });

            });

        } else {

            chrome.storage.sync.set({
                pluginStatus: "disabled"
            }, function() {

                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: "reloadPage"
                    });
                });

            });

        }

    });

    $('#syntheticCheckbox').on('change', function() {

        if ($(this).is(':checked')) {

            chrome.storage.sync.set({
                blockStatus: "disabled"
            }, function() {

                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: "reloadPage"
                    });
                });

            });

        } else {

            chrome.storage.sync.set({
                blockStatus: "enabled"
            }, function() {

                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: "reloadPage"
                    });
                });

            });

        }

    });


    //begin

    const defaultEnabledFunctions = [
        "Words","Phone Number", "Credit Card Number", "Crypto Addresses", "Email Address", "IBAN Codes", "IP Addresses"
    ];

    const functions = [
        "Words", "Phone Number", "Credit Card Number", "Crypto Addresses", "Email Address", "IBAN Codes", "IP Addresses",
        "ABA RTN", "Australian Business Number", "Australian Company Number", "Australian Drivers License",
        "Australian Full National Number (FNN)", "Australian Medicare card number", "Australian NSW Drivers License Pattern",
        "Australian Queensland Drivers License Pattern", "Australian Tax File Number", "Austrian Bank Account Numbers",
        "Austrian Passport Number", "Austrian Social Security Insurance Number", "Austrian VAT Identification Number (UID)",
        "Canadian Alberta Drivers License Pattern", "Canadian Alberta Health Pattern", "Canadian Manitoba Drivers License Pattern",
        "Canadian Manitoba Health Pattern", "Canadian Ontario Drivers License Pattern", "Canadian Ontario Health Pattern",
        "Canadian Passport Pattern", "Canadian Quebec Drivers License Pattern", "Canadian Quebec Health Pattern",
        "Canadian Saskatchewan Drivers License Pattern", "Canadian Social Insurance Number", "Date (Multiple Formats)",
        "France Drivers License Number", "France Passport Number", "France Value Added Tax (VAT) Number", "French INSEE Code",
        "German Driver's License Number", "German ID Number", "German Passport Number", "German Social Security Number",
        "German Tax Identifier/Code", "Indian Aadhaar Number", "Indian PAN", "Italian Passport Number", "Italian Tax ID/SSN (Codice Fiscale)",
        "Turkish Identification Number", "UK BIC Number", "UK Driver License Number", "UK Electoral Roll Number", "UK IBAN Number",
        "UK National Health Service (NHS) Number", "UK National Insurance Number", "UK Passport Number", "UK Postcode", "UK SEDOL",
        "UK Sort Code", "UK Unique Taxpayer Reference (UTR)", "US Driver License Number", "US Individual Taxpayer Identification Number (ITIN)",
        "US Medicare Health Insurance Claim (HIC) Number", "US Passport Number", "US Social Security Number (SSN)",
        "US Social Security Number Randomization", "US Vehicle Identification Number (VIN)", "US Zip Code", "China TIN", "Japan SSN",
        "Korea RRN", "New Zealand IRD", "Philippines SSS", "Belgium INSZ/NISS", "Germany StNr", "France NIR", "Italy Codice Fiscale",
        "Netherlands BSN", "Portugal NISS", "Russia INN", "Spain NUSS", "Ukraine INPP", "Brazil CPF"
    ];


    const functionsList = document.getElementById('functions-list');

    chrome.storage.sync.get(["enabledFunctions"], (result) => {
        let enabledFunctions = result.enabledFunctions;

        if (!enabledFunctions) {
            enabledFunctions = defaultEnabledFunctions;
            chrome.storage.sync.set({
                enabledFunctions
            }, () => {
                debug("Default active functions have been set:", enabledFunctions);
            });
        }

        functions.forEach(func => {
            const div = document.createElement('div');
            div.className = 'function';

            const slider = document.createElement('label');
            slider.className = 'switch';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = func;
            checkbox.checked = enabledFunctions.includes(func);
            checkbox.addEventListener('change', () => {
                handleCheckboxChange(func, checkbox.checked);
            });

            const sliderSpan = document.createElement('span');
            sliderSpan.className = 'slider';

            slider.appendChild(checkbox);
            slider.appendChild(sliderSpan);

            const label = document.createElement('label');
            label.htmlFor = func;
            label.textContent = func;
            label.className = 'function-label';

            div.appendChild(slider);
            div.appendChild(label);
            functionsList.appendChild(div);
        });

    });


    function handleCheckboxChange(func, isChecked) {
        chrome.storage.sync.get(["enabledFunctions"], (result) => {
            let enabledFunctions = result.enabledFunctions || [];

            if (isChecked) {
                if (!enabledFunctions.includes(func)) {
                    enabledFunctions.push(func);
                }
            } else {
                enabledFunctions = enabledFunctions.filter(item => item !== func);
            }

            chrome.storage.sync.set({
                enabledFunctions
            }, () => {
                debug(`Function ${func} has been  ${isChecked ? 'enabled' : 'disabled'}. Current active functions:`, enabledFunctions);
            });
        });
    }



//end
});