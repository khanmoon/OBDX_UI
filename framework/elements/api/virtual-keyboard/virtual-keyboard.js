define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/virtual-keypad",
    "ojs/ojpopup",
    "ojs/ojinputtext"
], function(ko, $, resources) {
    "use strict";
    return function(rootParams) {
        var self = this;
        self.id = Math.random().toString(36).substring(7);
        self.value = rootParams.value;
        self.resource = resources;

        function shuffle(array) {
            var currentIndex = array.length,
                temporaryValue, randomIndex;
            while (currentIndex !== 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        }

        function is_touch_device() {
            try {
                document.createEvent("TouchEvent");
                return !rootParams.baseModel.large();
            } catch (e) {
                return false;
            }
        }

        function generateNumberOrChar(type) {
            var array = [],
                i;

            if (type === "num") {
                for (i = 0; i < 10; i++) {
                    array.push(i);
                }
            } else {
                for (i = 0; i < 26; i++) {
                    array.push(String.fromCharCode(97 + i));
                }
            }

            return array;
        }

        self.numbers = shuffle(generateNumberOrChar("num"));

        var alphabets = shuffle(generateNumberOrChar());
        self.firstRowAlphabets = alphabets.splice(0, 10);
        self.secondRowAlphabets = alphabets.splice(0, 9);
        self.thirdRowAlphabets = alphabets;
        self.showVirtualKeypad = !is_touch_device();
        var shift = false,
            capslock = false;
        $(document).on("click", "#keyboard" + self.id + " li", function() {
            var $this = $(this),
                character = $this.html();
            // Shift keys
            if ($this.hasClass("left-shift") || $this.hasClass("right-shift")) {
                $(".letter").toggleClass("uppercase");
                $(".symbol span").toggle();
                shift = shift !== true;
                capslock = false;
                return false;
            }
            // Caps lock
            if ($this.hasClass("capslock")) {
                $(".letter").toggleClass("uppercase");
                capslock = true;
                return false;
            }
            // Delete
            if ($this.hasClass("delete")) {
                self.value(self.value() ? self.value().substr(0, self.value().length - 1) : null);
                return false;
            }
            // Special characters
            if ($this.hasClass("symbol")) character = $("span:visible", $this).html();
            if ($this.hasClass("space")) character = " ";
            if ($this.hasClass("tab")) character = "\t";
            if ($this.hasClass("return")) character = "\n";

            // Uppercase letter
            if ($this.hasClass("uppercase")) character = character.toUpperCase();

            // Remove shift once a key is clicked.
            if (shift === true) {
                $(".symbol span").toggle();
                if (capslock === false) $(".letter").toggleClass("uppercase");

                shift = false;
            }
            // Add the character
            self.value((self.value() || "") + character);
        });
        self.openVirtualKeyPad = function() {
            self.value("");
            document.querySelector("#popup" + self.id).open("#" + rootParams.element);
        };
    };
});