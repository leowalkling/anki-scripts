var cookie = require('cookie');
var isCookiesAllowed = function () {
    "use strict";
    return (location.protocol === 'file:' || location.protocol === 'http:');
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
function getChoiceSetIndexOfCandidate(element) {
    "use strict";
    var choiceSetId = getChoiceSetIdOfCandidate(element);
    return getChoiceSetIndexFromId(choiceSetId);
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
function addChoiceIdToChoiceSet(choiceSet, choiceId) {
    "use strict";
    choiceSet.choiceIds.push(choiceId);
    choiceSet.choices.push([]);
}
function hasChoiceId(choiceSet, choiceId) {
    "use strict";
    return choiceSet.choiceIds.lastIndexOf(choiceId) === -1;
}
function getChoiceSetForCandidate(choiceSets, element) {
    "use strict";
    return choiceSets[getChoiceSetIndexOfCandidate(element)];
}
function getChoiceIndexForId(choiceSet, choiceId) {
    "use strict";
    return choiceSet.choiceIds.lastIndexOf(choiceId);
}
function addCandidateToChoiceSet(choiceSet, element) {
    "use strict";
    var choiceId = getChoiceIdOfCandidate(element),
        choiceIndex;

    if (hasChoiceId(choiceSet, choiceId)) {
        addChoiceIdToChoiceSet(choiceSet, choiceId);
    }

    choiceIndex = getChoiceIndexForId(choiceSet, choiceId);
    choiceSet.choices[choiceIndex].push(element);
}
function addToCorrespondingChoiceSet(choiceSets, candidate) {
    "use strict";
    var choiceSetOfCandidate = getChoiceSetForCandidate(choiceSets, candidate);
    addCandidateToChoiceSet(choiceSetOfCandidate, candidate);
}
function populateChoiceSets() {
    "use strict";
    var candidates = getCandidates(),
        choiceSets = initializeChoiceSets(),
        i;
    for (i = 0; i < candidates.length; i += 1) {
        addToCorrespondingChoiceSet(choiceSets, candidates[i]);
    }
    return choiceSets;
}
function chooseIndexFromCookieOrRandom(choiceSet, reset_cookies) {
    "use strict";

    if (choiceSet === undefined || choiceSet.choices.length <= 0 || choiceSet.choices.length !== choiceSet.choiceIds.length) {
        throw {
            name: "Invalid Argument",
            level: "Assertion",
            message: "choiceSet invalid",
            toString: function () {
                return this.name + ": " + this.message;
            }
        };
    }

    var chosenIndex,
        chosenId,
        cookies = cookie.parse(document.cookie);
    if (reset_cookies || cookies[choiceSet.choiceSetId] === undefined || choiceSet.choiceIds.lastIndexOf(cookies[choiceSet.choiceSetId]) === -1) {
        chosenIndex = Math.floor(Math.random() * choiceSet.choiceIds.length);
        chosenId = choiceSet.choiceIds[chosenIndex];
        if (isCookiesAllowed()) {
            document.cookie = cookie.serialize(choiceSet.choiceSetId, chosenId);
        }
    } else {
        chosenId = cookies[choiceSet.choiceSetId];
        chosenIndex = choiceSet.choiceIds.lastIndexOf(chosenId);
    }
    return chosenIndex;
}
module.exports = function (reset_cookies) {
    "use strict";
    var choiceSets,
        i,
        j,
        k;

    choiceSets = populateChoiceSets();

    for (i = 0; i < 5; i += 1) {
        var currentChoiceSet = choiceSets[i],
            chosenIndex;
        if (currentChoiceSet.choices.length > 0) {
            chosenIndex = chooseIndexFromCookieOrRandom(currentChoiceSet, reset_cookies);
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
    }
};