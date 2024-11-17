<footer id="footer">
   <!-- Modals -->
   <section class="modal" style="display: none" data-modal="modal-1">
    <div class="modal__wrapper">
      <div class="modal__body">
        <button type="button" data-close-modal>
        <?php 
            $icon_name = 'icon-close';
            get_template_part('template-parts/content', 'icono');
            display_icon($icon_name); 
        ?>
        </button>
          <img class="modal-image" src="<?php echo IMG_BASE . 'boda-dresscode-daniela-y-spencer.webp' ?>" alt="" id="" />
      </div>
    </div>
  </section>

  <section class="modal" style="display: none" data-modal="modal-2">
    <div class="modal__wrapper">
      <div class="modal__body">
        <button type="button" data-close-modal>
        <?php 
            $icon_name = 'icon-close';
            get_template_part('template-parts/content', 'icono');
            display_icon($icon_name); 
        ?>
        </button>
        <img class="modal-image" src="<?php echo IMG_BASE . 'cocktail-casual-daniela-y-spencer.webp' ?>" alt="" id="" />
      </div>
    </div>
  </section>
  <section class="modal" style="display: none" data-modal="modal-3">
    <div class="modal__wrapper">
      <div class="modal__body">
        <button type="button" data-close-modal>
        <?php 
            $icon_name = 'icon-close';
            get_template_part('template-parts/content', 'icono');
            display_icon($icon_name); 
        ?>
        </button>
        <img class="modal-image" src="<?php echo IMG_BASE . 'makani-beach-daniela-y-spencer.webp' ?>" alt="" id="" />
      </div>
    </div>
  </section>
  <section class="modal" style="display: none" data-modal="modal-4">
    <div class="modal__wrapper">
      <div class="modal__body">
        <button type="button" data-close-modal>
        <?php 
            $icon_name = 'icon-close';
            get_template_part('template-parts/content', 'icono');
            display_icon($icon_name); 
        ?>
        </button>
        <img class="modal-image" src="<?php echo IMG_BASE . 'img-3.webp' ?>" alt="" id="" />
      </div>
    </div>
  </section>
</footer>

<!-- <script>
    document.addEventListener("DOMContentLoaded", function() {
      setTimeout(function() {
          document.querySelector(".section__main").classList.add("show");
          document.querySelector(".loader").classList.add("hide");
          setTimeout(function() {
              document.querySelector(".loader").style.display = "none";
          }, 900);
      }, 1000);
    });
</script> -->

<!-- wordpress footer includes -->
<?php wp_footer(); ?>