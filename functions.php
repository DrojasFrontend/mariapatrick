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
        $subject_admin = 'New RSVP Confirmation - ' . $rsvp_data['name'];
        $message_admin = "
        <html>
        <body style='font-family: Arial, sans-serif;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #333;'>New RSVP Confirmation</h2>
                <div style='background: #f5f5f5; padding: 20px; border-radius: 5px;'>
                    <p><strong>Guest:</strong> {$rsvp_data['name']}</p>
                    <p><strong>Wedding:</strong> " . ($rsvp_data['wedding'] ? 'Confirmed' : 'Declined') . "</p>
                    <p><strong>Welcome Cocktail:</strong> " . ($rsvp_data['cocktail'] ? 'Confirmed' : 'Declined') . "</p>
                    <p><strong>Phone:</strong> {$rsvp_data['phone']}</p>
                    <p><strong>Email:</strong> {$rsvp_data['email']}</p>
                    <p><strong>Restrictions:</strong> {$rsvp_data['restrictions']}</p>
                </div>
            </div>
        </body>
        </html>";

        // Email for guest
        $subject_guest = 'RSVP Confirmation - Maria & Patrick Wedding';
        $message_guest = "
        <html>
        <body style='font-family: Arial, sans-serif;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #333; text-align: center;'>Thank you for confirming your attendance</h2>
                <div style='background: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center;'>
                    <p>Dear {$rsvp_data['name']},</p>
                    <p>We have received your confirmation for our wedding. We are very happy to share this special day with you.</p>
                    <div style='margin: 20px 0; padding: 15px; background: #fff; border-radius: 5px;'>
                        <h3 style='color: #666;'>Your confirmation details:</h3>
                        " . ($rsvp_data['wedding'] ? "
                        <p><strong>Wedding</strong><br>
                        October 12th, 2025<br>
                        3:30 P.M.<br>
                        Hacienda San José, Pereira - Colombia</p>" : "") . "
                        " . ($rsvp_data['cocktail'] ? "
                        <p><strong>Welcome Cocktail</strong><br>
                        October 11th, 2025<br>
                        4:00 P.M.<br>
                        Hacienda Gavilanes</p>" : "") . "
                    </div>
                    <p>We will send you more details soon.</p>
                    <p style='margin-top: 30px;'>Best regards,<br>Maria & Patrick</p>
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

// Permitir subida de archivos SVG
function permitir_svg($mimes) {
    $mimes['svg'] = 'image/svg+xml';
    $mimes['svgz'] = 'image/svg+xml';
    return $mimes;
}
add_filter('upload_mimes', 'permitir_svg');

// Corregir el tipo MIME para SVG
function corregir_mime_svg($data, $file, $filename, $mimes) {
    $ext = isset($data['ext']) ? $data['ext'] : '';
    if ($ext === 'svg') {
        $data['type'] = 'image/svg+xml';
        $data['ext'] = 'svg';
    } elseif ($ext === 'svgz') {
        $data['type'] = 'image/svg+xml';
        $data['ext'] = 'svgz';
    }
    return $data;
}
add_filter('wp_check_filetype_and_ext', 'corregir_mime_svg', 10, 4);

// Mostrar vista previa de SVG en el Media Library
function mostrar_svg_media_library() {
    echo '
    <style>
        .attachment-266x266, .thumbnail img {
            width: 100% !important;
            height: auto !important;
        }
    </style>';
}
add_action('admin_head', 'mostrar_svg_media_library');