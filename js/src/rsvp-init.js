// js/src/rsvp-init.js
document.addEventListener("DOMContentLoaded", function () {
	const formData = {
		name: "",
		wedding: false,
		cocktail: false,
		phone: "",
		email: "",
		restrictions: "",
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

	// Abrir modal
	document.getElementById("openRSVP").addEventListener("click", function () {
		modal.classList.add("rsvpModal__show");
		updateProgress(1);
	});

	// Cerrar modal
	const closeBtn = document.querySelector(".rsvpModal__close");
	closeBtn.addEventListener("click", function () {
		modal.classList.remove("rsvpModal__show");
		setTimeout(resetForm, 300);
	});

	// Click fuera para cerrar
	window.addEventListener("click", function (e) {
		if (e.target === modal) {
			modal.classList.remove("rsvpModal__show");
			setTimeout(resetForm, 300);
		}
	});

	function resetForm() {
		formData.name = "";
		formData.wedding = false;
		formData.cocktail = false;
		formData.phone = "";
		formData.email = "";
		formData.restrictions = "";

		searchInput.value = "";
		searchResults.innerHTML = "";
		showStep(1);
	}

	// Búsqueda
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
		showStep(2);
		const eventsList = document.getElementById("eventsList");
		eventsList.innerHTML = `
        <div class="rsvpModal__event-content">
            <h3>Wedding</h3>
            <p>NUESTRO MATRIMONIO</p>
            <p>October 12th, 2025 / 12 de Octubre 2025</p>
            <p>Hacienda San José, Pareira - Colombia</p>
            <p>5:30 P.M.</p>
            <div class="guest-response">
                <p>${nombre}</p>
                <button class="rsvpModal__button" onclick="acceptWedding()">Accept</button>
                <button class="rsvpModal__button" onclick="declineWedding()">Decline</button>
            </div>
            ${
							eventos === 2
								? '<button class="rsvpModal__button" onclick="nextStep(3)">Continue to Cocktail</button>'
								: ""
						}
            <button class="rsvpModal__button" onclick="prevStep(1)">Back</button>
        </div>
    `;
	};

	// Funciones de Wedding
	window.acceptWedding = function () {
		formData.wedding = true;
		updateResponse("guest-response", true);
	};

	window.declineWedding = function () {
		formData.wedding = false;
		updateResponse("guest-response", false);
	};

	// Funciones de Cocktail
	window.showCocktail = function () {
		const cocktailHtml = `
					<h3>Welcome Cocktail</h3>
					<p>COCTEL DE BIENVENIDA</p>
					<p>October 11th, 2025 / 11 de Octubre 2025</p>
					<p>Hacienda San Jorge, Pereira - Colombia</p>
					<p>5:00 P.M.</p>
					<div class="guest-response-cocktail">
							<p>${formData.name}</p>
							<button class="rsvp-button" onclick="acceptCocktail()">Accept</button>
							<button class="rsvp-button" onclick="declineCocktail()">Decline</button>
					</div>
					<button class="rsvp-button" onclick="prevStep(2)">Back</button>
					<button class="rsvp-button" onclick="nextStep(4)">Continue</button>
			`;
		document.getElementById("step3").innerHTML = cocktailHtml;
	};

	window.acceptCocktail = function () {
		formData.cocktail = true;
		updateResponse("guest-response-cocktail", true);
	};

	window.declineCocktail = function () {
		formData.cocktail = false;
		updateResponse("guest-response-cocktail", false);
	};

	function updateResponse(className, accepted) {
		const responseDiv = document.querySelector(`.${className}`);
		const buttons = responseDiv.querySelectorAll(".rsvpModal__button");
		buttons.forEach((button) => button.classList.remove("selected"));
		buttons[accepted ? 0 : 1].classList.add("selected");
	}

	// Navegación entre pasos
	window.showStep = function (step) {
		document.querySelectorAll(".rsvpModal__step").forEach((s) => {
			s.classList.remove("rsvpModal__step--active");
		});
		document
			.getElementById(`step${step}`)
			.classList.add("rsvpModal__step--active");
		updateProgress(step);

		if (step === 3) showCocktail();
		if (step === 4) showAdditionalInfo();
	};

	window.prevStep = function (step) {
		showStep(step);
	};

	window.nextStep = function (step) {
		showStep(step);
	};

	// Info Adicional
	window.showAdditionalInfo = function () {
		document.getElementById("step4").innerHTML = `
					<h3>Additional Info</h3>
					<p>INFORMACIÓN ADICIONAL</p>
					<input type="text" id="phone" placeholder="Phone / Teléfono">
					<input type="email" id="email" placeholder="Email address (Correo Electrónico)">
					<textarea id="restrictions" placeholder="Tell us if you have any food allergies or restrictions..."></textarea>
					<button class="rsvp-button" onclick="prevStep(3)">Back</button>
					<button class="rsvp-button" onclick="submitRSVP()">R.S.V.P.</button>
			`;
	};

	// Submit y Thanks
	window.submitRSVP = function () {
		formData.phone = document.getElementById("phone").value;
		formData.email = document.getElementById("email").value;
		formData.restrictions = document.getElementById("restrictions").value;

		if (!formData.email || !formData.phone) {
			alert("Por favor completa todos los campos requeridos");
			return;
		}

		const submitData = () => {
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
					if (data.success) {
						showStep(5);
						showThanks();
					} else {
						throw new Error(data.data || "Error al enviar el formulario");
					}
				})
				.catch((error) => {
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
						if (data.success) {
							showStep(5);
							showThanks();
						} else {
							throw new Error(data.data || "Error en la verificación");
						}
					})
					.catch((error) => {
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
					<h3>Thanks</h3>
					<p>GRACIAS</p>
					<p>Thank you for confirming your attendance to our wedding. We are very happy to share this special day with you.</p>
					<p>Gracias por confirmar su asistencia a nuestra boda. Estamos muy contentos de compartir este día tan especial contigo.</p>
					<button class="rsvp-button" onclick="closeModal()">Close</button>
			`;
	};

	window.closeModal = function () {
		modal.classList.remove("rsvpModal__show");
		setTimeout(resetForm, 300);
	};

	// Inicializar
	updateProgress(1);
});
