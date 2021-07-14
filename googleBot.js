// ==UserScript==
// @name         GoogleBot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.google.com/*
// @match        https://xn----7sbab5aqcbiddtdj1e1g.xn--p1ai/*
// @match        https://crushdrummers.ru/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

let googleInput = document.getElementsByName("q")[0];
let btnK = document.getElementsByName("btnK")[1];
let sites = {
    "xn----7sbab5aqcbiddtdj1e1g.xn--p1ai": ["Как звучит гобой","Флейта","Кларнет","Фагот","Валторна","Саксофон"],
    "crushdrummers.ru": ["Барабанное шоу", "Шоу барабанщиков Crush", "Заказать барабанное шоу"]
}
let site = Object.keys(sites)[getIntRandom(0, Object.keys(sites).length)]; // Возвращаем случайный сайт
let words = sites[site]; // Получаем набор коючевых слов одного из сайтов
//let words = ["Как звучит гобой","Флейта","Кларнет","Фагот","Валторна","Саксофон"]; // Набор коючевых слов
let word = words[getIntRandom(0, words.length)]; // Получаем случайное слово из массива words

if(btnK != undefined){ // Проверяем, что мы на главной странице
    let i=0;
    let timerId = setInterval(function(){
        googleInput.value = googleInput.value + word[i++]; // Пишем по буквам фразу в поисковую строку
        document.cookie = "site="+site; // Записали выбранный сайт в cookie браузера
        if(i==word.length){
            clearInterval(timerId);
            btnK.click();// Клик по кнопке поиска
        }
    }, 500);
}else if(location.hostname === "www.google.com"){ // Если страница с поисковой выдачей
    let links = document.links; // Собираем коллекцию ссылок
    let goNext = true;
    let site = getCookie("site"); // Достаём ранее выбранный сайт из куки
    for(let i=0; i<links.length; i++){ // Перебираем ссылки
        let link = links[i];
        if(link.href.indexOf(site) != -1){ // Ищем ссылку с нужным сайтом
            setTimeout(function(){
                link.click(); // Кликаем по ссылке с нужным сайтом
            }, 3000);
            goNext = false; // запрещаем идти дальше по страницам поисковика
            break; // Останавливаем цикл
        }
    }
    if(goNext){ // Проверяем, можно ли идти далее по страницам поисковика
        let currentPage = document.querySelector('.YyVfkd').innerText;
        if(currentPage<10){
            let pnnext = document.getElementById("pnnext"); // Находим кнопку "Следующая"
            setTimeout(function(){
                pnnext.click(); // Кликаем по кнопке следующая
            }, 3000);
        }else{
            location.href = "https://www.google.com/";
        }
    }
}else{ // Любой другой сайт
    setInterval(function(){
        if(getIntRandom(0,100)<30) location.href = "https://www.google.com/"; // С некоторой вероятностью мы уйдём на сайт google
        let links = document.links; // Коллекция ссылок
        let randomIndex = getIntRandom(0, links.length);
        let link = links[randomIndex];
        if(link.href.indexOf(location.hostname) != -1){ // Если переход внутри сайта
            links[randomIndex].click();
        }else{ // Если переход на другой сайт, то мы ссылаем браузер на главную страницу нашего сайта
            location.href = location.origin;
        }
    },2000);
}

function getIntRandom(min, max){
    return Math.floor(Math.random()*(max-min)+min);
}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
