(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* header scroll state */
    var header = document.querySelector(".header");
    function onScroll() { header.classList.toggle("scrolled", window.scrollY > 10); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* mobile nav */
    var burger = document.querySelector(".burger");
    var mobileNav = document.querySelector(".mobile-nav");
    if (burger && mobileNav) {
        burger.addEventListener("click", function () { document.body.classList.toggle("menu-open"); });
        mobileNav.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () { document.body.classList.remove("menu-open"); });
        });
    }

    /* scroll reveal */
    var reveals = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && !reduceMotion) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0, rootMargin: "0px 0px -10% 0px" });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add("visible"); });
    }

    /* chat bubble sequence */
    var chatBody = document.querySelector("[data-chat]");
    if (!chatBody) return;

    var script = [
        { who: "user", text: "boleh ajar saya guna AI x?" },
        { who: "ai", text: "boleh! 6 modul percuma untuk Ting.1–6 😊" },
        { who: "user", text: "bila mula?" },
        { who: "ai", text: "taklimat 24 Ogos 2026, 2.30 ptg. jom daftar!" }
    ];

    if (reduceMotion) {
        chatBody.innerHTML = script.map(function (m) {
            return '<div class="bubble ' + m.who + ' show">' + m.text + "</div>";
        }).join("");
        return;
    }

    chatBody.innerHTML = "";
    var i = 0;

    function nextMessage() {
        if (i >= script.length) return;
        var m = script[i];

        var dots = document.createElement("div");
        dots.className = "typing-dots";
        dots.innerHTML = "<span></span><span></span><span></span>";
        chatBody.appendChild(dots);
        chatBody.scrollTop = chatBody.scrollHeight;

        setTimeout(function () {
            dots.remove();
            var bubble = document.createElement("div");
            bubble.className = "bubble " + m.who;
            bubble.textContent = m.text;
            chatBody.appendChild(bubble);
            requestAnimationFrame(function () { bubble.classList.add("show"); });
            i++;
            setTimeout(nextMessage, 650);
        }, 700);
    }

    var started = false;
    var chatObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !started) {
                started = true;
                setTimeout(nextMessage, 400);
                chatObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });
    chatObserver.observe(chatBody);
})();
