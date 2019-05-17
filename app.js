//Item uno -  cambia el color del titulo y alterna
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

//Item dos - Generamos números aleatorios
function generarAleatorios(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

// obtiene filas o columas de dulces
function obtenerArregloDulces(arrayType, index) {

	var dulceCol1 = $('.col-1').children();
	var dulceCol2 = $('.col-2').children();
	var dulceCol3 = $('.col-3').children();
	var dulceCol4 = $('.col-4').children();
	var dulceCol5 = $('.col-5').children();
	var dulceCol6 = $('.col-6').children();
	var dulceCol7 = $('.col-7').children();

	var matchColumns = $([dulceCol1, dulceCol2, dulceCol3, dulceCol4,
		dulceCol5, dulceCol6, dulceCol7
	]);

	if (typeof index === 'number') {
		var dulceRow = $([dulceCol1.eq(index), dulceCol2.eq(index), dulceCol3.eq(index),
			dulceCol4.eq(index), dulceCol5.eq(index), dulceCol6.eq(index),
			dulceCol7.eq(index)]);
	} else {
		index = '';
	}

	if (arrayType === 'columns') {
		return matchColumns;
	} else if (arrayType === 'rows' && index !== '') {
		return dulceRow;
	}
}

// arreglos de filas
function dulceRows(index) {
	var dulceRow = obtenerArregloDulces('rows', index);
	return dulceRow;
}

// arreglos de colunmnas
function matchColumns(index) {
	var matchColumn = obtenerArregloDulces('columns');
	return matchColumn[index];
}

//item tres - Valida si hay dulces que se eliminarán en una columna
function validacionColumna() {
	for (var j = 0; j < 7; j++) { //determinamos la cantidad de columnas
		var contador = 0;
		var matchPosition = [];
		var extramatchPosition = [];
		var matchColumn = matchColumns(j);
		var comparisonValue = matchColumn.eq(0);
		var gap = false;
		for (var i = 1; i < matchColumn.length; i++) {
			var srcComparison = comparisonValue.attr('src');
			var srcmatch = matchColumn.eq(i).attr('src');

			if (srcComparison != srcmatch) {
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
						extramatchPosition.push(i - 1);
					}
				}
				if (!gap) {
					matchPosition.push(i);
				} else {
					extramatchPosition.push(i);
				}
				contador += 1;
			}
			comparisonValue = matchColumn.eq(i);
		}
		if (extramatchPosition.length > 2) {
			matchPosition = $.merge(matchPosition, extramatchPosition);
		}
		if (matchPosition.length <= 2) {
			matchPosition = [];
		}
		matchCount = matchPosition.length;
		if (matchCount >= 3) {
			deleteColumnmatch(matchPosition, matchColumn);
			setScore(matchCount);
		}
	}
}
function deleteColumnmatch(matchPosition, matchColumn) {
	for (var i = 0; i < matchPosition.length; i++) {
		matchColumn.eq(matchPosition[i]).addClass('delete');
	}
}

// Valida si hay dulces que deben eliminarse en una fila
function validacionFila() {
	for (var j = 0; j < 7; j++) { // determinamos la cantidad de filas
		var contador = 0;
		var posicionDulces = [];
		var extraposicionDulces = [];
		var dulceRow = dulceRows(j);
		var comparacionValue = dulceRow[0];
		var gap = false;
		for (var i = 1; i < dulceRow.length; i++) {
			var srcComparacion = comparacionValue.attr('src');
			var srcDulce = dulceRow[i].attr('src');

			if (srcComparacion != srcDulce) {
				if (posicionDulces.length >= 3) {
					gap = true;
				} else {
					posicionDulces = [];
				}
				contador = 0;
			} else {
				if (contador == 0) {
					if (!gap) {
						posicionDulces.push(i - 1);
					} else {
						extraposicionDulces.push(i - 1);
					}
				}
				if (!gap) {
					posicionDulces.push(i);
				} else {
					extraposicionDulces.push(i);
				}
				contador += 1;
			}
			comparacionValue = dulceRow[i];
		}
		if (extraposicionDulces.length > 2) {
			posicionDulces = $.merge(posicionDulces, extraposicionDulces);
		}
		if (posicionDulces.length <= 2) {
			posicionDulces = [];
		}
		contadorDulces = posicionDulces.length;
		if (contadorDulces >= 3) { //verificamos
			//si hay tres o mas dulces alineados
			//y borramos los mismos horizontalmente
			deleteHorizontal(posicionDulces, dulceRow);
			setScore(contadorDulces);
		}
	}
}

//funcion para borrar los dulces por fila
function deleteHorizontal(posicionDulces, dulceRow) {
	for (var i = 0; i < posicionDulces.length; i++) {
		dulceRow[posicionDulces[i]].addClass('delete');
	}
}

//contador de puntuacion muestra la puntuacion
function setScore(contadorDulces) {
	var puntos = Number($('#score-text').text());
	switch (contadorDulces) {
		case 3:
			puntos += 25; //si se alinean tres dulces
			break;
		case 4:
			puntos += 50; //si se alinean cuatro dulces
			break;
		case 5:
			puntos += 75; // si se alinean cinco dulces
			break;
		case 6:
			puntos += 100; //si se alinean seis dulces
			break;
		case 7:
			puntos += 200; //si se alinean siete dulces
	}
	$('#score-text').text(puntos);
}

//pone los elemento caramelo en el tablero
function controlTablero() {
	llenarTablero();
}

// Realizamos el llenado de tablero con los dulces
function llenarTablero() {
	var top = 7;
	var column = $('[class^="col-"]');

	column.each(function () {
		var dulces = $(this).children().length;
		var agrega = top - dulces;
		for (var i = 0; i < agrega; i++) {
			var tipoDulce = generarAleatorios(1, 5);
			if (i === 0 && dulces < 1) {
				$(this).append('<img src="image/' + tipoDulce + '.png" class="element"></img>');
			} else {
				$(this).find('img:eq(0)').before('<img src="image/' + tipoDulce + '.png" class="element"></img>');
			}
		}
	});
	sumaEventosDulces();
	seteoValidacion();
}

// Si hay dulces que borrar
function seteoValidacion() {
	validacionColumna();
	validacionFila();
	// Si hay dulces que borrar
	if ($('img.delete').length !== 0) {
		borraAnimacionDulce();
	}
}


//punto siete - interacción del usuario con el elemento caramelo es drag and drop
//efecto de movimiento entre los caramelos
function sumaEventosDulces() {
	$('img').draggable({
		containment: '.panel-tablero',
		droppable: 'img',
		revert: true,
		revertDuration: 500,
		grid: [100, 100],
		zIndex: 10,
		drag: restringirMovDulce
	});
	$('img').droppable({
		drop: intercambioDulce
	});
	habilitoEventoDulce();
}

function desabilitoEventoDulce() {
	$('img').draggable('disable');
	$('img').droppable('disable');
}

function habilitoEventoDulce() {
	$('img').draggable('enable');
	$('img').droppable('enable');
}

//hace que el caramelo sea solido al moverse
function restringirMovDulce(event, arrastroDulce) {
	arrastroDulce.position.top = Math.min(100, arrastroDulce.position.top);
	arrastroDulce.position.bottom = Math.min(100, arrastroDulce.position.bottom);
	arrastroDulce.position.left = Math.min(100, arrastroDulce.position.left);
	arrastroDulce.position.right = Math.min(100, arrastroDulce.position.right);
}

//reemplaza a los caramelos anteriores
function intercambioDulce(event, arrastroDulce) {
	var arrastroDulce = $(arrastroDulce.draggable);
	var arrastaSrc = arrastroDulce.attr('src');
	var sueltoDulce = $(this);
	var sueltoSrc = sueltoDulce.attr('src');
	arrastroDulce.attr('src', sueltoSrc);
	sueltoDulce.attr('src', arrastaSrc);

	setTimeout(function () {
		controlTablero();
		if ($('img.delete').length === 0) {
			arrastroDulce.attr('src', arrastaSrc);
			sueltoDulce.attr('src', sueltoSrc);
		} else {
			updateMoves();
		}
	}, 500);
}

function controlTableroPro(result) {
	if (result) {
		controlTablero();
	}
}

//valida la puntuacion por cantidad de elementos en linea
function updateMoves() {
	var actualValue = Number($('#movimientos-text').text());
	var result = actualValue += 1;
	$('#movimientos-text').text(result);
}

//eliminacion automatica de los elementos
function borraAnimacionDulce() {
	desabilitoEventoDulce();
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
				borrarDulce()
					.then(controlTableroPro)
					.catch(showProError);
			},
			queue: true
		});
}

//llenado automatico de los espacios con elementos
function showProError(error) {
	console.log(error);
}

function borrarDulce() {
	return new Promise(function (resolve, reject) {
		if ($('img.delete').remove()) {
			resolve(true);
		} else {
			reject('No se pudo eliminar dulce...');
		}
	})
}

//punto 4 y 6. temporizador y boton reiniciar
//cambia el aspecto de la página
//final del juego
function finJuego() {
	$('div.panel-tablero, div.time').effect('fold');
	$('h1.main-titulo').addClass('title-over')
		.text('Gracias por jugar!');
	$('div.score, div.moves, div.panel-score').width('100%');

}

// inicia el juego
function iniciarJuego() {

	colorCambio('h1.main-titulo');

	$('.btn-reinicio').click(function () {
		if ($(this).text() === 'Reiniciar') {
			location.reload(true);
		}
		controlTablero();
		$(this).text('Reiniciar');
		$('#timer').startTimer({
			onComplete: finJuego
		})
	});
}

// Prepara el juego
$(function() {
	iniciarJuego();
});
