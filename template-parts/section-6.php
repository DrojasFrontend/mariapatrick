<?php 
$places = [
  [
    "en" => "HOTELS",
    "es" => "HOTELES",
    "link" => "/places/#hoteles"
  ],
  [
    "en" => "RESTAURANTS",
    "es" => "RESTAURANTES",
    "link" => "/places/#restaurantes"
  ],
  [
    "en" => "BEAUTY SALONS",
    "es" => "SALONES DE BELLEZA",
    "link" => "/places/#boutiques"
  ],
]
?>
<section class="section6">
  <div class="section6__bckg">
    <div class="container">
      <div class="section6__content">
        <div class="section6__title">
          <h2 class="heading--96 color--8F6C04">Places of Interest!</h2>
          <p class="heading--18 color--4F4F4F">¡SITIOS DE INTERÉS!</p>
        </div>

        <span class="space space--50"></span>

        <div class="section6__grid">
          <div class="section6__grid-img">
            <img class="" src="<?php echo IMG_BASE . 'img-14.png'?>" alt="">
            <div class="section6__grid-copy">
              <?php foreach ($places as $key => $place) { ?>
                <a href="<?php echo $place['link']?>">
                  <h2 class="heading--28 color--627463"><?php echo $place['en']?></h2>
                  <p class="heading--18 color--4F4F4F"><?php echo $place['es']?></p>
                </a>
              <?php } ?>
            </div>
          </div>
          <div class="section6__img">
            <img class="" src="<?php echo IMG_BASE . 'img-13.png'?>" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="box--footer">
    <p class="heading--26 color--FFF">#ElMatrickmonio</p>
  </div>
</section>