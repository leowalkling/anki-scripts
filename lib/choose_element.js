var cookie = require('cookie');
var isCookiesAllowed = function () {
    "use strict";
    return (location.protocol === 'file' || location.protocol === 'http');
};
function getCandidates() {
    "use strict";
    var selector_higherOrder = '.choose1,.choose2,.choose3,.choose4,.choose5';
    return document.querySelectorAll(selector_higherOrder);
}
function getChoiceSetIdOfCandidate(element) {
    "use strict";
    var choiceSetId = element.className.match(/(?:^|\s)choose[12345](?!\S)/)[0];
    if (choiceSetId) {
        choiceSetId = choiceSetId.trim();
    }
    return choiceSetId;
}
function getChoiceSetIndexFromId(choiceSetId) {
    "use strict";
    return parseInt(choiceSetId.match(/[12345]$/), 10) - 1;
}
function getChoiceIdOfCandidate(element) {
    "use strict";
    return element.getAttribute('data-choice');
}
function initializeChoiceSets() {
    "use strict";
    var choiceSets = [],
        i;
    for (i = 0; i < 5; i += 1) {
        choiceSets.push({
            choices: [],
            choiceSetId: 'choose' + (i + 1),
            choiceIds: []
        });
    }
    return choiceSets;
}
function populateChoiceSets() {
    "use strict";
    var candidates = getCandidates(),
        choiceSets = initializeChoiceSets(),
        i,
        currentCandidate,
        choiceSetId,
        choiceSetIndex,
        choiceId,
        currentChoiceSet,
        currentChoiceIndex;
    for (i = 0; i < candidates.length; i += 1) {
        currentCandidate = candidates[i];
        choiceSetId = getChoiceSetIdOfCandidate(currentCandidate);
        choiceSetIndex = getChoiceSetIndexFromId(choiceSetId);
        choiceId = getChoiceIdOfCandidate(currentCandidate);
        currentChoiceSet = choiceSets[choiceSetIndex];

        if (currentChoiceSet.choiceIds.lastIndexOf(choiceId) === -1) {
            currentChoiceSet.choiceIds.push(choiceId);
            currentChoiceSet.choices.push([]);
        }

        currentChoiceIndex = currentChoiceSet.choiceIds.lastIndexOf(choiceId);
        currentChoiceSet.choices[currentChoiceIndex].push(currentCandidate);
    }
    return choiceSets;
}
module.exports = function (reset_cookies) {
    "use strict";
    var choiceSets,
        i,
        j,
        k;

    choiceSets = populateChoiceSets();

    for (i = 0; i < 5; i += 1) {
        var currentChoiceSet = choiceSets[i];
        var cookies = cookie.parse(document.cookie);
        var chosenIndex;
        var chosenId;
        if (reset_cookies || cookies[currentChoiceSet.choiceSetId] === undefined || currentChoiceSet.choiceIds.lastIndexOf(cookies[currentChoiceSet.choiceSetId]) === -1) {
            chosenIndex = Math.floor(Math.random() * currentChoiceSet.choiceIds.length);
            chosenId = currentChoiceSet.choiceIds[chosenIndex];
            if (isCookiesAllowed()) {
                document.cookie = cookie.serialize(currentChoiceSet.choiceSetId, chosenId);
            }
        } else {
            chosenId = cookies[currentChoiceSet.choiceSetId];
            chosenIndex = currentChoiceSet.choiceIds.lastIndexOf(chosenId);
        }

        for (j = 0; j < currentChoiceSet.choices.length; j += 1) {
            if (j !== chosenIndex) {
                var chosenElements = currentChoiceSet.choices[j];
                for (k = 0; k < chosenElements.length; k += 1) {
                    var currentElement = chosenElements[k];
                    // TODO: Maybe remove parent as well (if only child and user desires it)
                    currentElement.parentNode.removeChild(currentElement);
                }
            }
        }
    }
};