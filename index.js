let myWord;
let buttons;
let tryCounter = 0;
const myFunction = async () => {
    const url = "https://random-word-api.herokuapp.com/word?length=5";
    const response = await fetch(url);
    const data = await response.json();
    myWord = data[0];
    buttons = [1, 2, 3, 4, 5].map((i) => document.getElementById("word" + i));
    for (let i = 0; i < buttons.length; i++) {
        if (i != buttons.length - 1) {
            buttons[i].addEventListener("keypress", (e) => {
                if (e.code == "Enter") return;
                setTimeout(() => {
                    buttons[i + 1].focus();
                }, 10);
            })
        }
        if (i != 0) {
            buttons[i].addEventListener("keydown", (e) => {
                if (e.code !== "Backspace") return;
                setTimeout(() => {
                    buttons[i - 1].focus();
                }, 10);
            })
        }
    }

}

document.addEventListener('DOMContentLoaded', () => myFunction());

const checkWord = () => {
    if (tryCounter == 5) {
        alert("NO! the word was " + myWord);
        return;
    }
    const word = buttons.map((button) => button.value).join('');
    if (word.length !== 5) {
        alert("INVALID!");
        return;
    }
    tryCounter++;
    let elem = `<div class="check">`;
    for (let i = 0; i < word.length; i++) {
        const indexes = [...myWord.matchAll(word[i])];
        if (indexes.length) {
            if (indexes.find((index => index.index == i))) {
                elem += `<span id = "green">${word[i]}</span>`;
            }
            else {
                elem += `<span id = "yellow">${word[i]}</span>`;
            }
        }
        else {
            elem += `<span id = "red">${word[i]}</span>`;
        }
    }
    elem += `</div>`
    document.getElementById("checks").innerHTML += elem;
    buttons.forEach(button => {
        button.value = '';
    });
    buttons[0].focus();
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
        checkWord();
    }
})