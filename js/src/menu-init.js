import $ from "jquery";

const $header = $("[data-header]");
const $menuMobile = $("[data-menu-mobile]");
const $botonToggleMenu = $("[data-toggle-menu]");
const $botonLink = $("[data-link]");

$(document).ready(function () {
  $botonToggleMenu.click(toggleMenu);
  $botonLink.click(closeMenu);

  $botonToggleMenu.click(function (event) {
    event.preventDefault();
  });
});

export function toggleMenu() {
  $(this).toggleClass("is-active");
  $menuMobile.toggleClass("is-active");
}

export function closeMenu() {
  $botonToggleMenu.removeClass("is-active");
  $menuMobile.removeClass("is-active");
}

$(window).scroll(function () {
  if ($(this).scrollTop() > 10) {
    $header.addClass("is-scroll");
  } else {
    $header.removeClass("is-scroll");
  }

  // $('section').each(function() {
  //   if (isScrolledIntoView($(this), $(window).height() / 4)) {
  //     $(this).addClass('animated');
  //   }
  // });

  // function isScrolledIntoView(elem, threshold) {
  //   var docViewTop = $(window).scrollTop();
  //   var docViewBottom = docViewTop + $(window).height();
  //   var elemTop = $(elem).offset().top;
  //   var elemBottom = elemTop + $(elem).height();
  //   var middleThreshold = $(window).height() / 2;
  //   return ((elemTop + threshold <= docViewBottom) && (elemBottom >= docViewTop + middleThreshold));
  // }
});

document.addEventListener('wpcf7mailsent', function(event) {
  // Muestra el modal
  var modal = document.getElementById("successModal");
  modal.style.display = "block";

  // Obtiene el elemento <span> que cierra el modal
  var span = document.getElementsByClassName("close")[0];

  // Cuando el usuario hace clic en <span> (x), cierra el modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // Cuando el usuario hace clic fuera del modal, lo cierra
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}, false);
