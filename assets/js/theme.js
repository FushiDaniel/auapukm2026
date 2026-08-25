

(function($) {
    'use strict';

    //===== Main Menu

    function mainMenu() {
        
        var var_window = $(window),
        navContainer = $('.header-navigation'),
        navbarToggler = $('.navbar-toggler'),
        navMenu = $('.theme-nav-menu'),
        navMenuLi = $('.theme-nav-menu ul li ul li'),
        closeIcon = $('.navbar-close');

        function openMenu() {
            navbarToggler.addClass('active');
            navMenu.addClass('menu-on');
            $('.offcanvas__overlay').addClass('overlay-open');
            $('body').addClass('menu-open');
        }

        function closeMenu() {
            navbarToggler.removeClass('active');
            navMenu.removeClass('menu-on');
            $('.offcanvas__overlay').removeClass('overlay-open');
            $('body').removeClass('menu-open');
        }

        navbarToggler.on('click', function() {
            if (navMenu.hasClass('menu-on')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        closeIcon.on('click', function() {
            closeMenu();
        });

        navMenu.find("li a").each(function() {
            if ($(this).children('.dd-trigger').length < 1) {
                if ($(this).next().length > 0) {
                    $(this).append('<span class="dd-trigger"><i class="far fa-angle-down"></i></span>')
                }
            }
        });

        navMenu.on('click', '.dd-trigger', function(e) {
            e.preventDefault();
            $(this).parent().parent().siblings().children('ul.sub-menu').slideUp();
            $(this).parent().next('ul.sub-menu').stop(true, true).slideToggle(350);
            $(this).toggleClass('sub-menu-open');
        });

    };

    //===== Offcanvas Overlay

    function offCanvas() {
        const $overlay = $(".offcanvas__overlay");
        const $toggler = $(".navbar-toggler");
        const $menu = $(".theme-nav-menu");
        $overlay.on("click", function () {
            $overlay.removeClass("overlay-open");
            $toggler.removeClass("active");
            $menu.removeClass("menu-on");
            $("body").removeClass("menu-open");
        });
        $(window).on("resize", function () {
            if ($(window).width() > 1199.98) {
                $overlay.removeClass("overlay-open");
                $toggler.removeClass("active");
                $menu.removeClass("menu-on");
                $("body").removeClass("menu-open");
            }
        });
    }

    //===== Windows load

    $(window).on('load', function(event) {
        //===== Preloader
        $('.preloader').delay(500).fadeOut(500);
    })

    
    //====== Sticky Header 
    
    $(document).ready(function () {
        function initStickyHeader(headerSelector) {
            const header = $(headerSelector);
            let lastScroll = 0;
            const updateStickyState = () => {
                if (document.body.classList.contains('modal-open')) return;

                const currentScroll = $(window).scrollTop();
                const isMobileMenuViewport = window.matchMedia("(max-width: 1199.98px)").matches;
                const stickyStart = 40;
                const hideStart = 140;
                const delta = 6;

                if (isMobileMenuViewport) {
                    header.addClass('sticky').removeClass('header-hidden');
                } else if (currentScroll <= stickyStart) {
                    header.removeClass('sticky header-hidden');
                } else {
                    header.addClass('sticky');

                    if (currentScroll > lastScroll + delta && currentScroll > hideStart) {
                        header.addClass('header-hidden');
                    } else if (currentScroll < lastScroll - delta) {
                        header.removeClass('header-hidden');
                    }
                }

                lastScroll = currentScroll;
            };

            $(window).on('scroll resize', updateStickyState);
            updateStickyState();
        }
        initStickyHeader('.header-navigation');

        // Hide the sticky header while any modal is open, and let it
        // recompute its correct state once the modal closes.
        $(document).on('show.bs.modal', '.modal', function() {
            $('.header-navigation').addClass('header-hidden');
        });
        $(document).on('hidden.bs.modal', '.modal', function() {
            $(window).trigger('scroll');
        });
    });

    //===== Gasp 
    
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    const isMobileViewport = window.matchMedia("(max-width: 991px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const useDesktopMotion = !isTouchDevice && !isMobileViewport && !prefersReducedMotion;

    // Gsap ScrollSmoother

    const smoother = useDesktopMotion ? ScrollSmoother.create({
    smooth: 1,
    effects: true,
        smoothTouch: 0,
    }) : null;

    // Pause ScrollSmoother while a Bootstrap modal is open so scrolling
    // inside the modal doesn't also scroll the page behind it.
    if (smoother) {
        $(document).on('show.bs.modal', '.modal', function() {
            smoother.paused(true);
        });
        $(document).on('hidden.bs.modal', '.modal', function() {
            smoother.paused(false);
        });
    }

    // Fade the "scroll for details" hint once the modal body is scrolled to its end.
    $(document).on('shown.bs.modal', '.ukm-modul-modal', function() {
        const $body = $(this).find('.modal-body');
        const $hint = $(this).find('.ukm-modul-modal-scroll-hint');
        if (!$body.length || !$hint.length) return;

        function updateHint() {
            const el = $body[0];
            const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 4;
            $hint.toggleClass('is-at-bottom', atBottom);
        }

        $body.off('scroll.ukmModalHint').on('scroll.ukmModalHint', updateHint);
        updateHint();
    });

    // One-page anchor navigation

    function scrollToSection(hash) {
        const target = document.querySelector(hash);
        if (!target) return;
        const headerHeight = $('.header-navigation').outerHeight() || 0;

        if (smoother) {
            smoother.scrollTo(target, true, 'top top+=' + (headerHeight + 24));
        } else {
            const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 24;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    }

    $(document).on('click', 'a[href^="#"]', function(e) {
        const hash = $(this).attr('href');
        if (!hash || hash === '#') return;

        const target = document.querySelector(hash);
        if (!target) return;

        e.preventDefault();
        $('.theme-nav-menu').removeClass('menu-on');
        $('.navbar-toggler').removeClass('active');
        $('.offcanvas__overlay').removeClass('overlay-open');
        $('body').removeClass('menu-open');
        scrollToSection(hash);

        if (window.history && window.history.pushState) {
            window.history.pushState(null, '', hash);
        } else {
            window.location.hash = hash;
        }
    });

    $(window).on('load', function() {
        if (window.location.hash && document.querySelector(window.location.hash)) {
            setTimeout(function() {
                scrollToSection(window.location.hash);
            }, 80);
        }
    });

    // Gsap SplitText disabled: the char-reveal animation relied on a
    // scroll-trigger + font-load race that repeatedly left headings
    // permanently invisible on first load. Not worth the risk — headings
    // just render normally now.
    //===== Dynamic Background

    function dynamicBackground() {
        $('[data-src]').each(function () {
          var src = $(this).attr('data-src');
          $(this).css({
            'background-image': 'url(' + src + ')',
          });
        });
    }

    //===== Aos Animation

    AOS.init({
        offset: 0,
        disable: function () {
            return isTouchDevice || isMobileViewport || prefersReducedMotion;
        }
    });

    // Document Ready

    $(function() {
        mainMenu();
        offCanvas();
        dynamicBackground();
    });

})(window.jQuery);
