import Sister from "sister";
import refresh from "../refresh";

export default function newBrim(config) {
	let brim = {};
	const player = {};
	let viewport,
		eventEmitter;
	
	viewport = config.viewport;
	/**
	 *
	 */
	brim._setupDOMEventListeners = function () {
		viewport.on('orientationchangeend', function () {
			brim._treadmill();
			brim._main();
			brim._mask();
		});
		
		viewport.on('viewchange', function (e) {
			brim._main();
			brim._mask();
			
			eventEmitter.trigger('viewchange', e);
		});
		
		brim._main();
		brim._mask();
		
		// Disable window scrolling when in minimal view.
		// @see http://stackoverflow.com/a/26853900/368691
		(function () {
			let firstMove;
			
			document.addEventListener('touchstart', function (e) {
				firstMove = true;
			});
			
			document.addEventListener('touchmove', function (e) {
				if (viewport.isMinimalView() && firstMove) {
					//e.preventDefault();
				}
				
				firstMove = false;
			});
		}());
	};
	
	/**
	 * Setting the offset ensures that "resize" event is triggered upon loading the page.
	 * A large (somewhat arbitrary) offset ensures that the page view does not change after device orientation.
	 *
	 * @see http://stackoverflow.com/questions/26784456/how-to-get-window-height-when-in-fullscreen
	 */
	brim._treadmill = function () {
		global.scrollTo(0, 1000);
	};
	
	/**
	 * Sets the dimensions and position of the drag mask player. The mask is an overlay on top
	 * of the treadmill and the main content.
	 *
	 * The mask is visible when view is full.
	 */
	brim._mask = function () {
		if (viewport.isMinimalView()) {
			player.mask.css({display:"none"});
			refresh();
			// player.mask.style.display = 'none';
		}
		else {
			player.mask.css({display:"block", width:viewport.getViewportWidth(), height:viewport.getViewportHeight()*2});
			// player.mask.style.display = 'block';
			
			// player.mask.style.width = global.innerWidth + 'px';
			// player.mask.style.height = (global.innerHeight * 2) + 'px';
			
			brim._repaintElement(player.mask);
		}
	};
	
	/**
	 * Sets the dimensions and position of the main player.
	 *
	 * The main element remains visible beneath the mask.
	 */
	brim._main = function () {
		if (viewport.isMinimalView()) {
			player.main.css({display: "block"});
			// player.mask.style.display = 'none';
			
			player.main.css({width: viewport.getViewportWidth(), height: viewport.getViewportHeight()});
			
			// player.main.style.width = global.innerWidth + 'px';
			// player.main.style.height = global.innerHeight + 'px';
			
			brim._repaintElement(player.main);
		}
		else {
			player.main.css({display: "none"});
		}
	};
	
	/**
	 * @return {HTMLElement}
	 */
	brim._makeTreadmill = function () {
		let treadmill = $('#brim-treadmill');
		
		//created here
		if (!treadmill) {
			treadmill = document.createElement('div');
			treadmill.id = 'brim-treadmill';
			
			document.body.appendChild(treadmill);
			
			treadmill.css({visibility: "hidden", position: "relative", zIndex: 10, left: 0});
			/*			treadmill.style.visibility = 'hidden';
			 treadmill.style.position = 'relative';
			 treadmill.style.zIndex = 10;
			 treadmill.style.left = 0;*/
			
			// Why make it such a large number?
			// Huge body height makes the size and position of the scrollbar fixed.
			treadmill.style.width = '1px';
			treadmill.style.height = '9999999999999999px';
		}
		else {
			console.log("Treadmill already exists.")
		}
		return treadmill;
	};
	
	/**
	 *
	 */
	brim._makeMask = function () {
		let mask = $('#brim-mask');
		//should exist
		if (mask) {
			mask.css({position: "fixed", zIndex: 30, top: 0, left: 0});
			
			/*			mask.style.position = 'fixed';
			 mask.style.zIndex = 30;
			 
			 mask.style.top = 0;
			 mask.style.left = 0;*/
		}
		else {
			console.log('Mask element does not exist.');
		}
		return mask;
	};
	
	/**
	 *
	 */
	brim._makeMain = function () {
		let main = $('#brim-main');
		//should exist
		if (main) {
			
			main.css({
				position: 'fixed',
				zIndex: 20,
				top: 0,
				left: 0,
				overflowY: "scroll",
				webkitOverflowScrolling: "touch"
			});
			
			/*			main.style.position = 'fixed';
			 main.style.zIndex = 20;
			 
			 main.style.top = 0;
			 main.style.left = 0;
			 
			 main.style.overflowY = 'scroll';
			 main.style.webkitOverflowScrolling = 'touch';*/
		}
		else {
			console.log('Main element does not exist.');
		}
		return main;
	};
	
	brim._makeDOM = function () {
		player.treadmill = brim._makeTreadmill();
		player.mask = brim._makeMask();
		player.main = brim._makeMain();
	};
	
	/**
	 * Fixed element is not visible outside of the chrome of the pre touch-drag state.
	 * See ./.readme/element-fixed-bug.png as a reminder of the bug.
	 *
	 * @see http://stackoverflow.com/questions/3485365/how-can-i-force-webkit-to-redraw-repaint-to-propagate-style-changes?lq=1
	 */
	brim._repaintElement = function (element) {
		//element.css({webkitTransform:'translateZ(0)'});
/*		element.style.webkitTransform = 'translateZ(0)';
		
		element.style.display = 'none';
		element.offsetHeight;
		element.style.display = 'block';*/
	};
	
	eventEmitter = Sister();
	
	brim.on = eventEmitter.on;
	
	brim._makeDOM();
	
	brim._setupDOMEventListeners();
	
	return brim;
};