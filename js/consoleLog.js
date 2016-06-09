var consoleLog = function () {
	var engine = function() {
			var rx = /function/gi;
			if(rx.test(document.querySelector('#input').value)) {
				new Function("return" + "(" + document.querySelector('#input').value + ")")()();
			}
		};
	return {
    appendInput2Dom: function () {
		if(!document.querySelector('#input')){
			$(document.body).append($('<div>', {
			'id': 'ConsoleLog',
			'style' : 'position : absolute; top: 0; width : 100%; height : 100px; transform :translate(25%);'
		  }).append($('<textarea>', {
			  'id' : 'input',
			  'rows' : '4',
			  'cols' : '100', 
			  'style' : ''
		  }).text("function(){/*Your Code's Cheatsheet: document.getElementsByClassName('.');document.getElementById('#');*/}")));
		}
    },
	arrowPress: function(e) {
                 var event = e || window.event;
					 if(event.keyCode.toString() == '13' && !event.shiftKey){
						 engine();
					 }
    },
	eventsBinder: function (El, event, handler) {
			  if (El && El.addEventListener) {
					El.addEventListener(event, handler);
				  } else if (El && El.attachEvent) {
					El.attachEvent('on' + event, handler);
				   }
			}
	};
};

$(document).ready(function(){
	var instance = new consoleLog();
			instance.appendInput2Dom();
			instance.eventsBinder(document.body, 'keypress', instance.arrowPress);
});