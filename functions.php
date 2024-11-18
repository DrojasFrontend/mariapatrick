<?php
define('URL_BASE', get_stylesheet_directory_uri() . '/');
define('IMG_BASE', URL_BASE . 'img/');

// Configuración SMTP para WordPress
add_action('phpmailer_init', 'configurar_smtp');
function configurar_smtp($phpmailer) {
    $phpmailer->isSMTP();
    $phpmailer->Host = 'smtp.hostinger.com';
    $phpmailer->SMTPAuth = true;
    $phpmailer->Port = 465;
    $phpmailer->Username = 'rsvp@mariaypatrick.com';
    $phpmailer->Password = 'x6?XNnYsO';
    $phpmailer->SMTPSecure = 'ssl';
    $phpmailer->From = 'rsvp@mariaypatrick.com';
    $phpmailer->FromName = 'Maria & Patrick Wedding';
}

// Agregar logging para debuggear emails
if (!function_exists('log_mailer_errors')) {
    function log_mailer_errors($wp_error) {
        $file = fopen(ABSPATH . '/wp-content/mail-errors.log', 'a');
        fputs($file, "Mailer Error: " . $wp_error->get_error_message() ."\n");
        fclose($file);
    }
    add_action('wp_mail_failed', 'log_mailer_errors', 10, 1);
}

function enqueue_webpack_scripts() {
    $cssFilePath = glob( get_template_directory() . '/css/build/main.min.*.css' );
    $cssFileURI = get_template_directory_uri() . '/css/build/' . basename($cssFilePath[0]);
    wp_enqueue_style( 'main_css', $cssFileURI );

    $jsFilePath = glob( get_template_directory() . '/js/build/main.min.*.js' );
    $jsFileURI = get_template_directory_uri() . '/js/build/' . basename($jsFilePath[0]);
    wp_enqueue_script( 'main_js', $jsFileURI , null , null , true );

    wp_localize_script('main_js', 'wpData', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('rsvp_nonce')
    ));
}
add_action( 'wp_enqueue_scripts', 'enqueue_webpack_scripts' );

// Agregar scripts necesarios
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_script('invitados-data', get_template_directory_uri() . '/data/invitados.js', [], '1.0', true);
    wp_enqueue_script('recaptcha', 'https://www.google.com/recaptcha/api.js?render=6Lc3xoEqAAAAAAkqDAnEarsqXf-6HKCC2G4jogWh', [], null, true);
});

// RSVP Email Handler
add_action('wp_ajax_send_rsvp_email', 'send_rsvp_email');
add_action('wp_ajax_nopriv_send_rsvp_email', 'send_rsvp_email');

function send_rsvp_email() {
    try {
        // Verificar nonce
        check_ajax_referer('rsvp_nonce', 'nonce');

        if (!isset($_POST['rsvp_data']) || !isset($_POST['recaptcha_response'])) {
            wp_send_json_error('Missing required data');
            return;
        }

        // Verificar reCAPTCHA
        $recaptcha_verify = wp_remote_post('https://www.google.com/recaptcha/api/siteverify', [
            'body' => [
                'secret' => '6Lc3xoEqAAAAAKWyBlu1e3kRLsdpE21JQwDtY5am',
                'response' => sanitize_text_field($_POST['recaptcha_response'])
            ]
        ]);

        $verify_response = json_decode(wp_remote_retrieve_body($recaptcha_verify));
        
        if (is_wp_error($recaptcha_verify) || !$verify_response || !$verify_response->success) {
            wp_send_json_error('reCAPTCHA verification failed');
            return;
        }

        $rsvp_data = json_decode(stripslashes($_POST['rsvp_data']), true);

        // Configuración del correo
        $to_admin = 'rsvp@mariaypatrick.com';
        $headers = array(
            'Content-Type: text/html; charset=UTF-8',
            'From: Maria & Patrick Wedding <rsvp@mariaypatrick.com>'
        );

        // Email para admin
        $subject_admin = 'Nueva confirmación RSVP - ' . $rsvp_data['name'];
        $message_admin = "
        <html>
        <body style='font-family: Arial, sans-serif;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #333;'>Nueva Confirmación RSVP</h2>
                <div style='background: #f5f5f5; padding: 20px; border-radius: 5px;'>
                    <p><strong>Invitado:</strong> {$rsvp_data['name']}</p>
                    <p><strong>Wedding:</strong> " . ($rsvp_data['wedding'] ? 'Confirmado' : 'Declinado') . "</p>
                    <p><strong>Welcome Cocktail:</strong> " . ($rsvp_data['cocktail'] ? 'Confirmado' : 'Declinado') . "</p>
                    <p><strong>Teléfono:</strong> {$rsvp_data['phone']}</p>
                    <p><strong>Email:</strong> {$rsvp_data['email']}</p>
                    <p><strong>Restricciones:</strong> {$rsvp_data['restrictions']}</p>
                </div>
            </div>
        </body>
        </html>";

        // Email para el invitado
        $subject_guest = 'Confirmación de tu RSVP - Maria & Patrick Wedding';
        $message_guest = "
        <html>
        <body style='font-family: Arial, sans-serif;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #333; text-align: center;'>Gracias por confirmar tu asistencia</h2>
                <div style='background: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center;'>
                    <p>Querido/a {$rsvp_data['name']},</p>
                    <p>Hemos recibido tu confirmación para nuestra boda. Estamos muy felices de compartir este día tan especial contigo.</p>
                    <div style='margin: 20px 0; padding: 15px; background: #fff; border-radius: 5px;'>
                        <h3 style='color: #666;'>Detalles de tu confirmación:</h3>
                        " . ($rsvp_data['wedding'] ? "
                        <p><strong>Wedding</strong><br>
                        12 de Octubre 2025<br>
                        5:30 P.M.<br>
                        Hacienda San José, Pareira - Colombia</p>" : "") . "
                        " . ($rsvp_data['cocktail'] ? "
                        <p><strong>Welcome Cocktail</strong><br>
                        11 de Octubre 2025<br>
                        5:00 P.M.<br>
                        Hacienda San Jorge, Pereira - Colombia</p>" : "") . "
                    </div>
                    <p>Te enviaremos más detalles próximamente.</p>
                    <p style='margin-top: 30px;'>Con cariño,<br>Maria & Patrick</p>
                </div>
            </div>
        </body>
        </html>";

        // Enviar emails
        $admin_sent = wp_mail($to_admin, $subject_admin, $message_admin, $headers);
        $guest_sent = wp_mail($rsvp_data['email'], $subject_guest, $message_guest, $headers);

        if ($admin_sent && $guest_sent) {
            wp_send_json_success('Confirmación enviada correctamente');
        } else {
            wp_send_json_error('Error al enviar los emails');
        }

    } catch (Exception $e) {
        wp_send_json_error($e->getMessage());
    }
    wp_die();
}

// Rest of your theme functions...
add_action('after_setup_theme', 'my_theme_setup');
function my_theme_setup() {
    add_theme_support('custom-logo', array(
        'height' => 48,
        'width' => 426,
        'flex-height' => true,
        'flex-width' => true,
    ));
}