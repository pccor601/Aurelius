/*
 * Heidelberg Catechism — reusable quiz engine
 *
 * This file is shared by the chapter HTML files.
 * Do not put chapter-specific questions in this file.
 *
 * Each question must look like:
 *
 * <div class="question">
 *   ...
 *   <input type="radio" name="q1" value="a">
 *   ...
 *   <input type="hidden" name="q1_correct" value="d">
 *   <button type="button" class="help-button" data-section="section1">Help</button>
 * </div>
 *
 * The engine automatically detects however many .question elements exist.
 */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("quizForm");

    if (!form) {
        return;
    }

    const questions = form.querySelectorAll(".question");
    const scoreDisplay = document.getElementById("scoreDisplay");
    const helpButtons = form.querySelectorAll(".help-button");

    // Help buttons are disabled until the quiz has been scored.
    helpButtons.forEach(function (button) {
        button.disabled = true;

        button.addEventListener("click", function () {
            removeHighlight();

            const sectionId = button.dataset.section;
            const section = document.getElementById(sectionId);

            if (section) {
                section.classList.add("highlight");
                section.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        });
    });

    function removeHighlight() {
        document.querySelectorAll(".highlight").forEach(function (element) {
            element.classList.remove("highlight");
        });
    }

    function enableHelpButtons() {
        helpButtons.forEach(function (button) {
            button.disabled = false;
        });
    }

    window.scoreQuiz = function () {

        enableHelpButtons();

        let score = 0;
        const total = questions.length;

        questions.forEach(function (question) {

            // Find the correct answer associated with this question.
            const correctInput = question.querySelector(
                'input[type="hidden"][name$="_correct"]'
            );

            if (!correctInput) {
                return;
            }

            const correct = correctInput.value;

            // Find the answer selected by the student.
            const chosen = question.querySelector(
                'input[type="radio"]:checked'
            );

            // First remove any previous colouring.
            question.querySelectorAll("label").forEach(function (label) {
                label.style.background = "";
                label.style.padding = "3px";
            });

            // Colour the correct answer green and the student's wrong
            // answer red, if applicable.
            question.querySelectorAll("label").forEach(function (label) {

                const input = label.querySelector('input[type="radio"]');

                if (!input) {
                    return;
                }

                if (input.value === correct) {
                    label.style.background = "lightgreen";
                }

                if (
                    chosen &&
                    input.value === chosen.value &&
                    chosen.value !== correct
                ) {
                    label.style.background = "lightcoral";
                }
            });

            if (chosen && chosen.value === correct) {
                score++;
            }
        });

        if (scoreDisplay) {
            scoreDisplay.textContent = `Score: ${score} / ${total}`;
        }
    };
});
