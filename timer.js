(function (factory) {

	if (typeof module === "object" && typeof module.exports === "object") {
		module.exports = function (jq) {
			factory(jq, window, document);
		}
	} else {
		factory(jQuery, window, document);
	}
}(function ($, window, document, undefined) {
	var timer;
	var Timer = function (targetElement) {
		this._options = {};
		this.targetElement = targetElement;
		return this;
	};

	Timer.start = function (userOptions, targetElement) {
		timer = new Timer(targetElement);
		mergeOptions(timer, userOptions);
		return timer.start(userOptions);
	};

	function mergeOptions(timer, opts) {
		opts = opts || {};
		var classNames = opts.classNames || {};
		timer._options.classNamesegundos = classNames.segundos || 'jst-segundos', timer._options.classNameminutos = classNames.minutos || 'jst-minutos', timer._options.classNameClearDiv = classNames.clearDiv || 'jst-clearDiv', timer._options.classNameTimeout = classNames.timeout || 'jst-timeout';
	}

	Timer.prototype.start = function (options) {
		var that = this;
		var createSubDivs = function (timerBoxElement) {
			var segundos = document.createElement('div');
			$(segundos).css('display', 'inline');
			segundos.className = that._options.classNamesegundos;

			var minutos = document.createElement('div');
			$(minutos).css('display', 'inline');
			minutos.className = that._options.classNameminutos;

			var clearDiv = document.createElement('div');
			clearDiv.className = that._options.classNameClearDiv;
			return timerBoxElement.
			append(minutos).
			append(segundos).
			append(clearDiv);
		};

		this.targetElement.each(function (_index, timerBox) {
			var that = this;
			var timerBoxElement = $(timerBox);
			var cssClassSnapshot = timerBoxElement.attr('class');

			timerBoxElement.on('complete', function () {
				clearInterval(timerBoxElement.intervalId);
			});

			timerBoxElement.on('complete', function () {
				timerBoxElement.onComplete(timerBoxElement);
			});

			timerBoxElement.on('complete', function () {
				timerBoxElement.addClass(that._options.classNameTimeout);
			});

			timerBoxElement.on('complete', function () {
				if (options && options.loop === true) {
					timer.resetTimer(timerBoxElement, options, cssClassSnapshot);
				}
			});

			timerBoxElement.on('pause', function () {
				clearInterval(timerBoxElement.intervalId);
				timerBoxElement.paused = true;
			});
			timerBoxElement.on('resume', function () {
				timerBoxElement.paused = false;
				that.startCountdown(timerBoxElement, {
					segundosLeft: timerBoxElement.data('timeLeft')
				});
			});
			createSubDivs(timerBoxElement);
			return this.startCountdown(timerBoxElement, options);
		}.bind(this));
	};

	Timer.prototype.resetTimer = function ($timerBox, options, css) {
		var interval = 0;
		if (options.loopInterval) {
			interval = parseInt(options.loopInterval, 10) * 1000;
		}
		setTimeout(function () {
			$timerBox.trigger('reset');
			$timerBox.attr('class', css + ' loop');
			timer.startCountdown($timerBox, options);
		}, interval);
	};

	Timer.prototype.fetchsegundosLeft = function (element) {
		var segundosLeft = element.data('segundos-left');
		var minutosLeft = element.data('minutos-left');
		if (Number.isFinite(segundosLeft)) {
			return parseInt(segundosLeft, 10);
		} else if (Number.isFinite(minutosLeft)) {
			return parseFloat(minutosLeft) * 60;
		} else {
			throw 'Datos de Tiempo Faltante';
		}
	};

	Timer.prototype.startCountdown = function (element, options) {
		options = options || {};
		var intervalId = null;
		var defaultComplete = function () {
			clearInterval(intervalId);
			return this.clearTimer(element);
		}.bind(this);
		element.onComplete = options.onComplete || defaultComplete;
		element.allowPause = options.allowPause || false;
		if (element.allowPause) {
			element.on('click', function () {
				if (element.paused) {
					element.trigger('resume');
				} else {
					element.trigger('pause');
				}
			});
		}

		var segundosLeft = options.segundosLeft || this.fetchsegundosLeft(element);
		var refreshRate = options.refreshRate || 1000;
		var endTime = segundosLeft + this.currentTime();
		var timeLeft = endTime - this.currentTime();

		this.setFinalValue(this.formatTimeLeft(timeLeft), element);

		intervalId = setInterval((function () {
			timeLeft = endTime - this.currentTime();

			if (timeLeft < 0) {
				timeLeft = 0;
			}
			element.data('timeLeft', timeLeft);
			this.setFinalValue(this.formatTimeLeft(timeLeft), element);
		}.bind(this)), refreshRate);
		element.intervalId = intervalId;
	};

	Timer.prototype.clearTimer = function (element) {
		element.find('.jst-segundos').text('00');
		element.find('.jst-minutos').text('00:');
	};

	Timer.prototype.currentTime = function () {
		return Math.round((new Date()).getTime() / 1000);
	};

	Timer.prototype.formatTimeLeft = function (timeLeft) {

		var lpad = function (n, width) {
			width = width || 2;
			n = n + '';

			var padded = null;

			if (n.length >= width) {
				padded = n;
			} else {
				padded = Array(width - n.length + 1).join(0) + n;
			}
			return padded;
		};
		var minutos = Math.floor(timeLeft / 60);
		timeLeft -= minutos * 60;
		var segundos = parseInt(timeLeft % 60, 10);
		if (+minutos === 0 && +segundos === 0) {
			return [];
		} else {
			return [lpad(minutos), lpad(segundos)];
		}
	};

	Timer.prototype.setFinalValue = function (finalValues, element) {

		if (finalValues.length === 0) {
			this.clearTimer(element);
			element.trigger('complete');
			return false;
		}
		element.find('.' + this._options.classNamesegundos).text(finalValues.pop());
		element.find('.' + this._options.classNameminutos).text(finalValues.pop() + ':');
	};

	$.fn.startTimer = function (options) {
		this.TimerObject = Timer;
		Timer.start(options, this);
		return this;
	};
}));
