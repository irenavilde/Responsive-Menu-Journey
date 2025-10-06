'use strict'

class ElementError extends Error {
	
	constructor(message) {
		super(message);
		this.name 		= "ElementError";
	}	
}

class MenuBurger {
	
	constructor () {
		
		try {
			
			this.setMessages = ['Large screen','Medium screen','Small screen',];
			
			this.styleNumber		= 0;  		// 0, 1, 2 - menu display styles
			this.elNumber			= 0;  		// how many elements in the menu
			this.setMenu			= []; 		// create menu list 
			this.mainMenu			= null;		// HTML menu element
			
			this.isBurgerMenuOpen	= false;	// whether 'burger' expanded menu is open 
			this.isError 			= false;	// if there is an error anywhere
			
			this.currentMenuWidth	= 0;		// current main menu width (calculated)
			
			this.MAX_STYLES 		= 2;		// after 2 styles will be 'burger' menu
			this.MIN_WIDTH 			= 10;		// emergency form width if any error occurs
			this.START_SPEED		= 0.1;		// interval start speed
			
		} catch(err) {
			
			this.isError = true;
			console.error(err.message);
		}		
	}
	
	// Internal procedure
	// Creates dynamic menu text with styles
	// Creates 'burger' menu list	
	_createMenuElements() {
		
		let retString = "<h1>"+this.setMessages[this.styleNumber]+"</h1>\n";			
		retString += "<ul>\n";
		
		const createBurgerMenu = (this.setMenu.length === 0);
		for (let j = 1; j<= this.elNumber; j++) {
			retString += "<li><a class=\"menu-style-"+this.styleNumber+"\">Menu "+j+"</a></li>\n";
			
			if (createBurgerMenu) {
				this.setMenu.push("Menu "+j);
			}	
		}
		retString += "</ul>\n";
		
		return retString;
	}
	
	// Creates adaptive menu
	// Closes the menu items input form
	// Opens the main menu form
	// Opens the calculator form
	menuInitialisation() {
		
		if (this.isError) return;
				
		try {
			
			// 1 - Hide main input form
			const inputForm1 = findCheckElement('inputFormMain');
			addRemoveClass(inputForm1, "hidden", null);
			
			// 2 - Show calculator form
			const inputForm2 = findCheckElement('inputFormBurger');
			addRemoveClass(inputForm2, "active-block", "hidden");
			
			// 3 - Show main menu
			this.mainMenu = findCheckElement('mainMenu');
			addRemoveClass(this.mainMenu, "active-inline-block", "hidden");
			
			// 4 - Get and validate number of menu elements
			const elInput = findCheckElement('menuCount');			
			this.elNumber = parseInt(elInput.value) || 5;
			this.elNumber = (this.elNumber > 8 || this.elNumber < 3)? 5 : this.elNumber;			
		
			// 5 - Create menu elements and get menu width
			this.mainMenu.innerHTML = this._createMenuElements();
			this.currentMenuWidth 	= this.mainMenu.offsetWidth;
			
			// 6 - Position main menu and calculator elements
			PositionTools.positionBottom(this.mainMenu, inputForm2, 30);
	
		} catch(err) {
			
			this.isError = true;
			console.error(err.message);
		}
	};
	
	// Main menu changes styles (shrinks)
	// Recalculates main menu size
	menuChange() {
		
		if (this.isError) return;
				
		try {
			
			// 1 - Increment style number
			this.styleNumber++;
			
			// 2 - Update menu with new style
			this.mainMenu.innerHTML = this._createMenuElements();
			
			// 3 - Recalculate menu width
			this.currentMenuWidth 	= this.mainMenu.offsetWidth;  
			
		} catch(err) {
			
			this.isError = true;
			console.error(err.message);
		}
	
	};
	
	// Animation of block shrinking and menu adaptation
	// When block reaches menu size - menu shrinks
	// After 3 shrink operations menu turns into 'burger' menu
	startAnnimation() {
		
		if (this.isError) return;		
		
		let intervalSpeed 	= this.START_SPEED;
		let currentWidth 	= 100;
		let workScreen		= null;
		
		// 1		
		try {
		
			// find a main screen to reduce
			workScreen = findCheckElement('mainScreen'); 
			workScreen.style.transition = 'width 0.4s linear';
		
		} catch(err) {
				
			this.isError = true;
			console.error(err.message);
		}  

		// 2 - Async process to reduce the main screen
		const compressionInterval = setInterval(() => {
			
			try {
				
				// 2.1 - Check if we need to stop or change menu style
				if (workScreen.offsetWidth -2 < this.currentMenuWidth 	|| 
						currentWidth <= this.MIN_WIDTH || this.isError) {
					
					// If error - stop the process
					if (this.isError) {
						clearInterval(compressionInterval);
						return;	
					}
					// If style level is maximum - stop and create 'burger' menu
					else if (this.styleNumber >= this.MAX_STYLES) {	
						clearInterval(compressionInterval);
						this.openBurgerMenu();
						return;				
					}
					// Change style and recalculate main menu width
					else {		
						this.menuChange();
						intervalSpeed /= 1.5;
					}
				}
                
				// 2.2 - Squeeze the main screen
				currentWidth -= intervalSpeed; 
				workScreen.style.width = currentWidth + '%';			
				
			} catch(err) {
				
				this.isError = true;
				console.error(err.message);
			}        
			
		}, 40);			
		
	};	
	
	// Close main menu and calculator
	// Open 'burger' menu
	// Create burger expanded menu
	openBurgerMenu() {
		
		if (this.isError) return;
		
		try {
			
			// 1 - Hide main menu
			addRemoveClass(this.mainMenu, "hidden", "active-inline-block");
			
			// 2 - Show 'burger' menu wrapper
			const burgerMenu = findCheckElement('burgerMenuWrap');
			addRemoveClass(burgerMenu, "active-block", "hidden");

			 // 3 - Create 'burger' expanded menu HTML
			let menuTegString = "<ul>\n";
			for (const elMenu of this.setMenu) {		
				menuTegString += "<li><a>"+elMenu+"</a></li>\n";
			}	
			menuTegString += "</ul>\n";
			
			// 4 - Insert 'burger' menu content
			const burgerExMenu = findCheckElement('burgerExpandMenu');
			burgerExMenu.innerHTML = menuTegString;	

			// 5 - Hide calculator form
			const inputForm = findCheckElement('inputFormBurger');
			addRemoveClass(inputForm, "hidden", "active-block");

			 // 6 - Position 'burger' menu elements
			PositionTools.positionBottom(burgerMenu, burgerExMenu, 5);	

		} catch(err) {
			
			this.isError = true;
			console.error(err.message);
		}		
	};	
	
	// Open / close burger extended menu
	manageBurgerExtendedMenu() {
		
		try {
			
			// 1 - Toggle burger menu state
			this.isBurgerMenuOpen = !this.isBurgerMenuOpen;	
			
			// 2 - Get 'burger' expanded menu element
			const burgerExMenu = findCheckElement('burgerExpandMenu');
			
			// 3 - Get 'burger' menu icon element
			const burgerMenu = findCheckElement('burgerMenu');
			
			// 4 - Apply changes based on menu state
			if (this.isBurgerMenuOpen) {
				
				// Show expanded menu
				addRemoveClass(burgerExMenu, "visible-yes", "visible-no");
				
				// Transform burger icon to X shape
				Object.assign(burgerMenu.children[0].style,{transform: 'rotate(45deg) translate(10px, 10px)'});
				Object.assign(burgerMenu.children[1].style,{opacity: '0'});
				Object.assign(burgerMenu.children[2].style,{transform: 'rotate(-45deg) translate(10px, -10px)'});
				
			}
			else {
				
				// Hide expanded menu
				addRemoveClass(burgerExMenu, "visible-no", "visible-yes");

				// Reset burger icon to original state
				Object.assign(burgerMenu.children[0].style,{transform: 'none'});
				Object.assign(burgerMenu.children[1].style,{opacity: '1'});
				Object.assign(burgerMenu.children[2].style,{transform: 'none'});
	
			}
			
		} catch(err) {
			
			this.isError = true;
			console.error(err.message);
		}
	}
}

// Find an element by ID
function findCheckElement(argName) {
	
	try {
		
		const workElement = document.getElementById(argName);
		if (!workElement) throw new ElementError("Element with id = '"+argName+"\' not found");
		return workElement;
					
	} catch(err) {
		
		throw err;
	}		
			
}

// Remove and/or add classes for elements
function addRemoveClass(argEl, classAdd, classRemove) {
	
	try {
		
		if (classAdd) argEl.classList.add(classAdd);
		if (classRemove) argEl.classList.remove(classRemove);
	
	} catch(err) {
		
		throw err;
	}
}

// Calculator function - performs mathematical operations based on user input
function resultCalculation() {
	
	// Define error messages for user feedback
	const ERROR_MESSAGES = {
		INVALID_NUMBERS: '<span style="color: red;">Please enter valid numbers</span>',
		DIVIDE_BY_ZERO: 'Divide by 0'
	};

	try {
		
		// Get first number input
		const elInput1 = findCheckElement('number1');
		const num1 = parseFloat(elInput1.value);
		
		// Get second number input 
		const elInput2 = findCheckElement('number2');
		const num2 = parseFloat(elInput2.value);
		
		// Get selected operation
		const elOperation = findCheckElement('operation');
		const operation = elOperation.value;	
		
		// Get result display element
		const elResult = findCheckElement('result'); 
		
		// Validate that both inputs are finite numbers
		if (!Number.isFinite(num1) || !Number.isFinite(num2)) {
			elResult.innerHTML = ERROR_MESSAGES.INVALID_NUMBERS;
			return;
		}
		
		// Define available mathematical operations with error handling
		const setOperations ={
			add: 		(num1, num2) => num1 + num2,
			subtract: 	(num1, num2) => num1 - num2,
			divide: 	(num1, num2) => {
				if (num2 === 0) return ERROR_MESSAGES.DIVIDE_BY_ZERO;  
				return num1 / num2; 
			},
			multiply: 	(num1, num2) => num1 * num2,
		}
		
		// Execute selected operation and display result
		const result = setOperations[operation](num1, num2);
		elResult.innerText = "Result: "+result;

	} catch(err) {
		console.error(err.message);
	}			
}

//////////////////////////////////////////////////////////////////

// Global variable to store the menu instance
let myBurgerMenu = null;

// Event listener for menu generation button click
document.getElementById('generateBtn').addEventListener('click', function() {

	myBurgerMenu = new MenuBurger();
	myBurgerMenu.menuInitialisation();
	myBurgerMenu.startAnnimation();
	
});

// Event listener for burger menu icon click
document.getElementById('burgerMenu').addEventListener('click', function() {

	myBurgerMenu.manageBurgerExtendedMenu();
	
});

// Event listener for calculator button click
document.getElementById('calculateBtn').addEventListener('click', resultCalculation);



