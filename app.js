// item uno  - alternamos el cambio de color del título principal
function colorCambio(selector) {
	$(selector).animate({
			opacity: '1',
		}, {
			step: function () {
				$(this).css('color', 'white');
			},
			queue: true
		})
		.animate({
			opacity: '1'
		}, {
			step: function () {
				$(this).css('color', 'red');
			},
			queue: true
		}, 600)
		.delay(1000)
		.animate({
			opacity: '1'
		}, {
			step: function () {
				$(this).css('color', 'white');
			},
			queue: true
		})
		.animate({
			opacity: '1'
		}, {
			step: function () {
				$(this).css('color', 'red');
				colorCambio('h1.main-titulo');
			},
			queue: true
		});
}

// iniciamos el juego
function initializeGame() {

	colorCambio('h1.main-titulo');

	$('.btn-reinicio').click(function () {
		if ($(this).text() === 'Reiniciar') {
			location.reload(true);
		}
		checkBoard();
		$(this).text('Reiniciar');
		$('#timer').startTimer({
			onComplete: endGame
		})
	});
}

// Preparamos el juego
$(function() {
	initializeGame();
});

//Item dos - funcion para generar números aleatorios
function generarAleatorios(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// obtenemos filas y o columnas de dulces
function matchArrays(arrayType, index) {

	var matchCol1 = $('.col-1').children();
	var matchCol2 = $('.col-2').children();
	var matchCol3 = $('.col-3').children();
	var matchCol4 = $('.col-4').children();
	var matchCol5 = $('.col-5').children();
	var matchCol6 = $('.col-6').children();
	var matchCol7 = $('.col-7').children();

	var matchColumnas = $([matchCol1, matchCol2, matchCol3, matchCol4,
    matchCol5, matchCol6, matchCol7
	]);

	if (typeof index === 'number') {
		var matchFilas = $([matchCol1.eq(index), matchCol2.eq(index), matchCol3.eq(index),
      matchCol4.eq(index), matchCol5.eq(index), matchCol6.eq(index),
      matchCol7.eq(index)
		]);
	} else {
		index = '';
	}

	if (arrayType === 'columns') {
		return matchColumnas;
	} else if (arrayType === 'rows' && index !== '') {
		return matchFilas;
	}
}

//arrays de filas
function matchFila(index){
	var matchFilas = matchArrays('rows', index);
	return matchFilas;
}

//arrays de columnas
function matchColumna(index){
	var matchColumnas = matchArrays('columns', index);
	return matchColumnas;
}

//item tres - validamos si hay dulces que se deban eliminar en las
//filas
function rowValidation() {
	for (var j = 0; j < 6; j++) {
		var contador = 0;
		var matchPosition = [];
		var extraMatchPosition = [];
		var matchFilas = matchFila(j);
		var comparasionValue = matchFilas[0];
		var gap = false;
		for (var i = 1; i < matchFilas.length; i++) {
			var srcComparison = comparasionValue.attr('src');
			var srcMatch = matchFilas[i].attr('src');

			if (srcComparison != srcMatch) {
				if (matchPosition.length >= 3) {
					gap = true;
				} else {
					matchPosition = [];
				}
				contador = 0;
			} else {
				if (contador == 0) {
					if (!gap) {
						matchPosition.push(i - 1);
					} else {
						extraMatchPosition.push(i - 1);
					}
				}
				if (!gap) {
					matchPosition.push(i);
				} else {
					extraMatchPosition.push(i);
				}
				contador += 1;
			}
			comparasionValue = matchFilas[i];
		}
		if (extraMatchPosition.length > 2) {
			matchPosition = $.merge(matchPosition, extraMatchPosition);
		}
		if (matchPosition.length <= 2) {
			matchPosition = [];
		}
		matchCount = matchPosition.length;
		if (matchCount >= 3) {
			borrarHorizontal(matchPosition, matchFilas);
			setScore(matchCount);
		}
	}
}

function borrarHorizontal(matchPosition, matchFilas) {
	for (var i = 0; i < matchPosition.length; i++) {
		matchFilas[matchPosition[i]].addClass('delete');
	}
}

//contador de puntuacion muestra la puntuacion
function setScore(matchCount) {
	var score = Number($('#score-text').text());
	switch (matchCount) {
		case 3:
			score += 25;
			break;
		case 4:
			score += 50;
			break;
		case 5:
			score += 75;
			break;
		case 6:
			score += 100;
			break;
		case 7:
			score += 200;
	}
	$('#score-text').text(score);
}

//pone los elemento caramelo en el tablero
function checkBoard() {
	fillBoard();
}

function fillBoard() {
	var top = 6;
	var column = $('[class^="col-"]');

	column.each(function () {
		var candys = $(this).children().length;
		var agrega = top - candys;
		for (var i = 0; i < agrega; i++) {
			var candyType = generarAleatorios(1, 5);
			if (i === 0 && candys < 1) {
				$(this).append('<img src="image/' + candyType + '.png" class="element"></img>');
			} else {
				$(this).find('img:eq(0)').before('<img src="image/' + candyType + '.png" class="element"></img>');
			}
		}
	});
	addCandyEvents();
	setValidations();
}

// Si hay dulces que borrar
function setValidations() {
	columnValidation();
	rowValidation();
	// Si hay dulces que borrar
	if ($('img.delete').length !== 0) {
		deletesCandyAnimation();
	}
}


//punto 7. interacción del usuario con el elemento caramelo es drag and drop
//efecto de movimiento entre los caramelos
function addCandyEvents() {
	$('img').draggable({
		containment: '.panel-tablero',
		droppable: 'img',
		revert: true,
		revertDuration: 500,
		grid: [100, 100],
		zIndex: 10,
		drag: constrainCandyMovement
	});
	$('img').droppable({
		drop: swapCandy
	});
	enableCandyEvents();
}

function disableCandyEvents() {
	$('img').draggable('disable');
	$('img').droppable('disable');
}

function enableCandyEvents() {
	$('img').draggable('enable');
	$('img').droppable('enable');
}

//hace que el caramelo sea solido al moverse
function constrainCandyMovement(event, candyDrag) {
	candyDrag.position.top = Math.min(100, candyDrag.position.top);
	candyDrag.position.bottom = Math.min(100, candyDrag.position.bottom);
	candyDrag.position.left = Math.min(100, candyDrag.position.left);
	candyDrag.position.right = Math.min(100, candyDrag.position.right);
}

//reemplaza a los caramelos anteriores
function swapCandy(event, candyDrag) {
	var candyDrag = $(candyDrag.draggable);
	var dragSrc = candyDrag.attr('src');
	var candyDrop = $(this);
	var dropSrc = candyDrop.attr('src');
	candyDrag.attr('src', dropSrc);
	candyDrop.attr('src', dragSrc);

	setTimeout(function () {
		checkBoard();
		if ($('img.delete').length === 0) {
			candyDrag.attr('src', dragSrc);
			candyDrop.attr('src', dropSrc);
		} else {
			updateMoves();
		}
	}, 500);

}

function checkBoardPromise(result) {
	if (result) {
		checkBoard();
	}
}

//valida la puntuacion por cantidad de elementos en linea
function updateMoves() {
	var actualValue = Number($('#movimientos-text').text());
	var result = actualValue += 1;
	$('#movimientos-text').text(result);
}

//eliminacion automatica de los elementos
function deletesCandyAnimation() {
	disableCandyEvents();
	$('img.delete').effect('pulsate', 400);
	$('img.delete').animate({
			opacity: '0'
		}, {
			duration: 300
		})
		.animate({
			opacity: '0'
		}, {
			duration: 400,
			complete: function () {
				deletesCandy()
					.then(checkBoardPromise)
					.catch(showPromiseError);
			},
			queue: true
		});
}

//llenado automatico de los espacios con elementos
function showPromiseError(error) {
	console.log(error);
}

function deletesCandy() {
	return new Promise(function (resolve, reject) {
		if ($('img.delete').remove()) {
			resolve(true);
		} else {
			reject('No se pudo eliminar Candy...');
		}
	})
}

//punto 4 y 6. temporizador y boton reiniciar
//cambia el aspecto de la página
//final del juego
function endGame() {
	$('div.panel-tablero, div.time').effect('fold');
	$('h1.main-titulo').addClass('title-over')
		.text('Gracias por jugar!');
	$('div.score, div.moves, div.panel-score').width('100%');

}
