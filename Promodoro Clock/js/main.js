// Your code here!
$(document).ready(function () {
    var breaktime = 5;
    var duration = 25;
    var playing = false;
    var state = "session";
    var t;
    var d = duration, c = 60, b = breaktime;
    Notification.requestPermission(function (permission) {
    });

    $(".minus").click(function () {
        var section = $(this).parent().parent();
        $(".sec").text("00");
        if (section.hasClass("break") && breaktime > 1) {
            breaktime--;
            section.find("span").text(breaktime + " min");
        }
        else if (section.hasClass("duration") && duration > 1) {
            duration--;
            section.find("span").text(duration + " min");
        }
        d = duration;
        b = breaktime;
        c = 60;
        state = "session";
        $(".inter .min").text(breaktime);
        $(".session .min").text(duration);
    });
    $(".plus").click(function () {
        var section = $(this).parent().parent();
        $(".sec").text("00");
        if (section.hasClass("break")) {
            breaktime++;
            section.find("span").text(breaktime + " min");
        }
        else if (section.hasClass("duration")) {
            duration++;
            section.find("span").text(duration + " min");
        }
        d = duration;
        b = breaktime;
        c = 60;
        state = "session";
        $(".inter .min").text(breaktime);
        $(".session .min").text(duration);
    });
    $(".play").click(function () {
        played();
    });
    function timedCount(elem) {
        if (state == "session") {
            var trans = 400 * (duration * 60 - (d - 1) * 60 - c) / (duration * 60);
            $(".inter").css("display", "none");
            $(".session").css("display", "block");
            $(".backg").addClass("backs").removeClass("backb");
            $(".backs").css({ "margin-top": trans + "px", "animation": "blinkgreen 2s infinite ease-in-out"});
            $(".clock").css("border", "1px solid green");
            if (c < 60) {
                elem.find(".min").text((d < 10) ? "0" + (d - 1) : (d - 1));
                if (d == 1) {
                    b = breaktime;
                }
            }
            else {
                elem.find(".min").text((d < 10) ? "0" + d : d);
            }
        }
        else {
            var trans2 = 400 * (breaktime * 60 - b * 60 - c) / (breaktime * 60);
            $(".session").css("display", "none");
            $(".inter").css("display", "block");
            $(".backg").addClass("backb").removeClass("backs");
            $(".backb").css({ "margin-top": trans2 + "px", "animation": "blinkred 2s infinite ease-in-out" });
            $(".clock").css("border", "1px solid red");
            if (c == 60) {
                elem.find(".min").text((b < 10) ? "0" + (b + 1) : (b + 1));
            }
            else {
                elem.find(".min").text((b < 10) ? "0" + b : b);
            }
        }
        if (c > 0) {
            elem.find(".sec").text((c == 60) ? "00" : ((c < 10) ? "0" + c : c));
            c--;//0
            t = setTimeout(function () { timedCount(elem); }, 1000);
        }
        else if (d > 1) {
            d--;//1
            c = 60;
            timedCount($(".session"));
        }
        else if (b > 0) {
            if (b == breaktime) {
                notifyMe("Take a break dude!! Have some tea...");
            }
            b--;
            c = 60;
            state = "break";
            timedCount($(".inter"));
        }
        else if (b == 0) {
            d = duration;
            c = 60;
            state = "session";
            notifyMe("Time to work!! The break time is over..");
            timedCount($(".session"));
        }
    }
    $(".next").click(function () {
        state = "session";
        b = breaktime;
        d = duration;
        playing = false;
        c = 60;
        $(".session .min").text(d);
        $(".inter .min").text(b);
        $(".sec").text("00");
        clearTimeout(t);
        played();
    });
    function played() {
        playing = !playing;
        if (!playing) {
            $(".plus,.minus").prop("disabled", false);
            $(".backs,.backb").css("animation", "none");
            $(".play").addClass("fa-play").removeClass("fa-pause");
            clearTimeout(t);
        }
        else {
            $(".plus,.minus").prop("disabled", true);
            $(".play").addClass("fa-pause").removeClass("fa-play");
            if (state == "session") {
                timedCount($(".session"));
            }
            else {
                timedCount($(".inter"));
            }
        }
    }
    //Notification API
    function notifyMe(msg) {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }

        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification(msg);
        }
    }
});