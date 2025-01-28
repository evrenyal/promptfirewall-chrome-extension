const usedCreditCards = new Set();
const usedCryptoAddresses = new Set();
const usedEmails = new Set();
const usedIBANCodes = new Set();
const usedIPAddresses = new Set();
const usedPhoneNumbers = new Set();
const usedWords = new Set();

const DEBUG_MODE = false;

function debug(label, data) {
    if (DEBUG_MODE) {
        console.group(`DEBUG: ${label}`);
        console.log(data);
        console.groupEnd();
    }
}

window.onload = function() {

    if (localStorage.getItem('reloaded') === 'true') {

        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '10px';
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.padding = '10px';
        popup.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
        popup.style.color = 'white';
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '1000';
        popup.innerText = 'Memory pollution detected';
        document.body.appendChild(popup);

        setTimeout(() => {
            document.body.removeChild(popup);
            popupDisplayed = false;
        }, 3000);

        localStorage.removeItem('reloaded');
    }
};

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

// American Banker Association routing transit numbers (ABA RTN)
function generateUniqueRandomABARTN() {
    const firstTwoDigitsOptions = [
        "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12",
        "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32",
        "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72",
        "80"
    ];
    const firstTwoDigits = firstTwoDigitsOptions[Math.floor(Math.random() * firstTwoDigitsOptions.length)];
    const remainingDigits = Array.from({
        length: 7
    }, () => Math.floor(Math.random() * 10)).join('');
    return `${firstTwoDigits}${remainingDigits}`;
}


// Australian Business Number
function generateUniqueRandomAustralianBusinessNumber() {
    const format = Math.floor(Math.random() * 4);
    const digits = Array.from({
        length: 11
    }, () => Math.floor(Math.random() * 10)).join('');
    if (format === 0) return digits.slice(0, 2) + '.' + digits.slice(2, 5) + '.' + digits.slice(5, 8) + '.' + digits.slice(8);
    if (format === 1) return digits.slice(0, 2) + '-' + digits.slice(2, 5) + '-' + digits.slice(5, 8) + '-' + digits.slice(8);
    if (format === 2) return digits.slice(0, 2) + ' ' + digits.slice(2, 5) + ' ' + digits.slice(5, 8) + ' ' + digits.slice(8);
    return digits;
}

// Australian Company Number
function generateUniqueRandomAustralianCompanyNumber() {
    const format = Math.floor(Math.random() * 4);
    const digits = Array.from({
        length: 9
    }, () => Math.floor(Math.random() * 10)).join('');
    if (format === 0) return digits.slice(0, 3) + '.' + digits.slice(3, 6) + '.' + digits.slice(6);
    if (format === 1) return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
    if (format === 2) return digits.slice(0, 3) + ' ' + digits.slice(3, 6) + ' ' + digits.slice(6);
    return digits;
}

// Australian Drivers License Patterns
function generateUniqueRandomAustralianDriversLicense() {
    const format = Math.floor(Math.random() * 5);
    const length = [8, 9, 10][Math.floor(Math.random() * 3)];
    const digits = Array.from({
        length
    }, () => Math.floor(Math.random() * 10)).join('');
    if (format === 1) return digits.slice(0, 3) + ' ' + digits.slice(3, 6) + ' ' + digits.slice(6);
    if (format === 2) return digits.slice(0, 1) + ' ' + digits.slice(1, 4) + ' ' + digits.slice(4, 7) + ' ' + digits.slice(7);
    if (format === 3) return digits.slice(0, 1) + '-' + digits.slice(1, 4) + '-' + digits.slice(4, 7) + '-' + digits.slice(7);
    if (format === 4) return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
    return digits;
}

// Australian Full National Number (FNN)
function generateUniqueRandomAustralianFullNationalNumber() {
    const format = Math.floor(Math.random() * 4);
    const areaCode = ['02', '03', '07', '08'][Math.floor(Math.random() * 4)];
    const number = Array.from({
        length: 8
    }, () => Math.floor(Math.random() * 10)).join('');
    if (format === 0) return areaCode + ' ' + number.slice(0, 4) + ' ' + number.slice(4);
    if (format === 1) return '04' + number.slice(0, 2) + '-' + number.slice(2, 5) + '-' + number.slice(5);
    if (format === 2) return '+61 ' + '4' + number.slice(0, 2) + ' ' + number.slice(2, 5) + ' ' + number.slice(5);
    return '+61' + '4' + number;
}

// Australian Medicare card number
function generateUniqueRandomAustralianMedicareCardNumber() {
    const format = Math.floor(Math.random() * 3);
    const digits = Array.from({
        length: 10
    }, () => Math.floor(Math.random() * 10)).join('');
    if (format === 0) return digits.slice(0, 4) + '-' + digits.slice(4, 9) + '-' + digits.slice(9);
    if (format === 1) return digits.slice(0, 4) + ' ' + digits.slice(4, 9) + ' ' + digits.slice(9);
    return digits;
}

// Australian NSW Drivers License Pattern
function generateUniqueRandomAustralianNSWDriversLicense() {
    return Array.from({
        length: 8
    }, () => Math.floor(Math.random() * 10)).join('');
}

// Australian Queensland Drivers License Pattern
function generateUniqueRandomAustralianQLDDriversLicense() {
    return '0' + Array.from({
        length: 7
    }, () => Math.floor(Math.random() * 10)).join('');
}

// Australian Tax File Number
function generateUniqueRandomAustralianTaxFileNumber() {
    const format = Math.floor(Math.random() * 3);
    const digits = Array.from({
        length: 9
    }, () => Math.floor(Math.random() * 10)).join('');
    if (format === 0) return digits;
    if (format === 1) return digits.slice(0, 3) + ' ' + digits.slice(3, 6) + ' ' + digits.slice(6);
    return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
}

// Austrian Bank Account Numbers
function generateUniqueRandomAustrianBankAccountNumbers() {
    return Array.from({
        length: 16
    }, () => Math.floor(Math.random() * 10)).join('');
}

// Austrian Passport Number
function generateUniqueRandomAustrianPassportNumber() {
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const digits = Array.from({
        length: 7
    }, () => Math.floor(Math.random() * 10)).join('');
    return `${letter} ${digits}`;
}

// Austrian Social Security Insurance Number
function generateUniqueRandomAustrianSocialSecurityInsuranceNumber() {
    const part1 = Math.floor(Math.random() * 9000 + 1000);
    const part2 = Math.floor(Math.random() * 100);
    const part3 = Math.floor(Math.random() * 100);
    const part4 = Math.floor(Math.random() * 100);
    return `${part1} ${part2} ${part3} ${part4}`;
}

// Austrian VAT Identification Number (UID)
function generateUniqueRandomAustrianVATNumber() {
    return 'U' + Array.from({
        length: 8
    }, () => Math.floor(Math.random() * 10)).join('');
}

// Canadian Alberta Drivers License Pattern
function generateUniqueRandomCanadianAlbertaDriversLicense() {
    const format = Math.floor(Math.random() * 3);
    const digits = Array.from({
        length: 9
    }, () => Math.floor(Math.random() * 10)).join('');
    if (format === 0) return digits.slice(0, 6) + ' ' + digits.slice(6);
    if (format === 1) return digits.slice(0, 6) + '-' + digits.slice(6);
    return digits;
}

// Canadian Alberta Health Pattern
function generateUniqueRandomCanadianAlbertaHealth() {
    const format = Math.floor(Math.random() * 3);
    const digits = Array.from({
        length: 9
    }, () => Math.floor(Math.random() * 10)).join('');
    if (format === 0) return digits.slice(0, 5) + ' ' + digits.slice(5);
    if (format === 1) return digits.slice(0, 5) + '-' + digits.slice(5);
    return digits;
}

// Canadian Manitoba Drivers License Pattern
function generateUniqueRandomCanadianManitobaDriversLicense() {
    return Array.from({
        length: 9
    }, () => Math.floor(Math.random() * 10)).join('');
}

// Canadian Manitoba Health Pattern
function generateUniqueRandomCanadianManitobaHealth() {
    return Array.from({
        length: 7
    }, () => Math.floor(Math.random() * 10)).join('');
}

// Canadian Ontario Drivers License Pattern
function generateUniqueRandomCanadianOntarioDriversLicense() {
    const format = Math.floor(Math.random() * 3);
    const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const digits = Array.from({
        length: 14
    }, () => Math.floor(Math.random() * 10)).join('');
    if (format === 0) return letters + digits.slice(0, 4) + ' ' + digits.slice(4, 9) + ' ' + digits.slice(9);
    if (format === 1) return letters + digits.slice(0, 4) + '-' + digits.slice(4, 9) + '-' + digits.slice(9);
    return letters + digits;
}

// Canadian Ontario Health Pattern
function generateUniqueRandomCanadianOntarioHealth() {
    const format = Math.floor(Math.random() * 3);
    const digits = Array.from({
        length: 10
    }, () => Math.floor(Math.random() * 10)).join('');
    if (format === 0) return digits.slice(0, 4) + ' ' + digits.slice(4, 7) + ' ' + digits.slice(7);
    if (format === 1) return digits.slice(0, 4) + '-' + digits.slice(4, 7) + '-' + digits.slice(7);
    return digits;
}

// Canadian Passport Pattern
function generateUniqueRandomCanadianPassport() {
    const format = Math.floor(Math.random() * 2);
    const digits = 'AT' + Array.from({
        length: 18
    }, () => Math.floor(Math.random() * 10)).join('');
    if (format === 0) return digits.slice(0, 2) + ' ' + digits.slice(2, 6) + ' ' + digits.slice(6, 10) + ' ' + digits.slice(10, 14) + ' ' + digits.slice(14);
    return digits;
}

// Canadian Quebec Drivers License Pattern
function generateUniqueRandomCanadianQuebecDriversLicense() {
    const format = Math.floor(Math.random() * 3);
    const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const digits = Array.from({
        length: 12
    }, () => Math.floor(Math.random() * 10)).join('');
    if (format === 0) return letters + digits.slice(0, 4) + ' ' + digits.slice(4, 10) + ' ' + digits.slice(10);
    if (format === 1) return letters + digits.slice(0, 4) + '-' + digits.slice(4, 10) + '-' + digits.slice(10);
    return letters + digits;
}

// Canadian Quebec Health Pattern
function generateUniqueRandomCanadianQuebecHealth() {
    const format = Math.floor(Math.random() * 2);
    const letters = Array.from({
        length: 4
    }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
    const digits = Array.from({
        length: 8
    }, () => Math.floor(Math.random() * 10)).join('');
    if (format === 0) return letters + ' ' + digits.slice(0, 4) + ' ' + digits.slice(4);
    return letters + digits;
}

// Canadian Saskatchewan Drivers License Pattern
function generateUniqueRandomCanadianSaskatchewanDriversLicense() {
    return Array.from({
        length: 8
    }, () => Math.floor(Math.random() * 10)).join('');
}

// Canadian Social Insurance Number
function generateUniqueRandomCanadianSocialInsuranceNumber() {
    const format = Math.floor(Math.random() * 3);
    const digits = Array.from({
        length: 9
    }, () => Math.floor(Math.random() * 10)).join('');
    if (format === 0) return digits;
    if (format === 1) return digits.slice(0, 3) + ' ' + digits.slice(3, 6) + ' ' + digits.slice(6);
    return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
}

// Date (Multiple Formats)
function generateUniqueRandomDateFormats() {
    const format = Math.floor(Math.random() * 4);
    const day = String(Math.floor(Math.random() * 31) + 1).padStart(2, '0');
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const year = String(Math.floor(Math.random() * 100) + 1900);
    if (format === 0) return `${month}/${day}/${year}`;
    if (format === 1) return `${month}.${day}.${year}`;
    if (format === 2) return `${day}/${month}/${year}`;
    return `${day}.${month}.${year}`;
}

// France Drivers License Number
function generateUniqueRandomFranceDriversLicenseNumber() {
    const year = String(Math.floor(Math.random() * 100)).padStart(2, '0');
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const region = String(Math.floor(Math.random() * 96) + 1).padStart(2, '0');
    const randomDigits = Array.from({
        length: 6
    }, () => Math.floor(Math.random() * 10)).join('');
    return `${year}${month}${region}${randomDigits}`;
}

// France Passport Number
function generateUniqueRandomFrancePassportNumber() {
    const digits = Array.from({
        length: 7
    }, () => Math.floor(Math.random() * 10)).join('');
    const letters = Array.from({
        length: 2
    }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
    return `${letters}${digits}`;
}

// France Value Added Tax (VAT) Number
function generateUniqueRandomFranceVATNumber() {
    const format = Math.floor(Math.random() * 5);
    const digits = Array.from({
        length: 11
    }, () => Math.floor(Math.random() * 10)).join('');
    const letters = Array.from({
        length: 2
    }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
    if (format === 0) return digits;
    if (format === 1) return letters.charAt(0) + digits;
    if (format === 2) return digits.charAt(0) + letters.charAt(1) + digits.slice(1);
    return letters + digits.slice(2);
}

// French INSEE Code
function generateUniqueRandomFrenchINSEECode() {
    const gender = [1, 2, 3, 4, 7, 8][Math.floor(Math.random() * 6)];
    const year = String(Math.floor(Math.random() * 100)).padStart(2, '0');
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const region = String(Math.floor(Math.random() * 96) + 1).padStart(3, '0');
    const randomDigits = Array.from({
        length: 5
    }, () => Math.floor(Math.random() * 10)).join('');
    return `${gender}${year}${month}${region}${randomDigits}`;
}

// German Driver's License Number
function generateUniqueRandomGermanDriversLicenseNumber() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return Array.from({
        length: 12
    }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

// German ID Number
function generateUniqueRandomGermanIDNumber() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const part1 = Array.from({
        length: 10
    }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    const part2 = Array.from({
        length: 6
    }, () => Math.floor(Math.random() * 10)).join('');
    return `${part1}D ${part2}`;
}

// German Passport Number
function generateUniqueRandomGermanPassportNumber() {
    const chars = '0123456789CFGHJKNPRTVWXYZ';
    return Array.from({
        length: 9
    }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

// German Social Security Number
function generateUniqueRandomGermanSocialSecurityNumber() {
    const day = String(Math.floor(Math.random() * 31) + 1).padStart(2, '0');
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const year = String(Math.floor(Math.random() * 100)).padStart(2, '0');
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const middle = Array.from({
        length: 2
    }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    const end = Array.from({
        length: 3
    }, () => Math.floor(Math.random() * 10)).join('');
    return `${year}${month}${day}${middle}${end}`;
}

// German Tax Identifier/Code
function generateUniqueRandomGermanTaxIdentifier() {
    const format = Math.floor(Math.random() * 2);
    const digits = Array.from({
        length: 10
    }, () => Math.floor(Math.random() * 10)).join('');
    if (format === 0) return digits;
    if (format === 1) return digits.slice(0, 3) + '/' + digits.slice(3, 7) + '/' + digits.slice(7);
    return digits;
}

// Indian Aadhaar Number
function generateUniqueRandomIndianAadhaarNumber() {
    const format = Math.floor(Math.random() * 2);
    const digits = Array.from({
        length: 12
    }, () => Math.floor(Math.random() * 10)).join('');
    if (format === 0) return digits;
    return digits.slice(0, 4) + ' ' + digits.slice(4, 8) + ' ' + digits.slice(8);
}

// Indian PAN
function generateUniqueRandomIndianPAN() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    return Array.from({
            length: 3
        }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('') +
        'C' + // 'C' is for individual
        chars.charAt(Math.floor(Math.random() * chars.length)) +
        Array.from({
            length: 4
        }, () => digits.charAt(Math.floor(Math.random() * digits.length))).join('') +
        chars.charAt(Math.floor(Math.random() * chars.length));
}

// Italian Passport Number
function generateUniqueRandomItalianPassportNumber() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({
        length: 9
    }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

// Italian Tax ID/SSN (Codice Fiscale)
function generateUniqueRandomItalianTaxID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const surname = Array.from({
        length: 3
    }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    const name = Array.from({
        length: 3
    }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    const year = String(Math.floor(Math.random() * 100)).padStart(2, '0');
    const month = 'ABCDEHLMPRST'.charAt(Math.floor(Math.random() * 12));
    const day = String(Math.floor(Math.random() * 31) + 1).padStart(2, '0');
    const code = chars.charAt(Math.floor(Math.random() * chars.length));
    const end = Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * digits.length))).join('');
    return `${surname}${name}${year}${month}${day}${code}${end}`;
}

// Turkish Identification Number
function generateUniqueRandomTurkishID() {
    return Array.from({
        length: 11
    }, () => Math.floor(Math.random() * 10)).join('');
}

// UK BIC Number
function generateUniqueRandomUKBICNumber() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({
            length: 4
        }, () => chars.charAt(Math.floor(Math.random() * 26))).join('') +
        'GB' +
        Array.from({
            length: 2
        }, () => chars.charAt(Math.floor(Math.random() * 36))).join('') +
        Array.from({
            length: 3
        }, () => chars.charAt(Math.floor(Math.random() * 36))).join('');
}

// UK Driver License Number
function generateUniqueRandomUKDriverLicenseNumber() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({
            length: 5
        }, () => chars.charAt(Math.floor(Math.random() * 36))).join('') +
        Math.floor(Math.random() * 6) +
        Math.floor(Math.random() * 31).toString().padStart(2, '0') +
        Array.from({
            length: 3
        }, () => chars.charAt(Math.floor(Math.random() * 36))).join('') +
        Array.from({
            length: 2
        }, () => chars.charAt(Math.floor(Math.random() * 36))).join('');
}

// UK Electoral Roll Number
function generateUniqueRandomUKElectoralRollNumber() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    return Array.from({
            length: 2 + Math.floor(Math.random() * 2)
        }, () => chars.charAt(Math.floor(Math.random() * 26))).join('') +
        Array.from({
            length: 1 + Math.floor(Math.random() * 3)
        }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
}

// UK IBAN Number
function generateUniqueRandomUKIBANNumber() {
    const format = Math.floor(Math.random() * 2);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const iban = 'GB' +
        Array.from({
            length: 2
        }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') +
        Array.from({
            length: 4
        }, () => chars.charAt(Math.floor(Math.random() * 26))).join('') +
        Array.from({
            length: 14
        }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 0) return iban.slice(0, 4) + ' ' + iban.slice(4, 8) + ' ' + iban.slice(8, 12) + ' ' + iban.slice(12, 16) + ' ' + iban.slice(16);
    return iban;
}

// UK National Health Service (NHS) Number
function generateUniqueRandomUKNHSNumber() {
    const format = Math.floor(Math.random() * 5);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const nhs = Array.from({
        length: 10
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 0) return Array.from({
        length: 8
    }, () => chars.charAt(Math.floor(Math.random() * 26))).join('') + nhs.slice(-1);
    if (format === 1) return nhs.slice(0, 3) + '.' + nhs.slice(3, 6) + '.' + nhs.slice(6);
    if (format === 2) return nhs.slice(0, 3) + ' ' + nhs.slice(3, 6) + ' ' + nhs.slice(6);
    if (format === 3) return nhs.slice(0, 3) + '-' + nhs.slice(3, 6) + '-' + nhs.slice(6);
    return nhs;
}

// UK National Insurance Number
function generateUniqueRandomUKNationalInsuranceNumber() {
    const format = Math.floor(Math.random() * 14);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const ni = Array.from({
        length: 8
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    const prefix = chars.charAt(Math.floor(Math.random() * 26)) + chars.charAt(Math.floor(Math.random() * 26));
    const suffix = chars.charAt(Math.floor(Math.random() * 4));
    if (format < 14) return `${prefix}${ni}${suffix}`;
}

// UK Passport Number
function generateUniqueRandomUKPassportNumber() {
    return Array.from({
        length: 9
    }, () => Math.floor(Math.random() * 10)).join('');
}

// UK Postcode
function generateUniqueRandomUKPostcode() {
    const format = Math.floor(Math.random() * 5);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    if (format === 0) return 'GIR 0AA';
    if (format === 1) return chars.charAt(Math.floor(Math.random() * 26)) + digits.charAt(Math.floor(Math.random() * 10)) + ' ' + digits.charAt(Math.floor(Math.random() * 10)) + chars.charAt(Math.floor(Math.random() * 26)) + chars.charAt(Math.floor(Math.random() * 26));
    if (format === 2) return chars.charAt(Math.floor(Math.random() * 26)) + chars.charAt(Math.floor(Math.random() * 8)) + digits.charAt(Math.floor(Math.random() * 10)) + ' ' + digits.charAt(Math.floor(Math.random() * 10)) + chars.charAt(Math.floor(Math.random() * 26)) + chars.charAt(Math.floor(Math.random() * 26));
    if (format === 3) return chars.charAt(Math.floor(Math.random() * 26)) + digits.charAt(Math.floor(Math.random() * 10)) + chars.charAt(Math.floor(Math.random() * 26)) + ' ' + digits.charAt(Math.floor(Math.random() * 10)) + chars.charAt(Math.floor(Math.random() * 26)) + chars.charAt(Math.floor(Math.random() * 26));
    return chars.charAt(Math.floor(Math.random() * 26)) + chars.charAt(Math.floor(Math.random() * 8)) + digits.charAt(Math.floor(Math.random() * 10)) + chars.charAt(Math.floor(Math.random() * 26)) + ' ' + digits.charAt(Math.floor(Math.random() * 10)) + chars.charAt(Math.floor(Math.random() * 26)) + chars.charAt(Math.floor(Math.random() * 26));
}

// UK SEDOL
function generateUniqueRandomUKSEDOL() {
    const chars = 'BCDFGHJKLMNPQRSTVWXYZ0123456789';
    return Array.from({
        length: 7
    }, () => chars.charAt(Math.floor(Math.random() * 33))).join('');
}

// UK Sort Code
function generateUniqueRandomUKSortCode() {
    const part1 = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    const part2 = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    const part3 = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${part1}-${part2}-${part3}`;
}

// UK Unique Taxpayer Reference (UTR)
function generateUniqueRandomUKUTR() {
    const format = Math.floor(Math.random() * 2);
    const digits = Array.from({
        length: 10
    }, () => Math.floor(Math.random() * 10)).join('');
    if (format === 0) return digits.slice(0, 5) + ' ' + digits.slice(5);
    return digits;
}

// US Driver License Number
function generateUniqueRandomUSDriverLicenseNumber() {
    const format = Math.floor(Math.random() * 36);
    const digits = '0123456789';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (format === 0) return Array.from({
        length: 7
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 1) return chars.charAt(Math.floor(Math.random() * 26)) + Array.from({
        length: 8
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 2) return '9' + Array.from({
        length: 8
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 3) return chars.charAt(Math.floor(Math.random() * 26)) + Array.from({
        length: 7
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 4) return Array.from({
        length: 2
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 4
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 5) return Array.from({
        length: 9
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 6) return chars.charAt(Math.floor(Math.random() * 26)) + Array.from({
        length: 12
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 7) return chars.charAt(Math.floor(Math.random() * 26)) + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 2
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + digits.charAt(Math.floor(Math.random() * 10));
    if (format === 8) return 'H' + Array.from({
        length: 8
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 9) return Array.from({
        length: 2
    }, () => chars.charAt(Math.floor(Math.random() * 26))).join('') + Array.from({
        length: 6
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 10) return Array.from({
        length: 1
    }, () => chars.charAt(Math.floor(Math.random() * 26))).join('') + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 4
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 4
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 11) return Array.from({
        length: 4
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 2
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 4
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 12) return Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + Array.from({
        length: 2
    }, () => chars.charAt(Math.floor(Math.random() * 26))).join('') + Array.from({
        length: 4
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 13) return 'K' + Array.from({
        length: 2
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 2
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 4
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 14) return Array.from({
        length: 1
    }, () => chars.charAt(Math.floor(Math.random() * 26))).join('') + Array.from({
        length: 2
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 15) return Array.from({
        length: 1
    }, () => chars.charAt(Math.floor(Math.random() * 26))).join('') + '-' + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 16) return Array.from({
        length: 1
    }, () => chars.charAt(Math.floor(Math.random() * 26))).join('') + ' ' + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + ' ' + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + ' ' + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + ' ' + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 17) return Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 2
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 4
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 18) return Array.from({
        length: 1
    }, () => chars.charAt(Math.floor(Math.random() * 26))).join('') + Array.from({
        length: 9
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 19) return Array.from({
        length: 2
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + Array.from({
        length: 3
    }, () => chars.charAt(Math.floor(Math.random() * 26))).join('') + Array.from({
        length: 2
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + Array.from({
        length: 2
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '41' + Array.from({
        length: 2
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 20) return Array.from({
        length: 2
    }, () => chars.charAt(Math.floor(Math.random() * 26))).join('') + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + Array.from({
        length: 2
    }, () => chars.charAt(Math.floor(Math.random() * 26))).join('') + Array.from({
        length: 2
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + Array.from({
        length: 1
    }, () => chars.charAt(Math.floor(Math.random() * 26))).join('') + Array.from({
        length: 2
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 21) return Array.from({
        length: 1
    }, () => chars.charAt(Math.floor(Math.random() * 26))).join('') + Array.from({
        length: 4
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + ' ' + Array.from({
        length: 5
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + ' ' + Array.from({
        length: 5
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 22) return Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + ' ' + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + ' ' + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 23) return Array.from({
        length: 12
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 24) return Array.from({
        length: 3
    }, () => chars.charAt(Math.floor(Math.random() * 26))).join('') + '-' + Array.from({
        length: 2
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 4
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 25) return Array.from({
        length: 2
    }, () => chars.charAt(Math.floor(Math.random() * 26))).join('') + Array.from({
        length: 6
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 26) return Array.from({
        length: 2
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + ' ' + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + ' ' + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 27) return Array.from({
        length: 2
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + Array.from({
        length: 5
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 28) return Array.from({
        length: 8
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 29) return Array.from({
        length: 7
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + chars.charAt(Math.floor(Math.random() * 26));
    if (format === 30) return Array.from({
        length: 1
    }, () => chars.charAt(Math.floor(Math.random() * 26))).join('') + Array.from({
        length: 2
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 2
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 4
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 31) return Array.from({
        length: 5
    }, () => chars.charAt(Math.floor(Math.random() * 26))).join('').slice(0, 3) + '***' + Array.from({
        length: 3
    }, () => chars.charAt(Math.floor(Math.random() * 26))).join('').slice(2, 5) + ' ' + Array.from({
        length: 3
    }, () => chars.charAt(Math.floor(Math.random() * 26))).join('').slice(0, 3);
    if (format === 32) return chars.charAt(Math.floor(Math.random() * 26)) + Array.from({
        length: 6
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 33) return chars.charAt(Math.floor(Math.random() * 26)) + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 4
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 4
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 2
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 34) return Array.from({
        length: 6
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('') + '-' + Array.from({
        length: 3
    }, () => digits.charAt(Math.floor(Math.random() * 10))).join('');
    if (format === 35) return 'WDL' + Array.from({
        length: 9
    }, () => chars.charAt(Math.floor(Math.random() * 36))).join('');
}

// US Individual Taxpayer Identification Number (ITIN)
function generateUniqueRandomUSITIN() {
    const format = Math.floor(Math.random() * 4);
    const digits = '9' + Array.from({
        length: 2
    }, () => Math.floor(Math.random() * 10)).join('') + (7 + Math.floor(Math.random() * 2)) + Array.from({
        length: 5
    }, () => Math.floor(Math.random() * 10)).join('');
    if (format === 0) return digits;
    if (format === 1) return digits.slice(0, 3) + '-' + digits.slice(3, 5) + '-' + digits.slice(5);
    if (format === 2) return digits.slice(0, 3) + ' ' + digits.slice(3, 5) + ' ' + digits.slice(5);
    return digits.slice(0, 3) + '.' + digits.slice(3, 5) + '.' + digits.slice(5);
}

// US Medicare Health Insurance Claim (HIC) Number
function generateUniqueRandomUSMedicareHICNumber() {
    const format = Math.floor(Math.random() * 4);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const digits = Array.from({
        length: 9
    }, () => chars.charAt(Math.floor(Math.random() * 36))).join('');
    if (format === 0) return digits;
    if (format === 1) return Array.from({
        length: 3
    }, () => chars.charAt(Math.floor(Math.random() * 36))).join('') + ' ' + digits;
    if (format === 2) return Array.from({
        length: 3
    }, () => chars.charAt(Math.floor(Math.random() * 36))).join('') + '-' + digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
    return Array.from({
        length: 3
    }, () => chars.charAt(Math.floor(Math.random() * 36))).join('') + '-' + digits.slice(0, 3) + ' ' + digits.slice(3, 5) + '-' + digits.slice(5) + '-' + digits.slice(-3);
}

// US Passport Number
function generateUniqueRandomUSPassportNumber() {
    const digits = Array.from({
        length: 9
    }, () => Math.floor(Math.random() * 10)).join('');
    if (Math.random() > 0.5) return digits.slice(0, 8);
    return digits;
}

// US Social Security Number (SSN)
function generateUniqueRandomUSSSN() {
    const format = Math.floor(Math.random() * 3);
    const digits = Array.from({
        length: 9
    }, () => Math.floor(Math.random() * 10)).join('');
    if (format === 0) return digits.slice(0, 3) + '-' + digits.slice(3, 5) + '-' + digits.slice(5);
    if (format === 1) return digits.slice(0, 3) + ' ' + digits.slice(3, 5) + ' ' + digits.slice(5);
    return digits;
}

// US Social Security Number Randomization
function generateUniqueRandomUSSSNRandomization() {
    const format = Math.floor(Math.random() * 3);
    const digits = Array.from({
        length: 9
    }, () => Math.floor(Math.random() * 10)).join('');
    if (format === 0) return digits.slice(0, 3) + '-' + digits.slice(3, 5) + '-' + digits.slice(5);
    if (format === 1) return digits.slice(0, 3) + ' ' + digits.slice(3, 5) + ' ' + digits.slice(5);
    return digits;
}

// US Vehicle Identification Number (VIN)
function generateUniqueRandomUSVIN() {
    const format = Math.floor(Math.random() * 2);
    const chars = '0123456789ABCDEFGHJKLMNPRSTUVWXYZ';
    const vin = Array.from({
        length: 17
    }, () => chars.charAt(Math.floor(Math.random() * 33))).join('');
    if (format === 0) return vin.slice(0, 3) + '-' + vin.slice(3, 8) + '-' + vin.slice(8, 9) + '-' + vin.slice(9);
    return vin;
}

// US Zip Code
function generateUniqueRandomUSZipCode() {
    const zip = Array.from({
        length: 5
    }, () => Math.floor(Math.random() * 10)).join('');
    if (Math.random() > 0.5) return zip + '-' + Array.from({
        length: 4
    }, () => Math.floor(Math.random() * 10)).join('');
    return zip;
}

// China Taxpayer Identification Number
function generateUniqueRandomChinaTIN() {
    return Math.floor(100000000000000000 + Math.random() * 900000000000000000).toString();
}

//Japan SSN
function generateUniqueRandomJapanSSN() {
    function getRandomSixDigits() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    const part1 = getRandomSixDigits();
    const part2 = getRandomSixDigits();

    return `${part1}${part2}`;
}


// Korea Resident Registration Number
function generateUniqueRandomKoreaRRN() {
    const part1 = Math.floor(100000 + Math.random() * 900000).toString();
    const part2 = Math.floor(1000000 + Math.random() * 9000000).toString();
    return `${part1}${part2}`;
}

// New Zealand IRD
function generateUniqueRandomIRD() {
    function getRandomThreeDigits() {
        return Math.floor(100 + Math.random() * 900).toString().padStart(3, '0');
    }

    const part1 = getRandomThreeDigits();
    const part2 = getRandomThreeDigits();
    const part3 = getRandomThreeDigits();

    return `${part1}-${part2}-${part3}`;
}


// Philippines SSS
function generateUniqueRandomSSS() {
    function getRandomTwoDigits() {
        return Math.floor(10 + Math.random() * 90).toString();
    }

    function getRandomSevenDigits() {
        return Math.floor(1000000 + Math.random() * 9000000).toString();
    }

    function getRandomOneDigit() {
        return Math.floor(1 + Math.random() * 9).toString();
    }

    const part1 = getRandomTwoDigits();
    const part2 = getRandomSevenDigits();
    const part3 = getRandomOneDigit();

    return `${part1}-${part2}-${part3}`;
}

// Belgium INSZ/NISS
function generateUniqueRandomINSZ() {
    function getRandomDigits(count) {
        const factor = Math.pow(10, count - 1);
        return Math.floor(factor + Math.random() * 9 * factor).toString().padStart(count, '0');
    }

    const part1 = getRandomDigits(6);
    const part2 = getRandomDigits(5);

    return `${part1}${part2}`;
}


// Germany Steuer-Identnummer
function generateUniqueRandomStNr() {
    return Math.floor(10000000000 + Math.random() * 90000000000).toString();
}

// France NIR
function generateUniqueRandomNIR() {
    function getRandomThirteenDigits() {
        return Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
    }

    function getRandomTwoDigits() {
        return Math.floor(10 + Math.random() * 90).toString().padStart(2, '0');
    }

    const part1 = getRandomThirteenDigits();
    const part2 = getRandomTwoDigits();

    return `${part1}-${part2}`;
}

// Italy Codice Fiscale
function generateUniqueRandomCodiceFiscale() {
    function getRandomThreeDigits() {
        return Math.floor(100 + Math.random() * 900).toString();
    }

    const part1 = getRandomThreeDigits();
    const part2 = getRandomThreeDigits();
    const part3 = getRandomThreeDigits();
    const part4 = getRandomThreeDigits();

    return `${part1}–${part2}–${part3}–${part4}`;
}

// Netherlands BSN
function generateUniqueRandomBSN() {
    return `${Math.floor(100000000 + Math.random() * 900000000)}`;
}

// Portugal NISS
function generateUniqueRandomNISS() {
    return Math.floor(10000000000 + Math.random() * 90000000000).toString();
}

// Russia INN
function generateUniqueRandomINN() {
    const firstNineDigits = Math.floor(100000000 + Math.random() * 900000000).toString().padStart(9, '0');
    const checksum = Math.floor(10 + Math.random() * 90).toString().padStart(2, '0');
    const separator = Math.random() > 0.5 ? ' ' : '-';
    return `${firstNineDigits.substring(0, 3)}-${firstNineDigits.substring(3, 6)}-${firstNineDigits.substring(6, 9)}${separator}${checksum}`;
}

// Spain NUSS
function generateUniqueRandomNUSS() {
    let nuss = '';
    while (nuss.length < 12) {
        nuss += Math.floor(Math.random() * 10).toString();
    }
    return nuss;
}

// Ukraine INPP
function generateUniqueRandomINPP() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

// Brazil CPF
function generateUniqueRandomCPF() {
    function getRandomDigit() {
        return Math.floor(Math.random() * 10).toString();
    }

    return `${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}.${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}.${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}-${getRandomDigit()}${getRandomDigit()}`;
}

function generateUniqueRandomWord() {
    const characters = 'abcdefghijklmnopqrstuvwxyz'; 
    const wordLength = Math.floor(Math.random() * 8) + 3;  
    let randomWord = '';

    for (let i = 0; i < wordLength; i++) {
        randomWord += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    if (!usedWords.has(randomWord)) {
        usedWords.add(randomWord); 
        return randomWord; 
    } else {

        return generateUniqueRandomWord();
    }
}

debug("Random Words:", generateUniqueRandomCreditCard());

debug("Random Credit Card Number:", generateUniqueRandomCreditCard());
debug("Random Crypto Address:", generateUniqueRandomCryptoAddress());
debug("Random Email Address:", generateUniqueRandomEmail());
debug("Random IBAN Code:", generateUniqueRandomIBAN());
debug("Random IP Address:", generateUniqueRandomIPAddress());
debug("Random Phone Number:", generateUniqueRandomPhoneNumber());

debug("Random ABA RTN:", generateUniqueRandomABARTN());
debug("Random Australian Business Number:", generateUniqueRandomAustralianBusinessNumber());
debug("Random Australian Company Number:", generateUniqueRandomAustralianCompanyNumber());
debug("Random Australian Drivers License:", generateUniqueRandomAustralianDriversLicense());
debug("Random Australian Full National Number:", generateUniqueRandomAustralianFullNationalNumber());
debug("Random Australian Medicare Card Number:", generateUniqueRandomAustralianMedicareCardNumber());
debug("Random Australian NSW Drivers License:", generateUniqueRandomAustralianNSWDriversLicense());
debug("Random Australian QLD Drivers License:", generateUniqueRandomAustralianQLDDriversLicense());
debug("Random Australian Tax File Number:", generateUniqueRandomAustralianTaxFileNumber());
debug("Random Austrian Bank Account Number:", generateUniqueRandomAustrianBankAccountNumbers());
debug("Random Austrian Passport Number:", generateUniqueRandomAustrianPassportNumber());
debug("Random Austrian Social Security Insurance Number:", generateUniqueRandomAustrianSocialSecurityInsuranceNumber());
debug("Random Austrian VAT Number:", generateUniqueRandomAustrianVATNumber());
debug("Random Canadian Alberta Drivers License:", generateUniqueRandomCanadianAlbertaDriversLicense());
debug("Random Canadian Alberta Health Number:", generateUniqueRandomCanadianAlbertaHealth());
debug("Random Canadian Manitoba Drivers License:", generateUniqueRandomCanadianManitobaDriversLicense());
debug("Random Canadian Manitoba Health Number:", generateUniqueRandomCanadianManitobaHealth());
debug("Random Canadian Ontario Drivers License:", generateUniqueRandomCanadianOntarioDriversLicense());
debug("Random Canadian Ontario Health Number:", generateUniqueRandomCanadianOntarioHealth());
debug("Random Canadian Passport Number:", generateUniqueRandomCanadianPassport());
debug("Random Canadian Quebec Drivers License:", generateUniqueRandomCanadianQuebecDriversLicense());
debug("Random Canadian Quebec Health Number:", generateUniqueRandomCanadianQuebecHealth());
debug("Random Canadian Saskatchewan Drivers License:", generateUniqueRandomCanadianSaskatchewanDriversLicense());
debug("Random Canadian Social Insurance Number:", generateUniqueRandomCanadianSocialInsuranceNumber());
debug("Random Date Format:", generateUniqueRandomDateFormats());
debug("Random France Drivers License Number:", generateUniqueRandomFranceDriversLicenseNumber());
debug("Random France Passport Number:", generateUniqueRandomFrancePassportNumber());
debug("Random France VAT Number:", generateUniqueRandomFranceVATNumber());
debug("Random French INSEE Code:", generateUniqueRandomFrenchINSEECode());
debug("Random German Drivers License Number:", generateUniqueRandomGermanDriversLicenseNumber());
debug("Random German ID Number:", generateUniqueRandomGermanIDNumber());
debug("Random German Passport Number:", generateUniqueRandomGermanPassportNumber());
debug("Random German Social Security Number:", generateUniqueRandomGermanSocialSecurityNumber());
debug("Random German Tax Identifier:", generateUniqueRandomGermanTaxIdentifier());
debug("Random Indian Aadhaar Number:", generateUniqueRandomIndianAadhaarNumber());
debug("Random Indian PAN:", generateUniqueRandomIndianPAN());
debug("Random Italian Passport Number:", generateUniqueRandomItalianPassportNumber());
debug("Random Italian Tax ID:", generateUniqueRandomItalianTaxID());
debug("Random Turkish ID:", generateUniqueRandomTurkishID());
debug("Random UK BIC Number:", generateUniqueRandomUKBICNumber());
debug("Random UK Driver License Number:", generateUniqueRandomUKDriverLicenseNumber());
debug("Random UK Electoral Roll Number:", generateUniqueRandomUKElectoralRollNumber());
debug("Random UK IBAN Number:", generateUniqueRandomUKIBANNumber());
debug("Random UK NHS Number:", generateUniqueRandomUKNHSNumber());
debug("Random UK National Insurance Number:", generateUniqueRandomUKNationalInsuranceNumber());
debug("Random UK Passport Number:", generateUniqueRandomUKPassportNumber());
debug("Random UK Postcode:", generateUniqueRandomUKPostcode());
debug("Random UK SEDOL:", generateUniqueRandomUKSEDOL());
debug("Random UK Sort Code:", generateUniqueRandomUKSortCode());
debug("Random UK UTR:", generateUniqueRandomUKUTR());
debug("Random US Driver License Number:", generateUniqueRandomUSDriverLicenseNumber());
debug("Random US ITIN:", generateUniqueRandomUSITIN());
debug("Random US Medicare HIC Number:", generateUniqueRandomUSMedicareHICNumber());
debug("Random US Passport Number:", generateUniqueRandomUSPassportNumber());
debug("Random US SSN:", generateUniqueRandomUSSSN());
debug("Random US SSN Randomization:", generateUniqueRandomUSSSNRandomization());
debug("Random US VIN:", generateUniqueRandomUSVIN());
debug("Random US Zip Code:", generateUniqueRandomUSZipCode());

debug("Random China TIN:", generateUniqueRandomChinaTIN());
debug("Random Japan SSN:", generateUniqueRandomJapanSSN());
debug("Random Korea RRN:", generateUniqueRandomKoreaRRN());
debug("Random New Zealand IRD:", generateUniqueRandomIRD());
debug("Random Philippines SSS:", generateUniqueRandomSSS());
debug("Random Belgium INSZ:", generateUniqueRandomINSZ());
debug("Random Germany StNr:", generateUniqueRandomStNr());
debug("Random France NIR:", generateUniqueRandomNIR());
debug("Random Italy Codice Fiscale:", generateUniqueRandomCodiceFiscale());
debug("Random Netherlands BSN:", generateUniqueRandomBSN());
debug("Random Portugal NISS:", generateUniqueRandomNISS());
debug("Random Russia INN:", generateUniqueRandomINN());
debug("Random Spain NUSS:", generateUniqueRandomNUSS());
debug("Random Ukraine INPP:", generateUniqueRandomINPP());
debug("Random Brazil CPF:", generateUniqueRandomCPF());

function matchCreditCardNumbers(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b(?:\d{4}[ -]?){3}(?=\d{4}\b)(?:\d{4})|3[47][0-9]{2}([ -]?)([0-9]{6}\1[0-9]{5})\b/g;

    const matches = text.match(regex);
    //debug("matchCreditCardNumbers:",matches); 

    return matches;
}

function matchCryptoAddresses(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}\b/g;

    const matches = text.match(regex);
    //debug("matchCryptoAddresses:",matches);   

    return matches;
}


function matchEmailAddresses(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

    const matches = text.match(regex);
    //debug("matchEmailAddresses:",matches);

    return matches;

}

function matchIBANCodes(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b(?:(?:CR|DE|ME|RS|VA)\d{20}|(?:CZ|ES|SE|SK|TN)\d{22}|(?:DK|FI|FO|GL|SD)\d{16}|(?:AT|BA|EE|LT|XK)\d{18}|(?:AE|IL|TL)\d{21}|(?:LY|PT|ST)\d{23}|(?:IT|SM)\d{2}[A-Z]\d{10}[A-Za-z0-9]{12}|(?:HU|PL)\d{26}|(?:AL|CY)\d{10}[A-Za-z0-9]{16}|(?:CH|LI)\d{7}[A-Za-z0-9]{12}|(?:FR|MC)\d{12}[A-Za-z0-9]{11}\d{2}|(?:GB|IE)\d{2}[A-Z]{4}\d{14}|(?:KZ|LU)\d{5}[A-Za-z0-9]{13}|(?:GI|IQ)\d{2}[A-Z]{4}[A-Za-z0-9]{15}|(?:PK|RO)\d{2}[A-Z]{4}[A-Za-z0-9]{16}|(?:PS|QA)\d{2}[A-Z]{4}[A-Za-z0-9]{21}|AD\d{10}[A-Za-z0-9]{12}|AZ\d{2}[A-Z]{4}[A-Za-z0-9]{20}|BE\d{14}|BG\d{2}[A-Z]{4}\d{6}[A-Za-z0-9]{8}|BH\d{2}[A-Z]{4}[A-Za-z0-9]{14}|BR\d{25}[A-Z][A-Za-z0-9]|BY\d{2}[A-Za-z0-9]{4}\d{4}[A-Za-z0-9]{16}|DO\d{2}[A-Za-z0-9]{4}\d{20}|EG\d{27}|GE\d{2}[A-Z]\d{16}|GT\d{2}[A-Za-z0-9]{24}|GR\d{9}[A-Za-z0-9]{16}|HR\d{19}|IS\d{24}|JO\d{2}[A-Z]{4}\d{4}[A-Za-z0-9]{18}|KW\d{2}[A-Z]{4}[A-Za-z0-9]{22}|LC\d{2}[A-Z]{4}[A-Za-z0-9]{24}|LB\d{6}[A-Za-z0-9]{20}|LV\d{2}[A-Z]{4}\d{13}|MD\d{2}[A-Za-z0-9]{20}|MK\d{5}[A-Za-z0-9]{10}\d{2}|MR\d{25}|MT\d{2}[A-Z]{4}\d{5}[A-Za-z0-9]{18}|MU\d{2}[A-Z]{4}\d{19}[A-Z]{3}|NL\d{2}[A-Z]{4}\d{10}|NO\d{13}|SA\d{4}[A-Za-z0-9]{18}|SC\d{2}[A-Z]{4}\d{20}[A-Z]{3}|SI\d{17}|SV\d{2}[A-Z]{4}\d{20}|TR\d{8}[A-Za-z0-9]{16}|UA\d{8}[A-Za-z0-9]{19}|VG\d{2}[A-Z]{4}\d{16}|GE\d{2}[A-Z]{2}\d{16})\b/g;
    const matches = text.match(regex);
    //debug("matchIBANCodes:",matches); 

    return matches;

}

function matchIPAddresses(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

    const matches = text.match(regex);
    //debug("matchIPAddresses:",matches); 

    return matches;
}

//https://regex101.com/r/DsaRfI/1
function matchPhoneNumbers(text) {

    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g;

    const matches = text.match(regex);
    //debug("matchPhoneNumbers:",matches); 

    return matches;
}

function matchSecretToken(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
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

// American Banker Association routing transit numbers (ABA RTN)
function matchABARTN(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b((0[0-9])|(1[0-2])|(2[1-9])|(3[0-2])|(6[1-9])|(7[0-2])|80)([0-9]{7})\b/g;
    const matches = text.match(regex);

    return matches;
}

// Australian Business Number
function matchAustralianBusinessNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b\d{2}\.\d{3}\.\d{3}\.\d{3}\b/g,
        /\b\d{2}-\d{3}-\d{3}-\d{3}\b/g,
        /\b\d{2} \d{3} \d{3} \d{3}\b/g,
        /\b\d{11}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// Australian Company Number
function matchAustralianCompanyNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b\d{3}\.\d{3}\.\d{3}\b/g,
        /\b\d{3}-\d{3}-\d{3}\b/g,
        /\b\d{3} \d{3} \d{3}\b/g,
        /\b\d{9}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// Australian Drivers License Patterns
function matchAustralianDriversLicense(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[0-9]{8,10}\b/g,
        /\b[0-9]{3} [0-9]{3} [0-9]{3}\b/g,
        /\b[0-9]{1} [0-9]{3} [0-9]{3} [0-9]{3}\b/g,
        /\b[0-9]{1}-[0-9]{3}-[0-9]{3}-[0-9]{3}\b/g,
        /\b[0-9]{3}-[0-9]{3}-[0-9]{3}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// Australian Full National Number (FNN)
function matchAustralianFullNationalNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b(0[2378]|\(0[2378]\)|\+61[2378]) ?\d{4}[- ]?\d{4}\b/g,
        /\b04\d{2}-\d{3}-\d{3}\b/g,
        /\b(0|\+61 )4\d{2} \d{3} \d{3}\b/g,
        /\b(0|\+61)4\d{8}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}


// Australian Medicare card number
function matchAustralianMedicareCardNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b\d{4}-\d{5}-\d\b/g,
        /\b\d{4} \d{5} \d\b/g,
        /\b\d{10}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// Australian NSW Drivers License Pattern
function matchAustralianNSWDriversLicense(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b[0-9]{8}\b/g;
    return text.match(regex);
}

// Australian Queensland Drivers License Pattern
function matchAustralianQLDDriversLicense(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b0[0-9]{7}\b/g;
    return text.match(regex);
}

// Australian Tax File Number
function matchAustralianTaxFileNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[0-9]{9}\b/g,
        /\b[0-9]{3} [0-9]{3} [0-9]{3}\b/g,
        /\b[0-9]{3}-[0-9]{3}-[0-9]{3}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// Austrian Bank Account Numbers
function matchAustrianBankAccountNumbers(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b\d{16}\b/g;
    return text.match(regex);
}

// Austrian Passport Number
function matchAustrianPassportNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b[A-Za-z] ?\d{7}\b/g;
    return text.match(regex);
}

// Austrian Social Security Insurance Number
function matchAustrianSocialSecurityInsuranceNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b[1-9][0-9]{3} ?[0-9]{2} ?[0-9]{2} ?[0-9]{2}\b/g;
    return text.match(regex);
}

// Austrian VAT Identification Number (UID)
function matchAustrianVATNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\bU[0-9]{8}\b/g;
    return text.match(regex);
}

// Canadian Alberta Drivers License Pattern
function matchCanadianAlbertaDriversLicense(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[0-9]{6} [0-9]{3}\b/g,
        /\b[0-9]{6}-[0-9]{3}\b/g,
        /\b[0-9]{9}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// Canadian Alberta Health Pattern
function matchCanadianAlbertaHealth(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[0-9]{5} [0-9]{4}\b/g,
        /\b[0-9]{5}-[0-9]{4}\b/g,
        /\b[0-9]{9}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// Canadian Manitoba Drivers License Pattern
function matchCanadianManitobaDriversLicense(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b[0-9]{9}\b/g;
    return text.match(regex);
}

// Canadian Manitoba Health Pattern
function matchCanadianManitobaHealth(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b[0-9]{7}\b/g;
    return text.match(regex);
}

// Canadian Ontario Drivers License Pattern
function matchCanadianOntarioDriversLicense(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[A-Z][0-9]{4} [0-9]{5} [0-9]{5}\b/g,
        /\b[A-Z][0-9]{4}-[0-9]{5}-[0-9]{5}\b/g,
        /\b[A-Z][0-9]{14}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// Canadian Ontario Health Pattern
function matchCanadianOntarioHealth(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[0-9]{4} [0-9]{3} [0-9]{3}[A-Z]?\b/g,
        /\b[0-9]{4}-[0-9]{3}-[0-9]{3}[A-Z]?\b/g,
        /\b[0-9]{10}[A-Z]?\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// Canadian Passport Pattern
function matchCanadianPassport(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\bAT[0-9]{2} [0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}\b/g,
        /\bAT[0-9]{18}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// Canadian Quebec Drivers License Pattern
function matchCanadianQuebecDriversLicense(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[A-Z][0-9]{4} [0-9]{6} [0-9]{2}\b/g,
        /\b[A-Z][0-9]{4}-[0-9]{6}-[0-9]{2}\b/g,
        /\b[A-Z][0-9]{12}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// Canadian Quebec Health Pattern
function matchCanadianQuebecHealth(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[A-Z]{4} [0-9]{4} [0-9]{4}\b/g,
        /\b[A-Z]{4}[0-9]{8}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// Canadian Saskatchewan Drivers License Pattern
function matchCanadianSaskatchewanDriversLicense(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b[0-9]{8}\b/g;
    return text.match(regex);
}

// Canadian Social Insurance Number
function matchCanadianSocialInsuranceNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[1-79][0-9]{8}\b/g,
        /\b[1-79][0-9]{2} [0-9]{3} [0-9]{3}\b/g,
        /\b[1-79][0-9]{2}-[0-9]{3}-[0-9]{3}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// Date (Multiple Formats)
function matchDateFormats(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[01])\/[0-9]{2,4}\b/g,
        /\b(0[1-9]|1[0-2])\.(0[1-9]|[1-2][0-9]|3[01])\.[0-9]{2,4}\b/g,
        /\b(0[1-9]|[1-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/[0-9]{2,4}\b/g,
        /\b(0[1-9]|[1-2][0-9]|3[01])\.(0[1-2]|1[0-2])\.[0-9]{2,4}\b/g
    ];
    let matches = [];
    regexArray.forEach(regex => {
        const match = text.match(regex);
        if (match) {
            matches = matches.concat(match);
        }
    });
    return matches;
}

// France Drivers License Number
function matchFranceDriversLicenseNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|1[0-9]|2A|2a|2B|2b|2[1-9]|[3-8][0-9]|9[0-5])[0-9]{6}\b/g;
    return text.match(regex);
}

// France Passport Number
function matchFrancePassportNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[0-9]{2}[a-z]{2}[0-9]{5}\b/g,
        /\b[0-9]{2}[A-Z]{2}[0-9]{5}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// France Value Added Tax (VAT) Number
function matchFranceVATNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[0-9]{11}\b/g,
        /\b[a-hA-Hj-nJ-Np-zP-Z][0-9]{10}\b/g,
        /\b[0-9][a-hA-Hj-nJ-Np-zP-Z][0-9]{9}\b/g,
        /\b[a-hj-np-z]{2}[0-9]{9}\b/g,
        /\b[A-HJ-NP-Z]{2}[0-9]{9}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// French INSEE Code
function matchFrenchINSEECode(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[1-478][0-9]{2}(0[1-9]|1[0-2]|[2-9][0-9])(([013-9][0-9]|2[AB1-9])[0-9]{3})[0-9]{5}\b/g,
        /\b[1-478] [0-9]{2} (0[1-9]|1[0-2]|[2-9][0-9]) ((([013-9][0-9]|2[AB1-9]) ?[0-9]{3})|([0-9]{3} ?[0-9]{2})) [0-9]{3} ?[0-9]{2}\b/g,
        /\b[1-478]-[0-9]{2}-(0[1-9]|1[0-2]|[2-9][0-9])-((([013-9][0-9]|2[AB1-9])-?[0-9]{3})|([0-9]{3}-?[0-9]{2}))-[0-9]{3}-?[0-9]{2}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// German Driver's License Number
function matchGermanDriversLicenseNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b[0-9A-Z][0-9]{2}[0-9A-Z]{6}[0-9][0-9A-Z]\b/g;
    return text.match(regex);
}

// German ID Number
function matchGermanIDNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[0-9A-Z]{9}[0-9]D?[ -]?[0-9]{6}[0-9][ -MF]?[0-9]{6}[0-9][ -]?[0-9]\b/g,
        /\b[0-9A-Z]{9}[0-9]D?\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// German Passport Number
function matchGermanPassportNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b[CF-HJ-NPRTV-Z0-9]{9}[0-9]?D?\b/g;
    return text.match(regex);
}

// German Social Security Number
function matchGermanSocialSecurityNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[0-9]{2}(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])[0-9]{2}[A-Z][0-9]{3}\b/g,
        /\b[0-9]{2} (0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])[0-9]{2} [A-Z] [0-9]{2} ?[0-9]\b/g,
        /\b[0-9]{2}-(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])[0-9]{2}-[A-Z]-[0-9]{2}-?[0-9]\b/g,
        /\b[0-9]{2}\/(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])[0-9]{2}\/[A-Z]\/[0-9]{2}\/?[0-9]\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// German Tax Identifier/Code
function matchGermanTaxIdentifier(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[1-9][0-9]{8}\b/g,
        /\b[1-9][0-9]{2}\/?[0-9]{4}\/?[0-9]{4}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// Indian Aadhaar Number
function matchIndianAadhaarNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[2-9][0-9]{11}\b/g,
        /\b[2-9][0-9]{3} [0-9]{4} [0-9]{4}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// Indian PAN
function matchIndianPAN(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b[A-Za-z]{3}[CPHFATBLJGcpfatbljg][A-Za-z]\d{4}[A-Za-z]\b/g;
    return text.match(regex);
}

// Italian Passport Number
function matchItalianPassportNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b[A-Z0-9]{2}[0-9]{7}\b/g;
    return text.match(regex);
}

// Italian Tax ID/SSN (Codice Fiscale)
function matchItalianTaxID(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b[A-Z]{3}[ -]?[A-Z]{3}[ -]?[0-9]{2}[A-EHLMPRST](?:[04][1-9]|[1256][0-9]|[37][01])[ -]?[A-MZ][0-9]{3}[A-Z]\b/g;
    return text.match(regex);
}

// Turkish Identification Number
function matchTurkishID(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b[1-9][0-9]{10}\b/g;
    return text.match(regex);
}

// UK BIC Number
function matchUKBICNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b([A-Z]{4}GB[0-9A-Z]{2}[0-9A-Z]{3})\b/g;
    return text.match(regex);
}

// UK Driver License Number
function matchUKDriverLicenseNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b[A-Z0-9]{5}\d[0156]\d([0][1-9]|[12]\d|3[01])\d[A-Z0-9]{3}[A-Z]{2}\b/g;
    return text.match(regex);
}

// UK Electoral Roll Number
function matchUKElectoralRollNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b[A-Z]{2,3}\d{1,4}\b/g;
    return text.match(regex);
}

// UK IBAN Number
function matchUKIBANNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\bGB[0-9]{2} [A-Z]{4} [0-9]{4} [0-9]{4} [0-9]{4} [0-9]{2}\b/g,
        /\bGB[0-9]{2}[A-Z]{4}[0-9]{14}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// UK National Health Service (NHS) Number
function matchUKNHSNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-DFM]{0,1}\b/g,
        /\b\d{3}\.\d{3}\.\d{4}\b/g,
        /\b\d{3}\d{3}\d{4}\b/g,
        /\b\d{3}-\d{3}-\d{4}\b/g,
        /\b\d{3} \d{3} \d{4}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// UK National Insurance Number
function matchUKNationalInsuranceNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[AEKLHTY][ABEHKLMPRSTWXYZ]\d{6}[A-D]\b/g,
        /\bB[ABEHKLMT]\d{6}[A-D]\b/g,
        /\bC[ABEHKLR]\d{6}[A-D]\b/g,
        /\bGY\d{6}[A-D]\b/g,
        /\bJ[ABCEGHJKLMNPRSTWXYZ]\d{6}[A-D]\b/g,
        /\bM[AWX]\d{6}[A-D]\b/g,
        /\bN[ABEHLMPRSWXYZ]\d{6}[A-D]\b/g,
        /\bO[ABEHKLMPRSX]\d{6}[A-D]\b/g,
        /\bP[ABCEGHJLMNPRSTWXY]\d{6}[A-D]\b/g,
        /\bR[ABEHKMPRSTWXYZ]\d{6}[A-D]\b/g,
        /\bS[ABCGHJKLMNPRSTWXYZ]\d{6}[A-D]\b/g,
        /\bW[ABEKLMP]\d{6}[A-D]\b/g,
        /\bZ[ABEHKLMPRSTWXY]\d{6}[A-D]\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// UK Passport Number
function matchUKPassportNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b\d{9}\b/g;
    return text.match(regex);
}

// UK Postcode
function matchUKPostcode(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b(GIR 0AA)\b/g,
        /\b[A-Z][0-9]{1,2} ?[0-9][A-Z]{2}\b/g,
        /\b[A-Z][A-HJ-Y][0-9]{1,2} ?[0-9][A-Z]{2}\b/g,
        /\b[A-Z][0-9][A-Z] ?[0-9][A-Z]{2}\b/g,
        /\b[A-Z][A-HJ-Y][0-9]?[A-Z] ?[0-9][A-Z]{2}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// UK SEDOL
function matchUKSEDOL(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b[B-DF-HJ-NP-TV-XYZ0-9]{6}[0-9]\b/g;
    return text.match(regex);
}

// UK Sort Code
function matchUKSortCode(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b(\d{2}-\d{2}-\d{2})\b/g;
    return text.match(regex);
}

// UK Unique Taxpayer Reference (UTR)
function matchUKUTR(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b\d{5} \d{5}\b/g,
        /\b\d{10}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// US Driver License Number
function matchUSDriverLicenseNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[0-9]{7}\b/g,
        /\b[A-Z][0-9]{8}\b/g,
        /\b9[0-9]{8}\b/g,
        /\b[A-Z][0-9]{7}\b/g,
        /\b[0-9]{2}-[0-9]{3}-[0-9]{4}\b/g,
        /\b[0-9]{9}\b/g,
        /\b[A-Z][0-9]{12}\b/g,
        /\b[A-Z][0-9]{3}-[0-9]{3}-[0-9]{2}-[0-9]{3}-[0-9]\b/g,
        /\b[H][0-9]{8}\b/g,
        /\b[A-Z]{2}[0-9]{6}[A-Z]\b/g,
        /\b[A-Z][0-9]{3}-[0-9]{4}-[0-9]{4}\b/g,
        /\b[0-9]{4}-[0-9]{2}-[0-9]{4}\b/g,
        /\b[0-9]{3}[A-Z]{2}[0-9]{4}\b/g,
        /\b[K][0-9]{2}-[0-9]{2}-[0-9]{4}\b/g,
        /\b[A-Z][0-9]{2}-[0-9]{3}-[0-9]{3}\b/g,
        /\b[A-Z]-[0-9]{3}-[0-9]{3}-[0-9]{3}-[0-9]{3}\b/g,
        /\b[A-Z] [0-9]{3} [0-9]{3} [0-9]{3} [0-9]{3}\b/g,
        /\b[0-9]{3}-[0-9]{2}-[0-9]{4}\b/g,
        /\b[A-Z][0-9]{9}\b/g,
        /\b(?:0[1-9]|1[0-2])[0-9]{3}[1-9][0-9]{3}41(?:0[1-9]|1[0-9]|2[0-9]|3[0-1])\b/g,
        /\b(?:0[1-9]|1[0-2])[A-Z]{3}[0-9]{2}(?:0[1-9]|1[0-9]|2[0-9]|3[0-1])[0-9]\b/g,
        /\b[A-Z][0-9]{4} [0-9]{5} [0-9]{5}\b/g,
        /\b[0-9]{3} [0-9]{3} [0-9]{3}\b/g,
        /\b[0-9]{12}\b/g,
        /\b[A-Z]{3}-[0-9]{2}-[0-9]{4}\b/g,
        /\b[A-Z]{2}[0-9]{6}\b/g,
        /\b[0-9]{2} [0-9]{3} [0-9]{3}\b/g,
        /\b[1-9]{2}[0-9]{5}\b/g,
        /\b[0-9]{8}\b/g,
        /\b[0-9]{7}[A-Z]\b/g,
        /\b[A-Z][0-9]{2}-[0-9]{2}-[0-9]{4}\b/g,
        /\b(?:[A-Z]{5}|[A-Z]{4}[*]{1}|[A-Z]{3}[*]{2}|[A-Z]{2}[*]{3})[A-Z]{2}[0-9]{3}[A-Z0-9]{2}\b/g,
        /\b[A-Z][0-9]{6}\b/g,
        /\b[A-Z][0-9]{3}-[0-9]{4}-[0-9]{4}-[0-9]{2}\b/g,
        /\b[0-9]{6}-[0-9]{3}\b/g,
        /\bWDL[A-Z0-9]{9}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// US Individual Taxpayer Identification Number (ITIN)
function matchUSITIN(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b\d{9}\b/,
        /\b\d{3}-\d{2}-\d{4}\b/,
        /\b\d{3}\s\d{2}\s\d{4}\b/,
        /\b\d{3}\.\d{2}\.\d{4}\b/
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// US Medicare Health Insurance Claim (HIC) Number
function matchUSMedicareHICNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[A-Z]{0,3}[0-9]{9}[0-9A-Z]{1,3}\b/g,
        /\b[A-Z]{0,3}[0-9]{3} [0-9]{6}[0-9A-Z]{1,3}\b/g,
        /\b[A-Z]{0,3}-[0-9]{3} [0-9]{2}-[0-9]{4}-[0-9A-Z]{1,3}\b/g,
        /\b[A-Z]{0,3}-[0-9]{3}-[0-9]{2}-[0-9]{4}-[0-9A-Z]{1,3}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// US Passport Number
function matchUSPassportNumber(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b\d{8}\b/g,
        /\b\d{9}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// US Social Security Number (SSN)
https: //regex101.com/r/kdXrYe/1
    function matchUSSSN(text) {
        if (typeof text !== 'string') {
            debug("Expected a string but received:", typeof text);
            text = '';
        }        
        const regexArray = [
            /(?!(\d){3}(-| |)\1{2}\2\1{4})(?!666|000|9\d{2})(\b\d{3}(-| |)(?!00)\d{2}\4(?!0{4})\d{4}\b)/g
        ];
        return regexArray.flatMap(regex => text.match(regex) || []);
    }

// US Social Security Number Randomization
function matchUSSSNRandomization(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[0-9]{3}-[0-9]{2}-[0-9]{4}\b/g,
        /\b[0-9]{3} [0-9]{2} [0-9]{4}\b/g,
        /\b[0-9]{9}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// US Vehicle Identification Number (VIN)
function matchUSVIN(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regexArray = [
        /\b[A-HJ-NPR-Z0-9]{3}-[A-HJ-NPR-Z0-9]{5}-[A-HJ-NPR-Z0-9]{1}-[A-HJ-NPR-Z0-9]{8}\b/g,
        /\b[A-HJ-NPR-Z0-9]{17}\b/g
    ];
    return regexArray.flatMap(regex => text.match(regex) || []);
}

// US Zip Code
function matchUSZipCode(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b[0-9]{5}(?:-[0-9]{4})?\b/g;
    return text.match(regex);
}

// China TIN
function matchChinaTIN(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b\d{18}\b/g;
    return text.match(regex);
}

// Japan SSN
function matchJapanSSN(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b\d{12}\b/g;
    return text.match(regex);
}

// Korea RRN
function matchKoreaRRN(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b\d{13}\b/g;
    return text.match(regex);
}

// New Zealand IRD
function matchIRD(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b\d{3}-\d{3}-\d{3}\b/g;
    return text.match(regex);
}


// Philippines SSS
function matchSSS(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b\d{2}-\d{7}-\d{1}\b/g;
    return text.match(regex);
}

// Belgium INSZ/NISS
function matchINSZ(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b\d{11}\b/g;
    return text.match(regex);
}

// Germany StNr
function matchStNr(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b\d{11}\b/g;
    return text.match(regex);
}

// France NIR
function matchNIR(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b\d{13}-\d{2}\b/g;
    return text.match(regex);
}

// Italy Codice Fiscale
function matchCodiceFiscale(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b\d{3}–\d{3}–\d{3}–\d{3}\b/g;
    return text.match(regex);
}

// Netherlands BSN
function matchBSN(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b\d{9}\b/g;
    return text.match(regex);
}


// Portugal NISS
function matchNISS(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b\d{11}\b/g;
    return text.match(regex);
}

// Russia INN
function matchINN(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b\d{3}-\d{3}-\d{3}[- ]\d{2}\b/g;
    return text.match(regex);
}

// Spain NUSS
function matchNUSS(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b(\d\s*){12}\b/g;
    return text.match(regex);
}

// Ukraine INPP
function matchINPP(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b\d{10}\b/g;
    return text.match(regex);
}

// Brazil CPF
function matchCPF(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g;
    return text.match(regex);
}

function matchMarkdown(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    
    const regex = /!\[.*?\]\(.*?\)/gm;

    const matches = text.match(regex);

    return matches;
}

function optimizedLevenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    let previous = Array(a.length + 1).fill(0).map((_, idx) => idx);
    let current = Array(a.length + 1).fill(0);

    for (let i = 1; i <= b.length; i++) {
        current[0] = i;
        for (let j = 1; j <= a.length; j++) {
            if (b[i - 1] === a[j - 1]) {
                current[j] = previous[j - 1];
            } else {
                current[j] = Math.min(
                    previous[j - 1] + 1, 
                    current[j - 1] + 1,  
                    previous[j] + 1       
                );
            }
        }

        [previous, current] = [current, previous];
    }

    return previous[a.length];
}


function matchClosest(text) {
    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }    

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

    let closestMatch = null;
    let lowestDistance = Infinity;

    targets.forEach(target => {
        const distance = optimizedLevenshtein(text.toLowerCase(), target.toLowerCase());
        if (distance < lowestDistance && distance < 6) {
            lowestDistance = distance;
            closestMatch = target;
        }
    });

    if (lowestDistance < 6) {
        debug("lowestDistance", lowestDistance);
        return closestMatch;
    } else {
        return null;
    }
}


let wordsList = [];

function loadWords() {
    chrome.runtime.sendMessage({ action: "fetchWords" }, function(response) {
        if (response.words && response.words.length > 0) {
            wordsList = response.words.map(wordObj => wordObj.word);
            debug("Words loaded:", wordsList);
        } else {
            debug("No words found in the database.");
        }
    });
}


function checkForWords(text) {

    if (typeof text !== 'string') {
        debug("Expected a string but received:", typeof text);
        text = '';
    }

    const matchedWords = wordsList.filter(word => text.includes(word));

    if (matchedWords.length > 0) {
        console.debug("Matched words:", matchedWords);
    }

    return matchedWords;
}


let isSendingData = false;

function sendDataWithRetry(retryCount = 0, callback) {
    if (isSendingData) return;
    isSendingData = true;

    chrome.runtime.sendMessage({
        action: 'addData'
    }, (response) => {
        if (chrome.runtime.lastError || (response && response.error)) {
            debug('Error:', chrome.runtime.lastError?.message || response.error);
            if (retryCount < 3) {
                setTimeout(() => sendDataWithRetry(retryCount + 1, callback), 1000);
            } else {
                isSendingData = false;
                if (callback) callback();
            }
        } else {
            debug('Response received:', response);
            isSendingData = false;
            if (callback) callback();
        }
    });
}

function sendMultipleRequests(times, interval) {
    debug("times", times);
    debug("interval", interval);
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


function handleAddedNodes() {

    debug("test", null);
}

const observer = new MutationObserver(mutationsList => {
    mutationsList.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
            handleAddedNodes();
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});



async function pluginfetchData() {
    try {
        //setTimeout(pluginfetchData, 100);
    } catch (error) {
        console.error("pluginfetchData encountered an error:", error);
        //setTimeout(pluginfetchData, 100);
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

    if (blockMode == "disabled") {

    } else {
        if (blockMode == "enabled" && pluginMode == "enabled") {
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
let matchedWords = [];
let matchedWordsx = [];

let textarea = null;
let textareaValue = "";

let intervalId = null;

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}


//start
function startInterval() {
    const intervalId = setInterval(() => {

        debug("setInterval", null);
        debug("Load Words", null);
        loadWords();

        let textarea;

        const promptTextarea = document.querySelector("#prompt-textarea"); //chatgpt
        const chatInput = document.querySelector("#chat-input"); //deepseek

        if (chatInput && chatInput.value.trim()) {
          textarea = chatInput; 
        } else if (promptTextarea) {
          textarea = promptTextarea; 
        }


        if (textarea) {  
        
            ['input', 'paste'].forEach(eventtype => {
            textarea.addEventListener(eventtype, debounce(async (event) => {
                let lastPart = "";
                let fullTextContent = textarea.textContent;
                lastPart = fullTextContent;

                if (eventtype === 'input' && event.inputType !== 'insertFromPaste') {

                    let words = fullTextContent.split(/\s+/);
                    lastPart = words[words.length - 2];

                    if (lastPart) {
                        debug("Last word added:", lastPart);
                    }

                    debug("Input event detected:", lastPart);
                } else if (eventtype === 'paste') {
                    lastPart = fullTextContent;
                    debug("Paste event detected:", lastPart);
                }

                matchedWords = [];
                matchedWordsx = [];
                clearInterval(intervalId);
                if (!isSendingData) {

                    function safeMatch(matchFunction, input) {
                        const result = matchFunction(input);
                        return (result && result.length > 0) ? result : null;
                    }

                    const checkForWordsStr = safeMatch(checkForWords, lastPart);
                    debug("checkForWordsStr", checkForWordsStr);
                    const matchPhoneNumbersStr = safeMatch(matchPhoneNumbers, lastPart);
                    debug("matchPhoneNumbersStr", matchPhoneNumbersStr);
                    const matchCryptoAddressesStr = safeMatch(matchCryptoAddresses, lastPart);
                    debug("matchCryptoAddressesStr", matchCryptoAddressesStr);
                    const matchEmailAddressesStr = safeMatch(matchEmailAddresses, lastPart);
                    debug("matchEmailAddressesStr TEST", matchEmailAddressesStr);
                    const matchIBANCodesStr = safeMatch(matchIBANCodes, lastPart);
                    debug("matchIBANCodesStr", matchIBANCodesStr);
                    const matchIPAddressesStr = safeMatch(matchIPAddresses, lastPart);
                    debug("matchIPAddressesStr", matchIPAddressesStr);
                    const matchCreditCardNumbersStr = safeMatch(matchCreditCardNumbers, lastPart);
                    debug("matchCreditCardNumbersStr", matchCreditCardNumbersStr);
                    const matchSecretTokenStr = safeMatch(matchSecretToken, lastPart);
                    debug("matchSecretTokenStr", matchSecretTokenStr);
                    const matchMarkdownStr = safeMatch(matchMarkdown, lastPart);
                    debug("matchMarkdownStr", matchMarkdownStr);
                    const matchClosestStr = safeMatch(matchClosest, lastPart);
                    debug("matchClosestStr", matchClosestStr);
                    const matchABARTNStr = safeMatch(matchABARTN, lastPart);
                    debug("matchABARTNStr", matchABARTNStr);
                    const matchAustralianBusinessNumberStr = safeMatch(matchAustralianBusinessNumber, lastPart);
                    debug("matchAustralianBusinessNumberStr", matchAustralianBusinessNumberStr);
                    const matchAustralianCompanyNumberStr = safeMatch(matchAustralianCompanyNumber, lastPart);
                    debug("matchAustralianCompanyNumberStr", matchAustralianCompanyNumberStr);
                    const matchAustralianDriversLicenseStr = safeMatch(matchAustralianDriversLicense, lastPart);
                    debug("matchAustralianDriversLicenseStr", matchAustralianDriversLicenseStr);
                    const matchAustralianFullNationalNumberStr = safeMatch(matchAustralianFullNationalNumber, lastPart);
                    debug("matchAustralianFullNationalNumberStr", matchAustralianFullNationalNumberStr);
                    const matchAustralianMedicareCardNumberStr = safeMatch(matchAustralianMedicareCardNumber, lastPart);
                    debug("matchAustralianMedicareCardNumberStr", matchAustralianMedicareCardNumberStr);
                    const matchAustralianNSWDriversLicenseStr = safeMatch(matchAustralianNSWDriversLicense, lastPart);
                    debug("matchAustralianNSWDriversLicenseStr", matchAustralianNSWDriversLicenseStr);
                    const matchAustralianQLDDriversLicenseStr = safeMatch(matchAustralianQLDDriversLicense, lastPart);
                    debug("matchAustralianQLDDriversLicenseStr", matchAustralianQLDDriversLicenseStr);
                    const matchAustralianTaxFileNumberStr = safeMatch(matchAustralianTaxFileNumber, lastPart);
                    debug("matchAustralianTaxFileNumberStr", matchAustralianTaxFileNumberStr);
                    const matchAustrianBankAccountNumbersStr = safeMatch(matchAustrianBankAccountNumbers, lastPart);
                    debug("matchAustrianBankAccountNumbersStr", matchAustrianBankAccountNumbersStr);
                    const matchAustrianPassportNumberStr = safeMatch(matchAustrianPassportNumber, lastPart);
                    debug("matchAustrianPassportNumberStr", matchAustrianPassportNumberStr);
                    const matchAustrianSocialSecurityInsuranceNumberStr = safeMatch(matchAustrianSocialSecurityInsuranceNumber, lastPart);
                    debug("matchAustrianSocialSecurityInsuranceNumberStr", matchAustrianSocialSecurityInsuranceNumberStr);
                    const matchAustrianVATNumberStr = safeMatch(matchAustrianVATNumber, lastPart);
                    debug("matchAustrianVATNumberStr", matchAustrianVATNumberStr);
                    const matchCanadianAlbertaDriversLicenseStr = safeMatch(matchCanadianAlbertaDriversLicense, lastPart);
                    debug("matchCanadianAlbertaDriversLicenseStr", matchCanadianAlbertaDriversLicenseStr);
                    const matchCanadianAlbertaHealthStr = safeMatch(matchCanadianAlbertaHealth, lastPart);
                    debug("matchCanadianAlbertaHealthStr", matchCanadianAlbertaHealthStr);
                    const matchCanadianManitobaDriversLicenseStr = safeMatch(matchCanadianManitobaDriversLicense, lastPart);
                    debug("matchCanadianManitobaDriversLicenseStr", matchCanadianManitobaDriversLicenseStr);
                    const matchCanadianManitobaHealthStr = safeMatch(matchCanadianManitobaHealth, lastPart);
                    debug("matchCanadianManitobaHealthStr", matchCanadianManitobaHealthStr);
                    const matchCanadianOntarioDriversLicenseStr = safeMatch(matchCanadianOntarioDriversLicense, lastPart);
                    debug("matchCanadianOntarioDriversLicenseStr", matchCanadianOntarioDriversLicenseStr);
                    const matchCanadianOntarioHealthStr = safeMatch(matchCanadianOntarioHealth, lastPart);
                    debug("matchCanadianOntarioHealthStr", matchCanadianOntarioHealthStr);
                    const matchCanadianPassportStr = safeMatch(matchCanadianPassport, lastPart);
                    debug("matchCanadianPassportStr", matchCanadianPassportStr);
                    const matchCanadianQuebecDriversLicenseStr = safeMatch(matchCanadianQuebecDriversLicense, lastPart);
                    debug("matchCanadianQuebecDriversLicenseStr", matchCanadianQuebecDriversLicenseStr);
                    const matchCanadianQuebecHealthStr = safeMatch(matchCanadianQuebecHealth, lastPart);
                    debug("matchCanadianQuebecHealthStr", matchCanadianQuebecHealthStr);
                    const matchCanadianSaskatchewanDriversLicenseStr = safeMatch(matchCanadianSaskatchewanDriversLicense, lastPart);
                    debug("matchCanadianSaskatchewanDriversLicenseStr", matchCanadianSaskatchewanDriversLicenseStr);
                    const matchCanadianSocialInsuranceNumberStr = safeMatch(matchCanadianSocialInsuranceNumber, lastPart);
                    debug("matchCanadianSocialInsuranceNumberStr", matchCanadianSocialInsuranceNumberStr);
                    const matchDateFormatsStr = safeMatch(matchDateFormats, lastPart);
                    debug("matchDateFormatsStr", matchDateFormatsStr);
                    const matchFranceDriversLicenseNumberStr = safeMatch(matchFranceDriversLicenseNumber, lastPart);
                    debug("matchFranceDriversLicenseNumberStr", matchFranceDriversLicenseNumberStr);
                    const matchFrancePassportNumberStr = safeMatch(matchFrancePassportNumber, lastPart);
                    debug("matchFrancePassportNumberStr", matchFrancePassportNumberStr);
                    const matchFranceVATNumberStr = safeMatch(matchFranceVATNumber, lastPart);
                    debug("matchFranceVATNumberStr", matchFranceVATNumberStr);
                    const matchFrenchINSEECodeStr = safeMatch(matchFrenchINSEECode, lastPart);
                    debug("matchFrenchINSEECodeStr", matchFrenchINSEECodeStr);
                    const matchGermanDriversLicenseNumberStr = safeMatch(matchGermanDriversLicenseNumber, lastPart);
                    debug("matchGermanDriversLicenseNumberStr", matchGermanDriversLicenseNumberStr);
                    const matchGermanIDNumberStr = safeMatch(matchGermanIDNumber, lastPart);
                    debug("matchGermanIDNumberStr", matchGermanIDNumberStr);
                    const matchGermanPassportNumberStr = safeMatch(matchGermanPassportNumber, lastPart);
                    debug("matchGermanPassportNumberStr", matchGermanPassportNumberStr);
                    const matchGermanSocialSecurityNumberStr = safeMatch(matchGermanSocialSecurityNumber, lastPart);
                    debug("matchGermanSocialSecurityNumberStr", matchGermanSocialSecurityNumberStr);
                    const matchGermanTaxIdentifierStr = safeMatch(matchGermanTaxIdentifier, lastPart);
                    debug("matchGermanTaxIdentifierStr", matchGermanTaxIdentifierStr);
                    const matchIndianAadhaarNumberStr = safeMatch(matchIndianAadhaarNumber, lastPart);
                    debug("matchIndianAadhaarNumberStr", matchIndianAadhaarNumberStr);
                    const matchIndianPANStr = safeMatch(matchIndianPAN, lastPart);
                    debug("matchIndianPANStr", matchIndianPANStr);
                    const matchItalianPassportNumberStr = safeMatch(matchItalianPassportNumber, lastPart);
                    debug("matchItalianPassportNumberStr", matchItalianPassportNumberStr);
                    const matchItalianTaxIDStr = safeMatch(matchItalianTaxID, lastPart);
                    debug("matchItalianTaxIDStr", matchItalianTaxIDStr);
                    const matchTurkishIDStr = safeMatch(matchTurkishID, lastPart);
                    debug("matchTurkishIDStr", matchTurkishIDStr);
                    const matchUKBICNumberStr = safeMatch(matchUKBICNumber, lastPart);
                    debug("matchUKBICNumberStr", matchUKBICNumberStr);
                    const matchUKDriverLicenseNumberStr = safeMatch(matchUKDriverLicenseNumber, lastPart);
                    debug("matchUKDriverLicenseNumberStr", matchUKDriverLicenseNumberStr);
                    const matchUKElectoralRollNumberStr = safeMatch(matchUKElectoralRollNumber, lastPart);
                    debug("matchUKElectoralRollNumberStr", matchUKElectoralRollNumberStr);
                    const matchUKIBANNumberStr = safeMatch(matchUKIBANNumber, lastPart);
                    debug("matchUKIBANNumberStr", matchUKIBANNumberStr);
                    const matchUKNHSNumberStr = safeMatch(matchUKNHSNumber, lastPart);
                    debug("matchUKNHSNumberStr", matchUKNHSNumberStr);
                    const matchUKNationalInsuranceNumberStr = safeMatch(matchUKNationalInsuranceNumber, lastPart);
                    debug("matchUKNationalInsuranceNumberStr", matchUKNationalInsuranceNumberStr);
                    const matchUKPassportNumberStr = safeMatch(matchUKPassportNumber, lastPart);
                    debug("matchUKPassportNumberStr", matchUKPassportNumberStr);
                    const matchUKPostcodeStr = safeMatch(matchUKPostcode, lastPart);
                    debug("matchUKPostcodeStr", matchUKPostcodeStr);
                    const matchUKSEDOLStr = safeMatch(matchUKSEDOL, lastPart);
                    debug("matchUKSEDOLStr", matchUKSEDOLStr);
                    const matchUKSortCodeStr = safeMatch(matchUKSortCode, lastPart);
                    debug("matchUKSortCodeStr", matchUKSortCodeStr);
                    const matchUKUTRStr = safeMatch(matchUKUTR, lastPart);
                    debug("matchUKUTRStr", matchUKUTRStr);
                    const matchUSDriverLicenseNumberStr = safeMatch(matchUSDriverLicenseNumber, lastPart);
                    debug("matchUSDriverLicenseNumberStr", matchUSDriverLicenseNumberStr);
                    const matchUSITINStr = safeMatch(matchUSITIN, lastPart);
                    debug("matchUSITINStr", matchUSITINStr);
                    const matchUSMedicareHICNumberStr = safeMatch(matchUSMedicareHICNumber, lastPart);
                    debug("matchUSMedicareHICNumberStr", matchUSMedicareHICNumberStr);
                    const matchUSPassportNumberStr = safeMatch(matchUSPassportNumber, lastPart);
                    debug("matchUSPassportNumberStr", matchUSPassportNumberStr);
                    const matchUSSSNStr = safeMatch(matchUSSSN, lastPart);
                    debug("matchUSSSNStr", matchUSSSNStr);
                    const matchUSSSNRandomizationStr = safeMatch(matchUSSSNRandomization, lastPart);
                    debug("matchUSSSNRandomizationStr", matchUSSSNRandomizationStr);
                    const matchUSVINStr = safeMatch(matchUSVIN, lastPart);
                    debug("matchUSVINStr", matchUSVINStr);
                    const matchUSZipCodeStr = safeMatch(matchUSZipCode, lastPart);
                    debug("matchUSZipCodeStr", matchUSZipCodeStr);

                    const matchChinaTINStr = safeMatch(matchChinaTIN, lastPart);
                    debug("matchChinaTINStr", matchChinaTINStr);
                    const matchJapanSSNStr = safeMatch(matchJapanSSN, lastPart);
                    debug("matchJapanSSNStr", matchJapanSSNStr);
                    const matchKoreaRRNStr = safeMatch(matchKoreaRRN, lastPart);
                    debug("matchKoreaRRNStr", matchKoreaRRNStr);
                    const matchIRDStr = safeMatch(matchIRD, lastPart);
                    debug("matchIRDStr", matchIRDStr);
                    const matchSSSStr = safeMatch(matchSSS, lastPart);
                    debug("matchSSSStr", matchSSSStr);
                    const matchINSZStr = safeMatch(matchINSZ, lastPart);
                    debug("matchINSZStr", matchINSZStr);
                    const matchStNrStr = safeMatch(matchStNr, lastPart);
                    debug("matchStNrStr", matchStNrStr);
                    const matchNIRStr = safeMatch(matchNIR, lastPart);
                    debug("matchNIRStr", matchNIRStr);
                    const matchCodiceFiscaleStr = safeMatch(matchCodiceFiscale, lastPart);
                    debug("matchCodiceFiscaleStr", matchCodiceFiscaleStr);
                    const matchBSNStr = safeMatch(matchBSN, lastPart);
                    debug("matchBSNStr", matchBSNStr);
                    const matchNISSStr = safeMatch(matchNISS, lastPart);
                    debug("matchNISSStr", matchNISSStr);
                    const matchINNStr = safeMatch(matchINN, lastPart);
                    debug("matchINNStr", matchINNStr);
                    const matchNUSSStr = safeMatch(matchNUSS, lastPart);
                    debug("matchNUSSStr", matchNUSSStr);
                    const matchINPPStr = safeMatch(matchINPP, lastPart);
                    debug("matchINPPStr", matchINPPStr);
                    const matchCPFStr = safeMatch(matchCPF, lastPart);
                    debug("matchCPFStr", matchCPFStr);

                    let cnt = ((matchPhoneNumbersStr && matchPhoneNumbersStr.length > 0) ? matchPhoneNumbersStr.length : 0) +
                        ((matchCryptoAddressesStr && matchCryptoAddressesStr.length > 0) ? matchCryptoAddressesStr.length : 0) +
                        ((matchEmailAddressesStr && matchEmailAddressesStr.length > 0) ? matchEmailAddressesStr.length : 0) +
                        ((matchIBANCodesStr && matchIBANCodesStr.length > 0) ? matchIBANCodesStr.length : 0) +
                        ((matchIPAddressesStr && matchIPAddressesStr.length > 0) ? matchIPAddressesStr.length : 0) +
                        ((matchCreditCardNumbersStr && matchCreditCardNumbersStr.length > 0) ? matchCreditCardNumbersStr.length : 0) +
                        ((matchSecretTokenStr && matchSecretTokenStr.length > 0) ? matchSecretTokenStr.length : 0) +
                        ((matchMarkdownStr && matchMarkdownStr.length > 0) ? matchMarkdownStr.length : 0) +
                        ((matchClosestStr && matchClosestStr.length > 0) ? matchClosestStr.length : 0) +
                        ((matchABARTNStr && matchABARTNStr.length > 0) ? matchABARTNStr.length : 0) +
                        ((matchAustralianBusinessNumberStr && matchAustralianBusinessNumberStr.length > 0) ? matchAustralianBusinessNumberStr.length : 0) +
                        ((matchAustralianCompanyNumberStr && matchAustralianCompanyNumberStr.length > 0) ? matchAustralianCompanyNumberStr.length : 0) +
                        ((matchAustralianDriversLicenseStr && matchAustralianDriversLicenseStr.length > 0) ? matchAustralianDriversLicenseStr.length : 0) +
                        ((matchAustralianFullNationalNumberStr && matchAustralianFullNationalNumberStr.length > 0) ? matchAustralianFullNationalNumberStr.length : 0) +
                        ((matchAustralianMedicareCardNumberStr && matchAustralianMedicareCardNumberStr.length > 0) ? matchAustralianMedicareCardNumberStr.length : 0) +
                        ((matchAustralianNSWDriversLicenseStr && matchAustralianNSWDriversLicenseStr.length > 0) ? matchAustralianNSWDriversLicenseStr.length : 0) +
                        ((matchAustralianQLDDriversLicenseStr && matchAustralianQLDDriversLicenseStr.length > 0) ? matchAustralianQLDDriversLicenseStr.length : 0) +
                        ((matchAustralianTaxFileNumberStr && matchAustralianTaxFileNumberStr.length > 0) ? matchAustralianTaxFileNumberStr.length : 0) +
                        ((matchAustrianBankAccountNumbersStr && matchAustrianBankAccountNumbersStr.length > 0) ? matchAustrianBankAccountNumbersStr.length : 0) +
                        ((matchAustrianPassportNumberStr && matchAustrianPassportNumberStr.length > 0) ? matchAustrianPassportNumberStr.length : 0) +
                        ((matchAustrianSocialSecurityInsuranceNumberStr && matchAustrianSocialSecurityInsuranceNumberStr.length > 0) ? matchAustrianSocialSecurityInsuranceNumberStr.length : 0) +
                        ((matchAustrianVATNumberStr && matchAustrianVATNumberStr.length > 0) ? matchAustrianVATNumberStr.length : 0) +
                        ((matchCanadianAlbertaDriversLicenseStr && matchCanadianAlbertaDriversLicenseStr.length > 0) ? matchCanadianAlbertaDriversLicenseStr.length : 0) +
                        ((matchCanadianAlbertaHealthStr && matchCanadianAlbertaHealthStr.length > 0) ? matchCanadianAlbertaHealthStr.length : 0) +
                        ((matchCanadianManitobaDriversLicenseStr && matchCanadianManitobaDriversLicenseStr.length > 0) ? matchCanadianManitobaDriversLicenseStr.length : 0) +
                        ((matchCanadianManitobaHealthStr && matchCanadianManitobaHealthStr.length > 0) ? matchCanadianManitobaHealthStr.length : 0) +
                        ((matchCanadianOntarioDriversLicenseStr && matchCanadianOntarioDriversLicenseStr.length > 0) ? matchCanadianOntarioDriversLicenseStr.length : 0) +
                        ((matchCanadianOntarioHealthStr && matchCanadianOntarioHealthStr.length > 0) ? matchCanadianOntarioHealthStr.length : 0) +
                        ((matchCanadianPassportStr && matchCanadianPassportStr.length > 0) ? matchCanadianPassportStr.length : 0) +
                        ((matchCanadianQuebecDriversLicenseStr && matchCanadianQuebecDriversLicenseStr.length > 0) ? matchCanadianQuebecDriversLicenseStr.length : 0) +
                        ((matchCanadianQuebecHealthStr && matchCanadianQuebecHealthStr.length > 0) ? matchCanadianQuebecHealthStr.length : 0) +
                        ((matchCanadianSaskatchewanDriversLicenseStr && matchCanadianSaskatchewanDriversLicenseStr.length > 0) ? matchCanadianSaskatchewanDriversLicenseStr.length : 0) +
                        ((matchCanadianSocialInsuranceNumberStr && matchCanadianSocialInsuranceNumberStr.length > 0) ? matchCanadianSocialInsuranceNumberStr.length : 0) +
                        ((matchDateFormatsStr && matchDateFormatsStr.length > 0) ? matchDateFormatsStr.length : 0) +
                        ((matchFranceDriversLicenseNumberStr && matchFranceDriversLicenseNumberStr.length > 0) ? matchFranceDriversLicenseNumberStr.length : 0) +
                        ((matchFrancePassportNumberStr && matchFrancePassportNumberStr.length > 0) ? matchFrancePassportNumberStr.length : 0) +
                        ((matchFranceVATNumberStr && matchFranceVATNumberStr.length > 0) ? matchFranceVATNumberStr.length : 0) +
                        ((matchFrenchINSEECodeStr && matchFrenchINSEECodeStr.length > 0) ? matchFrenchINSEECodeStr.length : 0) +
                        ((matchGermanDriversLicenseNumberStr && matchGermanDriversLicenseNumberStr.length > 0) ? matchGermanDriversLicenseNumberStr.length : 0) +
                        ((matchGermanIDNumberStr && matchGermanIDNumberStr.length > 0) ? matchGermanIDNumberStr.length : 0) +
                        ((matchGermanPassportNumberStr && matchGermanPassportNumberStr.length > 0) ? matchGermanPassportNumberStr.length : 0) +
                        ((matchGermanSocialSecurityNumberStr && matchGermanSocialSecurityNumberStr.length > 0) ? matchGermanSocialSecurityNumberStr.length : 0) +
                        ((matchGermanTaxIdentifierStr && matchGermanTaxIdentifierStr.length > 0) ? matchGermanTaxIdentifierStr.length : 0) +
                        ((matchIndianAadhaarNumberStr && matchIndianAadhaarNumberStr.length > 0) ? matchIndianAadhaarNumberStr.length : 0) +
                        ((matchIndianPANStr && matchIndianPANStr.length > 0) ? matchIndianPANStr.length : 0) +
                        ((matchItalianPassportNumberStr && matchItalianPassportNumberStr.length > 0) ? matchItalianPassportNumberStr.length : 0) +
                        ((matchItalianTaxIDStr && matchItalianTaxIDStr.length > 0) ? matchItalianTaxIDStr.length : 0) +
                        ((matchTurkishIDStr && matchTurkishIDStr.length > 0) ? matchTurkishIDStr.length : 0) +
                        ((matchUKBICNumberStr && matchUKBICNumberStr.length > 0) ? matchUKBICNumberStr.length : 0) +
                        ((matchUKDriverLicenseNumberStr && matchUKDriverLicenseNumberStr.length > 0) ? matchUKDriverLicenseNumberStr.length : 0) +
                        ((matchUKElectoralRollNumberStr && matchUKElectoralRollNumberStr.length > 0) ? matchUKElectoralRollNumberStr.length : 0) +
                        ((matchUKIBANNumberStr && matchUKIBANNumberStr.length > 0) ? matchUKIBANNumberStr.length : 0) +
                        ((matchUKNHSNumberStr && matchUKNHSNumberStr.length > 0) ? matchUKNHSNumberStr.length : 0) +
                        ((matchUKNationalInsuranceNumberStr && matchUKNationalInsuranceNumberStr.length > 0) ? matchUKNationalInsuranceNumberStr.length : 0) +
                        ((matchUKPassportNumberStr && matchUKPassportNumberStr.length > 0) ? matchUKPassportNumberStr.length : 0) +
                        ((matchUKPostcodeStr && matchUKPostcodeStr.length > 0) ? matchUKPostcodeStr.length : 0) +
                        ((matchUKSEDOLStr && matchUKSEDOLStr.length > 0) ? matchUKSEDOLStr.length : 0) +
                        ((matchUKSortCodeStr && matchUKSortCodeStr.length > 0) ? matchUKSortCodeStr.length : 0) +
                        ((matchUKUTRStr && matchUKUTRStr.length > 0) ? matchUKUTRStr.length : 0) +
                        ((matchUSDriverLicenseNumberStr && matchUSDriverLicenseNumberStr.length > 0) ? matchUSDriverLicenseNumberStr.length : 0) +
                        ((matchUSITINStr && matchUSITINStr.length > 0) ? matchUSITINStr.length : 0) +
                        ((matchUSMedicareHICNumberStr && matchUSMedicareHICNumberStr.length > 0) ? matchUSMedicareHICNumberStr.length : 0) +
                        ((matchUSPassportNumberStr && matchUSPassportNumberStr.length > 0) ? matchUSPassportNumberStr.length : 0) +
                        ((matchUSSSNStr && matchUSSSNStr.length > 0) ? matchUSSSNStr.length : 0) +
                        ((matchUSSSNRandomizationStr && matchUSSSNRandomizationStr.length > 0) ? matchUSSSNRandomizationStr.length : 0) +
                        ((matchUSVINStr && matchUSVINStr.length > 0) ? matchUSVINStr.length : 0) +
                        ((matchUSZipCodeStr && matchUSZipCodeStr.length > 0) ? matchUSZipCodeStr.length : 0) +
                        ((matchChinaTINStr && matchChinaTINStr.length > 0) ? matchChinaTINStr.length : 0) +
                        ((matchJapanSSNStr && matchJapanSSNStr.length > 0) ? matchJapanSSNStr.length : 0) +
                        ((matchKoreaRRNStr && matchKoreaRRNStr.length > 0) ? matchKoreaRRNStr.length : 0) +
                        ((matchIRDStr && matchIRDStr.length > 0) ? matchIRDStr.length : 0) +
                        ((matchSSSStr && matchSSSStr.length > 0) ? matchSSSStr.length : 0) +
                        ((matchINSZStr && matchINSZStr.length > 0) ? matchINSZStr.length : 0) +
                        ((matchStNrStr && matchStNrStr.length > 0) ? matchStNrStr.length : 0) +
                        ((matchNIRStr && matchNIRStr.length > 0) ? matchNIRStr.length : 0) +
                        ((matchCodiceFiscaleStr && matchCodiceFiscaleStr.length > 0) ? matchCodiceFiscaleStr.length : 0) +
                        ((matchBSNStr && matchBSNStr.length > 0) ? matchBSNStr.length : 0) +
                        ((matchNISSStr && matchNISSStr.length > 0) ? matchNISSStr.length : 0) +
                        ((matchINNStr && matchINNStr.length > 0) ? matchINNStr.length : 0) +
                        ((matchNUSSStr && matchNUSSStr.length > 0) ? matchNUSSStr.length : 0) +
                        ((matchINPPStr && matchINPPStr.length > 0) ? matchINPPStr.length : 0) +
                        ((matchCPFStr && matchCPFStr.length > 0) ? matchCPFStr.length : 0)+
                        ((checkForWordsStr && checkForWordsStr.length > 0) ? checkForWordsStr.length : 0);

                    debug("cnt", cnt);
                    sendMultipleRequests(cnt, 10000);

                    const handleMatches = (matches, blockMode, generateFunction, maskFunction, typeLabel) => {
                        debug("matched", matches);
                        if (!matches) return;

                        let maskedStringArr = [];

                        if (blockMode === "enabled") {

                            const matchedWords = matches.map(item => {
                                const maskedString = maskFunction(item);
                                maskedStringArr.push(maskedString);
                                return maskedString;
                            });

                            debug(`${typeLabel} matchedWords`, matchedWords);
                            const _mString = maskedStringArr.join(", ");
                            const _tmptype = `<span style='color:darkgrey; font-weight:bold;'>${typeLabel} :</span> ${_mString}`;
                            debug("_tmptype", _tmptype);
                            matchedWordsx.push(_tmptype);
                            showPopup(event, matchedWordsx);


                        } else if (blockMode === "disabled") {
                            matches.forEach(match => {
                                if (typeof match === 'string') {  
                                    const randomValue = generateFunction();
                                    const regex = new RegExp(match.replace('+', '\\+'), 'g');
                                    debug("Replace", textarea.textContent);
                                    textarea.textContent = textarea.textContent.replace(regex, randomValue);                            
                                } else {
                                    debug(`Invalid match: ${match}`);  
                                }
                            });
                        }

                    };

                    function getEnabledFunctions() {
                        return new Promise((resolve, reject) => {
                            chrome.storage.sync.get(['enabledFunctions'], function(result) {
                                if (chrome.runtime.lastError) {
                                    reject(chrome.runtime.lastError);
                                } else {
                                    debug('Retrieved enabled functions:', result.enabledFunctions);
                                    resolve(result.enabledFunctions);
                                }
                            });
                        });
                    }


                    getEnabledFunctions()
                        .then(enabledFunctions => {
                            debug('Enabled functions:', enabledFunctions);

                            const functionMapping = {
                                'Words': {
                                    matchStr: checkForWordsStr,
                                    generator: generateUniqueRandomWord,
                                    mask: maskString
                                },                                
                                'Phone Number': {
                                    matchStr: matchPhoneNumbersStr,
                                    generator: generateUniqueRandomPhoneNumber,
                                    mask: maskString
                                },
                                'Credit Card Number': {
                                    matchStr: matchCreditCardNumbersStr,
                                    generator: generateUniqueRandomCreditCard,
                                    mask: maskString
                                },
                                'Crypto Addresses': {
                                    matchStr: matchCryptoAddressesStr,
                                    generator: generateUniqueRandomCryptoAddress,
                                    mask: maskString
                                },
                                'Email Address': {
                                    matchStr: matchEmailAddressesStr,
                                    generator: generateUniqueRandomEmail,
                                    mask: maskStringEmail
                                },
                                'IBAN Codes': {
                                    matchStr: matchIBANCodesStr,
                                    generator: generateUniqueRandomIBAN,
                                    mask: maskString
                                },
                                'IP Addresses': {
                                    matchStr: matchIPAddressesStr,
                                    generator: generateUniqueRandomIPAddress,
                                    mask: maskString
                                },
                                'ABA RTN': {
                                    matchStr: matchABARTNStr,
                                    generator: generateUniqueRandomABARTN,
                                    mask: maskString
                                },
                                'Australian Business Number': {
                                    matchStr: matchAustralianBusinessNumberStr,
                                    generator: generateUniqueRandomAustralianBusinessNumber,
                                    mask: maskString
                                },
                                'Australian Company Number': {
                                    matchStr: matchAustralianCompanyNumberStr,
                                    generator: generateUniqueRandomAustralianCompanyNumber,
                                    mask: maskString
                                },
                                'Australian Drivers License': {
                                    matchStr: matchAustralianDriversLicenseStr,
                                    generator: generateUniqueRandomAustralianDriversLicense,
                                    mask: maskString
                                },
                                'Australian Full National Number (FNN)': {
                                    matchStr: matchAustralianFullNationalNumberStr,
                                    generator: generateUniqueRandomAustralianFullNationalNumber,
                                    mask: maskString
                                },
                                'Australian Medicare card number': {
                                    matchStr: matchAustralianMedicareCardNumberStr,
                                    generator: generateUniqueRandomAustralianMedicareCardNumber,
                                    mask: maskString
                                },
                                'Australian NSW Drivers License Pattern': {
                                    matchStr: matchAustralianNSWDriversLicenseStr,
                                    generator: generateUniqueRandomAustralianNSWDriversLicense,
                                    mask: maskString
                                },
                                'Australian Queensland Drivers License Pattern': {
                                    matchStr: matchAustralianQLDDriversLicenseStr,
                                    generator: generateUniqueRandomAustralianQLDDriversLicense,
                                    mask: maskString
                                },
                                'Australian Tax File Number': {
                                    matchStr: matchAustralianTaxFileNumberStr,
                                    generator: generateUniqueRandomAustralianTaxFileNumber,
                                    mask: maskString
                                },
                                'Austrian Bank Account Numbers': {
                                    matchStr: matchAustrianBankAccountNumbersStr,
                                    generator: generateUniqueRandomAustrianBankAccountNumbers,
                                    mask: maskString
                                },
                                'Austrian Passport Number': {
                                    matchStr: matchAustrianPassportNumberStr,
                                    generator: generateUniqueRandomAustrianPassportNumber,
                                    mask: maskString
                                },
                                'Austrian Social Security Insurance Number': {
                                    matchStr: matchAustrianSocialSecurityInsuranceNumberStr,
                                    generator: generateUniqueRandomAustrianSocialSecurityInsuranceNumber,
                                    mask: maskString
                                },
                                'Austrian VAT Identification Number (UID)': {
                                    matchStr: matchAustrianVATNumberStr,
                                    generator: generateUniqueRandomAustrianVATNumber,
                                    mask: maskString
                                },
                                'Canadian Alberta Drivers License Pattern': {
                                    matchStr: matchCanadianAlbertaDriversLicenseStr,
                                    generator: generateUniqueRandomCanadianAlbertaDriversLicense,
                                    mask: maskString
                                },
                                'Canadian Alberta Health Pattern': {
                                    matchStr: matchCanadianAlbertaHealthStr,
                                    generator: generateUniqueRandomCanadianAlbertaHealth,
                                    mask: maskString
                                },
                                'Canadian Manitoba Drivers License Pattern': {
                                    matchStr: matchCanadianManitobaDriversLicenseStr,
                                    generator: generateUniqueRandomCanadianManitobaDriversLicense,
                                    mask: maskString
                                },
                                'Canadian Manitoba Health Pattern': {
                                    matchStr: matchCanadianManitobaHealthStr,
                                    generator: generateUniqueRandomCanadianManitobaHealth,
                                    mask: maskString
                                },
                                'Canadian Ontario Drivers License Pattern': {
                                    matchStr: matchCanadianOntarioDriversLicenseStr,
                                    generator: generateUniqueRandomCanadianOntarioDriversLicense,
                                    mask: maskString
                                },
                                'Canadian Ontario Health Pattern': {
                                    matchStr: matchCanadianOntarioHealthStr,
                                    generator: generateUniqueRandomCanadianOntarioHealth,
                                    mask: maskString
                                },
                                'Canadian Passport Pattern': {
                                    matchStr: matchCanadianPassportStr,
                                    generator: generateUniqueRandomCanadianPassport,
                                    mask: maskString
                                },
                                'Canadian Quebec Drivers License Pattern': {
                                    matchStr: matchCanadianQuebecDriversLicenseStr,
                                    generator: generateUniqueRandomCanadianQuebecDriversLicense,
                                    mask: maskString
                                },
                                'Canadian Quebec Health Pattern': {
                                    matchStr: matchCanadianQuebecHealthStr,
                                    generator: generateUniqueRandomCanadianQuebecHealth,
                                    mask: maskString
                                },
                                'Canadian Saskatchewan Drivers License Pattern': {
                                    matchStr: matchCanadianSaskatchewanDriversLicenseStr,
                                    generator: generateUniqueRandomCanadianSaskatchewanDriversLicense,
                                    mask: maskString
                                },
                                'Canadian Social Insurance Number': {
                                    matchStr: matchCanadianSocialInsuranceNumberStr,
                                    generator: generateUniqueRandomCanadianSocialInsuranceNumber,
                                    mask: maskString
                                },
                                'Date (Multiple Formats)': {
                                    matchStr: matchDateFormatsStr,
                                    generator: generateUniqueRandomDateFormats,
                                    mask: maskString
                                },
                                'France Drivers License Number': {
                                    matchStr: matchFranceDriversLicenseNumberStr,
                                    generator: generateUniqueRandomFranceDriversLicenseNumber,
                                    mask: maskString
                                },
                                'France Passport Number': {
                                    matchStr: matchFrancePassportNumberStr,
                                    generator: generateUniqueRandomFrancePassportNumber,
                                    mask: maskString
                                },
                                'France Value Added Tax (VAT) Number': {
                                    matchStr: matchFranceVATNumberStr,
                                    generator: generateUniqueRandomFranceVATNumber,
                                    mask: maskString
                                },
                                'French INSEE Code': {
                                    matchStr: matchFrenchINSEECodeStr,
                                    generator: generateUniqueRandomFrenchINSEECode,
                                    mask: maskString
                                },
                                'German Driver\'s License Number': {
                                    matchStr: matchGermanDriversLicenseNumberStr,
                                    generator: generateUniqueRandomGermanDriversLicenseNumber,
                                    mask: maskString
                                },
                                'German ID Number': {
                                    matchStr: matchGermanIDNumberStr,
                                    generator: generateUniqueRandomGermanIDNumber,
                                    mask: maskString
                                },
                                'German Passport Number': {
                                    matchStr: matchGermanPassportNumberStr,
                                    generator: generateUniqueRandomGermanPassportNumber,
                                    mask: maskString
                                },
                                'German Social Security Number': {
                                    matchStr: matchGermanSocialSecurityNumberStr,
                                    generator: generateUniqueRandomGermanSocialSecurityNumber,
                                    mask: maskString
                                },
                                'German Tax Identifier/Code': {
                                    matchStr: matchGermanTaxIdentifierStr,
                                    generator: generateUniqueRandomGermanTaxIdentifier,
                                    mask: maskString
                                },
                                'Indian Aadhaar Number': {
                                    matchStr: matchIndianAadhaarNumberStr,
                                    generator: generateUniqueRandomIndianAadhaarNumber,
                                    mask: maskString
                                },
                                'Indian PAN': {
                                    matchStr: matchIndianPANStr,
                                    generator: generateUniqueRandomIndianPAN,
                                    mask: maskString
                                },
                                'Italian Passport Number': {
                                    matchStr: matchItalianPassportNumberStr,
                                    generator: generateUniqueRandomItalianPassportNumber,
                                    mask: maskString
                                },
                                'Italian Tax ID/SSN (Codice Fiscale)': {
                                    matchStr: matchItalianTaxIDStr,
                                    generator: generateUniqueRandomItalianTaxID,
                                    mask: maskString
                                },
                                'Turkish Identification Number': {
                                    matchStr: matchTurkishIDStr,
                                    generator: generateUniqueRandomTurkishID,
                                    mask: maskString
                                },
                                'UK BIC Number': {
                                    matchStr: matchUKBICNumberStr,
                                    generator: generateUniqueRandomUKBICNumber,
                                    mask: maskString
                                },
                                'UK Driver License Number': {
                                    matchStr: matchUKDriverLicenseNumberStr,
                                    generator: generateUniqueRandomUKDriverLicenseNumber,
                                    mask: maskString
                                },
                                'UK Electoral Roll Number': {
                                    matchStr: matchUKElectoralRollNumberStr,
                                    generator: generateUniqueRandomUKElectoralRollNumber,
                                    mask: maskString
                                },
                                'UK IBAN Number': {
                                    matchStr: matchUKIBANNumberStr,
                                    generator: generateUniqueRandomUKIBANNumber,
                                    mask: maskString
                                },
                                'UK National Health Service (NHS) Number': {
                                    matchStr: matchUKNHSNumberStr,
                                    generator: generateUniqueRandomUKNHSNumber,
                                    mask: maskString
                                },
                                'UK National Insurance Number': {
                                    matchStr: matchUKNationalInsuranceNumberStr,
                                    generator: generateUniqueRandomUKNationalInsuranceNumber,
                                    mask: maskString
                                },
                                'UK Passport Number': {
                                    matchStr: matchUKPassportNumberStr,
                                    generator: generateUniqueRandomUKPassportNumber,
                                    mask: maskString
                                },
                                'UK Postcode': {
                                    matchStr: matchUKPostcodeStr,
                                    generator: generateUniqueRandomUKPostcode,
                                    mask: maskString
                                },
                                'UK SEDOL': {
                                    matchStr: matchUKSEDOLStr,
                                    generator: generateUniqueRandomUKSEDOL,
                                    mask: maskString
                                },
                                'UK Sort Code': {
                                    matchStr: matchUKSortCodeStr,
                                    generator: generateUniqueRandomUKSortCode,
                                    mask: maskString
                                },
                                'UK Unique Taxpayer Reference (UTR)': {
                                    matchStr: matchUKUTRStr,
                                    generator: generateUniqueRandomUKUTR,
                                    mask: maskString
                                },
                                'US Driver License Number': {
                                    matchStr: matchUSDriverLicenseNumberStr,
                                    generator: generateUniqueRandomUSDriverLicenseNumber,
                                    mask: maskString
                                },
                                'US Individual Taxpayer Identification Number (ITIN)': {
                                    matchStr: matchUSITINStr,
                                    generator: generateUniqueRandomUSITIN,
                                    mask: maskString
                                },
                                'US Medicare Health Insurance Claim (HIC) Number': {
                                    matchStr: matchUSMedicareHICNumberStr,
                                    generator: generateUniqueRandomUSMedicareHICNumber,
                                    mask: maskString
                                },
                                'US Passport Number': {
                                    matchStr: matchUSPassportNumberStr,
                                    generator: generateUniqueRandomUSPassportNumber,
                                    mask: maskString
                                },
                                'US Social Security Number (SSN)': {
                                    matchStr: matchUSSSNStr,
                                    generator: generateUniqueRandomUSSSN,
                                    mask: maskString
                                },
                                'US Social Security Number Randomization': {
                                    matchStr: matchUSSSNRandomizationStr,
                                    generator: generateUniqueRandomUSSSNRandomization,
                                    mask: maskString
                                },
                                'US Vehicle Identification Number (VIN)': {
                                    matchStr: matchUSVINStr,
                                    generator: generateUniqueRandomUSVIN,
                                    mask: maskString
                                },
                                'US Zip Code': {
                                    matchStr: matchUSZipCodeStr,
                                    generator: generateUniqueRandomUSZipCode,
                                    mask: maskString
                                },
                                'China TIN': {
                                    matchStr: matchChinaTINStr,
                                    generator: generateUniqueRandomChinaTIN,
                                    mask: maskString
                                },
                                'Japan SSN Code': {
                                    matchStr: matchJapanSSNStr,
                                    generator: generateUniqueRandomJapanSSN,
                                    mask: maskString
                                },
                                'Korea RRN': {
                                    matchStr: matchKoreaRRNStr,
                                    generator: generateUniqueRandomKoreaRRN,
                                    mask: maskString
                                },
                                'New Zealand IRD': {
                                    matchStr: matchIRDStr,
                                    generator: generateUniqueRandomIRD,
                                    mask: maskString
                                },
                                'Philippines SSS': {
                                    matchStr: matchSSSStr,
                                    generator: generateUniqueRandomSSS,
                                    mask: maskString
                                },
                                'Belgium INSZ/NISS': {
                                    matchStr: matchINSZStr,
                                    generator: generateUniqueRandomINSZ,
                                    mask: maskString
                                },
                                'Germany StNr': {
                                    matchStr: matchStNrStr,
                                    generator: generateUniqueRandomStNr,
                                    mask: maskString
                                },
                                'France NIR': {
                                    matchStr: matchNIRStr,
                                    generator: generateUniqueRandomNIR,
                                    mask: maskString
                                },
                                'Italy Codice Fiscale': {
                                    matchStr: matchCodiceFiscaleStr,
                                    generator: generateUniqueRandomCodiceFiscale,
                                    mask: maskString
                                },
                                'Netherlands BSN': {
                                    matchStr: matchBSNStr,
                                    generator: generateUniqueRandomBSN,
                                    mask: maskString
                                },
                                'Portugal NISS': {
                                    matchStr: matchNISSStr,
                                    generator: generateUniqueRandomNISS,
                                    mask: maskString
                                },
                                'Russia INN': {
                                    matchStr: matchINNStr,
                                    generator: generateUniqueRandomINN,
                                    mask: maskString
                                },
                                'Spain NUSS': {
                                    matchStr: matchNUSSStr,
                                    generator: generateUniqueRandomNUSS,
                                    mask: maskString
                                },
                                'Ukraine INPP': {
                                    matchStr: matchINPPStr,
                                    generator: generateUniqueRandomINPP,
                                    mask: maskString
                                },
                                'Brazil CPF': {
                                    matchStr: matchCPFStr,
                                    generator: generateUniqueRandomCPF,
                                    mask: maskString
                                }
                            };

                            enabledFunctions.forEach(func => {
                                if (functionMapping[func]) {
                                    const {
                                        matchStr,
                                        generator,
                                        mask
                                    } = functionMapping[func];
                                    if (matchStr) { 
                                        handleMatches(matchStr, blockMode, generator, mask, func);
                                    } else {
                                        debug("No match string found for function");
                                    }
                                }  else {
                                    
                                    debug("No function mapping found");
                                 }
                            });
                        })
                        .catch(error => {
                            console.error('Error retrieving enabled functions:', error);
                        });



                    if (matchSecretTokenStr && matchSecretTokenStr.length > 0) {
                        handleMatches(matchSecretTokenStr, blockMode, generateSyntheticData, maskString, "Secret Tokens");
                    }

                    if (matchMarkdownStr) {
                        if (blockMode === "enabled") {
                            try {
                                sendDataWithRetry();
                            } catch (error) {
                                console.error('Error:', error);
                            }

                            const _tmptype = `<span style='color:darkgrey; font-weight:bold;'>Markdown Injection :</span> ${matchMarkdownStr}`;
                            matchedWordsx.push(...matchedWords.filter(word => word !== undefined && word !== null));
                            matchedWordsx.push(_tmptype);
                            showPopup(event, matchedWordsx);
                        }
                        textarea.value += " ";
                    }

                    if (matchClosestStr) {
                        if (blockMode === "enabled") {
                            const _tmptype = `<span style='color:darkgrey; font-weight:bold;'>Injection Attack :</span> ${matchClosestStr}`;
                            matchedWordsx.push(...matchedWords.filter(word => word !== undefined && word !== null));
                            matchedWordsx.push(_tmptype);
                            showPopup(event, matchedWordsx);
                        }
                        textarea.value += " ";
                    }

                // end if
                }

            }, 300)); // 300 ms debounce delay
            }); //debounce input paste event


        } else {

            debug("Textarea not found", null);
            textarea = document.querySelector("#prompt-textarea");
        }

    }, 4000); //intervalId end

}
//end

startInterval();

const style = document.createElement("link");
style.rel = "stylesheet";
style.href = chrome.runtime.getURL("style.css");
document.head.appendChild(style);

const popupContainer = createEl('div', {
    id: 'popup-container',
    style: 'opacity: 0; transition: opacity 0.3s; display: none;'
});
const popup = createEl('div', {
    id: 'popup',
    style: 'opacity: 0; transition: opacity 0.3s;'
});
const closeButton = createEl('span', {
    id: 'close-button',
    innerHTML: '&times;',
    onClick: closePopup
});
const popupText = createEl('p', {
    textContent: ""
});

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

    debug("word",wordx);
    popupContainer.style.display = 'flex';
    setTimeout(() => {
        popupContainer.style.opacity = '1';
        popup.style.opacity = '1';
    }, 10);


    if (Array.isArray(wordx)) {
        wordx = wordx.reverse();
        debug("matchedWordsx.count", wordx.length);

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
    setTimeout(startInterval, 4000);
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
    setTimeout(startInterval, 4000);
}