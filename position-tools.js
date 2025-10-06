'use strict'

const PositionTools = (function() {
	
	const ElPosition = {
		
		bottom: 		"bottom",
		top: 			"top",
		left: 			"left",
		right: 			"right",
		
		bottomLeft: 	"bottom-left",
		bottomRight: 	"bottom-right",
		topLeft: 		"top-left",
		topRight: 		"top-right",
		
		bottomCenter:	"bottom-center",
		topCenter:		"top-center",
		leftCenter:		"left-center",
		rightCenter:	"right-center",

	}
	
	// * Internal class
	class PositionError extends Error {
		
		constructor(message) {
			super(message);
			this.name 		= "PositionError";
		}	
	}

	/**
	 * Check a value. Must be finity number
	 * @param {*} 'valueToCheck' - position between elements or offset
	 * @throws {Error} checked value is not a number
	 */
	function _checkDistanceBetweenElements(valueToCheck, withMessage) {
		
		try {
			
			// check a distance whether it is a number
			if (!Number.isFinite(valueToCheck)) {
				throw new PositionError("Invalid number: "+ valueToCheck + " Must be a finite number");
			}	

			return {isError: false};
			
		} catch(err) {
			
			if (err instanceof PositionError) {
				if (withMessage) console.error("Value check error: "+err.message);
				return {isError: true};
			}
			
			throw err;
		}
	}

	/**
	 * Check an element. Must be valid HTML element
	 * @param {HTMLElement} 'elementToCheck' - Reference element
	 * @param {HTMLElement} 'elementName' - Element name for a message  
	 * @throws {Error} checked element is not exist or is not an HTML element
	 */
	function _checkPositioningElement(elementToCheck, elementName, withMessage) {
		
		try {
			
			// checked element was not found
			if (!elementToCheck) {
				throw new PositionError(elementName + " is required");
			}	

			// checked element is not HTML element		
			if (!(elementToCheck instanceof HTMLElement)) {
				throw new PositionError(elementName + " must be a DOM element");
			}

			return {isError: false};
			
		} catch(err) {
			
			if (err instanceof PositionError) {
				if (withMessage) console.error("HTML element check error: "+err.message);
				return {isError: true};
			}
			
			throw err;
		}
	}
	
	/**
	 * Set position for Element to position
	 * @param {HTMLElement} 'baseElement' - Reference element
	 * @param {HTMLElement} 'elementToPosition' - Element to position    
	 * @param {number} 'distance' - Distance in pixels (can be negative for overlap)
	 * @param {number} 'offset' - offset from base element (can be negative)
	 * @param {string} 'position' - position from ElPosition list
	 * @param {Object} 'absCoord' - baseElement absolute position
	 */
	function _setPosition(baseElement, elementToPosition, distance, offset, position, absCoord) {
	
		let middleBaseElement;
		
		// clear conflicting position
		switch (position) {
			case ElPosition.top:
			case ElPosition.bottom:
			case ElPosition.topCenter:
			case ElPosition.bottomCenter:

				elementToPosition.style.top = "";
				elementToPosition.style.bottom = "";
				break;
				
			case ElPosition.left:
			case ElPosition.right:
			case ElPosition.leftCenter:
			case ElPosition.rightCenter:

				elementToPosition.style.left = "";
				elementToPosition.style.right = "";
				break;
				
			case ElPosition.topLeft:
			case ElPosition.topRight:
			case ElPosition.bottomLeft:
			case ElPosition.bottomRight:

				elementToPosition.style.top = "";
				elementToPosition.style.bottom = "";
				elementToPosition.style.left = "";
				elementToPosition.style.right = "";
				break;
		}
		
		// set new position
		switch (position) {
			case ElPosition.top:
				elementToPosition.style.top 	= (absCoord.top - elementToPosition.offsetHeight - distance) + "px";
				break;
				
			case ElPosition.right:
				elementToPosition.style.left 	= (absCoord.right + distance) + "px";
				break;
				
			case ElPosition.bottom:
				elementToPosition.style.top 	= (absCoord.bottom + distance) + "px";
				break;
				
			case ElPosition.left:
				elementToPosition.style.left 	= (absCoord.left - elementToPosition.offsetWidth - distance) + "px";
				break;
				
			case ElPosition.bottomLeft:
				elementToPosition.style.top 	= (absCoord.bottom + distance) + "px";
				elementToPosition.style.left 	= (absCoord.left - elementToPosition.offsetWidth - offset) + "px";
				break;
				
			case ElPosition.topLeft:
				elementToPosition.style.top 	= (absCoord.top - elementToPosition.offsetHeight - distance) + "px";
				elementToPosition.style.left 	= (absCoord.left - elementToPosition.offsetWidth - offset) + "px";
				break;
				
			case ElPosition.bottomRight:
				elementToPosition.style.top 	= (absCoord.bottom + distance) + "px";
				elementToPosition.style.left 	= (absCoord.right + offset) + "px";
				break;
				
			case ElPosition.topRight:
				elementToPosition.style.top 	= (absCoord.top - elementToPosition.offsetHeight - distance) + "px";
				elementToPosition.style.left 	= (absCoord.right + offset) + "px";
				break;
				
			case ElPosition.bottomCenter:
				elementToPosition.style.top 	= (absCoord.bottom + distance) + "px";
				
				middleBaseElement = (absCoord.right - absCoord.left) / 2;
				elementToPosition.style.left 	= (absCoord.left + middleBaseElement) + "px";
				
				elementToPosition.style.transform = "translate(-50%, 0)"; 
				break;
				
			case ElPosition.topCenter:
				elementToPosition.style.top 	= (absCoord.top - elementToPosition.offsetHeight - distance) + "px";
				
				middleBaseElement = (absCoord.right - absCoord.left) / 2;
				elementToPosition.style.left 	= (absCoord.left + middleBaseElement) + "px";
				
				elementToPosition.style.transform = "translate(-50%, 0)";
				break;	
				
			case ElPosition.rightCenter:
				elementToPosition.style.left 	= (absCoord.right + distance) + "px";
				
				middleBaseElement = (absCoord.bottom - absCoord.top) / 2;
				elementToPosition.style.top 	= (absCoord.top + middleBaseElement) + "px";
				
				elementToPosition.style.transform = "translate(0, -50%)";
				break;	
				
			case ElPosition.leftCenter:
				elementToPosition.style.left 	= (absCoord.left - elementToPosition.offsetWidth - distance) + "px";
				
				middleBaseElement = (absCoord.bottom - absCoord.top) / 2;
				elementToPosition.style.top 	= (absCoord.top + middleBaseElement) + "px";
				
				elementToPosition.style.transform = "translate(0, -50%)";
				break;		
				
		}		
	}

	 /**
	 * Positions one element relative to another
	 * @param {HTMLElement} 'baseElement' - Reference element
	 * @param {HTMLElement} 'elementToPosition' - Element to position    
	 * @param {number} 'distance' - Distance in pixels (can be negative for overlap)
	 * @param {number} 'offset' - offset from base element (can be negative)
	 * @param {string} 'position' - position from ElPosition list
	 */
	function _positionBetweenElements(baseElement, elementToPosition, distance, offset, position, withMessage) {

		try {
			
			// elements and distance validation
			if (_checkPositioningElement(baseElement, "Base element",withMessage).isError) return;
			if (_checkPositioningElement(elementToPosition, "Element to position",withMessage).isError) return;
			if (_checkDistanceBetweenElements(distance, withMessage).isError) return;
			if (_checkDistanceBetweenElements(offset, withMessage).isError) return;
			
			// find Base element absolute position
			const coord = baseElement.getBoundingClientRect();

			const absCoord = {
				top: 	coord.top 		+ window.pageYOffset,
				bottom: coord.bottom 	+ window.pageYOffset,
				left: 	coord.left 		+ window.pageXOffset,
				right: 	coord.right 	+ window.pageXOffset
			};
			
			// Set position for Element to position
			_setPosition(baseElement, elementToPosition, distance, offset, position, absCoord);
						
			return {isError: false};
		
		} catch(err) {
			
			throw err;
		}
	}
	
	/** Public API
	 * @param {HTMLElement} baseElement - Reference element
	 * @param {HTMLElement} elementToPosition - Element to position  
	*/ 
    return {
		
		/** 
		 * Element to position is below the base element
		 * @param {number} 'distance' = distance from base element 
		*/ 
        positionBottom: function(baseElement, elementToPosition, distance = 0, withMessage = true) {
            _positionBetweenElements(baseElement, elementToPosition, distance, 0, ElPosition.bottom, withMessage);
        },
        
		/** 
		 * Element to position is above the base element  
		 * @param {number} 'distance' = distance from base element 
		*/  
        positionTop: function(baseElement, elementToPosition, distance = 0, withMessage = true) {
            _positionBetweenElements(baseElement, elementToPosition, distance, 0, ElPosition.top, withMessage);
        },
        
		/** 
		 * Element to position is on the left side of the base element
		 * @param {number} 'distance' = distance from base element 
		*/  
        positionLeft: function(baseElement, elementToPosition, distance = 0, withMessage = true) {
            _positionBetweenElements(baseElement, elementToPosition, distance, 0, ElPosition.left, withMessage);
        },
        
		/** 
		 * Element to position is on the right side of the base element
		 * @param {number} 'distance' = distance from base element 
		*/  
        positionRight: function(baseElement, elementToPosition, distance = 0, withMessage = true) {
            _positionBetweenElements(baseElement, elementToPosition, distance, 0, ElPosition.right, withMessage);
        },
		
		/** 
		 * Element to position is below and aligned to the left of base element
		 * @param {number} 'distance' = distance from base element 
		 * @param {number} 'offset' = offset from base element 
		*/  
		positionBottomLeft: function(baseElement, elementToPosition, distance = 0, offset = 0, withMessage = true) {
            _positionBetweenElements(baseElement, elementToPosition, distance, offset, ElPosition.bottomLeft, withMessage);
        },
		
		/** 
		 * Element to position is above and aligned to the left of base element
		 * @param {number} 'distance' = distance from base element 
		 * @param {number} 'offset' = offset from base element 
		*/  
		positionTopLeft: function(baseElement, elementToPosition, distance = 0, offset = 0, withMessage = true) {
            _positionBetweenElements(baseElement, elementToPosition, distance, offset, ElPosition.topLeft, withMessage);
        },
		
		/** 
		 * Element to position is below and aligned to the right of base element
		 * @param {number} 'distance' = distance from base element 
		 * @param {number} 'offset' = offset from base element 
		*/  
		positionBottomRight: function(baseElement, elementToPosition, distance = 0, offset = 0, withMessage = true) {
            _positionBetweenElements(baseElement, elementToPosition, distance, offset, ElPosition.bottomRight, withMessage);
        },
		
		/** 
		 * Element to position is above and aligned to the right of base element
		 * @param {number} 'distance' = distance from base element 
		 * @param {number} 'offset' = offset from base element 
		*/  
		positionTopRight: function(baseElement, elementToPosition, distance = 0, offset = 0, withMessage = true) {
            _positionBetweenElements(baseElement, elementToPosition, distance, offset, ElPosition.topRight, withMessage);
        },
		
		/** 
		 * Element to position is below and horizontally centered relative to base element
		 * @param {number} 'distance' = distance from base element 
		*/  
		positionBottomCenter: function(baseElement, elementToPosition, distance = 0, withMessage = true) {
            _positionBetweenElements(baseElement, elementToPosition, distance, 0, ElPosition.bottomCenter, withMessage);
        },
		
		/** 
		 * Element to position is above and horizontally centered relative to base element
		 * @param {number} 'distance' = distance from base element 
		*/  
		positionTopCenter: function(baseElement, elementToPosition, distance = 0, withMessage = true) {
            _positionBetweenElements(baseElement, elementToPosition, distance, 0, ElPosition.topCenter, withMessage);
        },
		
		/** 
		 * Element to position is on the left and vertically centered relative to base element
		 * @param {number} 'distance' = distance from base element 
		*/  
		positionLeftCenter: function(baseElement, elementToPosition, distance = 0, withMessage = true) {
            _positionBetweenElements(baseElement, elementToPosition, distance, 0, ElPosition.leftCenter, withMessage);
        },
		
		/** 
		 * Element to position is on the right and vertically centered relative to base element
		 * @param {number} 'distance' = distance from base element 
		*/  
		positionRightCenter: function(baseElement, elementToPosition, distance = 0, withMessage = true) {
            _positionBetweenElements(baseElement, elementToPosition, distance, 0, ElPosition.rightCenter, withMessage);
        },
				
    };
	
})();
