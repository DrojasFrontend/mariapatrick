<!-- template-parts/rsvp-button.php -->
<!-- <button id="openRSVP">RSVP</button> -->

<div id="rsvpModal" class="rsvpModal">
    <div class="rsvpModal__content">

        <span class="rsvpModal__close">&times;</span>

        <div class="rsvpModal__progress">
            <div class="rsvpModal__progress-bar"></div>
        </div>
        <!-- Step 1: Search -->
        <div id="step1" class="rsvpModal__step rsvpModal__step--active">
            <h2 class="heading--64 color--627463">Maria & Patrick</h2>
            <p class="heading--14 color--4F4F4F">WEDDING RSVP</p>
            <span class="space space--30"></span>
            <p class="heading--16 color--000" style="font-family: 'Poppins', serif; ">
                Please enter below your First Name <br> and your Last Name, all in capitals.
            </p>
            <span class="space space--50 visibleDesktop"></span>
            <span class="space space--30 visibleMobile"></span>
            <label for="" class="heading--16 color--000" style="font-family: 'Poppins', serif; ">Full Name</label>
            <input type="text" id="searchInput" placeholder="Full Name">
            <div id="searchResults"></div>
        </div>

        <!-- Step 2: Wedding -->
        <div id="step2" class="rsvpModal__step">
            <h2 class="heading--64 color--627463">Wedding</h3>
            <p class="heading--14 color--4F4F4F">NUESTRO MATRIMONIO</p>
            <span class="space space--20"></span>
            <p class="heading--16 color--000" style="font-family: 'Poppins', serif; ">
            October 12th, 2025 / 12 de Octubre 2025
            Hacienda San José, Pereira - Colombia
            3:30 P.M.
            </p>
            <span class="space space--20"></span>
            <div class="guest-response">
                <p>Name Guest 1</p>
                <div>
                    <button class="button button--green--small" onclick="acceptWedding()">Accept</button>
                    <button class="button button--green--small" onclick="declineWedding()">Decline</button>
                </div>
            </div>
            <button class="button button--green" onclick="prevStep(1)">Back</button>
            <span class="space space--10"></span>
            <button class="button button--green" onclick="nextStep(3)">Continue</button>
        </div>

        <!-- Step 3: Cocktail -->
        <div id="step3" class="rsvpModal__step">
            <h2 class="heading--64 color--627463">Welcome Cocktail</h3>
            <p class="heading--14 color--4F4F4F">COCTEL DE BIENVENIDA</p>
            <span class="space space--20"></span>
            <p class="heading--16 color--000" style="font-family: 'Poppins', serif; ">
                October 11th, 2025 / 11 de Octubre 2025 <br>
                Hacienda Gavilanes <br>
                4:00 P.M.
            </p>
            <span class="space space--30"></span>
            <div class="guest-response">
                <p>Name Guest 1</p>
                <div>
                    <button class="button button--green--small" onclick="acceptCocktail()">Accept</button>
                    <button class="button button--green--small" onclick="declineCocktail()">Decline</button>
                </div>
            </div>
            <button class="button button--green" onclick="prevStep(2)">Back</button>
            <span class="space space--10"></span>
            <button class="button button--green" onclick="nextStep(4)">Continue</button>
        </div>

        <!-- Step 4: Additional Info -->
        <div id="step4" class="rsvpModal__step">
            <h2 class="heading--64 color--627463">Additional Info</h3>
            <p class="heading--14 color--4F4F4F">INFORMACIÓN ADICIONAL</p>
            <span class="space space--20"></span>
            <label for="" class="heading--16 color--000" style="font-family: 'Poppins', serif; ">Phone / Teléfono</label>
            <input type="text" id="phone">
            <span class="space space--10"></span>
            <label for="" class="heading--16 color--000" style="font-family: 'Poppins', serif; ">Email address (Correo Electrónico)</label>
            <span class="space space--10"></span>
            <input type="email" id="email">
            <label for="" class="heading--16 color--000" style="font-family: 'Poppins', serif; ">Tell us if you have any food allergies or restrictions. <br> Dinos si tienes alguna alergia o restricción alimentaria.</label>
            <textarea id="restrictions"></textarea>
            <span class="space space--10"></span>
            <button class="button button--green" onclick="prevStep(3)">Back</button>
            <span class="space space--10"></span>
            <button class="button button--green" onclick="submitRSVP()">R.S.V.P.</button>
        </div>

        <!-- Step 5: Thanks -->
        <div id="step5" class="rsvpModal__step">
            <h2 class="heading--64 color--627463">Thanks</h3>
            <p class="heading--14 color--4F4F4F">GRACIAS</p>
            <p class="heading--16 color--000" style="font-family: 'Poppins', serif; ">
                Thank you for confirming your attendance to our wedding. We are very happy to share this special day with you. We will send a copy of your RSVP to your email.
            </p>
            <span class="space space--10"></span>
            <p class="heading--16 color--000" style="font-family: 'Poppins', serif; ">
            Gracias por confirmar tu asistencia a nuestro matrimonio. Estamos muy contentos de compartir este día tan especial con ustedes.
            Te enviaremos una copia del RSVP a tu correo electrónico.
            </p>

            <button class="button button--green" onclick="backToHome()">BACK TO HOME</button>
        </div>
    </div>
</div>