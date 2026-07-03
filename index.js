const main = document.querySelector("main");
const textarea = document.querySelector("textarea");
const makeTranslitButton = document.querySelector(".make-translit");
const clearButton = document.querySelector(".clear");
const outputList = document.querySelector(".output-list");
const originalText = document.querySelector(".original-text");
const translitText = document.querySelector(".translit-text");
const deleteButton = document.querySelector(".delete");
const error = document.querySelector(".error");
const svg = document.querySelector("svg");

const isFieldFilled = value => Boolean(value && typeof value === "string" && value.trim().length > 0);

// Таблица замен для транслитерации
const translitTable = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '\'',
    'э': 'e', 'ю': 'yu', 'я': 'ya'
};

// Регулярное выражение для фильтрации мата
const hateSpeech = /(?<![а-яё])(?:(?:(?:у|[нз]а|(?:хитро|не)?вз?[ыьъ]|с[ьъ]|(?:и|ра)[зс]ъ?|(?:о[тб]|п[оа]д)[ьъ]?|(?:\S(?=[а-яё]))+?[оаеи-])-?)?(?:[её](?:б(?!о[рй]|рач)|п[уа](?:ц|тс))|и[пб][ае][тцд][ьъ]).*?|(?:(?:н[иеа]|(?:ра|и)[зс]|[зд]?[ао](?:т|дн[оа])?|с(?:м[еи])?|а[пб]ч|в[ъы]?|пр[еи])-?)?ху(?:[яйиеёю]|л+и(?!ган)).*?|бл(?:[эя]|еа?)(?:[дт][ьъ]?)?|\S*?(?:п(?:[иеё]зд|ид[аое]?р|ед(?:р(?!о)|[аое]р|ик)|охую)|бля(?:[дбц]|тс)|[ое]ху[яйиеё]|хуйн).*?|(?:о[тб]?|про|на|вы)?м(?:анд(?:[ауеыи](?:л(?:и[сзщ])?[ауеиы])?|ой|[ао]в.*?|юк(?:ов|[ауи])?|е[нт]ь|ища)|уд(?:[яаиое].+?|е?н(?:[ьюия]|ей))|[ао]л[ао]ф[ьъ](?:[яиюе]|[еёо]й))|елд[ауые].*?|ля[тд]ь|(?:[нз]а|по)х)(?![а-яё])/gim;

// Стартовое состояние страницы
function renderPage () {
    textarea.value = "Собака сутулая";
    originalText.textContent = "Собака сутулая";
    translitText.textContent = "Sobaka sutulaya";
}
renderPage();

// Транслитерация
function convertToTranslit(clearedInput) {
    let translitResult = "";

    for (const char of clearedInput) {
        const lowerChar = char.toLowerCase();
            
        if (!translitTable[lowerChar]) {
            translitResult += char;
            continue; 
        }
            
        const translitChar = translitTable[lowerChar];
            
        if (char === char.toUpperCase() && char !== lowerChar) {
            translitResult += translitChar[0].toUpperCase() + translitChar.slice(1);
        } else {
            translitResult += translitChar;
        }
    }

    return translitResult;
}

// Валидация ввода и вывод DOM
function inputValidation(text) {
    if (!isFieldFilled(text.value)){
        error.textContent = "Введите текст для транслитерации";
        return null;
    }

    error.textContent = "";
    
    return text.value.replace(hateSpeech, "****");
}

makeTranslitButton.addEventListener('click', () => {

    const clearedInput = inputValidation(textarea);
    
    if (!clearedInput) return;

    const translit = convertToTranslit(clearedInput);

    const li = document.createElement("li");
    li.classList.add("output-content");

    const original = document.createElement("p");
    original.classList.add("original-text");
    original.textContent = clearedInput;

    const pTranslit = document.createElement("p");
    pTranslit.classList.add("translit-text");
    pTranslit.textContent = translit;

    const button = document.createElement("button");
    button.classList.add("delete");
    button.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`;

    li.append(original);
    li.append(pTranslit);
    li.append(button);
    outputList.append(li);
});

clearButton.addEventListener('click', () => {
    textarea.value = "";
});

// Удаление строк