import $ from "jquery";

$(".tab-link").click(function () {
  var tabId = $(this).attr("data-tab");

  $(".tab-link").removeClass("active");
  $(".tab-content").removeClass("active");

  $(this).addClass("active");
  $("#" + tabId).addClass("active");
});

$(".accordion-link").click(function (e) {
  e.preventDefault();

  var tabId = $(this).attr("data-tab");
  var accordionContent = $("#" + tabId);

  if (accordionContent.is(":visible")) {
    accordionContent.slideUp();
    $(this).removeClass("active");
  } else {
    $(".accordion-content").slideUp();
    $(".accordion-link").removeClass("active");

    accordionContent.slideDown();
    $(this).addClass("active");
  }
});

$("[data-traslate]").on("click", function(e) {
  e.preventDefault(); 
  
  $(".text-traslate-es").toggleClass("active");
  $(".text-traslate-en").toggleClass("active");
  
  if($(this).text() == 'Leer en Español') {
    $(this).text("Read in English");
  } else {
    $(this).text("Leer en Español");
  }
  
  const targetId = $(this).attr('href') || '#scroll-top'; // Reemplaza 'tuID' con el ID al que quieres hacer scroll
  
  $('html, body').animate({
    scrollTop: $(targetId).offset().top - 100
  }, 200);
});