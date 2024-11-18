<!-- template-parts/rsvp-button.php -->
<button id="openRSVP">RSVP</button>

<div id="rsvpModal" class="rsvpModal">
    <div class="rsvpModal-content">

        <span class="rsvpModal__close">&times;</span>

        <div class="rsvpModal__progress">
            <div class="rsvpModal__progress-bar"></div>
        </div>
        <!-- Step 1: Search -->
        <div id="step1" class="rsvpModal__step rsvpModal__step--active">
            <h3>Maria & Patrick</h3>
            <p>WEDDING RSVP</p>
            <p>Please enter below your First Name and your Last Name, all in capitals.</p>
            <input type="text" id="searchInput" placeholder="Full Name">
            <div id="searchResults"></div>
        </div>

        <!-- Step 2: Wedding -->
        <div id="step2" class="rsvpModal__step">
            <h3>Wedding</h3>
            <p>NUESTRO MATRIMONIO</p>
            <p>October 12th, 2025 / 12 de Octubre 2025</p>
            <p>Hacienda San José, Pareira - Colombia</p>
            <p>5:30 P.M.</p>
            <div class="guest-response">
                <p>Name Guest 1</p>
                <button onclick="acceptWedding()">Accept</button>
                <button onclick="declineWedding()">Decline</button>
            </div>
            <button onclick="prevStep(1)">Back</button>
            <button onclick="nextStep(3)">Continue</button>
        </div>

        <!-- Step 3: Cocktail -->
        <div id="step3" class="rsvpModal__step">
            <h3>Welcome Cocktail</h3>
            <p>COCTEL DE BIENVENIDA</p>
            <p>October 11th, 2025 / 11 de Octubre 2025</p>
            <p>Hacienda San Jorge, Pereira - Colombia</p>
            <p>5:00 P.M.</p>
            <div class="guest-response">
                <p>Name Guest 1</p>
                <button onclick="acceptCocktail()">Accept</button>
                <button onclick="declineCocktail()">Decline</button>
            </div>
            <button onclick="prevStep(2)">Back</button>
            <button onclick="nextStep(4)">Continue</button>
        </div>

        <!-- Step 4: Additional Info -->
        <div id="step4" class="rsvpModal__step">
            <h3>Additional Info</h3>
            <p>INFORMACIÓN ADICIONAL</p>
            <input type="text" id="phone" placeholder="Phone / Teléfono">
            <input type="email" id="email" placeholder="Email address (Correo Electrónico)">
            <textarea id="restrictions" placeholder="Tell us if you have any food allergies or restrictions. Dinos si tienes alguna alergia o restricción alimentaria."></textarea>
            <button onclick="prevStep(3)">Back</button>
            <button onclick="submitRSVP()">R.S.V.P.</button>
        </div>

        <!-- Step 5: Thanks -->
        <div id="step5" class="rsvpModal__step">
            <h3>Thanks</h3>
            <p>GRACIAS</p>
            <p>Thank you for confirming your attendance to our wedding. We are very happy to share this special day with you. We will send a copy of your RSVP to your email.</p>
            <p>Gracias por confirmar su asistencia a nuestra boda. Estamos muy contentos de compartir este día tan especial con ustedes. Le enviaremos una copia de su RSVP a su correo electrónico.</p>
            <button class="rsvpModal__button" onclick="backToHome()">BACK TO HOME</button>
        </div>
    </div>
</div>