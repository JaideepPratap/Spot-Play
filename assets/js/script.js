// Mobile menu toggle
(function(){
	var toggle = document.querySelector('.nav-toggle');
	var menu = document.getElementById('nav-menu');
	if(!toggle || !menu) return;
	function setOpen(isOpen){
		toggle.setAttribute('aria-expanded', String(isOpen));
		menu.classList.toggle('open', isOpen);
	}
	toggle.addEventListener('click', function(){
		var isOpen = toggle.getAttribute('aria-expanded') === 'true';
		setOpen(!isOpen);
	});
	menu.addEventListener('click', function(e){
		if(e.target.tagName === 'A') setOpen(false);
	});
})();

// Smooth scroll for hash links
(function(){
	var links = document.querySelectorAll('a[href^="#"]');
	links.forEach(function(link){
		link.addEventListener('click', function(e){
			var targetId = link.getAttribute('href');
			if(targetId.length > 1){
				e.preventDefault();
				var el = document.querySelector(targetId);
				if(el){ el.scrollIntoView({behavior:'smooth'}); }
			}
		});
	});
})();

// Basic contact form handler (no backend)
(function(){
    var form = document.querySelector('.contact-form');
    if(!form) return;
    if(form.getAttribute('data-emailjs') === 'true') return; // handled by EmailJS integration
    form.addEventListener('submit', function(e){
        e.preventDefault();
        var data = new FormData(form);
        var name = (data.get('firstName') || '') + ' ' + (data.get('lastName') || '');
        alert('Thanks '+ name.trim() + '! We\'ll get back to you at ' + (data.get('email') || 'your email') + '.');
        form.reset();
    });
})();

// Testimonials carousel
(function(){
	var root = document.querySelector('.testimonials');
	if(!root) return;
	var track = root.querySelector('.testimonial-track');
	var items = Array.prototype.slice.call(root.querySelectorAll('.testimonial'));
	var prev = root.querySelector('[data-prev]');
	var next = root.querySelector('[data-next]');
	var index = 0;
	var autoplay = root.getAttribute('data-autoplay') === 'true';
	var timer = null;

	function itemWidth(){
		var first = items[0];
		return first ? first.getBoundingClientRect().width + 16 : 0; // include gap
	}
	function clamp(i){
		var perView = window.innerWidth < 900 ? 1 : 3;
		var maxIndex = Math.max(0, items.length - perView);
		return Math.max(0, Math.min(i, maxIndex));
	}
	function goTo(i){
		index = clamp(i);
		track.style.transform = 'translateX(' + (-index * itemWidth()) + 'px)';
	}
	function nextSlide(){ goTo(index + 1); }
	function prevSlide(){ goTo(index - 1); }

	window.addEventListener('resize', function(){ goTo(index); });
	if(next) next.addEventListener('click', function(){ nextSlide(); reset(); });
	if(prev) prev.addEventListener('click', function(){ prevSlide(); reset(); });

	function start(){
		if(!autoplay) return;
		stop();
		timer = setInterval(function(){
			var perView = window.innerWidth < 900 ? 1 : 3;
			var maxIndex = Math.max(0, items.length - perView);
			if(index >= maxIndex) goTo(0); else nextSlide();
		}, 3500);
	}
	function stop(){ if(timer){ clearInterval(timer); timer = null; } }
	function reset(){ stop(); start(); }

	start();
})();


