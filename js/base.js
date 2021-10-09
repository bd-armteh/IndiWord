"use strict";

$( document ).ready(function(){



// открытие и закрытие меню с настройками	
/*$("#systemMenuIcon").click(function(){
	$("#systemMenuIcon").toggleClass("systemMenuIconActive");
	$("#systemMenuDropContent").toggleClass("systemMenuDropContentActive");
});*/

// закрытие окна если был клик вне его области
/*$(document).mouseup(function (e){ // событие клика по веб-документу
	var div = $("#systemMenu"); // тут указываем ID элемента
	if (!div.is(e.target) // если клик был не по нашему блоку
		   && div.has(e.target).length === 0) { // и не по его дочерним элементам
	$("#systemMenuIcon").removeClass("systemMenuIconActive");
	$("#systemMenuDropContent").removeClass("systemMenuDropContentActive");
	} 
});
*/


// закрытие AlertPop
$("#AlertPop span").click(function(){
	$("#AlertPop").hide();
});




	
/*-----  Функциональная часть  -----*/



// функция рамдомного числа из кол-ва ключей объекта
function getRandomNumberFromObj (data) {
	// получаем рандомное число из кол-ва ключей в переданном объекте
	return Math.floor(Math.random() * Object.keys(data).length);
};



// функция возвращает слово
function getWordFromObject ( myObject, key ){
	 return myObject[key].word;
}

// функция возвращает подсказку
function getPromptFromObject ( myObject, key ){
	 return myObject[key].prompt;
}


// добавляем подсказку в модальное окно
function addPromptInModal (data) {
	$("#myModal .modal-content-text").text( data );
	$("#myModal .modal-content-button .promptOk").show();	
}

// очищаем модальное окно - текстовое поле и скрываем кнопки
function emptyModalField () {
	$("#myModal .modal-content-text").empty();
	$("#myModal .modal-content-button span").hide();

}

// модальное окно при выйграше
function addTextVinnerInModal () {

	// заносим данные
	$("#myModal .modal-content-text").text("Отгадали!");

	// показываем кнопки
	$("#myModal .modal-content-button .nextLevel").show();
	$("#myModal .modal-content-button .mainMenu").show();
	
	// показываем модальное окно
	$("#myModal").show();

	// вызываем функцию вычисления отступа модального окна
	// используем фукцию по времени так как объекты в момент добавления не имеют высоты 
	setTimeout(function(){ myModalCalcMarginTop(); }, 0);
}

// модальное окно при проиграше
function addTextLoseInModal () {

	// заносим данные
	$("#myModal .modal-content-text").text("Кончились ходы");

	// показываем кнопки
	$("#myModal .modal-content-button .restartLevel").show();
	$("#myModal .modal-content-button .mainMenu").show();

	// показываем модальное окно
	$("#myModal").show();

	// вызываем функцию вычисления отступа модального окна
	// используем фукцию по времени так как объекты в момент добавления не имеют высоты 
	setTimeout(function(){ myModalCalcMarginTop(); }, 0);

}

let word;    				 // слово
let prompt;                  // подсказка
let remainingLetters;    	 // кол-во букв
let answerArray;         	 // итоговый массив из букв
let userAttempts;		 	 // ходы игрока
let gameAttempts;			 // осталось ходов у игрока
let gameLevels;			     // игровой уровень 
let numberOfAddChances = 6;  // кол-во дополнительных шансов

// функция получает все необходимые данные для старта игры
function getDataForStartGame() {

	// в функцию передаем объект и
	// сохраняем рандомное число для последующей вставки в поле - ключ 
	let randomNumberFromObj = getRandomNumberFromObj (wordForProlog);

	// получаем случайное слово
	 word = getWordFromObject (wordForProlog,randomNumberFromObj).toUpperCase();
	 prompt = getPromptFromObject (wordForProlog,randomNumberFromObj);

	// Создаем итоговый массив
	 answerArray = [];
	for (let i = 0; i < word.length; i++) {
		answerArray[i] = "_";

		// Находим родительский элемент.
		// Создать в нем элеметы, кол-во соотведствует длине слова
		// Заполнить их символом "_"
		$("#screenResult ul.keyboard").append("<li class='keyWrap' keyId="+ i +">"+ answerArray[i] +"</li>");
	}

	// кол-во букв которые надо открыть
	 remainingLetters = word.length;

	// объявляем переменные счетчиков
	 userAttempts = 0;
	 gameAttempts = word.length + numberOfAddChances;

	// заносим стартовые значения
	$(".userAttempts").text(userAttempts);
	$(".gameAttempts").text(gameAttempts)

	//return remainingLetters;

}

// функция обработки счетчика кол-ва ходов игрока
function userAttemptsCount (){
	userAttempts ++;
	$(".userAttempts").text(userAttempts);
}

// функция обработки счетчика ehjdytq
function gameLevelsCount (option){

	// проверяем какой сейчас уровень
	gameLevels = $(".gameLevels").text();

	// условие если в option - nextLevel, то увеличиваем счетчик

	if(option === "nextLevel") {
		gameLevels ++;
		$(".gameLevels").text(gameLevels);
	}

	// если resetLevel - то сбрасывем счетчик
	if(option === "resetLevel") {
		gameLevels = 1;
		$(".gameLevels").text(gameLevels);
	}
	
}

// функция обработки счетчика оставшихся ходов
function gameAttemptsCount (){
	gameAttempts --;
	$(".gameAttempts").text(gameAttempts);
}

// функция очистки поля для букв и стилей у кнопок

function clearScreenResultAndScreenKeyClass(){
	// очищаем поле от букв
		$("#screenResult ul.keyboard").empty();

		// убираем стили у кнопок
		$("#screenKey li.keyWrap").removeClass('keyWrapRight').removeClass('keyWrapWrong');
}


// функции обработки клика пользователя по буквам
function keyboardUserClick () {

	let userKey = $(this).text().toUpperCase();
	let userKeyRight = $(this).hasClass('keyWrapRight');
	let userKeyWrong = $(this).hasClass('keyWrapWrong');

	// 1 проверка на существующие стили
	if (userKeyRight || userKeyWrong){
		//console.log("Есть что то");
		return;
	} else {
		//console.log("Их нет");
	}

	// 2 проверка - если отгаданных букв больше 0
	if (remainingLetters > 0){

		// Обновляем состояние игры
		for (var j = 0; j < word.length; j++) {
			// если буква совпадает
			if (word[j] === userKey) {
				 answerArray[j] = userKey;
				 remainingLetters--;

				 // находим порядковый номер и заменяем текст
				 $("#screenResult ul.keyboard li[keyId="+j+"]").text(answerArray[j]);

				 //console.log("Осталось букв: " + remainingLetters);

				 // добавляем клас
				$(this).addClass("keyWrapRight");


			} else { // если буква не совпадает
				// добавляем клас
				$(this).addClass("keyWrapWrong");
				
			}
		}
	} // конец 2 проверки


	// 3 проверка - на количество отгаданных букв
	// Действие для победителя
	if (remainingLetters === 0) {
		// вызываем функцию через определенное время
		setTimeout(function() {
			// вызываем функцию
			addTextVinnerInModal();
		}, 300);
		return;
	} // конец 3 проверки
	

	// обработка счетчиков кол-ва ходов игрока
	userAttemptsCount();
	gameAttemptsCount();


	// 4 проверка - на кол-во оставшихся ходов
	// проверить не прервется ли игра когда игрок на последнем ходу отгодал слово.
	/*if (gameAttempts > 0 ){
		console.log("Ходы еще есть: " + gameAttempts);
	} else {
		console.log("Вы проиграли");
	}*/
	if (gameAttempts < 1 ){
		//console.log("Вы проиграли");
		// вызов модального окна при проиграше
		addTextLoseInModal ();

	} else {
		//console.log("Ходы еще есть: " + gameAttempts);
	}


} // конец функции обработки клика пользователя по буквам


// функция вычисляет отступ для модального окна
// добавть обработку в реальном времени, сейчас при изменении окна браузера она сработает неправильно
function myModalCalcMarginTop() {
	let heightModal = $("#myModal .modal-content").outerHeight();
	let windowHeight = $(window).height();
	$("#myModal .modal-content").css({"margin-top": (windowHeight - heightModal) / 2 });
}


// функция вычисляет отступ #screenResult
// добавть обработку в реальном времени, сейчас при изменении окна браузера она сработает неправильно
function ScreenResultPaddingTop() {

	// высоту окна
	let windowHeight = $(window).height();
	
	//получаем высоту #screenKey
	let heightScreenKey = $("#screenKey").outerHeight();
	
	//получаем высоту #screenResult ul.keyboard
	let heightScreenResult = $("#screenResult ul.keyboard").height();
	
	$("#screenResult ul.keyboard").css({"padding-top": ((windowHeight - heightScreenKey) - heightScreenResult) / 2 });
}



/* -------- Клики по кнопкам ------- */


// запуск функции обработки клика пользователя по буквам
$("#screenKey li.keyWrap").on("click",keyboardUserClick);


// клик по иконке подсказки
$("#gameTopBarPromptButton").on("click",function(){

	// добавляем подсказку и кнопку ОК для закрытия
	addPromptInModal(prompt);

	// вызываем функцию вычисления отступа модального окна
	// используем фукцию по времени так как объекты в момент добавления не имеют высоты 
	setTimeout(function(){ myModalCalcMarginTop(); }, 0);

	// показываем модальное окно
	$("#myModal").show();

	// закрытие модального окна по кнопке ОК с классом promptOk
	$("#myModal .modalButton.promptOk").on("click",function(){
	$("#myModal").hide();
	
	// очищаем поля
	emptyModalField();
	});
	
});


// клик по кнопке в модальном окне - Дальше
$("#myModal .modalButton.nextLevel").on("click",function(){
				
	$("#myModal").hide();
	// прописываем действие для кнопки - Дальше
	//alert("На следующий уровень");

	// выравнивам блок ScreenResult
	setTimeout(function(){ ScreenResultPaddingTop(); }, 0);

	// Получаем текс с экрана загрузки
	let headMiniTextDefault = $("#GameLoadingScreen .headMini").text();
	let headMiniTextWrite = "Следующий уровень";
	$("#GameLoadingScreen .headMini").text(headMiniTextWrite);
	
	// Экран загрузки
	$(".bgColorFill").fadeIn(500,function(){

		// перезагружаем игру
		// очищаем поле для букв и стили у кнопок
		clearScreenResultAndScreenKeyClass();

		// получаем стартовые данные
		getDataForStartGame();

		// счетчик уровней
		gameLevelsCount("nextLevel");

		// после задержки скрываем экран загрузки
		setTimeout(function(){ 
			$(".bgColorFill").fadeOut(500, function(){
				// возвращаем название обратно
				$("#GameLoadingScreen .headMini").text(headMiniTextDefault);
			});
		}, 1500);
	}); // конец fadeIn


	// очищаем поля
	emptyModalField();
});


// клик по кнопке в модальном окне - Меню
$("#myModal .modalButton.mainMenu").on("click",function(){
				
	$("#myModal").hide();
	// прописываем действие для кнопки - Меню
	//alert("Меню");

	// Получаем текс с экрана загрузки
	let headMiniTextDefault = $("#GameLoadingScreen .headMini").text();
	let headMiniTextWrite = "Главное меню";
	$("#GameLoadingScreen .headMini").text(headMiniTextWrite);

	// Экран загрузки
	$(".bgColorFill").fadeIn(500,function(){

		
		// очищаем поле для букв и стили у кнопок
		clearScreenResultAndScreenKeyClass();

		// счетчик уровней
		gameLevelsCount("resetLevel");

		// показываем главный экран
		$("#MainMenu").show();
		$("#author_info").show();


		// скрываем игровой интерфейс
		//$("#systemMenu").hide();
		//$("#systemHelpIcon").hide();
		$("#gameUI").hide();
		$("#gameScreen").hide();

		
		// после задержки скрываем экран загрузки
		setTimeout(function(){ 
			$(".bgColorFill").fadeOut(500, function(){
				// возвращаем название обратно
				$("#GameLoadingScreen .headMini").text(headMiniTextDefault);
			});
		}, 1500);
	}); // конец fadeIn

				
	// очищаем поля
	emptyModalField();
});		
	
// клик по кнопке в модальном окне - Переиграть
$("#myModal .modalButton.restartLevel").on("click",function(){
				
	$("#myModal").hide();
	// прописываем действие для кнопки - Переиграть
	//alert("Переиграть");

	// выравнивам блок ScreenResult
	setTimeout(function(){ ScreenResultPaddingTop(); }, 0);

	// Получаем текс с экрана загрузки
	let headMiniTextDefault = $("#GameLoadingScreen .headMini").text();
	let headMiniTextWrite = "Заново";
	$("#GameLoadingScreen .headMini").text(headMiniTextWrite);

	// Экран загрузки
	$(".bgColorFill").fadeIn(500,function(){

		// перезагружаем игру
		// очищаем поле для букв и стили у кнопок
		clearScreenResultAndScreenKeyClass();

		// получаем стартовые данные
		getDataForStartGame();

		// счетчик уровней
		gameLevelsCount("resetLevel");

		// после задержки скрываем экран загрузки
		setTimeout(function(){ 
			$(".bgColorFill").fadeOut(500, function(){
				// возвращаем название обратно
				$("#GameLoadingScreen .headMini").text(headMiniTextDefault);
			});
		}, 1500);
	}); // конец fadeIn

			
	// очищаем поля
	emptyModalField();
});


// кнопка - Играть в главном меню
$("#MainMenuButtonPlay").on("click",function(){

	$(".bgColorFill").fadeIn(500,function(){

		// выравнивам блок ScreenResult
		setTimeout(function(){ ScreenResultPaddingTop(); }, 0);

		// очищаем поле для букв и стили у кнопок
		clearScreenResultAndScreenKeyClass();

		// получаем стартовые данные
		getDataForStartGame();

		// счетчик уровней
		gameLevelsCount("resetLevel");

		//  скрываем главный экран
		$("#MainMenu").hide();
		$("#author_info").hide();

		// показываем игровой интерфейс
		//$("#systemMenu").show();
		//$("#systemHelpIcon").show();
		$("#gameUI").show();
		$("#gameScreen").show();
			

		// после задержки скрываем экран загрузки
		setTimeout(function(){ 
			$(".bgColorFill").fadeOut(500);
		}, 1500);

	});
});


// кнопка - Меню верхнем меню
$("#gameTopBarMenuButton").on("click",function(){

	// Получаем текс с экрана загрузки
	let headMiniTextDefault = $("#GameLoadingScreen .headMini").text();
	let headMiniTextWrite = "Главное меню";
	$("#GameLoadingScreen .headMini").text(headMiniTextWrite);

	
	// Экран загрузки
	$(".bgColorFill").fadeIn(500,function(){

		// очищаем поле для букв и стили у кнопок
		clearScreenResultAndScreenKeyClass();

		//  скрываем главный экран
		$("#MainMenu").show();
		$("#author_info").show();


		// показываем игровой интерфейс
		//$("#systemMenu").hide();
		//$("#systemHelpIcon").hide();
		$("#gameUI").hide();
		$("#gameScreen").hide();
		

		
		// после задержки скрываем экран загрузки
		setTimeout(function(){ 
			$(".bgColorFill").fadeOut(500, function(){
				// возвращаем название обратно
				$("#GameLoadingScreen .headMini").text(headMiniTextDefault);
			});
		}, 1500);
	}); // конец fadeIn
});



}); // конец $(document).ready



/*
// код запуска звука при клике
$('.button').on('click', function () { 
    var obj = document.createElement('audio');
    obj.src = 'linktoyourfile.wav'; 
    obj.play(); 
});

*/