document.addEventListener('DOMContentLoaded', () => {

  /* ---------- NAVIGATION (надежная, проверенная) ---------- */
  const links = document.querySelectorAll('.nav-link');
  const pages = document.querySelectorAll('.page');

  // на старте показываем только первую страницу (about)
  pages.forEach((p, idx) => { if (idx !== 0) p.classList.add('hidden'); });

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.dataset.page;

      // active state for nav
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

        // Показываем нужную страницу
      pages.forEach(p => p.classList.add('hidden'));
      const targetPage = document.getElementById(targetId);
      if (targetPage) targetPage.classList.remove('hidden');

      // Специальные случаи — прокрутка и возврат
      if (targetId === 'contacts') {
        const about = document.getElementById('about');
        about.classList.remove('hidden');
        setTimeout(() => {
          const contactEl = document.querySelector('.contacts');
          if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
        }, 40);
        return;
      }

      if (targetId === 'about') {
        const about = document.getElementById('about');
        about.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (targetId === 'portfolio') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });



  /* ---------- GALLERY + LIGHTBOX (delegation) ---------- */
  const gallery = document.querySelector('.gallery');

  // lightbox DOM
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <span class="lb-close">&times;</span>
    <span class="lb-arrow left">&#10094;</span>
    <img class="lb-img" src="" alt="expanded">
    <span class="lb-arrow right">&#10095;</span>
  `;
  document.body.appendChild(lb);

  const lbImg = lb.querySelector('.lb-img');
  const lbClose = lb.querySelector('.lb-close');
  const lbLeft = lb.querySelector('.lb-arrow.left');
  const lbRight = lb.querySelector('.lb-arrow.right');

  let currentVariants = []; // массив путей для текущей карточки
  let currentIndex = 0;

  // делегирование кликов по галерее: откроет lightbox и загрузит вариации
  gallery.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;

    // получаем variants из data-атрибута (разделитель запятая)
    const raw = item.dataset.variants || '';
    if (!raw) return;
    currentVariants = raw.split(',').map(s => s.trim()).filter(Boolean);
    currentIndex = 0;
    showLBImage();
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  function showLBImage() {
    if (!currentVariants.length) return;
    lbImg.src = currentVariants[currentIndex];
  }

  lbClose.addEventListener('click', () => {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  });

  // arrows
  lbLeft.addEventListener('click', () => {
    if (!currentVariants.length) return;
    currentIndex = (currentIndex - 1 + currentVariants.length) % currentVariants.length;
    showLBImage();
  });
  lbRight.addEventListener('click', () => {
    if (!currentVariants.length) return;
    currentIndex = (currentIndex + 1) % currentVariants.length;
    showLBImage();
  });

  // click outside image closes
  lb.addEventListener('click', (e) => {
    if (e.target === lb) {
      lb.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // keyboard support (Esc = close, arrows = nav variants)
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') { lb.classList.remove('active'); document.body.style.overflow = ''; }
    if (e.key === 'ArrowLeft') lbLeft.click();
    if (e.key === 'ArrowRight') lbRight.click();
  });


  /* ---------- LOAD MORE (добавляет новые карточки с тем же data-variants форматом) ---------- */
  const loadMoreBtn = document.getElementById('load-more');

  let pageBlock = 1;                // у нас уже есть первая "страница" (12 items)
  const perPage = 12;
  const maxPages = 3;              // всего 3 * 12 = 36 изображений, поменяй при желании

  loadMoreBtn.addEventListener('click', () => {
    pageBlock++;
    const startIndex = (pageBlock - 1) * perPage + 1; // например: 13
    const endIndex = Math.min(pageBlock * perPage, perPage * maxPages);

    for (let i = startIndex; i <= endIndex; i++) {
      // формируем имя модели по шаблону modelNN_M.jpg
      // допустим, варианты имен: modelXX_1..modelXX_5
      const modelNum = String(i).padStart(2, '0'); // 01,02,03...
      const variants = [];
      for (let v = 1; v <= 5; v++) {
        variants.push(`images/model${modelNum}_${v}.jpg`);
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'gallery-item';
      wrapper.setAttribute('data-variants', variants.join(','));

      const thumb = document.createElement('img');
      thumb.src = variants[0]; // первая вариация как миниатюра
      thumb.alt = `Model ${modelNum}`;

      wrapper.appendChild(thumb);
      gallery.appendChild(wrapper);

      // лёгкий эффект появления
      wrapper.style.opacity = 0;
      wrapper.style.transform = 'translateY(6px)';
      setTimeout(() => {
        wrapper.style.transition = 'opacity 360ms ease, transform 360ms ease';
        wrapper.style.opacity = 1;
        wrapper.style.transform = '';
      }, 40);
    }

    // если дошли до конца — прячем кнопку
    if (pageBlock >= maxPages) loadMoreBtn.style.display = 'none';

    
  });

});