const form = document.querySelector("form");
const username = document.getElementById("name");
const email = document.getElementById("email");
const comments = document.getElementById('comments');
const nameErr = document.getElementById('nameErr');
const nameInfo = document.getElementById('nameInfo');
const emailErr = document.getElementById('emailErr');
const emailInfo = document.getElementById('emailInfo');
const commentsErr = document.getElementById('commentsErr');
const commentsInfo = document.getElementById('commentsInfo');
const minNameLength = parseInt(username.getAttribute("minlength"));
const maxNameLength = parseInt(username.getAttribute("maxlength"));
const minEmailLength = parseInt(email.getAttribute("minlength"));
const maxEmailLength = parseInt(email.getAttribute("maxlength"));
const maxCommentsLength = parseInt(comments.getAttribute("maxlength"));
const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const nameRegExp = /^[a-zA-Z]+(?:-[a-zA-Z]+)?(?: [a-zA-Z]+)?$/;

var formErrors = [];



function characterCount(val) {

	var len = val.value.length;
	var remainingChars = maxCommentsLength - len;
  
	if (len >= maxCommentsLength) {
	  	val.value = val.value.substring(0, maxCommentsLength);
	  	$('#commentsErr').text(0);
	} else {
	  	$('#commentsErr').text(remainingChars);
  
	  	if (remainingChars < 50 && remainingChars > 15) {
			color = 'orange';
	  	}
	  	else if (remainingChars <= 15) {
			color = 'red';
	  	}
	  	else {
			color = 'white';
	  	}
	  		commentsErr.style.color = color;
	}
  
};

username.addEventListener("input", (event) => {
	//name
	const nameLength = username.value.length;
	const usernameIsValid =  nameLength >= minNameLength && nameLength <= maxNameLength && nameRegExp.test(username.value);
	if (usernameIsValid) {
		nameErr.textContent = "";
		nameErr.className = "error";
	} else {
		showError();
	}
});

email.addEventListener("input", (event) => {
	//email
	if (email.validity.valid) {
	  emailErr.textContent = "";
	  emailErr.className = "error";
	} else {
	  showError();
	}
});

form.addEventListener("submit", (event) => {
	event.preventDefault();
  
	const nameLength = username.value.length;
	const usernameIsValid =  nameLength >= minNameLength && nameLength <= maxNameLength && nameRegExp.test(username.value);
	if (!usernameIsValid) {
		username.className = "invalid";
		nameErr.textContent = "Please enter a valid name.";
		nameErr.className = "nameErr active";
		formErrors.push({ message: `Invalid Property in Name Field`, timestamp: new Date().toISOString() });
		submitErrors();
	}
	else {
		username.className = "valid";
		nameErr.textContent = "";
		nameErr.className = "nameErr";
	}

	const emailIsValid = email.value.length === 0 || emailRegExp.test(email.value);
	if (!emailIsValid) {
		email.className = "invalid";
		emailErr.textContent = "Please enter a valid email address.";
		emailErr.className = "emailErr active";
		formErrors.push({ message: `Invalid Property in Email Field`, timestamp: new Date().toISOString() });
		submitErrors();
	} else {
		email.className = "valid";
		emailErr.textContent = "";
		emailErr.className = "emailErr";
	}

	fetch('https://httpbin.org/post', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formErrors) });
	
	formErrors = [];
});

comments.addEventListener("keyup", (event) => {
    const typedCharacters = comments.value.length;
    if (typedCharacters > maxCommentsLength) {
        return false;
    }
    commentsInfo.textContent = typedCharacters;
    if (typedCharacters >= maxCommentsLength - 100 && typedCharacters < maxCommentsLength - 50) {
        commentsInfo.classList = "text-warning";
    } else if (typedCharacters >= maxCommentsLength - 50) {
        commentsInfo.classList = "text-danger";
    }
});

function showError() {
	if (username.validity.valueMissing) {
		nameErr.textContent = "You need to enter a name.";
	  } else if (username.validity.typeMismatch) {
		nameErr.textContent = "Entered value is not valid.";
	  } else if (username.validity.tooShort) {
		nameErr.textContent = `Name should be at least ${minNameLength} characters; you entered ${minNameLength}.`;
	  }

	if (email.validity.valueMissing) {
	  emailErr.textContent = "You need to enter an email address.";
	} else if (email.validity.typeMismatch) {
	  emailErr.textContent = "Entered value is not valid.";
	} else if (email.validity.tooShort) {
	  emailErr.textContent = `Email should be at least ${minEmailLength} characters; you entered ${minEmailLength}.`;
	}
}

function submitErrors() {
	var formErrorsJSON = JSON.stringify(formErrors);
	console.log("Submitting form errors to server:", formErrorsJSON);
}

function toggleTheme() {
	var element = document.querySelector('body');
	element.classList.toggle("dark-mode");

	var isDarkMode = element.classList.contains("dark-mode");

	localStorage.setItem("theme", isDarkMode ? "dark-mode" : "light-mode");
}

document.addEventListener("DOMContentLoaded", function () {
	var currTheme = localStorage.getItem("theme");
  
	if (currTheme) {
	  	document.body.classList.add(currTheme);
	}
});