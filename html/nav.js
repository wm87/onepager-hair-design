"use strict";

$(document).ready(function () {

    // Galerie Variablen
    let counter = 0, diashow, intervalSet = false, rotatePic = 0;
    let pic = $(".gallery-img");
    let picDescr = $(".gallery-frame figcaption");

    let overlayGal = $("#overlayGal");
    let elem = $("<img>").addClass("marginauto");
    let closeButton = $("<button>").addClass("marginCloseButton").text("×");
    let prevButton = $("<div>").addClass("marginPrevButton");
    let nextButton = $("<div>").addClass("marginNextButton");
    let playButton = $("<div>").addClass("marginDiaPlay");
    let stopButton = $("<div>").addClass("marginDiaStop");
    let rotateLeft = $("<div>").addClass("marginDiaRotLeft");
    let rotateRight = $("<div>").addClass("marginDiaRotRight");
    let currentPicDescr = $("<div>").addClass("marginCurrPicDescr");
    let currentPicNr = $("<div>").addClass("marginCurrPicNr");
    let minGalSlider = $("<div>").addClass("minGalContainer");
    let minGalFlex = $("<div>").addClass("minGalFlex");

    let diaShowBox = $("<div>").addClass("marginDiaContainer");
    let diaShowFlex = $("<div>").addClass("marginDiaFlex");

    function funcHighlight(elements) {
        elements.each(function () {
            $(this).on("click", function () {
                $(elements).removeClass("active");
                $(this).addClass("active");
            });
        });
    }

    funcHighlight($(".ul_nav a:not(.logoMain)"));
    funcHighlight($(".overlay a:not(.closebtn)"));

    function openNav() {
        $("#myNav").css("height", "100vh");
    }

    function closeNav() {
        $("#myNav").css("height", "0vh");
    }

    $(".icon").on("click", openNav);
    $(".closebtn, .overlay-content a").on("click", closeNav);

    minGalSlider.append(minGalFlex);
    overlayGal.append(currentPicDescr, minGalSlider, currentPicNr, prevButton, nextButton, playButton, stopButton, rotateLeft, rotateRight, closeButton, elem);

    diaShowFlex.append(playButton);
    diaShowFlex.append(stopButton);
    diaShowFlex.append(rotateLeft);
    diaShowFlex.append(rotateRight);

    diaShowBox.append(diaShowFlex);
    overlayGal.append(diaShowBox);

    // Minigalerie-Bilder erstellen
    pic.each(function (i) {
        let elemMin = $("<img>", {
            class: "minGalImg",
            src: $(this).attr("src"),
            click: function () {
                showMe($(this));
            }
        }).css("order", i);

        minGalFlex.append(elemMin);
    });

    function showMe(elemMin) {
        let imgSrc = elemMin.attr("src");
        counter = pic.toArray().findIndex(el => $(el).attr("src") === imgSrc);

        if (counter !== -1) {
            $(".marginauto").fadeIn(300, function () {
                $(this).attr("src", imgSrc).fadeIn(300);
            });

            $(".marginCurrPicDescr").text(picDescr.eq(counter).text());
            $(".marginCurrPicNr").text((counter + 1) + " / " + pic.length);
        }
    }

    function updateGallery() {
        elem.attr("src", pic.eq(counter).attr("src"));
        currentPicDescr.text(picDescr.eq(counter).text());
        currentPicNr.text(`${counter + 1} / ${pic.length}`);
    }

    function fadeEffect(callback) {
        elem.css({ transition: ".9s ease-out", opacity: "0.3" });
        setTimeout(() => {
            callback();
            elem.css("opacity", "1");
        }, 300);
    }

    function prevFn() {
        counter = (counter - 1 + pic.length) % pic.length;
        fadeEffect(updateGallery);
    }

    function nextFn() {
        counter = (counter + 1) % pic.length;
        fadeEffect(updateGallery);
    }

    function playFn() {
        if (!intervalSet) {
            diashow = setInterval(nextFn, 3000);
            intervalSet = true;
        }
    }

    function stopFn() {
        clearInterval(diashow);
        intervalSet = false;
    }

    function rotateImage(direction) {
        rotatePic += direction;
        elem.css("transform", `translateX(-50%) translateY(-50%) rotate(${rotatePic}deg)`);
    }

    function closeFn() {
        overlayGal.hide();
        $("body").removeClass("overlay-active");
        stopFn();
        counter = 0;
    }

    prevButton.on("click", prevFn);
    nextButton.on("click", nextFn);
    playButton.on("click", playFn);
    stopButton.on("click", stopFn);
    rotateLeft.on("click", () => rotateImage(-90));
    rotateRight.on("click", () => rotateImage(90));
    closeButton.on("click", closeFn);

    pic.on("click", function () {
        overlayGal.show();
        counter = pic.index(this);
        updateGallery();
        $("body").addClass("overlay-active"); // Scrollen verhindern
    });

    minGalFlex.on("mousedown", function (e) {
        let isDown = true;
        let startX = e.pageX - minGalFlex.offset().left;
        let scrollLeft = minGalFlex.scrollLeft();

        $(document).on("mousemove", function (e) {
            if (!isDown) return;
            e.preventDefault();
            let x = e.pageX - minGalFlex.offset().left;
            minGalFlex.scrollLeft(scrollLeft - (x - startX) * 3);
        }).on("mouseup", function () {
            isDown = false;
            $(document).off("mousemove mouseup");
        });
    });

    minGalFlex.on("wheel", function (e) {
        e.preventDefault();
        minGalFlex.scrollLeft(minGalFlex.scrollLeft() - e.originalEvent.deltaY);
    });
});
