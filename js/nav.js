"use strict";

$(function () {

    // --- Galerie Variablen ---
    let counter = 0,
        diashow,
        intervalSet = false,
        rotateDeg = 0;

    const pic = $(".gallery-img");
    const picDescr = $(".gallery-frame figcaption");
    const overlayGal = $("#overlayGal");

    // --- Dynamische Overlay-Elemente ---
    const elem = $("<img>").addClass("marginauto");
    const closeButton = $("<button>").addClass("marginCloseButton").text("×");
    const prevButton = $("<div>").addClass("marginPrevButton");
    const nextButton = $("<div>").addClass("marginNextButton");
    const playButton = $("<div>").addClass("marginDiaPlay");
    const stopButton = $("<div>").addClass("marginDiaStop");
    const rotateLeft = $("<div>").addClass("marginDiaRotLeft");
    const rotateRight = $("<div>").addClass("marginDiaRotRight");
    const currentPicDescr = $("<div>").addClass("marginCurrPicDescr");
    const currentPicNr = $("<div>").addClass("marginCurrPicNr");

    const minGalSlider = $("<div>").addClass("minGalContainer");
    const minGalFlex = $("<div>").addClass("minGalFlex");

    const diaShowBox = $("<div>").addClass("marginDiaContainer");
    const diaShowFlex = $("<div>").addClass("marginDiaFlex");

    // --- Navigation Highlight ---
    const highlightElements = (elements) => {
        elements.on("click", function () {
            elements.removeClass("active");
            $(this).addClass("active");
        });
    };
    highlightElements($(".ul_nav a:not(.logoMain)"));
    highlightElements($(".overlay a:not(.closebtn)"));

    // --- Navigation öffnen/schließen ---
    const openNav = () => $("#myNav").css("height", "100vh");
    const closeNav = () => $("#myNav").css("height", "0vh");
    $(".icon").on("click", openNav);
    $(".closebtn, .overlay-content a").on("click", closeNav);

    // --- Overlay Struktur ---
    minGalSlider.append(minGalFlex);
    overlayGal.append(
        currentPicDescr,
        minGalSlider,
        currentPicNr,
        prevButton,
        nextButton,
        playButton,
        stopButton,
        rotateLeft,
        rotateRight,
        closeButton,
        elem
    );

    diaShowFlex.append(playButton, stopButton, rotateLeft, rotateRight);
    diaShowBox.append(diaShowFlex);
    overlayGal.append(diaShowBox);

    // --- Minigalerie Bilder ---
    pic.each(function (i) {
        $("<img>", {
            class: "minGalImg",
            src: this.src,
            click: () => showImage(i)
        }).css("order", i).appendTo(minGalFlex);
    });

    // --- Bildanzeige aktualisieren ---
    function updateGallery() {
        const src = pic.eq(counter).attr("src");
        elem.attr("src", src);
        currentPicDescr.text(picDescr.eq(counter).text());
        currentPicNr.text(`${counter + 1} / ${pic.length}`);
        elem.css("transform", `translate(-50%, -50%) rotate(${rotateDeg}deg)`);
        elem.show();
    }

    // --- Fade Effekt ---
    function fadeEffect(callback) {
        elem.css({ transition: ".9s ease-out", opacity: 0.3 });
        setTimeout(() => {
            callback();
            elem.css("opacity", 1);
        }, 300);
    }

    // --- Navigation vorher/nächste ---
    const prevFn = () => { counter = (counter - 1 + pic.length) % pic.length; fadeEffect(updateGallery); };
    const nextFn = () => { counter = (counter + 1) % pic.length; fadeEffect(updateGallery); };

    // --- Diashow ---
    const playFn = () => {
        if (!intervalSet) {
            diashow = setInterval(nextFn, 3000);
            intervalSet = true;
        }
    };
    const stopFn = () => { clearInterval(diashow); intervalSet = false; };

    // --- Bildrotation ---
    const rotateImage = (deg) => {
        rotateDeg += deg;
        elem.css("transform", `translate(-50%, -50%) rotate(${rotateDeg}deg)`);
    };

    // --- Overlay schließen ---
    const closeFn = () => {
        overlayGal.hide();
        hideSlider();
        $("body").removeClass("overlay-active");
        stopFn();
        counter = 0;
        rotateDeg = 0;
    };

    // --- Event Bindings Overlay ---
    prevButton.on("click", prevFn);
    nextButton.on("click", nextFn);
    playButton.on("click", playFn);
    stopButton.on("click", stopFn);
    rotateLeft.on("click", () => rotateImage(-90));
    rotateRight.on("click", () => rotateImage(90));
    closeButton.on("click", closeFn);

    // --- Hauptbild Klick ---
    pic.on("click", function () {
        counter = pic.index(this);
        rotateDeg = 0;
        updateGallery();
        showSlider();
        overlayGal.show();
        $("body").addClass("overlay-active");
    });

    // --- Minigalerie Scroll ---
    let isDown = false, startX, scrollLeft;
    minGalFlex.on("mousedown", function (e) {
        isDown = true;
        startX = e.pageX - minGalFlex.offset().left;
        scrollLeft = minGalFlex.scrollLeft();
    });
    $(document).on("mousemove", function (e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - minGalFlex.offset().left;
        minGalFlex.scrollLeft(scrollLeft - (x - startX) * 3);
    }).on("mouseup", () => { isDown = false; });

    minGalFlex.on("wheel", function (e) {
        e.preventDefault();
        minGalFlex.scrollLeft(minGalFlex.scrollLeft() - e.originalEvent.deltaY);
    });

    // --- Bildanzeige aus Minigalerie ---
    function showImage(index) {
        counter = index;
        updateGallery();
        elem.fadeIn(300);
    }

    // Overlay öffnen
    function showSlider() {
        document.body.classList.add('overlay-gal-open');
    }

    // Overlay schließen
    function hideSlider() {
        document.body.classList.remove('overlay-gal-open');
    }



});
