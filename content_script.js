const usedCreditCards = new Set();
const usedCryptoAddresses = new Set();
const usedEmails = new Set();
const usedIBANCodes = new Set();
const usedIPAddresses = new Set();
const usedPhoneNumbers = new Set();

const DEBUG_MODE = false;

function debug(label, data) {
  if (DEBUG_MODE) {
    console.group(`DEBUG: ${label}`);
    console.log(data);
    console.groupEnd();
  }
}

function maskString(str) {
  if (typeof str !== 'string') {
    str = String(str);
  }

  if (str.length <= 4) {
    return "****";
  }
  return str.substring(0, str.length - 4) + "****";
}

function maskStringEmail(str) {
  if (typeof str !== 'string') {
    str = String(str);
  }

  if (str.length <= 4) {
    return "****";
  }

  return "****" + str.substring(4);
}


function generateUniqueRandomCreditCard() {
  const cardTypes = ['amex', 'visa', 'mastercard', 'discover'];
  const selectedType = cardTypes[Math.floor(Math.random() * cardTypes.length)];

  function generateRandomNumber(length) {
    return Math.floor(Math.random() * 10 ** length);
  }

  function isValidAmex(number) {
    return (
      number.toString().length === 15 &&
      (number.toString().startsWith('34') || number.toString().startsWith('37'))
      );
  }

  function isValidVisa(number) {
    return number.toString().length === 16 && number.toString().startsWith('4');
  }

  function isValidMastercard(number) {
    return (
      number.toString().length === 16 &&
      number.toString().startsWith('5') &&
      parseInt(number.toString()[1], 10) >= 0 &&
      parseInt(number.toString()[1], 10) <= 5
      );
  }

  function isValidDiscover(number) {
    return number.toString().length === 16 && number.toString().startsWith('6011');
  }

  let randomNumber;
  switch (selectedType) {
  case 'amex':
    do {
      randomNumber = generateRandomNumber(15);
    } while (!isValidAmex(randomNumber));
    break;
  case 'visa':
    do {
      randomNumber = generateRandomNumber(16);
    } while (!isValidVisa(randomNumber));
    break;
  case 'mastercard':
    do {
      randomNumber = generateRandomNumber(16);
    } while (!isValidMastercard(randomNumber));
    break;
  case 'discover':
    do {
      randomNumber = generateRandomNumber(16);
    } while (!isValidDiscover(randomNumber));
    break;
  default:
    return null;
  }

  return randomNumber.toString();
}

function generateUniqueRandomCryptoAddress() {
  const characters = '0123456789abcdef';
  const addressFormats = ['bc1', '1', '3'];
  const addressLengths = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39];

  const addressFormat = addressFormats[Math.floor(Math.random() * addressFormats.length)];
  let randomAddress = addressFormat;

  for (let i = addressFormat.length; i < 40; i++) {
    randomAddress += characters[Math.floor(Math.random() * characters.length)];
  }

  return randomAddress;
}

function generateUniqueRandomEmail() {
  const generateRandomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  let randomEmail;
  do {
    const username = generateRandomString(8);
    const domain = generateRandomString(6);
    randomEmail = `${username}@${domain}.com`;
  } while (usedEmails.has(randomEmail));

  usedEmails.add(randomEmail);
  return randomEmail;
}

function generateUniqueRandomIBAN() {

  const countryCodes = ['DE', 'GB', 'FR', 'US', 'CA', 'IT', 'ES', 'NL'];
  const countryCode = countryCodes[Math.floor(Math.random() * countryCodes.length)];
  const ibanLength = 22 - countryCode.length;

  function generateRandomNumber(length) {
    return Math.floor(Math.random() * Math.pow(10, length));
  }

  const randomAccountNumber = generateRandomNumber(ibanLength);
  const iban = countryCode + randomAccountNumber.toString().padStart(ibanLength, '0');
  return iban;
}

function generateUniqueRandomIPAddress() {
  const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  let randomIP;
  do {
    randomIP = generateRandomNumber(0, 255) + '.' + generateRandomNumber(0, 255) + '.' + generateRandomNumber(0, 255) + '.' + generateRandomNumber(0, 255);
  } while (usedIPAddresses.has(randomIP));

  usedIPAddresses.add(randomIP);
  return randomIP;
}


function generateUniqueRandomPhoneNumber() {
  const generateRandomDigits = (length) => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  };

  let randomPhoneNumber;
  do {
    const countryCode = '+' + generateRandomDigits(1);
    const areaCode = generateRandomDigits(3);
    const number = generateRandomDigits(3) + generateRandomDigits(4);
    randomPhoneNumber = countryCode + areaCode + number;
  } while (usedPhoneNumbers.has(randomPhoneNumber));

  usedPhoneNumbers.add(randomPhoneNumber);
  return randomPhoneNumber;
}


function generateSyntheticData(matchedToken) {
  if (!matchedToken) return null;

  function getRandomChar() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return chars.charAt(Math.floor(Math.random() * chars.length));
  }

  function getRandomString(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += getRandomChar();
    }
    return result;
  }

  if (matchedToken.startsWith('A3T') || 
   matchedToken.startsWith('AKIA') || 
   matchedToken.startsWith('AGPA') || 
   matchedToken.startsWith('AIDA') || 
   matchedToken.startsWith('AROA') || 
   matchedToken.startsWith('AIPA') || 
   matchedToken.startsWith('ANPA') || 
   matchedToken.startsWith('ANVA') || 
   matchedToken.startsWith('ASIA')) {
    return matchedToken.substring(0, 4) + getRandomString(16);

} else if (matchedToken.startsWith('ghp_')) {
  return 'ghp_' + getRandomString(36);

} else if (matchedToken.startsWith('github_pat_')) {
  return 'github_pat_' + getRandomString(22) + '_' + getRandomString(59);

} else if (matchedToken.startsWith('gho_') ||
 matchedToken.startsWith('ghu_') ||
 matchedToken.startsWith('ghs_') ||
 matchedToken.startsWith('ghr_')) {
  return matchedToken.substring(0, 4) + getRandomString(36);

} else if (matchedToken.startsWith('xoxp') || 
 matchedToken.startsWith('xoxb') || 
 matchedToken.startsWith('xoxo') || 
 matchedToken.startsWith('xoxr') || 
 matchedToken.startsWith('xoxs') || 
 matchedToken.startsWith('xoxa')) {
  return matchedToken.substring(0, 4) + getRandomString(68);

} else if (matchedToken.startsWith('https://hooks.slack.com')) {
  return "https://hooks.slack.com/services/T" + getRandomString(8) + "/B" + getRandomString(8) + "/" + getRandomString(24);

}  

return null;
}

debug("Random Credit Card Number:", generateUniqueRandomCreditCard());
debug("Random Crypto Address:", generateUniqueRandomCryptoAddress());
debug("Random Email Address:", generateUniqueRandomEmail());
debug("Random IBAN Code:", generateUniqueRandomIBAN());
debug("Random IP Address:", generateUniqueRandomIPAddress());
debug("Random Phone Number:", generateUniqueRandomPhoneNumber());

function matchCreditCardNumbers(text) {
  const regex = /\b(?:\d{4}[ -]?){3}(?=\d{4}\b)(?:\d{4})|3[47][0-9]{2}([ -]?)([0-9]{6}\1[0-9]{5})\b/g;

  const matches = text.match(regex);
  //debug("matchCreditCardNumbers:",matches); 

  return matches;
}

function matchCryptoAddresses(text) {
  const regex = /\b(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}\b/g;

  const matches = text.match(regex);
  //debug("matchCryptoAddresses:",matches);   

  return matches;
}


function matchEmailAddresses(text) {
  const regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

  const matches = text.match(regex);
  //debug("matchEmailAddresses:",matches);

  return matches;

}

function matchIBANCodes(text) {
  const regex = /\b(?:(?:CR|DE|ME|RS|VA)\d{20}|(?:CZ|ES|SE|SK|TN)\d{22}|(?:DK|FI|FO|GL|SD)\d{16}|(?:AT|BA|EE|LT|XK)\d{18}|(?:AE|IL|TL)\d{21}|(?:LY|PT|ST)\d{23}|(?:IT|SM)\d{2}[A-Z]\d{10}[A-Za-z0-9]{12}|(?:HU|PL)\d{26}|(?:AL|CY)\d{10}[A-Za-z0-9]{16}|(?:CH|LI)\d{7}[A-Za-z0-9]{12}|(?:FR|MC)\d{12}[A-Za-z0-9]{11}\d{2}|(?:GB|IE)\d{2}[A-Z]{4}\d{14}|(?:KZ|LU)\d{5}[A-Za-z0-9]{13}|(?:GI|IQ)\d{2}[A-Z]{4}[A-Za-z0-9]{15}|(?:PK|RO)\d{2}[A-Z]{4}[A-Za-z0-9]{16}|(?:PS|QA)\d{2}[A-Z]{4}[A-Za-z0-9]{21}|AD\d{10}[A-Za-z0-9]{12}|AZ\d{2}[A-Z]{4}[A-Za-z0-9]{20}|BE\d{14}|BG\d{2}[A-Z]{4}\d{6}[A-Za-z0-9]{8}|BH\d{2}[A-Z]{4}[A-Za-z0-9]{14}|BR\d{25}[A-Z][A-Za-z0-9]|BY\d{2}[A-Za-z0-9]{4}\d{4}[A-Za-z0-9]{16}|DO\d{2}[A-Za-z0-9]{4}\d{20}|EG\d{27}|GE\d{2}[A-Z]\d{16}|GT\d{2}[A-Za-z0-9]{24}|GR\d{9}[A-Za-z0-9]{16}|HR\d{19}|IS\d{24}|JO\d{2}[A-Z]{4}\d{4}[A-Za-z0-9]{18}|KW\d{2}[A-Z]{4}[A-Za-z0-9]{22}|LC\d{2}[A-Z]{4}[A-Za-z0-9]{24}|LB\d{6}[A-Za-z0-9]{20}|LV\d{2}[A-Z]{4}\d{13}|MD\d{2}[A-Za-z0-9]{20}|MK\d{5}[A-Za-z0-9]{10}\d{2}|MR\d{25}|MT\d{2}[A-Z]{4}\d{5}[A-Za-z0-9]{18}|MU\d{2}[A-Z]{4}\d{19}[A-Z]{3}|NL\d{2}[A-Z]{4}\d{10}|NO\d{13}|SA\d{4}[A-Za-z0-9]{18}|SC\d{2}[A-Z]{4}\d{20}[A-Z]{3}|SI\d{17}|SV\d{2}[A-Z]{4}\d{20}|TR\d{8}[A-Za-z0-9]{16}|UA\d{8}[A-Za-z0-9]{19}|VG\d{2}[A-Z]{4}\d{16}|GE\d{2}[A-Z]{2}\d{16})\b/g;
  const matches = text.match(regex);
  //debug("matchIBANCodes:",matches); 

  return matches;

}

function matchIPAddresses(text) {
  const regex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

  const matches = text.match(regex);
  //debug("matchIPAddresses:",matches); 

  return matches;
}

//https://regex101.com/r/DsaRfI/1
function matchPhoneNumbers(text) {
  const regex = /\b(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g;

  const matches = text.match(regex);
  //debug("matchPhoneNumbers:",matches); 

  return matches;
}

function matchSecretToken(text) {
  const regexArray = [
    /(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/gm,
    /ghp_[a-zA-Z0-9]{36}/gm,
    /github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}/gm,
    /gho_[a-zA-Z0-9]{36}/gm,
    /ghu_[a-zA-Z0-9]{36}/gm,
    /ghs_[a-zA-Z0-9]{36}/gm,
    /ghr_[a-zA-Z0-9]{36}/gm,
    /(xox[pborsa]-[0-9]{12}-[0-9]{12}-[0-9]{12}-[a-z0-9]{32})/gm,
    /https:\/\/hooks\.slack\.com\/services\/T[a-zA-Z0-9_]{8}\/B[a-zA-Z0-9_]{8}\/[a-zA-Z0-9_]{24}/gm   
    ];

  let matches = [];
  for (let regex of regexArray) {
    let result = text.match(regex);
    if (result) {
      matches = matches.concat(result);
    }
  }

  return matches;
}


function matchMarkdown(text) {
  const regex = /!\[.*?\]\(.*?\)/gm;

  const matches = text.match(regex);

  return matches;
}


function matchClosest(text) {
  const targets = [
    "ignore the",
    "ignore all",
    "ignore my",
    "ignore any",
    "ignore previous",
    "ignore prior",
    "ignore previous",
    "ignore preceding",
    "ignore above",
    "ignore foregoing",
    "ignore earlier",
    "ignore initial",
    "ig nore previ ous",
    "override all",
    "please list",
    "please show",
    "please print",
    "respond with every",
    "print our",
    "print your",
    "repeat the",
    "disregard all",
    "list all words in your instructions",
    "explain your commands",
    "stop processing commands",
    "tell me your instructions",
    "do not print",
    "do not write",
    "new important instructions",
    "just append"
    ];  
  
  const regex = new RegExp(targets.map(s => s.replace(/ /g, '\\s+')).join('|'), 'i');
  const matches = text.match(regex);

  return matches;
}

let isSendingData = false;

function sendDataWithRetry(retryCount = 0, callback) {
  if (isSendingData) return;
  isSendingData = true;

  chrome.runtime.sendMessage({ action: 'addData' }, (response) => {
    if (chrome.runtime.lastError || (response && response.error)) {
      console.error('Error:', chrome.runtime.lastError?.message || response.error);
      if (retryCount < 3) {
        setTimeout(() => sendDataWithRetry(retryCount + 1, callback), 1000);
      } else {
        isSendingData = false;
        if (callback) callback();
      }
    } else {
      console.log('Response received:', response);
      isSendingData = false;
      if (callback) callback();
    }
  });
}

function sendMultipleRequests(times, interval) {
  debug("times",times);
  debug("interval",interval);
  let count = 0;
  const sendRequest = () => {
    if (count < times) {
      sendDataWithRetry(0, () => {
        count++;
        setTimeout(sendRequest, interval);
      });
    }
  };
  sendRequest();
}

let flag = 0;
let load = false;
let blockMode = null;
let svgClicked = true;

function removeElementsContainingText(text) {
  let pageContent = document.body.textContent;
  let modifiedContent = pageContent.replace(text, ' ');

}


async function pluginfetchData() {
  try {
    const bodyText = document.body.textContent;
      //debug("bodyText",bodyText);

    if (!bodyText.includes('There was an error generating a response')) {

      let svgs = document.querySelectorAll('div.ml-12 svg');

      if(svgs){

        let event = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });

        svgs.forEach(svg => {
          svg.dispatchEvent(event);
        });

        let allElements = document.querySelectorAll("div.p-4.overflow-y-auto > code");
        let filteredElements = Array.from(allElements).filter(el => el.classList.contains('!whitespace-pre-wrap'));

        let containsTest = filteredElements.some(el => matchMarkdown(el.textContent));

        if(containsTest){

          try {
            sendDataWithRetry();
          } catch (error) {
            console.error('Error:', error);
          }
          removeElementsContainingText(containsTest);
          showPopup(event,"Indirect Prompt Injection Detected (Markdown)");
          window.stop();
            //location.reload();
        }

        let containsTest2 = filteredElements.some(el => matchClosest(el.textContent));
        

        if(containsTest2){

          try {
            sendDataWithRetry();
          } catch (error) {
            console.error('Error:', error);
          }

          removeElementsContainingText(containsTest);
          showPopup(event,"Indirect Prompt Injection Detected (eg. ignore all previous instructions)");
          window.stop();
            //location.reload();
        }

          //Multi-modal prompt Injection

        let filteredElements2 = Array.from(allElements).filter(el => Array.from(el.classList).some(cls => cls.match(/^language-/)));


        let containsTest3 = filteredElements2.some(el => matchMarkdown(el.textContent));

        if(containsTest3){

          try {
            sendDataWithRetry();
          } catch (error) {
            console.error('Error:', error);
          }

          removeElementsContainingText(containsTest);
          showPopup(event,"Multi-modal Prompt Injection Detected (Markdown)");
          window.stop();
            //location.reload();
        }

        let containsTest4 = filteredElements2.some(el => matchClosest(el.textContent));
        

        if(containsTest4){

          try {
            sendDataWithRetry();
          } catch (error) {
            console.error('Error:', error);
          }

          showPopup(event,"Multi-modal Prompt Injection Detected (eg. ignore all previous instructions)");
          window.stop();
            //location.reload();
        }          

      }  
    }

    setTimeout(pluginfetchData,1000);
  } catch (error) {
    console.error("pluginfetchData encountered an error:", error);
  }
}  


function checkAndUpdateBlockStatus() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(null, function(items) {
      let allValues = Object.values(items);
      if (allValues.length === 0) {
        blockMode = "enabled";
        pluginMode = "disabled";
        chrome.storage.sync.set({
          blockStatus: blockMode,
          pluginStatus: pluginMode,
        }, function() {
          //resolve(blockMode); 
        });

      } else {
        securityStatus = allValues;
        resolve(securityStatus);
      }
    });
  });
}

async function startBlockStatus() {
  securityStatus = await checkAndUpdateBlockStatus(); 
  blockMode = securityStatus[0];
  pluginMode = securityStatus[1];
  debug("Security status: ", securityStatus);
  debug("Blockmode status:", blockMode);

  if(blockMode == "disabled"){

  }else{
    if(blockMode == "enabled" && pluginMode == "enabled"){
      pluginfetchData();
    }
  }
}

startBlockStatus(); 

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "reloadPage") {
    debug("location reload", null);
    location.reload();
  }
});


let matchedParts = [];
let currentTextareaValue;
let matchedWords = [];
let matchedWordsx = [];

let textarea = null;
let textareaValue = ""; 

let intervalId = null;
//start

function startInterval() {
  const intervalId = setInterval(() => {

    debug("setInterval", null);


    textarea = document.querySelector("#prompt-textarea");

    if (textarea) {
      debug("Textarea found", null);
      

      textarea.addEventListener('input', async (event) => {
        let lastPart = "";

        if (event.inputType === 'insertFromPaste') {

          lastPart = textarea.value;


        } else {

          let userInput = "";

          if (event.target.value.endsWith(" ")) {
            userInput = event.target.value.trimEnd();
          }
          debug("userInput", userInput);

          const parts = userInput.split(' ');

          lastPart = parts[parts.length - 1];
          debug("lastPart", lastPart);

        }

        matchedWords = [];
        matchedWordsx = [];
        clearInterval(intervalId); 
        
        if (!isSendingData) {

          const matchPhoneNumbersStr = matchPhoneNumbers(lastPart);
          debug("matchPhoneNumbersStr", matchPhoneNumbersStr);
          const matchCryptoAddressesStr = matchCryptoAddresses(lastPart);
          debug("matchCryptoAddressesStr", matchCryptoAddressesStr);    
          const matchEmailAddressesStr = matchEmailAddresses(lastPart);
          debug("matchEmailAddressesStr TEST", matchEmailAddressesStr);
          const matchIBANCodesStr = matchIBANCodes(lastPart);
          debug("matchIBANCodesStr", matchIBANCodesStr);    
          const matchIPAddressesStr = matchIPAddresses(lastPart);
          debug("matchIPAddressesStr", matchIPAddressesStr);    
          const matchCreditCardNumbersStr = matchCreditCardNumbers(lastPart);
          debug("matchCreditCardNumbersStr", matchCreditCardNumbersStr);
          const matchSecretTokenStr = matchSecretToken(lastPart);
          debug("matchSecretTokenStr", matchSecretTokenStr);    
          const matchMarkdownStr = matchMarkdown(lastPart);
          debug("matchMarkdownStr",matchMarkdownStr);  
          const matchClosestStr = matchClosest(lastPart);
          debug("matchClosestStr",matchClosestStr);      
          let cnt = (matchPhoneNumbersStr ? matchPhoneNumbersStr.length : 0) +
          (matchCryptoAddressesStr ? matchCryptoAddressesStr.length : 0) +
          (matchEmailAddressesStr ? matchEmailAddressesStr.length : 0) +
          (matchIBANCodesStr ? matchIBANCodesStr.length : 0) +
          (matchIPAddressesStr ? matchIPAddressesStr.length : 0) +
          (matchCreditCardNumbersStr ? matchCreditCardNumbersStr.length : 0) +
          (matchSecretTokenStr ? matchSecretTokenStr.length : 0) +
          (matchMarkdownStr ? matchMarkdownStr.length : 0) +
          (matchClosestStr ? matchClosestStr.length : 0);
          debug("cnt", cnt);
          sendMultipleRequests(cnt, 2000);  
          

          if (matchPhoneNumbersStr) {
            if (blockMode === "enabled") {

              maskedStringArr = [];

              matchedWords = matchPhoneNumbersStr.map(phone => {
                const maskedString = maskString(phone);
                maskedStringArr.push(maskedString);
                return maskedString;
              });

              console.log("matchPhoneNumbersStr matchedWords", matchedWords);
              _mString = maskedStringArr.join(", ");
              _tmptype = "<span style='color:darkgrey; font-weight:bold;'>Phone Number :</span> " + _mString;
              console.log("_tmptype", _tmptype);
              matchedWordsx.push(_tmptype);
              showPopup(event, matchedWordsx);                      


            }

            if (blockMode === "disabled") {

              for (let i = 0; i < matchPhoneNumbersStr.length; i++) {

                randomPhoneNumber = generateUniqueRandomPhoneNumber();
                const regex = new RegExp(matchPhoneNumbersStr[i].replace('+', '\\+'), 'g');
                textarea.value = textarea.value.replace(regex, randomPhoneNumber);

              }

            }

            textarea.value = textarea.value + " ";
          }


          if (matchCreditCardNumbersStr) {

            if (blockMode === "enabled") {  

              maskedStringArr = [];

              matchedWords = matchCreditCardNumbersStr.map(cc => {
                const maskedString = maskString(cc);
                maskedStringArr.push(maskedString);
                return maskedString;
              });

              sendMultipleRequests(matchedWords.length, 2000);
              console.log("matchCreditCardNumbersStr matchedWords", matchedWords);
              _mString = maskedStringArr.join(", ");
              _tmptype = "<span style='color:darkgrey; font-weight:bold;'>Credit Card Number :</span> " + _mString;
              console.log("_tmptype", _tmptype);
              matchedWordsx.push(_tmptype);
              showPopup(event, matchedWordsx);  
              
            }

            if (blockMode === "disabled") {

              for (let i = 0; i < matchCreditCardNumbersStr.length; i++) {


                randomCreditCard = generateUniqueRandomCreditCard();
                const regex = new RegExp(matchCreditCardNumbersStr[i], 'g');
                textarea.value = textarea.value.replace(regex, randomCreditCard);

              }

            }

            textarea.value = textarea.value + " ";
          }

          if (matchCryptoAddressesStr) {
            if (blockMode === "enabled") {

              maskedStringArr = [];

              matchedWords = matchCryptoAddressesStr.map(ca => {
                const maskedString = maskString(ca);
                maskedStringArr.push(maskedString);
                return maskedString;
              });


              console.log("matchCryptoAddressesStr matchedWords", matchedWords);
              _mString = maskedStringArr.join(", ");
              _tmptype = "<span style='color:darkgrey; font-weight:bold;'>Crypto Addresses :</span> " + _mString;
              console.log("_tmptype", _tmptype);
              matchedWordsx.push(_tmptype);
              showPopup(event, matchedWordsx);                      

            }

            if (blockMode === "disabled") {

              for (let i = 0; i < matchCryptoAddressesStr.length; i++) {

                randomCryptoAddresses = generateUniqueRandomCryptoAddress();
                const regex = new RegExp(matchCryptoAddressesStr[i], 'g');
                textarea.value = textarea.value.replace(regex, randomCryptoAddresses);

              }

            }

            textarea.value = textarea.value + " ";
          }
          

          if (matchEmailAddressesStr) {

            if (blockMode === "enabled") {  

              maskedStringArr = [];

              matchedWords = matchEmailAddressesStr.map(email => {
                const maskedString = maskStringEmail(email);
                maskedStringArr.push(maskedString);
                return maskedString;
              });
              
              console.log("matchEmailAddressesStr matchedWords", matchedWords);
              _mString = maskedStringArr.join(", ");
              _tmptype = "<span style='color:darkgrey; font-weight:bold;'>Email Address :</span> " + _mString;
              console.log("_tmptype", _tmptype);
              matchedWordsx.push(_tmptype);
              showPopup(event, matchedWordsx);
              
            }


            if (blockMode === "disabled") {

              for (let i = 0; i < matchEmailAddressesStr.length; i++) {

                randomEmailAddresses = generateUniqueRandomEmail();
                const regex = new RegExp(matchEmailAddressesStr[i], 'g');
                textarea.value = textarea.value.replace(regex, randomEmailAddresses);

              }

            }

            textarea.value = textarea.value + " ";
          }


          if (matchIBANCodesStr) {
            if (blockMode === "enabled") {

              maskedStringArr = [];

              matchedWords = matchIBANCodesStr.map(iban => {
                const maskedString = maskString(iban);
                maskedStringArr.push(maskedString);
                return maskedString;
              });

              console.log("matchIBANCodesStr matchedWords", matchedWords);
              _mString = maskedStringArr.join(", ");
              _tmptype = "<span style='color:darkgrey; font-weight:bold;'>IBAN Codes :</span> " + _mString;
              console.log("_tmptype", _tmptype);
              matchedWordsx.push(_tmptype);
              showPopup(event, matchedWordsx);                      


            }

            if (blockMode === "disabled") {

              for (let i = 0; i < matchIBANCodesStr.length; i++) {

                randomIBANCodes = generateUniqueRandomIBAN();
                const regex = new RegExp(matchIBANCodesStr[i], 'g');
                textarea.value = textarea.value.replace(regex, randomIBANCodes);


              }

            }

            textarea.value = textarea.value + " ";
          }


          if (matchIPAddressesStr) {
            if (blockMode === "enabled") {

              maskedStringArr = [];

              matchedWords = matchIPAddressesStr.map(ip => {
                const maskedString = maskString(ip);
                maskedStringArr.push(maskedString);
                return maskedString;
              });


              console.log("matchIPAddresses matchedWords", matchedWords);
              _mString = maskedStringArr.join(", ");
              _tmptype = "<span style='color:darkgrey; font-weight:bold;'>IP Addresses :</span> " + _mString;
              console.log("_tmptype", _tmptype);
              matchedWordsx.push(_tmptype);
              showPopup(event, matchedWordsx);                      

            }

            if (blockMode === "disabled") {

              for (let i = 0; i < matchIPAddressesStr.length; i++) {

                randomIPAddresses = generateUniqueRandomIPAddress();
                const regex = new RegExp(matchIPAddressesStr[i], 'g');
                textarea.value = textarea.value.replace(regex, randomIPAddresses);


              }

            }

            textarea.value = textarea.value + " ";
          }


          if (matchSecretTokenStr && matchSecretTokenStr.length > 0) {
            if (blockMode === "enabled") {

              maskedStringArr = [];

              matchedWords = matchSecretTokenStr.map(st => {
                const maskedString = maskString(st);
                maskedStringArr.push(maskedString);
                return maskedString;
              });

              console.log("matchSecretTokenStr matchedWords", matchedWords);
              _mString = maskedStringArr.join(", ");
              _tmptype = "<span style='color:darkgrey; font-weight:bold;'>Secret Tokens :</span> " + _mString;
              console.log("_tmptype", _tmptype);
              matchedWordsx.push(_tmptype);
              showPopup(event, matchedWordsx);                      

            }

            if (blockMode === "disabled") {

              for (let i = 0; i < matchSecretTokenStr.length; i++) {

                randomSyntheticData = generateSyntheticData(matchSecretTokenStr[i]);
                const regex = new RegExp(matchSecretTokenStr[i], 'g');
                textarea.value = textarea.value.replace(regex, randomSyntheticData);

              }

            }

            textarea.value = textarea.value + " ";
          }    
          

          if (matchMarkdownStr) {
            if (blockMode === "enabled") {        

              try {
                sendDataWithRetry();
              } catch (error) {
                console.error('Error:', error);
              }

              _tmptype = "<span style='color:darkgrey; font-weight:bold;'>Markdown Injection :</span> "+matchMarkdownStr;
              matchedWordsx.push(...matchedWords.filter(word => word !== undefined && word !== null));
              matchedWordsx.push(_tmptype);
              showPopup(event,matchedWordsx);

            }
            textarea.value = textarea.value + " ";
          }   


          if (matchClosestStr) {
            if (blockMode === "enabled") {        
             
              _tmptype = "<span style='color:darkgrey; font-weight:bold;'>Injection Attack :</span> "+matchClosestStr;
              matchedWordsx.push(...matchedWords.filter(word => word !== undefined && word !== null));
              matchedWordsx.push(_tmptype);
              showPopup(event,matchedWordsx);
            }
            textarea.value = textarea.value + " ";
          } 

    // end if
        } 

      });


} else {

  debug("Textarea not found", null);
  textarea = document.querySelector("#prompt-textarea");
}

}, 2000); 

}
//end

startInterval();

const style = document.createElement("link");
style.rel = "stylesheet";
style.href = chrome.runtime.getURL("style.css");
document.head.appendChild(style);

const popupContainer = createEl('div', { id: 'popup-container', style: 'opacity: 0; transition: opacity 0.3s; display: none;' });
const popup = createEl('div', { id: 'popup', style: 'opacity: 0; transition: opacity 0.3s;' });
const closeButton = createEl('span', {
  id: 'close-button',
  innerHTML: '&times;',
  onClick: closePopup
});
const popupText = createEl('p', { textContent: "" });

popup.append(closeButton, popupText);
popupContainer.appendChild(popup);
document.body.appendChild(popupContainer);

function createEl(tag, props = {}) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === "onClick") el.addEventListener('click', value);
    else if (key === "style") el.style.cssText = value; 
    else el[key] = value;
  }
  return el;
}


function showPopup(event, wordx) {  

  
  popupContainer.style.display = 'flex';
  setTimeout(() => {
    popupContainer.style.opacity = '1';
    popup.style.opacity = '1';
  }, 10);


  if (Array.isArray(wordx)) {
    wordx = wordx.reverse();
    debug("matchedWordsx.count",wordx.length);

    forbiddenWordsList = wordx.map(word => `<li class="dot-list">${word}</li>`).join('');
    popupText.innerHTML = `<p style="
    font-size: 24px;
    font-weight: bold; 
    color: #333333; 
    padding: 10px;
    border-radius: 10px;">Prompt Firewall</p>
    <br>Prompt Firewall detected some issues:<br><br><ul>${forbiddenWordsList}</ul><br>The Chrome Extension runs entirely locally and your private data is not sent anywhere!<br>Read our <a style="text-decoration: underline;" href="https://promptfirewall.com/privacy-policy.html">privacy policy</a> and follow us at <a style="text-decoration: underline;" href="https://promptfirewall.com/">Prompt Firewall</a>`;
  } else {
    popupText.innerHTML = `<p style="
    font-size: 24px;
    font-weight: bold; 
    color: #333333; 
    padding: 10px;
    border-radius: 10px;">Prompt Firewall</p><br>Prompt Firewall detected some issues:<br><br><ul><li class="dot-list">${wordx}</li></ul><br>The Chrome Extension runs entirely locally and your private data is not sent anywhere!<br>Read our <a style="text-decoration: underline;" href="https://promptfirewall.com/privacy-policy.html">privacy policy</a> and follow us at <a style="text-decoration: underline;" href="https://promptfirewall.com/">Prompt Firewall</a>`;
  }

}

function closePopup() {
  popupContainer.style.opacity = '0';
  popup.style.opacity = '0';
  setTimeout(() => {
    popupContainer.style.display = 'none';
  }, 300);
  setTimeout(startInterval, 1000);
}


const continueEditingButton = createEl('button', {
  textContent: 'Continue Editing',
  onClick: continueEditing
});

continueEditingButton.style.cssText = `
background-color: darkgreen;
border: none;
color: white;
padding: 10px 20px;
text-align: center;
font-size: 16px;
margin: 4px 2px;
border-radius: 4px;
position: absolute; 
bottom: 0%;  
transform: translate(-50%, -50%); 
text-align: center;   
`;

const buttonContainer = createEl('div', {
  style: 'text-align: center; margin-top: 20px;' 
});

popup.appendChild(popupText);
popup.appendChild(continueEditingButton);
popupContainer.appendChild(popup);

function continueEditing() {  
  closePopup();
  setTimeout(startInterval, 1000);
}