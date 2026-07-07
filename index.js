const inputTextarea = document.querySelector(".input-textarea");
const makeTranslitButton = document.querySelector(".make-translit");
const clearButton = document.querySelector(".clear");
const outputList = document.querySelector(".output-list");
const errorMessage = document.querySelector(".error");

// Демо-строка
const demoOriginalText = document.querySelector(".original-text");
const demoTranslitText = document.querySelector(".translit-text");
const demoDeleteButton = document.querySelector(".delete");

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
const hateSpeech = /(?<![а-яё])(?:(?:(?:у|[нз]а|(?:хитро|не)?вз?[ыьъ]|с[ьъ]|(?:и|ра)[зс]ъ?|(?:о[тб]|п[оа]д)[ьъ]?|(?:\S(?=[а-яё]))+?[оаеи-])-?)?(?:[её](?:б(?!о[рй]|рач)|п[уа](?:ц|тс))|и[пб][ае][тцд][ьъ]).*?|(?:(?:н[иеа]|(?:ра|и)[зс]|[зд]?[ао](?:т|дн[оа])?|с(?:м[еи])?|а[пб]ч|в[ъы]?|пр[еи])-?)?ху(?:[яйиеёю]|л+и(?!ган)).*?|бл(?:[эя]|еа?)(?:[дт][ьъ]?)?|\S*?(?:п(?:[иеё]зд|ид[аое]?р|ед(?:р(?!о)|[аое]р|ик)|охую)|бля(?:[дбц]|тс)|[ое]ху[яйиеё]|хуйн).*?|(?:о[тб]?|pro|на|вы)?м(?:анд(?:[ауеыи](?:л(?:и[сзщ])?[ауеиы])?|ой|[ао]в.*?|юк(?:ов|[ауи])?|е[нт]ь|ища)|уд(?:[яаиое].+?|е?н(?:[ьюия]|ей))|[ао]л[ао]ф[ьъ](?:[яиюе]|[еёо]й))|елд[ауые].*?|ля[тд]ь|(?:[нз]а|по)х)(?![а-яё])/gim;

// Стартовое состояние страницы
function renderInitialDemoRow() {
    inputTextarea.value = "Собака сутулая";
    if (demoOriginalText) demoOriginalText.textContent = "Собака сутулая";
    if (demoTranslitText) demoTranslitText.textContent = "Sobaka sutulaya";
}
renderInitialDemoRow();

// Транслитерация одной строки текста
function convertLineToTranslit(sourceLine) {
    let translitResult = "";

    for (const char of sourceLine) {
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

// Валидация содержимого textarea
function validateInput(textareaElement) {

    errorMessage.textContent = "";
    textareaElement.classList.remove("invalid");

    if (!isFieldFilled(textareaElement.value)) {
        errorMessage.textContent = "Введите текст для транслитерации";
        textareaElement.classList.add("invalid");
        return null;
    }

    if (hateSpeech.test(textareaElement.value)) {
        errorMessage.textContent = "Нецензурная лексика запрещена!";
        textareaElement.classList.add("invalid");
        return null;
    }

    return textareaElement.value;
}

// Создаёт один <li> с парой оригинал→транслит и кнопкой удаления
function createOutputListItem(originalLine, translitLine) {
    const listItem = document.createElement("li");
    listItem.classList.add("output-content");

    const originalTextEl = document.createElement("p");
    originalTextEl.classList.add("original-text");
    originalTextEl.textContent = originalLine;

    const translitTextEl = document.createElement("p");
    translitTextEl.classList.add("translit-text");
    translitTextEl.textContent = translitLine;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "delete");
    deleteButton.setAttribute("aria-label", "Удалить эту пару");
    deleteButton.innerHTML = `
    <svg class="icon-close" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`;

    deleteButton.addEventListener('click', () => {
        listItem.remove();
    });

    listItem.append(originalTextEl, translitTextEl, deleteButton);
    return listItem;
}

makeTranslitButton.addEventListener('click', () => {
    const validatedText = validateInput(inputTextarea);
    if (!validatedText) return;

    const lines = validatedText.split('\n');

    for (const line of lines) {
        if (!line.trim()) continue;

        const translitLine = convertLineToTranslit(line);
        const newListItem = createOutputListItem(line, translitLine);
        outputList.append(newListItem);
    }

    inputTextarea.value = "";
});

clearButton.addEventListener('click', () => {
    inputTextarea.value = "";
    errorMessage.textContent = "";
    inputTextarea.classList.remove("invalid");
});

// Удаление демо-строки
if (demoDeleteButton) {
    demoDeleteButton.addEventListener('click', () => {
        demoDeleteButton.closest("li").remove();
    });
}