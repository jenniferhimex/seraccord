/**
 * Seraccord Master Architecture Script (English)
 * European Archive Brand Guideline V1.2 Compliance
 * Supports:
 * - Layer 1: Hero Carousel, Catalog 4-Card Filtering, Newsletter & Cart
 * - Layer 2: Category Filter Routing, Subcategory Chips, Sort/Filter Engine
 * - Layer 3: PDP Dynamic Product Loading, Gallery & Blueprint Switcher,
 *            Interactive 2-Step Configurator, Live Price Calculator & Mobile Sticky CTA
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. GLOBAL STATE & PERSISTENT CART
  // =========================================================================
  let cartCount = parseInt(localStorage.getItem('seraccord_cart_count') || '0', 10);
  const cartCountEls = document.querySelectorAll('#cartCount, .cart-badge');
  
  function updateCartUI() {
    cartCountEls.forEach(el => {
      el.textContent = cartCount;
      el.style.transform = 'scale(1.35)';
      setTimeout(() => { el.style.transform = 'scale(1)'; }, 200);
    });
    localStorage.setItem('seraccord_cart_count', cartCount.toString());
  }

  updateCartUI();

  // Toast System
  const toastMessage = document.getElementById('toastMessage');
  const toastText = document.getElementById('toastText');
  let toastTimer = null;

  function showToast(message) {
    if (!toastMessage || !toastText) return;
    toastText.textContent = message;
    toastMessage.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMessage.classList.remove('show');
    }, 3200);
  }

  // Sticky Header Transition
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    });
  }

  // Mobile Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // Global Cart Button Click
  const cartBtns = document.querySelectorAll('#cartBtn, .cart-btn');
  cartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (cartCount === 0) {
        showToast('Your shopping bag is currently empty.');
      } else {
        showToast(`Your bag contains ${cartCount} item(s). Proceeding to secure checkout...`);
      }
    });
  });

  // Global Add to Cart Buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const productName = btn.getAttribute('data-product') || 'Selected Piece';
      cartCount++;
      updateCartUI();
      showToast(`Added "${productName}" to your shopping bag.`);
    });
  });

  // Global Support & Account Triggers
  const supportBtn = document.getElementById('supportBtn');
  if (supportBtn) {
    supportBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openConsultationModal();
    });
  }

  const accountBtn = document.getElementById('accountBtn');
  if (accountBtn) {
    accountBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Connecting with Seraccord Concierge: 0909 068 237');
    });
  }

  // Global Newsletter Forms
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you for subscribing to the Seraccord Journal.');
      newsletterForm.reset();
    });
  }

  const footerForm = document.getElementById('footerForm');
  if (footerForm) {
    footerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Welcome to the Seraccord Family.');
      footerForm.reset();
    });
  }

  // =========================================================================
  // CLIENT CONCIERGE & MULTI-CHANNEL FLOATING WIDGET
  // =========================================================================
  const floatingContactWidget = document.getElementById('floatingContactWidget');
  const floatingContactToggle = document.getElementById('floatingContactToggle');
  const consultModal = document.getElementById('consultModal');
  const openConsultModalBtns = document.querySelectorAll('#openConsultModalBtn, .open-consult-btn');
  const closeConsultModalBtn = document.getElementById('closeConsultModalBtn');
  const consultationForm = document.getElementById('consultationForm');

  if (floatingContactToggle && floatingContactWidget) {
    floatingContactToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      floatingContactWidget.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!floatingContactWidget.contains(e.target)) {
        floatingContactWidget.classList.remove('open');
      }
    });
  }

  function openConsultationModal() {
    if (consultModal) {
      consultModal.classList.add('open');
      if (floatingContactWidget) floatingContactWidget.classList.remove('open');
    }
  }

  function closeConsultationModal() {
    if (consultModal) {
      consultModal.classList.remove('open');
    }
  }

  openConsultModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openConsultationModal();
    });
  });

  if (closeConsultModalBtn) {
    closeConsultModalBtn.addEventListener('click', closeConsultationModal);
  }

  if (consultModal) {
    consultModal.addEventListener('click', (e) => {
      if (e.target === consultModal) closeConsultationModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && consultModal.classList.contains('open')) {
        closeConsultationModal();
      }
    });
  }

  if (consultationForm) {
    consultationForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitBtn = consultationForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Submit';
      if (submitBtn) {
        submitBtn.textContent = 'Sending to Google Sheet & Concierge...';
        submitBtn.disabled = true;
      }

      const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbwUsxiEvEjzCFZs19a7Mup67BJsUYDdeayynI0mhzWviSltSVjC24h7h2rTeW4vg_lL/exec';
      const formData = new FormData(consultationForm);
      const urlEncoded = new URLSearchParams();
      for (const pair of formData.entries()) {
        urlEncoded.append(pair[0], pair[1]);
      }

      // 1. Ghi trực tiếp vào Google Sheet & gửi mail qua Google Apps Script
      fetch(googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: urlEncoded
      }).catch(err => console.log('Google Sheet dispatch:', err));

      // 2. Dự phòng thêm cổng email FormSubmit
      fetch('https://formsubmit.co/ajax/jennifer.himex@gmail.com', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(() => {
        showToast('Success! Saved to Google Sheet & notification sent to Jennifer.');
        consultationForm.reset();
        closeConsultationModal();
      })
      .catch(() => {
        showToast('Success! Request recorded to Google Sheet.');
        consultationForm.reset();
        closeConsultationModal();
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      });
    });
  }

  // =========================================================================
  // 2. LAYER 1: LANDING PAGE HERO CAROUSEL & SEARCH
  // =========================================================================
  const heroTitle = document.getElementById('heroTitle');
  const heroSubtitle = document.getElementById('heroSubtitle');
  const carouselDots = document.querySelectorAll('.carousel-dot');

  if (heroTitle && carouselDots.length > 0) {
    const heroSlides = [
      {
        title: 'Made to gather a life around it.',
        subtitle: 'Considered furniture for rooms that evolve with you—defined by honest materials, lasting proportion, and everyday ease.'
      },
      {
        title: 'Rooms for a life well lived.',
        subtitle: 'Solid FSC European oak, raw textural linen, and organic architecture crafted to endure through generations.'
      },
      {
        title: 'Modular seating, composed.',
        subtitle: 'Architectural proportion meets zero-tool reconfigurable engineering for limitless living space flexibility.'
      },
      {
        title: 'Tactile materials, made to remain.',
        subtitle: 'Dense textural bouclé, vegetable-tanned leathers, and natural stone plinths finished with quiet authority.'
      }
    ];

    let currentSlide = 0;
    let heroTimer = null;

    function setHeroSlide(index) {
      currentSlide = index;
      carouselDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      const slide = heroSlides[index];
      if (slide) {
        heroTitle.textContent = slide.title;
        if (heroSubtitle) heroSubtitle.textContent = slide.subtitle;
      }
    }

    carouselDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-slide'), 10);
        setHeroSlide(idx);
        if (heroTimer) clearInterval(heroTimer);
        startHeroTimer();
      });
    });

    function startHeroTimer() {
      heroTimer = setInterval(() => {
        let nextIndex = (currentSlide + 1) % heroSlides.length;
        setHeroSlide(nextIndex);
      }, 6000);
    }

    startHeroTimer();
  }

  // Dynamic Search on Landing Page or Collection
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase().trim();
      const productCards = document.querySelectorAll('.product-card, .col-product-card');
      productCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (val === '' || text.includes(val)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // =========================================================================
  // 3. LAYER 2: COLLECTION / CATEGORY PAGE ENGINE
  // =========================================================================
  const subcategoryChips = document.querySelectorAll('.subcategory-chip');
  const collectionGrid = document.getElementById('collectionGrid');
  const sortSelect = document.getElementById('sortSelect');
  const activeFilterBadge = document.getElementById('activeFilterBadge');
  const activeFiltersRow = document.getElementById('activeFiltersRow');
  const clearAllFiltersBtn = document.getElementById('clearAllFiltersBtn');
  const breadcrumbCategory = document.getElementById('breadcrumbCategory');
  const collectionHeroTitle = document.getElementById('collectionHeroTitle');
  const collectionHeroDeck = document.getElementById('collectionHeroDeck');

  if (collectionGrid) {
    const urlParams = new URLSearchParams(window.location.search);
    let currentCategory = urlParams.get('cat') || 'all';
    if (currentCategory === 'accent-chair') currentCategory = 'accent';
    if (currentCategory === 'sectional' || currentCategory === 'sofa-bed' || currentCategory === '3-seater') currentCategory = 'sofa';

    const categoryData = {
      all: {
        title: 'Complete Furniture Archive',
        deck: 'Explore all 4 core Seraccord architectural pieces crafted with FSC solid European oak, heavy bouclé weaves, and honest proportions.',
        breadcrumb: 'All Collections'
      },
      bed: {
        title: 'Archival Bed Systems',
        deck: 'Restorative bedroom frameworks enveloped in washed tactile European linen and built upon reinforced solid oak subframes.',
        breadcrumb: 'Bed Systems'
      },
      accent: {
        title: 'Sculptural Accent Chairs',
        deck: 'Curved organic armchairs tailored in dense tactile bouclé and anchored by hand-carved solid Nordic oak timber plinths.',
        breadcrumb: 'Accent Chairs'
      },
      sofa: {
        title: 'Modular Sofas',
        deck: 'Architectural seating systems crafted with FSC European solid oak frameworks, washable Italian weaves, and zero-tool modular reconfigurability.',
        breadcrumb: 'Modular Sofas'
      },
      ottoman: {
        title: 'Tactile Ottomans & Poufs',
        deck: 'Dual-purpose monolithic seating and resting plinths crafted with inset oak bases and resilient foam cores.',
        breadcrumb: 'Ottomans'
      },
      'why-us': {
        title: 'The European Archive Standard',
        deck: 'Honest materials, 100% FSC certified forestry, quiet architectural authority, and lifelong circular care.',
        breadcrumb: 'Why Seraccord'
      }
    };

    function applyCategoryFilter(catKey) {
      if (catKey === 'accent-chair') catKey = 'accent';
      if (catKey === 'sectional' || catKey === 'sofa-bed' || catKey === '3-seater') catKey = 'sofa';

      if (categoryData[catKey]) {
        if (collectionHeroTitle) collectionHeroTitle.textContent = categoryData[catKey].title;
        if (collectionHeroDeck) collectionHeroDeck.textContent = categoryData[catKey].deck;
        if (breadcrumbCategory) breadcrumbCategory.textContent = categoryData[catKey].breadcrumb;
        document.title = `${categoryData[catKey].title} — Seraccord`;
      }

      subcategoryChips.forEach(chip => {
        const filterVal = chip.getAttribute('data-filter');
        chip.classList.toggle('active', filterVal === catKey);
      });

      const cards = collectionGrid.querySelectorAll('.col-product-card');
      let visibleCount = 0;

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (catKey === 'all' || cardCat === catKey) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      const countLabel = document.getElementById('productCountLabel');
      if (countLabel) {
        countLabel.textContent = `Showing ${visibleCount} Curated Model${visibleCount === 1 ? '' : 's'}`;
      }
    }

    // Initialize with query param or default
    applyCategoryFilter(currentCategory);

    // Subcategory chip clicks
    subcategoryChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const filterVal = chip.getAttribute('data-filter');
        applyCategoryFilter(filterVal);
      });
    });

    // Sorting Engine
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        const sortVal = sortSelect.value;
        const cardsArray = Array.from(collectionGrid.querySelectorAll('.col-product-card'));

        cardsArray.sort((a, b) => {
          const priceA = parseFloat(a.getAttribute('data-price') || '0');
          const priceB = parseFloat(b.getAttribute('data-price') || '0');
          const ratingA = parseFloat(a.getAttribute('data-rating') || '0');
          const ratingB = parseFloat(b.getAttribute('data-rating') || '0');

          if (sortVal === 'price-asc') return priceA - priceB;
          if (sortVal === 'price-desc') return priceB - priceA;
          if (sortVal === 'rating') return ratingB - ratingA;
          return 0; // default order
        });

        cardsArray.forEach(card => collectionGrid.appendChild(card));
      });
    }

    // Clear filters
    if (clearAllFiltersBtn) {
      clearAllFiltersBtn.addEventListener('click', () => {
        applyCategoryFilter('all');
        if (activeFiltersRow) activeFiltersRow.style.display = 'none';
        if (activeFilterBadge) activeFilterBadge.textContent = '0';
      });
    }
  }

  // =========================================================================
  // 4. LAYER 3: PRODUCT DETAIL PAGE (PDP) DYNAMIC ENGINE
  // =========================================================================
  const pdpTitle = document.getElementById('pdpTitle');
  const pdpHeroImage = document.getElementById('pdpHeroImage');
  const pdpPriceDisplay = document.getElementById('pdpPriceDisplay');
  const pdpBtnText = document.getElementById('pdpBtnText');
  const pdpAddToCartBtn = document.getElementById('pdpAddToCartBtn');
  const selectedFabricLabel = document.getElementById('selectedFabricLabel');
  const selectedConfigLabel = document.getElementById('selectedConfigLabel');
  const viewModeToggleBtn = document.getElementById('viewModeToggleBtn');
  const viewModeText = document.getElementById('viewModeText');
  const pdpBlueprintImage = document.getElementById('pdpBlueprintImage');
  const addonProtection = document.getElementById('addonProtection');
  const addonSleepKit = document.getElementById('addonSleepKit');
  const mobileStickyBar = document.getElementById('mobileStickyBar');
  const mobileBarPrice = document.getElementById('mobileBarPrice');
  const mobileBarTitle = document.getElementById('mobileBarTitle');
  const mobileBarAddBtn = document.getElementById('mobileBarAddBtn');

  if (pdpTitle) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || 'sofa-midnight';

    // Product Database Registry
    const productCatalog = {
      'sofa-midnight': {
        title: 'Midnight Modular Sectional',
        category: 'SEATING ARCHITECTURE / MODULAR SYSTEM',
        basePrice: 3570,
        rating: '4.8 (242 verified reviews)',
        heroImg: 'product-sofa.jpg',
        blueprint: 'dimension-blueprint-sofa.svg',
        defaultFabric: 'Snowdrift • Aquaforte',
        defaultConfig: '5-Seater with Corner R',
        breadcrumbCat: 'Seating',
        breadcrumbSub: 'Sectional Sofas',
        specs: 'Total Width: 309 cm (121.7") • Depth: 245 cm (96.5") • Height: 86 cm (33.9")'
      },
      'sofa-ciello': {
        title: 'Ciello 4 Seater Sectional',
        category: 'MODULAR LIVING / PLUSH SERIES',
        basePrice: 2445,
        rating: '4.8 (2,150 verified reviews)',
        heroImg: 'product-sofa.jpg',
        blueprint: 'dimension-blueprint-sofa.svg',
        defaultFabric: 'Snowdrift • Aquaforte',
        defaultConfig: '4-Seater with Chaise L',
        breadcrumbCat: 'Seating',
        breadcrumbSub: 'Sectionals',
        specs: 'Total Width: 280 cm (110.2") • Depth: 165 cm (65.0") • Height: 84 cm (33.1")'
      },
      'sofa-neptune': {
        title: 'Neptune Modular Sofa Bed',
        category: 'DUAL LIVING / SLEEPER SYSTEMS',
        basePrice: 3100,
        rating: '4.7 (640 verified reviews)',
        heroImg: 'product-sofa.jpg',
        blueprint: 'dimension-blueprint-sofa.svg',
        defaultFabric: 'Snowdrift • Aquaforte',
        defaultConfig: '4-Seater Modular Sleeper',
        breadcrumbCat: 'Seating',
        breadcrumbSub: 'Sofa Beds',
        specs: 'Total Width: 295 cm (116.1") • Depth: 220 cm (86.6") • Height: 85 cm (33.5")'
      },
      'bed-linen-low': {
        title: 'Linen Low Bed Frame',
        category: 'BEDROOM ARCHIVE / REST SYSTEMS',
        basePrice: 1850,
        rating: '4.9 (1,280 verified reviews)',
        heroImg: 'product-bed.jpg',
        blueprint: 'dimension-blueprint-bed.svg',
        defaultFabric: 'Washed European Linen • Natural',
        defaultConfig: 'King (206 x 228 cm)',
        breadcrumbCat: 'Bed Collection',
        breadcrumbSub: 'Low Bed Frames',
        specs: 'Total Width: 206 cm (81.1") • Length: 228 cm (89.8") • Headboard: 102 cm (40.2")'
      },
      'chair-sculptural': {
        title: 'Sculptural Accent Chair',
        category: 'SEATING ACCENT / ORGANIC FORM',
        basePrice: 920,
        rating: '4.9 (920 verified reviews)',
        heroImg: 'product-accent-chair.jpg',
        blueprint: 'dimension-blueprint-sofa.svg',
        defaultFabric: 'Dense Heavy Bouclé • Oatmeal',
        defaultConfig: 'Standard Lounge Chair',
        breadcrumbCat: 'Chairs',
        breadcrumbSub: 'Accent Chairs',
        specs: 'Total Width: 88 cm (34.6") • Depth: 92 cm (36.2") • Height: 78 cm (30.7")'
      },
      'ottoman-boucle': {
        title: 'Textured Bouclé Ottoman',
        category: 'TACTILE LIVING / DUAL RESTING PLINTH',
        basePrice: 690,
        rating: '4.8 (610 verified reviews)',
        heroImg: 'product-ottoman.jpg',
        blueprint: 'dimension-blueprint-sofa.svg',
        defaultFabric: 'Dense Heavy Bouclé • Natural',
        defaultConfig: 'Square Ottoman (85x85 cm)',
        breadcrumbCat: 'Living Accessories',
        breadcrumbSub: 'Ottomans',
        specs: 'Total Width: 85 cm (33.5") • Depth: 85 cm (33.5") • Height: 44 cm (17.3")'
      }
    };

    // Populate Page with Active Product Data
    const activeProduct = productCatalog[productId] || productCatalog['sofa-midnight'];
    pdpTitle.textContent = activeProduct.title;
    document.title = `${activeProduct.title} — Seraccord`;

    const pdpCategoryEyebrow = document.getElementById('pdpCategoryEyebrow');
    if (pdpCategoryEyebrow) pdpCategoryEyebrow.textContent = activeProduct.category;

    const pdpBreadcrumbCat = document.getElementById('pdpBreadcrumbCat');
    const pdpBreadcrumbSub = document.getElementById('pdpBreadcrumbSub');
    const pdpBreadcrumbTitle = document.getElementById('pdpBreadcrumbTitle');
    if (pdpBreadcrumbCat) pdpBreadcrumbCat.textContent = activeProduct.breadcrumbCat;
    if (pdpBreadcrumbSub) pdpBreadcrumbSub.textContent = activeProduct.breadcrumbSub;
    if (pdpBreadcrumbTitle) pdpBreadcrumbTitle.textContent = activeProduct.title;

    if (pdpHeroImage) pdpHeroImage.src = activeProduct.heroImg;
    if (pdpBlueprintImage) pdpBlueprintImage.src = activeProduct.blueprint;
    if (mobileBarTitle) mobileBarTitle.textContent = activeProduct.title;

    const firstThumb = document.querySelector('#pdpThumbsList .pdp-thumb-btn:first-child');
    if (firstThumb) {
      firstThumb.setAttribute('data-img', activeProduct.heroImg);
      const firstThumbImg = firstThumb.querySelector('img');
      if (firstThumbImg) firstThumbImg.src = activeProduct.heroImg;
    }

    // Pricing Calculation Engine
    let currentBasePrice = activeProduct.basePrice;

    function recalculateTotal() {
      let total = currentBasePrice;
      if (addonProtection && addonProtection.checked) {
        total += parseInt(addonProtection.getAttribute('data-cost') || '280', 10);
      }
      if (addonSleepKit && addonSleepKit.checked) {
        total += parseInt(addonSleepKit.getAttribute('data-cost') || '195', 10);
      }

      const formatted = `$${total.toLocaleString('en-US')}`;
      if (pdpPriceDisplay) pdpPriceDisplay.textContent = formatted;
      if (pdpBtnText) pdpBtnText.textContent = `Add to bag • ${formatted}`;
      if (mobileBarPrice) mobileBarPrice.textContent = formatted;
    }

    recalculateTotal();

    // Step 1: Fabric Swatch Clicks
    const swatchCards = document.querySelectorAll('.pdp-swatch-card');
    swatchCards.forEach(swatch => {
      swatch.addEventListener('click', () => {
        swatchCards.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        const fabricName = swatch.getAttribute('data-fabric') || 'Selected Fabric';
        if (selectedFabricLabel) selectedFabricLabel.textContent = fabricName;
        
        // Subtle animation on hero photo
        if (pdpHeroImage) {
          pdpHeroImage.style.opacity = '0.7';
          setTimeout(() => { pdpHeroImage.style.opacity = '1'; }, 150);
        }
      });
    });

    // Step 2: Configuration Layout Clicks
    const configCards = document.querySelectorAll('.pdp-config-option-card');
    configCards.forEach(card => {
      card.addEventListener('click', () => {
        configCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const configName = card.getAttribute('data-config') || 'Selected Configuration';
        const priceVal = parseInt(card.getAttribute('data-price') || currentBasePrice.toString(), 10);
        currentBasePrice = priceVal;
        if (selectedConfigLabel) selectedConfigLabel.textContent = configName;
        recalculateTotal();
      });
    });

    // Addon Checkbox Listeners
    if (addonProtection) addonProtection.addEventListener('change', recalculateTotal);
    if (addonSleepKit) addonSleepKit.addEventListener('change', recalculateTotal);

    // Thumbnails Gallery Clicks
    const thumbBtns = document.querySelectorAll('.pdp-thumb-btn');
    thumbBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        thumbBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const newImg = btn.getAttribute('data-img');
        if (pdpHeroImage && newImg) {
          pdpHeroImage.style.opacity = '0.4';
          setTimeout(() => {
            pdpHeroImage.src = newImg;
            pdpHeroImage.style.opacity = '1';
          }, 120);
        }
      });
    });

    // Sit / Sleep Mode Toggle
    let isSleepMode = false;
    if (viewModeToggleBtn && viewModeText) {
      viewModeToggleBtn.addEventListener('click', () => {
        isSleepMode = !isSleepMode;
        if (isSleepMode) {
          viewModeText.textContent = 'Sleep / Bed Mode Active';
          viewModeToggleBtn.style.backgroundColor = 'var(--midnight)';
          viewModeToggleBtn.style.color = 'var(--paper)';
          if (pdpHeroImage) {
            pdpHeroImage.style.transform = 'scale(1.02)';
          }
          showToast('Switched to Open Sleeper Layout view.');
        } else {
          viewModeText.textContent = 'Sit / Sleep Mode';
          viewModeToggleBtn.style.backgroundColor = '';
          viewModeToggleBtn.style.color = '';
          if (pdpHeroImage) {
            pdpHeroImage.style.transform = 'scale(1)';
          }
          showToast('Switched to Daytime Lounge view.');
        }
      });
    }

    // Accordions Toggle
    const accordionTriggers = document.querySelectorAll('.pdp-accordion-trigger');
    accordionTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.pdp-accordion-item');
        if (item) {
          const isOpen = item.classList.contains('open');
          item.classList.toggle('open', !isOpen);
          trigger.setAttribute('aria-expanded', (!isOpen).toString());
        }
      });
    });

    // PDP Add to Bag CTA
    function executeAddToCart() {
      cartCount++;
      updateCartUI();
      showToast(`Added "${activeProduct.title}" to your shopping bag.`);
    }

    if (pdpAddToCartBtn) pdpAddToCartBtn.addEventListener('click', executeAddToCart);
    if (mobileBarAddBtn) mobileBarAddBtn.addEventListener('click', executeAddToCart);

    // Mobile Sticky Floating CTA Intersection Observer
    if (mobileStickyBar && pdpAddToCartBtn) {
      window.addEventListener('scroll', () => {
        const rect = pdpAddToCartBtn.getBoundingClientRect();
        if (rect.bottom < 0) {
          mobileStickyBar.classList.add('visible');
        } else {
          mobileStickyBar.classList.remove('visible');
        }
      });
    }
  }
});
