document.addEventListener("DOMContentLoaded", function () {
	// =========================================
	// Configuración inicial y variables globales
	// =========================================
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
		numEvents: 0,
	};

	// Detectar tipo de dispositivo para eventos
	const userAgent = navigator.userAgent.toLowerCase();
	const eventType = userAgent.match(/(iphone|ipod|ipad)/)
		? "touchstart"
		: "click";

	// Elementos del DOM
	const searchInput = document.getElementById("searchInput");
	const searchResults = document.getElementById("searchResults");
	const modal = document.getElementById("rsvpModal");
	const progressBar = document.querySelector(".rsvpModal__progress-bar");
	const totalSteps = 5;

	// =========================================
	// Funciones de utilidad
	// =========================================
	function updateProgress(currentStep) {
		const progressPercentage = (currentStep / totalSteps) * 100;
		progressBar.style.width = `${progressPercentage}%`;
	}

	function resetForm() {
		formData.name = "";
		formData.wedding = null;
		formData.cocktail = null;
		formData.phone = "";
		formData.email = "";
		formData.restrictions = "";
		formData.numEvents = 0;

		searchInput.value = "";
		searchResults.innerHTML = "";
		showStep(1);
	}

	function updateButtonStyles(button, isAccept, containerClass) {
		const container = document.querySelector(containerClass);
		const buttons = container.querySelectorAll(".button--green--small");

		buttons.forEach((btn) => {
			btn.classList.remove("selected");
		});

		button.classList.add("selected");

		if (containerClass.includes("cocktail")) {
			formData.cocktail = isAccept;
		} else {
			formData.wedding = isAccept;
		}
	}

	// =========================================
	// Funciones de creación de componentes
	// =========================================
	function createResponseButtons(containerClass, name) {
		const html = `
					<div class="guest-response${
						containerClass.includes("cocktail") ? "-cocktail" : ""
					}">
							<p>${name}</p>
							<div>
									<button class="button button--green--small" data-action="accept">Accept</button>
									<button class="button button--green--small" data-action="decline">Decline</button>
							</div>
					</div>
			`;

		const container = document.querySelector(containerClass);
		container.innerHTML = html;

		const buttons = container.querySelectorAll(".button--green--small");
		buttons.forEach((button) => {
			button.addEventListener(
				eventType,
				function (e) {
					e.preventDefault();
					const isAccept = this.getAttribute("data-action") === "accept";
					updateButtonStyles(this, isAccept, containerClass);
				},
				{ passive: false }
			);
		});
	}

	// =========================================
	// Funciones de navegación y pasos
	// =========================================
	window.showStep = function (step) {
		document.querySelectorAll(".rsvpModal__step").forEach((s) => {
			s.classList.remove("rsvpModal__step--active");
		});

		if (step === 3 && formData.numEvents === 1) {
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

		switch (step) {
			case 2:
				stepElement.innerHTML = `
        <h2 class="heading--64 color--627463">Wedding</h2>
        <p class="heading--14 color--4F4F4F">NUESTRO MATRIMONIO</p>
        <span class="space space--30"></span>
        <p class="heading--16 color--000" style="font-family: 'Poppins', serif; ">
            October 12th, 2025 / 12 de Octubre 2025 <br>
            Hacienda San José, Pereira - Colombia <br>
            3:30 P.M.
        </p>
        <span class="space space--20"></span>
        <div class="wedding-response"></div>
        <div class="navigation-buttons">
            <button class="button button--green" data-nav="back">Back</button>
            <button class="button button--green" data-nav="continue">Continue</button>
        </div>
    `;

				createResponseButtons(".wedding-response", formData.name);
				// Llamamos a la función de manera correcta
				addNavigationListeners(
					stepElement,
					1,
					formData.numEvents === 2 ? 3 : 4
				);
				break;

				createResponseButtons(".wedding-response", formData.name);
				addNavigationListeners(
					stepElement,
					1,
					formData.numEvents === 2 ? 3 : 4
				);
				break;

			case 3:
				if (formData.numEvents === 2) {
					stepElement.innerHTML = `
											<h2 class="heading--64 color--627463">Welcome Cocktail</h2>
											<p class="heading--14 color--4F4F4F">COCTEL DE BIENVENIDA</p>
											<span class="space space--20"></span>
											<p class="heading--16 color--000" style="font-family: 'Poppins', serif; ">
													October 11th, 2025 / 11 de Octubre 2025 <br>
													Hacienda Gavilanes, Pereira - Colombia <br>
													4:00 P.M.
											</p>
											<span class="space space--20"></span>
											<div class="cocktail-response"></div>
											<div class="navigation-buttons">
													<button class="button button--green" data-nav="back">Back</button>
													<button class="button button--green" data-nav="continue">Continue</button>
											</div>
									`;

					createResponseButtons(".cocktail-response", formData.name);
					addNavigationListeners(stepElement, 2, 4);
				}
				break;

			case 4:
				showAdditionalInfo();
				break;

			case 5:
				showThanks();
				break;
		}
	};

	function addNavigationListeners(element, backStep, nextStep) {
		const navButtons = element.querySelectorAll("[data-nav]");
		navButtons.forEach((button) => {
			button.addEventListener(eventType, function (e) {
				e.preventDefault();
				const action = this.getAttribute("data-nav");
				if (action === "back") {
					prevStep(backStep);
				} else {
					nextStep(nextStep);
				}
			});
		});
	}

	window.nextStep = function (step) {
		if (formData.numEvents === 1 && step === 3) {
			showStep(4);
		} else {
			showStep(step);
		}
	};

	// Función para ir al paso anterior
	window.prevStep = function (step) {
		if (step === 3 && formData.numEvents === 1) {
			showStep(2);
		} else {
			showStep(step);
		}
	};

	// =========================================
	// Funciones de búsqueda y selección
	// =========================================
	searchInput.addEventListener("keyup", function (e) {
		const search = e.target.value.toLowerCase();
		const filtered = invitados.filter((inv) =>
			inv.nombre.toLowerCase().includes(search)
		);

		searchResults.innerHTML = filtered
			.map(
				(inv) => `
							<div class="rsvpModal__result" onclick="selectInvitado('${inv.nombre}', ${inv.eventos})">
									${inv.nombre}
							</div>
					`
			)
			.join("");
	});

	window.selectInvitado = function (nombre, eventos) {
		formData.name = nombre;
		formData.numEvents = eventos;
		formData.wedding = null;
		formData.cocktail = null;
		showStep(2);
	};

	// =========================================
	// Funciones de envío y finalización
	// =========================================
	window.submitRSVP = function () {
		const submitButton = document.querySelector(
			'button[onclick="submitRSVP()"]'
		);
		const originalText = submitButton.innerHTML;
		let dots = "";
		let loadingInterval;

		function updateLoadingText() {
			dots = dots.length >= 3 ? "" : dots + ".";
			submitButton.innerHTML = `Sending${dots}`;
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

			fetch(wpData.ajaxurl, {
				method: "POST",
				body: formDataToSend,
			})
				.then((response) => response.json())
				.then((data) => {
					stopLoading();
					if (data.success) {
						showStep(5);
					} else {
						throw new Error(data.data || "Error al enviar el formulario");
					}
				})
				.catch((error) => {
					stopLoading();
					console.error("Error:", error);
					// alert(
					// 	`Hubo un error al enviar tu confirmación. Por favor intenta de nuevo.`
					// );
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
						} else {
							throw new Error(data.data || "Error en la verificación");
						}
					})
					.catch((error) => {
						stopLoading();
						console.error("Error:", error);
						// alert(
						// 	`Hubo un error al enviar tu confirmación. Por favor intenta de nuevo.`
						// );
					});
			});
		}
	};

	function addNavigationListeners(element, backStep, nextStep) {
		const navButtons = element.querySelectorAll("[data-nav]");
		navButtons.forEach((button) => {
			button.addEventListener(eventType, function (e) {
				e.preventDefault();
				const action = this.getAttribute("data-nav");
				if (action === "back") {
					window.prevStep(backStep);
				} else {
					window.nextStep(nextStep);
				}
			});
		});
	}

	// =========================================
	// Event Listeners iniciales
	// =========================================
	document.getElementById("openRSVP").addEventListener(eventType, function () {
		modal.classList.add("rsvpModal__show");
		updateProgress(1);
	});

	const closeBtn = document.querySelector(".rsvpModal__close");
	closeBtn.addEventListener(eventType, function () {
		modal.classList.remove("rsvpModal__show");
		setTimeout(resetForm, 300);
	});

	window.addEventListener(eventType, function (e) {
		if (e.target === modal) {
			modal.classList.remove("rsvpModal__show");
			setTimeout(resetForm, 300);
		}
	});

	// =========================================
	// Estilos
	// =========================================
	const style = document.createElement("style");
	style.textContent = `
			.button--green--small.selected {
					background-color: #627463 !important;
					color: white !important;
					-webkit-appearance: none;
					-webkit-tap-highlight-color: transparent;
					transform: scale(0.98);
					transition: transform 0.1s ease;
			}
			
			.button--green--small {
					-webkit-touch-callout: none;
					-webkit-user-select: none;
					user-select: none;
					cursor: pointer;
					transition: transform 0.1s ease;
			}
			
			.button--green--small:active {
					transform: scale(0.95);
			}
	`;
	document.head.appendChild(style);

	// Inicialización
	updateProgress(1);
});
