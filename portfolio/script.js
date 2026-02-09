// Интерактивные эффекты для портфолио
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => loader.classList.add('hidden'), 1500);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // ===== Текущий год в подвале =====
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // ===== Эффект печатной машинки =====
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const phrases = ['Привет, я', 'Фронтенд-разработчик', 'Студент КИТЭК'];
        let phraseIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 100;

        const typeText = () => {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                typingText.textContent = currentPhrase.substring(0, --charIndex);
                typingSpeed = 50;
            } else {
                typingText.textContent = currentPhrase.substring(0, ++charIndex);
                typingSpeed = 100;
            }
            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500;
            }
            setTimeout(typeText, typingSpeed);
        };
        setTimeout(typeText, 2000);
    }

    // ===== Мобильное меню =====
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Закрытие меню по клику на ссылку
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && navLinks) {
                navLinks.classList.remove('active');
            }
        });
    });

    // ===== Плавная прокрутка по якорям =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const offset = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({
                top,
                behavior: 'smooth'
            });
        });
    });

    // ===== Подсветка активного пункта меню =====
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');
    let ticking = false;

    const setActiveNav = () => {
        const scrollPos = window.pageYOffset + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;

            if (scrollPos >= top && scrollPos < bottom) {
                const id = section.getAttribute('id');
                navItems.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(setActiveNav);
            ticking = true;
        }
    }, { passive: true });
    setActiveNav();

    // ===== Header эффект при скролле =====
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // ===== Кнопка "Наверх" =====
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== Reveal-анимации при скролле =====
    const revealItems = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (revealItems.length) {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
            revealItems.forEach(el => observer.observe(el));
        } else {
            revealItems.forEach(el => el.classList.add('visible'));
        }
    }

    // ===== Счётчики статистики =====
    const counters = document.querySelectorAll('.counter');
    if (counters.length && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counter = entry.target;
                        const target = parseInt(counter.closest('.stat').dataset.count) || 0;
                        const duration = 2000;
                        const step = target / (duration / 16);
                        let current = 0;

                        const updateCounter = () => {
                            current += step;
                            if (current < target) {
                                counter.textContent = Math.floor(current);
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.textContent = target;
                            }
                        };

                        updateCounter();
                        counterObserver.unobserve(counter);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // ===== 3D Tilt эффект для карточек =====
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        let ticking = false;
        card.addEventListener('mousemove', (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    card.style.transform = `perspective(1000px) rotateX(${(y - centerY) / 10}deg) rotateY(${(centerX - x) / 10}deg) translateZ(10px)`;
                    ticking = false;
                });
                ticking = true;
            }
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });

    // ===== Частицы =====
    const particlesContainer = document.querySelector('.particles-container');
    if (particlesContainer) {
        const createParticle = () => {
            const p = document.createElement('span');
            p.className = 'particle';
            p.style.left = `${Math.random() * 100}%`;
            p.style.bottom = '-20px';
            p.style.animationDuration = `${8 + Math.random() * 6}s`;
            particlesContainer.appendChild(p);
            p.addEventListener('animationend', () => p.remove());
        };
        for (let i = 0; i < 8; i++) createParticle();
        setInterval(createParticle, 2500);
    }

    // ===== Обработка формы =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('.btn');
            const originalText = btn.textContent;

            btn.textContent = 'Отправка...';
            btn.disabled = true;

            // Симуляция отправки
            setTimeout(() => {
                btn.textContent = 'Отправлено! ✓';
                btn.style.background = 'var(--success-color)';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                    contactForm.reset();
                }, 2000);
            }, 1500);
        });
    }
});
