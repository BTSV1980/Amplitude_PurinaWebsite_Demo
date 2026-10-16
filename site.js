/* Purina.com demo — event names match the synthetic dataset in project 881516 */
(function () {
  'use strict';
  // >>> Set this to the GitHub Pages URL of the myPurina demo app <<<
  var APP_URL = window.MYPURINA_APP_URL || 'https://btsv1980.github.io/Amplitude_myPurina_Demo/';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var qs = new URLSearchParams(location.search);
  function track(n, p) { try { window.amplitude.track(n, p || {}); } catch (e) {} }
  function deviceId() { try { return window.amplitude.getDeviceId() || ''; } catch (e) { return ''; } }
  var isMobile = window.matchMedia('(hover:none) and (pointer:coarse), (max-width:760px)').matches;
  var os = /android/i.test(navigator.userAgent) ? 'android' : (/iphone|ipad|ipod/i.test(navigator.userAgent) ? 'ios' : 'desktop');
  var PAGE = document.body.dataset.page;

  function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  var PRODUCTS = [
    ['Pro Plan Complete Essentials Chicken & Rice', 'Purina Pro Plan', 'dog', 'dry_food', '#1E1E1E', 'Real chicken is the first ingredient, with guaranteed live probiotics for digestive health.'],
    ['Pro Plan Sensitive Skin & Stomach Salmon & Rice', 'Purina Pro Plan', 'dog', 'dry_food', '#2D2A26', 'Salmon as the first ingredient and an easy-to-digest formula for dogs with sensitive systems.'],
    ['Purina ONE True Instinct Salmon & Tuna', 'Purina ONE', 'dog', 'dry_food', '#C8102E', 'High protein with real salmon and tuna and added vitamins, minerals and nutrients.'],
    ['Purina ONE +Plus Lamb & Rice', 'Purina ONE', 'dog', 'dry_food', '#9E0E25', 'Lamb as the first ingredient with a crunchy kibble that helps clean teeth.'],
    ['Beneful Originals with Real Beef', 'Beneful', 'dog', 'dry_food', '#0B7A3B', 'Real beef and wholesome grains with accents of vegetables.'],
    ['Dog Chow Complete Adult', 'Dog Chow', 'dog', 'dry_food', '#B30F27', 'Complete and balanced nutrition with 23 vitamins and minerals.'],
    ["Beggin' Strips Bacon Flavor", "Beggin'", 'dog', 'treats', '#D9361E', 'Bacon-flavored treats dogs can not resist.'],
    ['Pro Plan Kitten Chicken & Rice', 'Purina Pro Plan', 'cat', 'dry_food', '#232323', 'DHA for brain and vision development, made with real chicken.'],
    ['Pro Plan Adult Indoor Salmon & Rice', 'Purina Pro Plan', 'cat', 'dry_food', '#34302C', 'Fiber blend for hairball control and real salmon for lean muscle.'],
    ['Purina ONE Indoor Advantage', 'Purina ONE', 'cat', 'dry_food', '#C8102E', 'Lower calorie formula with a natural fiber blend for indoor cats.'],
    ['Fancy Feast Classic Pate Variety Pack', 'Fancy Feast', 'cat', 'wet_food', '#6B4A8E', 'Smooth pate recipes cats love, in a 12-can variety pack.'],
    ['Friskies Party Mix Original Crunch', 'Friskies', 'cat', 'treats', '#E09B00', 'Crunchy treats with real chicken, liver and turkey.'],
    ['Cat Chow Complete', 'Cat Chow', 'cat', 'dry_food', '#A40F24', 'Complete nutrition with high-quality protein for active cats.'],
    ['Tidy Cats LightWeight Clumping Litter', 'Tidy Cats', 'cat', 'litter', '#E7B400', 'Half the weight of traditional litter with long-lasting odor control.']
  ].map(function (p) { return { name: p[0], brand: p[1], pet: p[2], cat: p[3], color: p[4], desc: p[5], slug: slug(p[0]) }; });
  var ARTICLES = [
    ['How much should I feed my dog?', 'feeding', 'dog'], ['Kitten feeding guide: the first year', 'feeding', 'cat'],
    ['Why does my cat knead?', 'behavior', 'cat'], ['How to switch dog food safely', 'nutrition', 'dog'],
    ['Dental care for dogs', 'health', 'dog'], ['Indoor cat enrichment ideas', 'behavior', 'cat'],
    ["Your puppy's first week at home", 'training', 'dog'], ['Senior dog nutrition basics', 'nutrition', 'dog']
  ].map(function (a) { return { title: a[0], topic: a[1], pet: a[2], slug: slug(a[0]) }; });
  var RETAILERS = ['Walmart', 'Chewy', 'Amazon', 'Target', 'Petco', 'PetSmart'];

  // ------------------------------------------------------------------ layout
  function layout() {
    var nav = [['dogs.html', 'Dogs', 'dogs'], ['cats.html', 'Cats', 'cats'], ['food-finder.html', 'Food Finder', 'food_finder'], ['coupons.html', 'Coupons', 'coupons'], ['mypurina.html', 'myPurina App', 'mypurina']];
    document.body.insertAdjacentHTML('afterbegin',
      '<div class="demo-bar">Demo site for an Amplitude product walkthrough. Not affiliated with or endorsed by Nestlé Purina PetCare.</div>' +
      '<header class="site"><div class="wrap"><a class="wordmark" href="index.html">Purina <small>demo</small></a><nav class="main" aria-label="Main">' +
      nav.map(function (n) { return '<a href="' + n[0] + '"' + (PAGE === n[2] ? ' aria-current="page"' : '') + '>' + n[1] + '</a>'; }).join('') +
      '</nav><div class="hdr-cta"><button class="btn sm line" id="signin-btn">' + (user() ? 'Hi, ' + esc(user().first) : 'Sign in') + '</button></div></div></header>');
    document.body.insertAdjacentHTML('beforeend',
      '<footer class="site"><div class="wrap"><div><strong style="color:var(--ink)">Stay in the loop</strong><p>Pet care tips and offers, once a month.</p>' +
      '<form id="nl" style="display:flex;gap:8px;max-width:420px"><input class="field" style="margin:0" type="email" aria-label="Email" placeholder="you@example.com" required><button class="btn sm">Sign up</button></form></div>' +
      '<div><strong style="color:var(--ink)">Shop</strong><br><a href="dogs.html">Dog food</a><br><a href="cats.html">Cat food</a><br><a href="coupons.html">Coupons</a></div>' +
      '<div><strong style="color:var(--ink)">Rewards</strong><br><a href="mypurina.html">myPurina app</a><br><a href="food-finder.html">Food Finder</a></div></div></footer>' +
      '<div class="toast" id="toast" role="status" aria-live="polite"></div>' +
      '<div class="modal" id="modal"><div class="box" id="modalBox"></div></div>');
    $('#nl').addEventListener('submit', function (e) { e.preventDefault(); track('Newsletter Signed Up', { placement: 'footer' }); toast('Thanks! Check your inbox.'); e.target.reset(); });
    $('#signin-btn').addEventListener('click', function () { if (!user()) signUp('header'); });
  }
  function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('show'); }, 2600); }
  function user() { try { return JSON.parse(localStorage.getItem('pc_user')); } catch (e) { return null; } }

  // ------------------------------------------------------------------ account
  function signUp(trigger, done) {
    track('Sign Up Started', { trigger: trigger });
    var f = ['Emma', 'Liam', 'Ava', 'Noah', 'Mia', 'Lucas', 'Grace', 'Ethan'][Math.floor(Math.random() * 8)];
    var em = (f + '.demo' + Math.floor(Math.random() * 900 + 100)).toLowerCase() + '@example.com';
    $('#modalBox').innerHTML = '<h3>Create your Purina account</h3><p style="color:var(--ink-2)">Clip coupons and use the same login in the myPurina app.</p>' +
      '<label for="mfn">First name</label><input class="field" id="mfn" value="' + f + '"><label for="mem">Email</label><input class="field" id="mem" type="email" value="' + em + '">' +
      '<div style="display:flex;gap:10px"><button class="btn" id="mcreate">Create account</button><button class="btn line" id="mcancel">Not now</button></div>';
    $('#modal').classList.add('open');
    $('#mcancel').onclick = function () { $('#modal').classList.remove('open'); };
    $('#mcreate').onclick = function () {
      var hex = ''; for (var i = 0; i < 12; i++) hex += Math.floor(Math.random() * 16).toString(16);
      var u = { id: 'pur-' + hex, first: $('#mfn').value || f, email: $('#mem').value || em };
      localStorage.setItem('pc_user', JSON.stringify(u));
      try { window.amplitude.setUserId(u.id); var id = new window.amplitude.Identify(); id.set('email', u.email); id.set('has_mypurina_account', true); window.amplitude.identify(id); } catch (e) {}
      track('Account Created', { method: 'email', trigger: trigger });
      $('#modal').classList.remove('open'); $('#signin-btn').textContent = 'Hi, ' + u.first;
      toast('Welcome, ' + u.first + '!'); if (done) done();
    };
  }

  // ------------------------------------------------------------------ app promo + QR handoff
  function appLink(placement, medium) {
    var p = new URLSearchParams({ utm_source: 'purina.com', utm_medium: medium, utm_campaign: 'web_' + placement, amp_device_id: deviceId() });
    return APP_URL + '?' + p.toString();
  }
  function promoHTML(placement, big) {
    var head = big ? '' : '<div style="flex:1"><h3 style="margin:0 0 6px">Earn 10 points for every $1 on Purina</h3><p style="margin:0;color:var(--ink-2)">Scan receipts in the myPurina app and trade points for treats, toys and free food.</p></div>';
    return head + '<div class="qr-box" data-qr="' + placement + '"><div class="qr" aria-label="QR code to get the myPurina app"></div><small>Scan with your phone to get the app</small></div>' +
      '<div class="store-btns"><button class="store" data-store="' + placement + '">' + (os === 'ios' ? ' Download on the App Store' : '▶ Get it on Google Play') + '</button></div>';
  }
  function wirePromos() {
    [].forEach.call(document.querySelectorAll('[data-promo]'), function (el) {
      var placement = el.dataset.promo;
      if (!el.dataset.custom) el.innerHTML = promoHTML(placement, el.classList.contains('app-band'));
      var seen = false;
      var io = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting && !seen) { seen = true; track('App Promo Viewed', { placement: placement, promo_format: isMobile ? 'store_button' : 'qr_code' }); drawQR(el, placement); io.disconnect(); }
        });
      }, { threshold: 0.5 });
      io.observe(el);
    });
    if (wirePromos.bound) return; wirePromos.bound = true;
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-store]'); if (!b) return;
      var placement = b.dataset.store;
      track('App Download Clicked', { placement: placement, promo_format: 'store_button', store: os === 'ios' ? 'app_store' : 'google_play' });
      setTimeout(function () { location.href = appLink(placement, 'store_button'); }, 250);
    });
  }
  function drawQR(el, placement) {
    var box = el.querySelector('.qr'); if (!box || box.dataset.done || isMobile) return;
    box.dataset.done = '1';
    var go = function () {
      if (!window.QRCode) return;
      new window.QRCode(box, { text: appLink(placement, 'qr'), width: 300, height: 300, correctLevel: window.QRCode.CorrectLevel.M });
      box.style.cursor = 'pointer'; box.title = 'Open the app link (demo)';
      box.addEventListener('click', function () { window.open(appLink(placement, 'qr'), '_blank'); });
    };
    var tries = 0; (function wait() { if (window.QRCode) return go(); if (++tries < 25) setTimeout(wait, 200); })();
  }

  // ------------------------------------------------------------------ cards
  function bag(p, big) { return '<div class="bag' + (big ? ' big' : '') + '" style="background:' + p.color + '">' + esc(p.brand) + '<br>' + esc(p.name.replace(p.brand + ' ', '')) + '</div>'; }
  function productTile(p) { return '<a class="tile" href="product.html?p=' + p.slug + '">' + bag(p) + '<strong>' + esc(p.name) + '</strong><div class="meta">' + esc(p.brand) + '</div></a>'; }
  function articleTile(a) { return '<a class="tile" href="article.html?a=' + a.slug + '"><div class="meta">' + (a.pet === 'dog' ? 'Dogs' : 'Cats') + ', ' + a.topic + '</div><h3 style="margin-top:6px">' + esc(a.title) + '</h3></a>'; }

  // ------------------------------------------------------------------ pages
  var pages = {};
  pages.home = function (m) {
    m.innerHTML = '<div class="wrap"><div class="hero"><div><h1>Food that fits the pet in front of you.</h1><p class="lede">Nutrition shaped by veterinarians and pet nutritionists, for every life stage, from first bowl to golden years.</p>' +
      '<div class="ctas"><a class="btn" id="hero-finder-cta" href="food-finder.html">Find the right food</a><a class="btn line" href="dogs.html">Dog food</a><a class="btn line" href="cats.html">Cat food</a></div></div>' +
      '<div class="hero-pets" aria-hidden="true"><div class="blob a">🐕</div><div class="blob b">🐈</div><div class="blob c">10 pts per $1</div></div></div>' +
      '<div class="app-band" data-promo="home_hero" data-custom="1"><div><h2>Get rewarded for every Purina purchase.</h2><p>Scan your receipts in the myPurina app, earn 10 points for every $1, and redeem for treats, toys and free food. Plus 400 bonus points for your pet\'s profile.</p>' +
      '<div class="perks"><span class="perk">400 bonus points</span><span class="perk">Ask Allie, our pet care chatbot</span><span class="perk">HAPPi bonding challenges</span></div></div>' + promoHTML('home_hero', true) + '</div></div>' +
      '<section><div class="wrap"><h2>Popular right now</h2><div class="grid g4">' + PRODUCTS.filter(function (p, i) { return [0, 2, 8, 10].indexOf(i) >= 0; }).map(productTile).join('') + '</div></div></section>' +
      '<section style="background:var(--mist)"><div class="wrap"><h2>Pet care advice</h2><div class="grid g4">' + ARTICLES.slice(0, 4).map(articleTile).join('') + '</div></div></section>';
  };
  pages.dogs = pages.cats = function (m) {
    var pet = PAGE === 'dogs' ? 'dog' : 'cat';
    m.innerHTML = '<div class="wrap"><div class="crumbs">Home / ' + (pet === 'dog' ? 'Dogs' : 'Cats') + '</div><h1 style="font-size:52px;margin-top:14px">' + (pet === 'dog' ? 'Dog food' : 'Cat food') + '</h1>' +
      '<p class="lede">Not sure where to start? <a href="food-finder.html">Take the Food Finder</a> and get matched in under a minute.</p>' +
      '<div class="grid g4" style="margin-top:26px">' + PRODUCTS.filter(function (p) { return p.pet === pet; }).map(productTile).join('') + '</div></div>';
  };
  pages.product = function (m) {
    var p = PRODUCTS.filter(function (x) { return x.slug === qs.get('p'); })[0] || PRODUCTS[2];
    document.title = p.name + ' | Purina';
    m.innerHTML = '<div class="wrap"><div class="crumbs">Home / ' + (p.pet === 'dog' ? 'Dogs' : 'Cats') + ' / ' + esc(p.brand) + '</div><div class="pdp"><div>' + bag(p, true) + '</div><div>' +
      '<div class="meta" style="color:var(--ink-2)">' + esc(p.brand) + '</div><h1 style="font-size:44px">' + esc(p.name) + '</h1><p class="lede">' + esc(p.desc) + '</p>' +
      '<h3 style="margin-top:26px">Where to buy</h3><div class="wtb">' + RETAILERS.map(function (r) { return '<button data-wtb="' + r + '">' + r + ' <span>In stock</span></button>'; }).join('') + '</div>' +
      '<div class="inline-promo" data-promo="product_page_banner"></div></div></div></div>';
    track('Product Viewed', { product_name: p.name, brand: p.brand, pet_type: p.pet, product_category: p.cat });
    m.addEventListener('click', function (e) { var b = e.target.closest('[data-wtb]'); if (!b) return; track('Where To Buy Clicked', { retailer: b.dataset.wtb, product_name: p.name, brand: p.brand, pet_type: p.pet, page_type: 'product' }); toast('Opening ' + b.dataset.wtb + '...'); });
  };
  pages.article = function (m) {
    var a = ARTICLES.filter(function (x) { return x.slug === qs.get('a'); })[0] || ARTICLES[0];
    document.title = a.title + ' | Purina';
    var body = {
      feeding: ['The right amount depends on your pet\'s weight, age and activity level. The feeding guide on the bag is a starting point, not a rule.', 'Weigh your pet, use a measuring cup rather than a scoop, and check body condition every two weeks. You should be able to feel the ribs without pressing hard.', 'Split the daily amount into two meals for adults and three or four for young puppies and kittens. Treats should stay under 10% of daily calories.'],
      behavior: ['Most behaviors that puzzle owners are normal, instinctive ways pets communicate and self-soothe.', 'Look at the context: when does it happen, what happened right before, and how does your pet seem afterwards? Patterns tell you more than single moments.', 'Short daily routines of play and calm contact help. Try five minutes of focused attention at the same time each day.'],
      nutrition: ['Switch foods over 7 to 10 days. Start with 25% new food and increase every few days while watching stool quality and appetite.', 'Older pets often need fewer calories but more high-quality protein to maintain muscle.', 'If your pet has a medical condition, talk to your veterinarian before changing diets.'],
      health: ['Plaque turns into tartar within days, so daily habits beat occasional deep cleans.', 'Brush with a pet-safe toothpaste, offer dental chews, and schedule regular veterinary checkups.', 'Bad breath, drooling or chewing on one side can signal dental pain worth a vet visit.'],
      training: ['The first week sets routines. Keep feeding, potty breaks and sleep at consistent times.', 'Reward the behavior you want within a second or two, and keep sessions under five minutes.', 'Socialize gently: new sounds, surfaces and people, always at a pace your puppy can handle.']
    }[a.topic];
    m.innerHTML = '<div class="wrap"><div class="article"><div class="crumbs">Pet care advice / ' + (a.pet === 'dog' ? 'Dogs' : 'Cats') + '</div><h1 style="font-size:50px;margin-top:12px">' + esc(a.title) + '</h1>' +
      '<p>' + body[0] + '</p><p>' + body[1] + '</p><div class="inline-promo" data-promo="article_inline"></div><p>' + body[2] + '</p>' +
      '<p>' + body[0] + ' ' + body[2] + '</p><p>' + body[1] + '</p><div id="read-marker"></div>' +
      '<h3>Keep reading</h3><div class="grid g2">' + ARTICLES.filter(function (x) { return x !== a; }).slice(0, 2).map(articleTile).join('') + '</div></div></div>';
    track('Article Viewed', { article_title: a.title, article_topic: a.topic, pet_type: a.pet });
    var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { track('Article Read', { article_title: a.title, article_topic: a.topic, read_depth_pct: 75 }); io.disconnect(); } });
    io.observe($('#read-marker'));
  };
  pages.food_finder = function (m) {
    var steps = [['Pet type', 'Who are we feeding?', ['Dog', 'Cat']], ['Age', 'How old is your pet?', ['Puppy or kitten', 'Adult', 'Senior']],
      ['Size & activity', 'How would you describe them?', ['Small and relaxed', 'Medium and playful', 'Large and very active']], ['Health needs', 'Anything we should know?', ['Sensitive stomach', 'Weight management', 'Skin and coat', 'None of these']]];
    var st = 0, ans = [];
    track('Food Finder Started', { pet_type: 'unknown', platform_surface: 'web' });
    function draw() {
      if (st === steps.length) return result();
      var s = steps[st];
      m.innerHTML = '<div class="wrap"><div class="finder"><div class="crumbs">Food Finder, step ' + (st + 1) + ' of ' + steps.length + '</div><div class="bar"><b style="width:' + (st / steps.length * 100) + '%"></b></div>' +
        '<h1 style="font-size:46px">' + s[1] + '</h1><div class="opts">' + s[2].map(function (o) { return '<button class="opt" aria-pressed="false" data-opt="' + esc(o) + '">' + esc(o) + '</button>'; }).join('') + '</div></div></div>';
    }
    function result() {
      var pet = ans[0] === 'Cat' ? 'cat' : 'dog';
      var pick = PRODUCTS.filter(function (p) { return p.pet === pet && p.cat === 'dry_food'; })[ans[3] === 'Sensitive stomach' ? 1 : 0];
      track('Food Finder Completed', { pet_type: pet, platform_surface: 'web', results_count: 10 });
      track('Food Recommendation Viewed', { product_name: pick.name, brand: pick.brand, rank: 1, platform_surface: 'web' });
      m.innerHTML = '<div class="wrap"><div class="finder"><div class="crumbs">Your best match</div><div class="pdp" style="padding-top:10px"><div>' + bag(pick, true) + '</div><div><h1 style="font-size:40px">' + esc(pick.name) + '</h1><p class="lede">' + esc(pick.desc) + '</p>' +
        '<div class="wtb">' + RETAILERS.slice(0, 4).map(function (r) { return '<button data-wtb="' + r + '">' + r + ' <span>In stock</span></button>'; }).join('') + '</div></div></div>' +
        '<div class="inline-promo" data-promo="food_finder_results"></div></div></div>';
      m.onclick = function (e) { var b = e.target.closest('[data-wtb]'); if (!b) return; track('Where To Buy Clicked', { retailer: b.dataset.wtb, product_name: pick.name, brand: pick.brand, pet_type: pet, page_type: 'food_finder' }); toast('Opening ' + b.dataset.wtb + '...'); };
      wirePromos();
    }
    m.addEventListener('click', function (e) {
      var b = e.target.closest('[data-opt]'); if (!b) return;
      ans.push(b.dataset.opt); track('Food Finder Step Completed', { step_number: st + 1, step_name: steps[st][0], platform_surface: 'web' });
      st++; draw();
    });
    draw();
  };
  pages.mypurina = function (m) {
    m.innerHTML = '<div class="wrap"><div class="hero"><div><h1>Treats. Toys. Swag. Freebies.</h1><p class="lede">The myPurina app turns your Purina receipts into rewards. Earn 10 points for every $1 and 400 bonus points just for creating your pet\'s profile.</p></div>' +
      '<div class="app-band" data-promo="mypurina_page" style="grid-template-columns:1fr;justify-items:center;text-align:center"></div></div>' +
      '<section><div class="grid g3">' +
      [['Scan your receipt', 'Snap a photo of any receipt with Purina products within 30 days of purchase.'], ['Ask Allie', 'Get answers on nutrition, health and behavior from our pet care chatbot.'], ['Bond with HAPPi', 'Five-day challenges that help you play and connect with your pet.']]
        .map(function (x) { return '<div class="tile"><h3>' + x[0] + '</h3><p class="meta">' + x[1] + '</p></div>'; }).join('') + '</div></section></div>';
  };
  pages.coupons = function (m) {
    var offers = [['$3', 'Purina Pro Plan', 'any Pro Plan dry dog food, 5 lb or larger'], ['$2', 'Fancy Feast', 'two Fancy Feast variety packs'], ['$4', 'Tidy Cats', 'any Tidy Cats litter, 20 lb or larger'], ['$3', 'Purina ONE', 'any Purina ONE dry food']];
    m.innerHTML = '<div class="wrap"><h1 style="font-size:52px;margin-top:30px">Coupons and offers</h1><p class="lede">Clip a coupon to your account, then use it in store or online.</p><div class="grid g4" style="margin-top:24px">' +
      offers.map(function (o) { return '<div class="coupon"><div class="amt">' + o[0] + '</div><strong>Save on ' + esc(o[2]) + '</strong><button class="btn sm" data-clip="' + esc(o[1]) + '" data-amt="' + o[0] + '">Clip coupon</button></div>'; }).join('') +
      '</div><div class="inline-promo" data-promo="coupon_page"></div></div>';
    offers.forEach(function (o) { track('Coupon Viewed', { offer_name: 'Save ' + o[0] + ' on ' + o[1], brand: o[1] }); });
    m.addEventListener('click', function (e) {
      var b = e.target.closest('[data-clip]'); if (!b) return;
      var props = { offer_name: 'Save ' + b.dataset.amt + ' on ' + b.dataset.clip, brand: b.dataset.clip };
      track('Coupon Clip Started', props);
      var finish = function () { track('Coupon Clipped', props); b.textContent = 'Clipped ✓'; b.disabled = true; toast('Coupon added to your account'); };
      if (user()) finish(); else signUp('coupon_clip', finish);
    });
  };

  // ------------------------------------------------------------------ boot
  layout();
  var main = $('#main');
  (pages[PAGE] || pages.home)(main);
  wirePromos();
  var u = user();
  if (u) { try { if (window.amplitude.getUserId() !== u.id) window.amplitude.setUserId(u.id); } catch (e) {} }
})();
