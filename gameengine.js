/*
 * made by romasan 2013
 */
var res = {
	gun : 'gun.png'
}
var EMPTY = 99,
	POOL  = 97
var level = 1,
	points = 0
colors = ['#f00', '#ff0', '#0f0', '#0ff', '#00f']
colors2 = {
	'#f00' : '1.png',
	'#ff0' : '2.png',
	'#0f0' : '3.png',
	'#0ff' : '4.png',
	'#00f' : '5.png'
}
//-------------------------------------------------------------------
var time = 5 * 60
var timer = function() {
	time -= 1;
	var _m = (time / 60)|0,
		_s = time % 60
		_m = (_m > 9)?_m:'0' + _m
		_s = (_s > 9)?_s:'0' + _s
	if(time > 0) {
		$('#time').html(_m + '-' + _s)
		setTimeout(function(){timer()}, 1000)
	
	} else {
		splash(scaling().w / 2, scaling().h / 2, 'score : ' + points, function(){document.location.reload()}, 1000)
	}
}
var point = function(x, y) {
	//$('.point1').remove()
	$('body').append(
		$('<div>')
		.addClass('point1')
		.css({
			position   : 'absolute',
			background : '#f00',
			left       : x + 'px',
			top        : y + 'px',
			width      : '3px',
			height     : '3px'
		})
	)
}
//------------------------------------------------------------------------------------------
var splash = function(x, y, s, f, t) {
	t = (typeof t == 'undefined') ? 0 : t;
	$('body').append(
		$('<div>')
			.css({
				position      : 'absolute',
				top           : y - 50 + 'px',
				left          : x - 150 + 'px',
				width         : '300px',
				height        : '100px',
				color         : '#fff',
				'text-shadow' : '0px 1px #000',
				'text-align'  : 'center',
				'line-height' : '100px',
				'font-size'   : '1pt',
			})
			.html(s)
			.attr({
				id : 'splash'
			})
			.animate({
				'font-size' : '27pt'
			}, function() {
				setTimeout(function() {
					$('#splash')
						.animate({
							'font-size' : '1pt'
						}, function() {
							$('#splash').remove()
							if(typeof f == 'function') {f()}
						})
				}, t)
			})
	)
}
//-----------------------------------------------------------------------------------------
var a = 0xff, b = 0, c = 0
var points = 0
var color0 = '',
	color = ''
var randbg = function() {
	if(a > 0xff) {a = 0xff}
    if(b > 0xff) {b = 0xff}
    if(c > 0xff) {c = 0xff}
	var _a = ((a < 0x10)?'0':'') + (a).toString(16)
	var _b = ((b < 0x10)?'0':'') + (b).toString(16)
	var _c = ((c < 0x10)?'0':'') + (c).toString(16)
    if(a < 0) {a = 0}
    if(b < 0) {b = 0}
    if(c < 0) {c = 0}
	//alert('#' + _a + _b + _c)
	$('body').css({background : color0})
	color0 = '#' + _a + _b + _c
	color = '#' +
		(((0xff - a) < 0x10)?'0':'') + (0xff - a).toString(16) +
		(((0xff - b) < 0x10)?'0':'') + (0xff - b).toString(16) +
		(((0xff - c) < 0x10)?'0':'') + (0xff - c).toString(16)
	$('#bar').css({color : color})
	if(typeof Game.ctx != 'undefined') {
		Game.redraw()
	}
    a = parseInt(a)
    b = parseInt(b)
    c = parseInt(c)
    if(a == 0xff && b <  0xff && c == 0   ) {b += 1}//Rg_
	if(a >  0    && b == 0xff && c == 0   ) {a -= 1}//rG_
	if(a == 0    && b == 0xff && c <  0xff) {c += 1}//_Gb
	if(a == 0    && b >  0    && c == 0xff) {b -= 1}//_gB
	if(a <  0xff && b == 0    && c == 0xff) {a += 1}//r_B
	if(a == 0xff && b == 0    && c > 0    ) {c -= 1}//R_b
	setTimeout(function(){
		randbg()
	}, 0)
}
//-----------------------------------------------------------------------------------------
var scaling = function(i) {
	var _w = document.body.clientWidth,
		_h = document.body.clientHeight,
		SCALINGFACTOR = _w / ((_w > _h)?480:320); 
	if(typeof i == 'undefined') {return {w : _w, h : _h}}
	return i * SCALINGFACTOR;
}
//-------------------------------------------------------------------
var ball = function(a) {
	this.x = a.x
	this.y = a.y
	this.color = a.color
	this.stepx = a.stepx
	this.stepy = a.stepy
	this.w = a.w
	this.h = a.h
	this.el = $('#ball0').clone()
	$(this.el).attr({id : '_' + ((Math.random() * 0xffffff)|0)})
	$(Game.elcontainer).append($(this.el))
	this.inpool = function() {
		for(var y = 0; y < Game.maxv; y++) {
			for(var x = 0; x < Game.maxg; x++) {
				var x2 = Game.marginx + Game.radius + (Game.distance + 2 * Game.radius) * x,
					y2 = Game.marginy + Game.radius + (Game.distance + 2 * Game.radius) * y,
					_x = this.x + Game.radius - x2,
					_y = this.y + Game.radius - y2,
					r2 = this.w / 2,
					distance = Math.sqrt(_x * _x + _y * _y)
				if(r2 > distance) {
					if(Game.map[y][x].color == POOL) {
							//point(x2, y2)
							//point(this.x + Game.radius, this.y + Game.radius)
							Game.map[y][x].color = this.color
							// console.log('y :', y)
							if(y < Game.maxv - 1) {
								Game.map[y + 1][x].color = POOL
							} else {
								Game.over()
							}
							$(this.el).remove()
							Game.check()
							Game.redraw()
							return true
					} else if(Game.map[y][x].color == EMPTY) {} else {
						this.stepx = -this.stepx
						this.x += this.stepx
						//this.stepy = -this.stepy
						//this.y += this.stepy
					}
				}
			}
		}
		return false
	}
	this.move = function() {
		console.log('>>> move')
		this.x += this.stepx
		this.y += this.stepy
		if(this.x <= 0 || this.x + this.w > scaling().w) {
			this.stepx = -this.stepx
			this.x += this.stepx
		}
		if(this.y <= 0 || this.y + this.h > scaling().h) {
			this.stepy = -this.stepy
			this.y += this.stepy
		}
		$(this.el).css({
			left : this.x + 'px',
			top  : this.y + 'px'
		})
		if(this.inpool()) {
			//alert('in pool')
		} else {
			var _this = this,
				_f = function() {
					_this.move()
				}
				setTimeout(_f, 10)
		}
	}
	this.move()
}
//-------------------------------------------------------------------
var gunx = {
	w : 60,
	h : 60
}
var gun = function() {
	this.w = scaling(gunx.w)
	this.h = scaling(gunx.h)
	this.l = scaling().w / 2 - this.w / 2
	this.t = scaling().h - this.h - scaling(50)
	this.debug_margin = 13
	this.center = {
		x : this.l + this.w / 2,
		y : this.t + this.h + scaling(this.debug_margin)
	}
	//--------------------------------
	this.el = $('<div>')
		.attr({id : 'gun'})
		.css({
			left   : this.l + 'px',
			top    : this.t + 'px',
			width  : this.w + 'px',
			height : this.h + scaling(2 * this.debug_margin) + 'px',
			'background-size' : this.w + 'px ' + this.h + 'px'
			//border : '1px dashed #fff'
		})
	//--------------------------------
	this.fire = function(x, y) {
		var a = this.center.x - x,
			b = this.center.y - y,
			c = Math.sqrt(a * a + b * b)
		var	alpha = Math.asin(b / c) * 180 / Math.PI - 90
			alpha = (a < 0)?(360 - alpha):alpha
			alpha = (alpha > 360)?(alpha - 360):alpha
			alpha = (alpha < 0)?(360 + alpha):alpha
			if(alpha > 300 || alpha < 60) {
				var stepx, stepy
				if(a > b) {//a = x, b = y
					stepx = 10
					stepy = 10 / a * b
				} else {
					stepy = 10
					stepx = 10 / b * a
				}
				stepx = -stepx
				stepy = -stepy
				console.log('alpha', alpha)
				this.angle = alpha
				var color = Game.holder.shift()
				Game.holder.push(((Math.random() * Game.holderlength)|0))
				new ball({
					x : this.center.x - scaling(20),
					y : this.center.y - this.h / 2 - this.debug_margin - scaling(10),
					color : color,
					w : this.w,
					h : this.h,
					stepx : stepx,
					stepy : stepy
				})
			}
		$(this.el).css({
			transform : 'rotate(' + this.angle + 'deg)'
		})
		//point(x, y)
		this.redraw()
		Game.redraw()
	}
	this.image = new Image()
	this.image.src = res.gun
	this.angle = 15
	this.r = Game.radius
	this.drawball = function(x, y, c, i) {
		console.log('log', this.r, x, y, c)
		var el = $('<div>')
			.attr({id : 'ball' + i})
			.addClass('ball')
			.addClass('ball' + c)
			.css({
				left     : x - this.r + 'px',
				top      : y - this.r - scaling(3 * this.debug_margin) + 'px',
				width    : 2 * this.r + 'px',
				height   : 2 * this.r + 'px',
				// border   : '1px dashed #fff'
			})
			// .data({x : x, y : y})
			// .attr({
				// id : 'x_y_' + x + '_' + y,
				// x : x,
				// y : y, 
			// })
		$('body').append(el)
	}
	this.redraw = function() {
		for(i in Game.holder) {
			var _i = Game.holderlength - 1 - i
			//cl = $('#ball' + _i).className
			//$('#ball' + _i).removeClass(cl)
			$('#ball' + i).removeClass('ball0')
			$('#ball' + i).removeClass('ball1')
			$('#ball' + i).removeClass('ball2')
			$('#ball' + i).removeClass('ball3')
			$('#ball' + i).removeClass('ball4')
			$('#ball' + i).removeClass('ball5')
			$('#ball' + i).addClass('ball' + Game.holder[i])
		}
		//TODO
	}
	this.draw = function() {
		for(var i = Game.holder.length - 1; i >= 0; i--) {
			var _i = Game.holder.length - 1 - i
			this.drawball(this.center.x - this.r * 2.5 * _i, this.center.y + scaling(10), Game.holder[_i], _i)
		}
		$(Game.elcontainer).append(this.el)
	}
}
//-----------------------------------------------------------------------------------------
Game = {
	name : 'points1',
	start : function() {
		this.draw()
		$(this.elcontainer).css({width : scaling().w + 'px', height : scaling().h + 'px'})
		$('body').css({width : scaling().w + 'px', height : scaling().h + 'px'})
		$('html').css({width : scaling().w + 'px', height : scaling().h + 'px'})
		var margin = 10
		$('#bar').css({
			left  : scaling(margin) + 'px',
			top   : scaling(margin) + 'px',
			width : scaling().w - scaling(2 * margin) + 'px',
		})
		setTimeout(function() {Game.redraw()}, 100)
	},
	maxg : 7,
	maxv : 8,
	radius : 20,
	marginx : 10,
	marginy : 30,
	elcontainer : 'body',
	colors : 5,
	//distance : 0,
	//radius : 0,
	step : {},
	drawpoint : function(_x, _y, _c, _f) {
		var width     = Math.round(((2 * this.radius)|0)),
			height    = Math.round(((2 * this.radius)|0)),
			left      = Math.round(_x - this.radius),
			top       = Math.round(_y - this.radius),
			color     = colors[_c]
		var _this = this//,
		try {
			_this.ctx.drawImage(_this.pics[color], left, top, width, height)
		} catch(e) {
			//alert(e)
		}
	},
	holderlength : 3,
	holder : [],
	redraw : function() {
		//this.gun.redraw()
		this.ctx.clearRect (0, 0 , scaling().w, scaling().h)
		for(var y = 0; y < this.maxv; y++) {
			for(var x = 0; x < this.maxg; x++) {
				var _x, _y, _c
				_c = this.map[y][x].color
				_x = this.marginx + this.radius + (this.distance + 2 * this.radius) * x
				_y = this.marginy + this.radius + (this.distance + 2 * this.radius) * y
				if(_c < colors.length) {
					_f = this.map[y][x].removed
					this.drawpoint(_x, _y, _c, _f)
				} else if(_c == POOL) {
					// this.ctx.beginPath()
					// this.ctx.lineWidth = 1;
					// this.ctx.strokeStyle = '#eee';
					// this.ctx.arc(_x, _y, this.radius, 0, 2 * Math.PI)
					// this.ctx.stroke()
				}
			}
		}
	},
	draw : function() {
		this.holder = new Array(this.holderlength).join(',').split(',')
		for(i in this.holder) {this.holder[i] = (Math.random() * this.colors)|0}
		$(this.elcontainer).children().remove()
		timer()
		this.marginx  = scaling(this.marginx)
		this.marginy  = scaling(this.marginy)
		this.w        = scaling().w - 2 * this.marginx
		this.h        = scaling().h - 2 * this.marginy
		this.radius   = scaling(this.radius)
		this.distance = (this.w - this.radius * 2 * this.maxg) / (this.maxg - 1)
		this.canvas   = document.createElement('canvas')
		this.canvas.width  = scaling().w
		this.canvas.height = scaling().h
		this.ctx = this.canvas.getContext("2d")
		this.pics = []
		for(i in colors2) {
			this.pics[i] = new Image()
			this.pics[i].src = colors2[i]
			//alert(colors2[i])
		}
		//this.ctx.clearRect(0, 0, scaling().w, scaling().h)
		this.map = []
		var _this = this
			// _f = function() {
				//alert('boobs')
				var middleline = ((_this.maxv / 2)|0)
				for(var y = 0; y < _this.maxv; y++) {
					_this.map[y] = []
					for(var x = 0; x < _this.maxg; x++) {
						var _x,
							_y,
							_c
						// console.log('***', y, _this.maxv, ((_this.maxv / 2)|0))
						if(y == middleline) {
							_c = POOL
						} else if(y > middleline) {
							_c = EMPTY
						} else {
							_x = _this.marginx + _this.radius + (_this.distance + 2 * _this.radius) * x,
							_y = _this.marginy + _this.radius + (_this.distance + 2 * _this.radius) * y,
							_c = (Math.random() * colors.length)|0
							_this.drawpoint(_x, _y, _c)
						}
						_this.map[y][x] = {color : _c, removed : false}
						/*$('body').append(
							$('<div>')
							.css({
								position : 'absolute',
								left     : _x - this.radius + 'px',
								top      : _y - this.radius + 'px',
								width    : 2 *  this.radius + 'px',
								height   : 2 *  this.radius + 'px',
								border : '1px dashed #fff'
							})
							.data({x : x, y : y})
							.attr({
								id : 'x_y_' + x + '_' + y,
								x : x,
								y : y, 
							})
						)
						*/
					}
				}
			// }
			// setTimeout(_f, 100)
		document.body.appendChild(this.canvas)
		this.debug_counter = 0
		/*
		this.debug_swipe   = true;
		$('body').swipe({
			swipeStatus : function(event, phase, direction, distance, duration, fingers) {
				// if(event.pageX == 0) {Game.debug_swipe = false}
				// if(Game.debug_swipe == false) {return}
				// var _x = parseInt($(event.target).attr('x')),
					// _y = parseInt($(event.target).attr('y'))
				if(phase == 'start') {
					Game.gun.fire(event.pageX, event.pageY)
					// Game.mdown()
				}
				// if((_x).toString() != 'NaN' && (_y).toString() != 'NaN') {
					// Game.addtopatch({x : _x, y : _y})
					// Game.debug_counter += 1
				// }
				// var _c = Game.checkpoint({x : event.pageX, y : event.pageY})
				// if(_c){
					// Game.addtopatch({x : _c.x, y : _c.y})
				// }
				if(phase == 'end') {
					// Game.mup()
				}
			}
		})
		*/
		var _this = this,
			_f = function() {
				_this.gun.fire
			}
		//---------------------------------
		document.body.addEventListener('touchstart', function(event) {
//			Game.mdown()
			var touch = event.targetTouches[0]
			//alert(touch.pageX + ' ' + touch.pageY)
			Game.gun.fire(touch.pageX, touch.pageY)
			// alert('boobs')
			console.log('holder :', Game.holder)
			//var _c = Game.checkpoint({x : touch.pageX, y : touch.pageY})
			//if(_c){
			//	Game.addtopatch({x : _c.x, y : _c.y})
			//}
		})
		document.body.addEventListener('touchmove', function(e) {
//			var touch = event.targetTouches[0]
//			var _c = Game.checkpoint({x : touch.pageX, y : touch.pageY})
//			if(_c){
//				Game.addtopatch({x : _c.x, y : _c.y})
//			}
		})
		document.body.addEventListener('touchend', function(e) {
//			Game.mup()
		})
		$('body').append(
			$('<div>')
				.css({
					position      : 'absolute',
					top           : (scaling(3)|0)  + 'px',
					left          : (scaling(10)|0) + 'px',
					width         : '100%',
					height        : '50px',
					color         : '#fff',
					'font-size'   : (scaling(16)|0) + 'pt',
					//'text-shadow' : '0px 1px #000'
				})
				.attr({id : 'bar'})
				.append('points : ')
				.append($('<span>').attr({id : 'points'}).html('0'))
				.append(' time : ')
				.append($('<span>').attr({id : 'time'}).html('00-00'))
		)
		//---------------------------------
		console.log('draw canvas', scaling().w, scaling().h)
		this.gun = new gun()
		this.gun.draw()
		//this.gun.redraw(this.ctx)
	},
	check : function() {
		console.log('start check')
		for(_y in this.map) {
			var y = parseInt(_y)
			for(_x in this.map[_y]) {
				var x = parseInt(_x)
				if(this.map[y][x].color != EMPTY && this.map[y][x].color != POOL) {
						console.log('BOOBS 7')
					//gline
					if(x < this.maxg - 2) {
						// console.log('x + 1', x + 1)
						if(
							this.map[y][x].color     == this.map[y][x + 1].color
						 && this.map[y][x + 1].color == this.map[y][x + 2].color
						) {
						console.log('BOOBS *')
							this.map[y][x].removed     = true
							this.map[y][x + 1].removed = true
							this.map[y][x + 2].removed = true
						}
					}
					//vline
					if(y < this.maxv - 2) {
						if(
							this.map[y][x].color     == this.map[y + 1][x].color
						 && this.map[y + 1][x].color == this.map[y + 2][x].color
						) {
						console.log('BOOBS')
							this.map[y][x].removed     = true
							this.map[y + 1][x].removed = true
							this.map[y + 2][x].removed = true
						}
					}
					//qL
					if(x < this.maxg - 1 && y < this.maxv - 1) {
						if(
							this.map[y][x].color == this.map[y][x + 1].color
						 && this.map[y][x].color == this.map[y + 1][x].color
						) {
						console.log('BOOBS')
							this.map[y][x].removed     = true
							this.map[y][x + 1].removed = true
							this.map[y + 1][x].removed = true
						}
					}
					//wL
					if(x > 0 && y < this.maxv - 1) {
						if(
							this.map[y][x].color == this.map[y][x - 1].color
						 && this.map[y][x].color == this.map[y + 1][x].color
						) {
						console.log('BOOBS')
							this.map[y][x].removed     = true
							this.map[y][x - 1].removed = true
							this.map[y + 1][x].removed = true
						}
					}
					//aL
					if(x < this.maxg - 1 && y > 0) {
						if(
							this.map[y][x].color == this.map[y][x + 1].color
						 && this.map[y][x].color == this.map[y - 1][x].color
						) {
						console.log('BOOBS')
							this.map[y][x].removed     = true
							this.map[y][x + 1].removed = true
							this.map[y - 1][x].removed = true
						}
					}
					//sL
					if(x > 0 && y > 0) {
						if(
							this.map[y][x].color == this.map[y][x - 1].color
						 && this.map[y][x].color == this.map[y - 1][x].color
						) {
						console.log('BOOBS')
							this.map[y][x].removed     = true
							this.map[y][x - 1].removed = true
							this.map[y - 1][x].removed = true
						}
					}
				}
			}
		}
		var _p = points
		for(y in this.map) {
			for(x in this.map[y]) {
				if(this.map[y][x].removed) {
					this.map[y][x].removed = false
					this.map[y][x].color   = EMPTY
					points += 1
				}
			}
		}
		if(_p < points) {
			$('#points').html(points)
			splash(scaling().w / 2, scaling().h / 2, '+' + points)
		}
		for(var x = 0; x < this.maxg; x++) {
			var count = 0
			for(var y = 0; y < this.maxv; y++) {
				if(this.map[y][x].color == EMPTY) {
					count += 1
				} else {
					console.log('y - count', y - count)
					if(count > 0) {
						this.map[y - count][x].color = this.map[y][x].color
						this.map[y][x].color = EMPTY
					}
				}
			}
		}
		for(y in this.map) {
			var s = ''
			for(x in this.map[y]) {
				s += this.map[y][x].color + ' '
			}
			console.log(s)
		}
	},
	win : function() {
		
	},
	over : function() {
		splash(scaling().w / 2, scaling().h / 2, lang.gameover, function() {
			document.location.reload()
		}, 1000)
	}
}
//-----------------------------------------------------------------------------------------
$(document).ready(function(){
	Game.start();
});