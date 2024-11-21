// js/src/rsvp-init.js
document.addEventListener("DOMContentLoaded", function () {
	if (!window.appState) {
		window.appState = {
			rsvp: {
				isLoading: false,
			},
		};
	} else if (!window.appState.rsvp) {
		window.appState.rsvp = {
			isLoading: false,
		};
	}

	const formData = {
		name: "",
        wedding: null,
        cocktail: null,
        phone: "",
        email: "",
        restrictions: "",
        numEvents: 0
	};

	const searchInput = document.getElementById("searchInput");
	const searchResults = document.getElementById("searchResults");
	const modal = document.getElementById("rsvpModal");
	const progressBar = document.querySelector(".rsvpModal__progress-bar");
	const totalSteps = 5;

	function updateProgress(currentStep) {
		const progressPercentage = (currentStep / totalSteps) * 100;
		progressBar.style.width = `${progressPercentage}%`;
	}

	document.getElementById("openRSVP").addEventListener("click", function () {
		modal.classList.add("rsvpModal__show");
		updateProgress(1);
	});

	const closeBtn = document.querySelector(".rsvpModal__close");
	closeBtn.addEventListener("click", function () {
		modal.classList.remove("rsvpModal__show");
		setTimeout(resetForm, 300);
	});

	window.addEventListener("click", function (e) {
		if (e.target === modal) {
			modal.classList.remove("rsvpModal__show");
			setTimeout(resetForm, 300);
		}
	});

	function resetForm() {
		formData.name = "";
		formData.wedding = null; // Cambiado de false a null
		formData.cocktail = null; // Cambiado de false a null
		formData.phone = "";
		formData.email = "";
		formData.restrictions = "";
		formData.numEvents = 0;

		searchInput.value = "";
		searchResults.innerHTML = "";
		showStep(1);
	}

	searchInput.addEventListener("keyup", function (e) {
		const search = e.target.value.toLowerCase();
		const filtered = invitados.filter((inv) =>
			inv.nombre.toLowerCase().includes(search)
		);

		searchResults.innerHTML = filtered
			.map(
				(inv) =>
					`<div class="rsvpModal__result" onclick="selectInvitado('${inv.nombre}', ${inv.eventos})">
									${inv.nombre}
							</div>`
			)
			.join("");
	});

	window.selectInvitado = function (nombre, eventos) {
		formData.name = nombre;
		formData.numEvents = eventos;
		formData.wedding = null; // Inicializar como null
		formData.cocktail = null; // Inicializar como null
		showStep(2);

		const step2 = document.getElementById("step2");
		step2.innerHTML = `
				<h2 class="heading--64 color--627463">Wedding</h3>
				<p class="heading--14 color--4F4F4F">NUESTRO MATRIMONIO</p>
				<span class="space space--30"></span>
				<p class="heading--16 color--000" style="font-family: 'Poppins', serif; ">
				October 12th, 2025 / 12 de Octubre 2025 <br>
				Hacienda San José, Pereira - Colombia <br>
				3:30 P.M.
				</p>
				<span class="space space--20"></span>
				<div class="guest-response">
						<p>${nombre}</p>
						<div>
							<button class="button button--green--small" onclick="acceptWedding()">Accept</button>
							<button class="button button--green--small" onclick="declineWedding()">Decline</button>
						</div>
				</div>
				<div class="navigation-buttons">
						<button class="button button--green" onclick="prevStep(1)">Back</button>
						${
							eventos === 2
								? '<button class="button button--green" onclick="nextStep(3)">Continue</button>'
								: '<button class="button button--green" onclick="nextStep(4)">Continue</button>'
						}
				</div>
		`;
	};

	// Funciones de Wedding
	window.acceptWedding = function () {
		formData.wedding = true;
		const responseDiv = document.querySelector(".guest-response");
		const buttons = responseDiv.querySelectorAll("button");
		buttons.forEach((button) => {
			button.classList.remove("selected");
			if (button.innerText === "Accept") {
				button.classList.add("selected");
			}
		});
	};

	window.declineWedding = function () {
		formData.wedding = false;
		const responseDiv = document.querySelector(".guest-response");
		const buttons = responseDiv.querySelectorAll("button");
		buttons.forEach((button) => {
			button.classList.remove("selected");
			if (button.innerText === "Decline") {
				button.classList.add("selected");
			}
		});
	};

	// Funciones de Cocktail
	window.showCocktail = function () {
		if (formData.numEvents !== 2) return;

		const cocktailHtml = `
            <h2 class="heading--64 color--627463">Welcome Cocktail</h3>
            <p class="heading--14 color--4F4F4F">COCTEL DE BIENVENIDA</p>
            <span class="space space--20"></span>
            <p class="heading--16 color--000" style="font-family: 'Poppins', serif; ">
                October 11th, 2025 / 11 de Octubre 2025 <br>
                Hacienda San Jorge, Pereira - Colombia <br>
                5:00 P.M.
            </p>
			<span class="space space--20"></span>
            <div class="guest-response-cocktail">
                <p>${formData.name}</p>
                <div>
                    <button class="button button--green--small" onclick="acceptCocktail()">Accept</button>
                    <button class="button button--green--small" onclick="declineCocktail()">Decline</button>
                </div>
            </div>
            <div class="navigation-buttons">
                <button class="button button--green" onclick="prevStep(2)">Back</button>
                <button class="button button--green" onclick="nextStep(4)">Continue</button>
            </div>
        `;
		document.getElementById("step3").innerHTML = cocktailHtml;

		// Solo añadir la clase selected si ya se hizo una selección explícita
		if (formData.cocktail !== null) {
			const responseDiv = document.querySelector(".guest-response-cocktail");
			const buttons = responseDiv.querySelectorAll("button");
			buttons.forEach((button) => {
				button.classList.remove("selected");
				if (
					(formData.cocktail && button.innerText === "Accept") ||
					(!formData.cocktail && button.innerText === "Decline")
				) {
					button.classList.add("selected");
				}
			});
		}
	};

	window.acceptCocktail = function () {
		formData.cocktail = true;
		const responseDiv = document.querySelector(".guest-response-cocktail");
		const buttons = responseDiv.querySelectorAll("button");
		buttons.forEach((button) => {
			button.classList.remove("selected");
			if (button.innerText === "Accept") {
				button.classList.add("selected");
			}
		});
	};

	window.declineCocktail = function () {
		formData.cocktail = false;
		const responseDiv = document.querySelector(".guest-response-cocktail");
		const buttons = responseDiv.querySelectorAll("button");
		buttons.forEach((button) => {
			button.classList.remove("selected");
			if (button.innerText === "Decline") {
				button.classList.add("selected");
			}
		});
	};

	function updateResponse(className, accepted) {
		const responseDiv = document.querySelector(`.${className}`);
		const buttons = responseDiv.querySelectorAll(".rsvpModal__button");
		buttons.forEach((button) => button.classList.remove("selected"));
		buttons[accepted ? 0 : 1].classList.add("selected");
	}

	window.nextStep = function (step) {
		if (formData.numEvents === 1 && step === 3) {
			showStep(4);
		} else {
			showStep(step);
		}
	};

	window.showStep = function (step) {
		document.querySelectorAll(".rsvpModal__step").forEach((s) => {
			s.classList.remove("rsvpModal__step--active");
		});

		// Si intentamos mostrar el paso 3 (Cocktail) pero el invitado tiene solo 1 evento
		if (step === 3 && formData.numEvents === 1) {
			// Redirigir al paso 2 (Wedding) si viene de "Back", o al paso 4 (Additional Info) si viene de "Continue"
			const newStep = document.activeElement?.innerText === "Back" ? 2 : 4;
			document
				.getElementById(`step${newStep}`)
				.classList.add("rsvpModal__step--active");
			updateProgress(newStep);
			return;
		}

		const stepElement = document.getElementById(`step${step}`);
		stepElement.classList.add("rsvpModal__step--active");
		updateProgress(step);

		// Actualizar el contenido según el paso
		switch (step) {
			case 2:
				// Actualizar contenido de Wedding
				const step2 = document.getElementById("step2");
				step2.innerHTML = `
								<h2 class="heading--64 color--627463">Wedding</h3>
								<p class="heading--14 color--4F4F4F">NUESTRO MATRIMONIO</p>
								<span class="space space--30"></span>
								<p class="heading--16 color--000" style="font-family: 'Poppins', serif; ">
								October 12th, 2025 / 12 de Octubre 2025 <br>
								Hacienda San José, Pereira - Colombia <br>
								3:30 P.M.
								</p>
								<span class="space space--20"></span>
								<div class="guest-response">
										<p>${formData.name}</p>
										<div>
											<button class="button button--green--small ${
												formData.wedding ? "selected" : ""
											}" onclick="acceptWedding()">Accept</button>
											<button class="button button--green--small ${
												!formData.wedding ? "selected" : ""
											}" onclick="declineWedding()">Decline</button>
										</div>
								</div>
								<div class="navigation-buttons">
										<button class="button button--green" onclick="prevStep(1)">Back</button>
										${
											formData.numEvents === 2
												? '<button class="button button--green" onclick="nextStep(3)">Continue</button>'
												: '<button class="button button--green" onclick="nextStep(4)">Continue</button>'
										}
								</div>
						`;
				break;
			case 3:
				if (formData.numEvents === 2) {
					showCocktail();
				}
				break;
			case 4:
				showAdditionalInfo();
				break;
		}
	};

	window.prevStep = function (step) {
		if (step === 3 && formData.numEvents === 1) {
			showStep(2);
		} else {
			showStep(step);
		}
	};

	window.showAdditionalInfo = function () {
		const step4 = document.getElementById("step4");
		step4.innerHTML = `
				<h2 class="heading--64 color--627463">Additional Info</h3>
				<p class="heading--14 color--4F4F4F">INFORMACIÓN ADICIONAL</p>
				<label for="" class="heading--16 color--000" style="font-family: 'Poppins', serif; ">Phone / Teléfono</label>
				<input type="text" id="phone" value="${formData.phone}">
				<span class="space space--10"></span>
				<label for="" class="heading--16 color--000" style="font-family: 'Poppins', serif; ">Email address (Correo Electrónico)</label>
				<input type="email" id="email" value="${formData.email}">
				<span class="space space--10"></span>
				<label for="" class="heading--16 color--000" style="font-family: 'Poppins', serif; ">Tell us if you have any food allergies or restrictions. <br> Dinos si tienes alguna alergia o restricción alimentaria.</label>
				<textarea id="restrictions">${formData.restrictions}</textarea>
				<div class="navigation-buttons">
						<button class="button button--green" onclick="prevStep(${
							formData.numEvents === 2 ? 3 : 2
						})">Back</button>
						<button class="button button--green" onclick="submitRSVP()">R.S.V.P.</button>
				</div>
		`;
	};

	window.submitRSVP = function () {
		const submitButton = document.querySelector('button[onclick="submitRSVP()"]');
        const originalText = submitButton.innerHTML;
        let dots = '';
        let loadingInterval;

		function updateLoadingText() {
			dots = dots.length >= 3 ? "" : dots + ".";
			submitButton.innerHTML = `Enviando${dots}`;
		}

		function startLoading() {
			submitButton.disabled = true;
			loadingInterval = setInterval(updateLoadingText, 500);
			window.appState.rsvp.isLoading = true;
		}

		function stopLoading() {
			clearInterval(loadingInterval);
			submitButton.disabled = false;
			submitButton.innerHTML = originalText;
			window.appState.rsvp.isLoading = false;
		}

		formData.phone = document.getElementById("phone").value;
		formData.email = document.getElementById("email").value;
		formData.restrictions = document.getElementById("restrictions").value;

		if (!formData.email || !formData.phone) {
			alert("Por favor completa todos los campos requeridos");
			return;
		}

		const submitData = () => {
			startLoading();

			const formDataToSend = new FormData();
			formDataToSend.append("action", "send_rsvp_email");
			formDataToSend.append("rsvp_data", JSON.stringify(formData));
			formDataToSend.append("nonce", wpData.nonce);

			return fetch(wpData.ajaxurl, {
				method: "POST",
				body: formDataToSend,
			})
				.then((response) => response.json())
				.then((data) => {
					stopLoading();
					if (data.success) {
						showStep(5);
						showThanks();
					} else {
						throw new Error(data.data || "Error al enviar el formulario");
					}
				})
				.catch((error) => {
					stopLoading();
					console.error("Error:", error);
					alert(
						`Hubo un error al enviar tu confirmación. Por favor intenta de nuevo.`
					);
				});
		};

		if (wpData.isLocal) {
			submitData();
		} else {
			grecaptcha.ready(function () {
				startLoading();
				grecaptcha
					.execute("6Lc3xoEqAAAAAAkqDAnEarsqXf-6HKCC2G4jogWh", {
						action: "rsvp",
					})
					.then(function (token) {
						const formDataToSend = new FormData();
						formDataToSend.append("action", "send_rsvp_email");
						formDataToSend.append("rsvp_data", JSON.stringify(formData));
						formDataToSend.append("recaptcha_response", token);
						formDataToSend.append("nonce", wpData.nonce);

						return fetch(wpData.ajaxurl, {
							method: "POST",
							body: formDataToSend,
						});
					})
					.then((response) => response.json())
					.then((data) => {
						stopLoading();
						if (data.success) {
							showStep(5);
							showThanks();
						} else {
							throw new Error(data.data || "Error en la verificación");
						}
					})
					.catch((error) => {
						stopLoading();
						console.error("Error:", error);
						alert(
							`Hubo un error al enviar tu confirmación. Por favor intenta de nuevo.`
						);
					});
			});
		}
	};

	window.showThanks = function () {
		document.getElementById("step5").innerHTML = `
			<h2 class="heading--64 color--627463">Thanks</h3>
            <p class="heading--14 color--4F4F4F">GRACIAS</p>
            <p class="heading--16 color--000" style="font-family: 'Poppins', serif; ">
                Thank you for confirming your attendance to our wedding. We are very happy to share this special day with you. We will send a copy of your RSVP to your email.
            </p>
            <span class="space space--10"></span>
            <p class="heading--16 color--000" style="font-family: 'Poppins', serif; ">
                Gracias por confirmar su asistencia a nuestra boda. Estamos muy contentos de compartir este día tan especial con ustedes. Le enviaremos una copia de su RSVP a su correo electrónico.
            </p>
			<button class="button button--green" onclick="backToHome()">BACK TO HOME</button>
			`;
	};

	window.closeModal = function () {
		modal.classList.remove("rsvpModal__show");
		setTimeout(resetForm, 300);
	};

	updateProgress(1);
});
