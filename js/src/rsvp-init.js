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

	// Abrir modal
	document.getElementById("openRSVP").addEventListener("click", function () {
		modal.style.display = "block";
	});

	// Búsqueda
	searchInput.addEventListener("keyup", function (e) {
		const search = e.target.value.toLowerCase();
		const filtered = invitados.filter((inv) =>
			inv.nombre.toLowerCase().includes(search)
		);

		searchResults.innerHTML = filtered
			.map(
				(inv) =>
					`<div onclick="selectInvitado('${inv.nombre}', ${inv.eventos})">${inv.nombre}</div>`
			)
			.join("");
	});

	// Función global para seleccionar invitado
	window.selectInvitado = function (nombre, eventos) {
		formData.name = nombre;
		showStep(2);
		const eventsList = document.getElementById("eventsList");
		eventsList.innerHTML = `
					<div>
							<h3>Wedding</h3>
							<p>NUESTRO MATRIMONIO</p>
							<p>October 12th, 2025 / 12 de Octubre 2025</p>
							<p>Hacienda San José, Pareira - Colombia</p>
							<p>5:30 P.M.</p>
							<div class="guest-response">
									<p>${nombre}</p>
									<button onclick="acceptWedding()">Accept</button>
									<button onclick="declineWedding()">Decline</button>
							</div>
							${
								eventos === 2
									? '<button onclick="nextStep(3)">Continue to Cocktail</button>'
									: ""
							}
							<button onclick="prevStep(1)">Back</button>
					</div>
			`;
	};

	window.acceptWedding = function () {
		formData.wedding = true;
		const responseDiv = document.querySelector(".guest-response");
		responseDiv.innerHTML = `
        <p>${formData.name}</p>
        <button class="selected" onclick="acceptWedding()">Accept</button>
        <button onclick="declineWedding()">Decline</button>
    `;
	};

	window.declineWedding = function () {
		formData.wedding = false;
		const responseDiv = document.querySelector(".guest-response");
		responseDiv.innerHTML = `
			<p>${formData.name}</p>
			<button onclick="acceptWedding()">Accept</button>
			<button class="selected" onclick="declineWedding()">Decline</button>
	`;
	};

	window.showCocktail = function () {
		const cocktailHtml = `
					<h3>Welcome Cocktail</h3>
					<p>COCTEL DE BIENVENIDA</p>
					<p>October 11th, 2025 / 11 de Octubre 2025</p>
					<p>Hacienda San Jorge, Pereira - Colombia</p>
					<p>5:00 P.M.</p>
					<div class="guest-response-cocktail">
							<p>${formData.name}</p>
							<button onclick="acceptCocktail()">Accept</button>
							<button onclick="declineCocktail()">Decline</button>
					</div>
					<button onclick="prevStep(2)">Back</button>
					<button onclick="nextStep(4)">Continue</button>
			`;
		document.getElementById("step3").innerHTML = cocktailHtml;
	};

	window.acceptCocktail = function () {
		formData.cocktail = true;
		const responseDiv = document.querySelector(".guest-response-cocktail");
		responseDiv.innerHTML = `
        <p>${formData.name}</p>
        <button class="selected" onclick="acceptCocktail()">Accept</button>
        <button onclick="declineCocktail()">Decline</button>
    `;
	};

	window.declineCocktail = function () {
		formData.cocktail = false;
		const responseDiv = document.querySelector(".guest-response-cocktail");
		responseDiv.innerHTML = `
        <p>${formData.name}</p>
        <button onclick="acceptCocktail()">Accept</button>
        <button class="selected" onclick="declineCocktail()">Decline</button>
    `;
	};

	// Función global para mostrar pasos
	window.showStep = function (step) {
		document
			.querySelectorAll(".step")
			.forEach((s) => s.classList.remove("active"));
		document.getElementById(`step${step}`).classList.add("active");
		if (step === 3) showCocktail();
		if (step === 4) showAdditionalInfo();
	};

	window.showAdditionalInfo = function () {
		const additionalHtml = `
					<h3>Additional Info</h3>
					<p>INFORMACIÓN ADICIONAL</p>
					<input type="text" id="phone" placeholder="Phone / Teléfono">
					<input type="email" id="email" placeholder="Email address (Correo Electrónico)">
					<textarea id="restrictions" placeholder="Tell us if you have any food allergies or restrictions. Dinos si tienes alguna alergia o restricción alimentaria."></textarea>
					<button onclick="prevStep(3)">Back</button>
					<button onclick="submitRSVP()">R.S.V.P.</button>
			`;
		document.getElementById("step4").innerHTML = additionalHtml;
	};

	// Función global para anterior paso
	window.prevStep = function (step) {
		showStep(step);
	};

	// Función global para siguiente paso
	window.nextStep = function (step) {
		showStep(step);
	};

	window.showThanks = function () {
		const thanksHtml = `
					<h3>Thanks</h3>
					<p>GRACIAS</p>
					<p>Thank you for confirming your attendance to our wedding. We are very happy to share this special day with you. We will send a copy of your RSVP to your email.</p>
					<p>Gracias por confirmar su asistencia a nuestra boda. Estamos muy contentos de compartir este día tan especial con ustedes. Le enviaremos una copia de su RSVP a su correo electrónico.</p>
					<button onclick="backToHome()">BACK TO HOME</button>
			`;
		document.getElementById("step5").innerHTML = thanksHtml;
	};

	window.backToHome = function () {
		window.location.href = "/";
	};

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
						`Hubo un error al enviar tu confirmación. Por favor intenta de nuevo. Error: ${error.message}`
					);
				});
		};

		// Verificar si estamos en modo local
		if (wpData.isLocal) {
			console.log("Modo local: saltando reCAPTCHA");
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
							`Hubo un error al enviar tu confirmación. Por favor intenta de nuevo. Error: ${error.message}`
						);
					});
			});
		}
	};
});
