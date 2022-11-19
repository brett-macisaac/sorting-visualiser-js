
console.log("Hello world!");


/*
* This function is called when the browser loads the window.
* It performs initial actions that must be made when the web app runs.
*/
function init()
{
    console.log("Hello world!");
    CreateElements(25);
}
//window.onload = init; // Call init when the browser loads the window.
init();


// Auxiliaries (X) =====================================================================================================

/* Auxiliary of init
* Creates the elements that are to be sorted and places them in the relevant container on the web page.

* Parameters:
    > aNumElements: the number of elements to generate.
*/
function CreateElements(aNumElements)
{
    // Validate aNumElements's type.
    if (typeof aNumElements !== 'number')
    {
        console.log("Elements not loaded: " + aNumElements + " must be a number.");
        return;
    }

    // The min and max number of elements: (lMinElements, lMaxElements].
    const lMinElements = 1;
    const lMaxElements = 1000;

    // Validate aNumElements's size.
    if (aNumElements < lMinElements || aNumElements > lMaxElements)
    {
        console.log("Elements not loaded: the number of elements must be between " + lMinElements + " and " + lMaxElements);
        return;
    }

    // The container that will hold the elements.
    const lElements = document.getElementById("elements");

    // The computed style of lElements (includes stylesheet styling, not just inline styling).
    // https://stackoverflow.com/questions/67914015/javascript-shows-empty-style-property-for-document-objects-that-i-have-styled-us
    const lElementsStyle = window.getComputedStyle(lElements);

    console.log(`Container width: ${lElementsStyle.width}.`);
    console.log(`Container height: ${lElementsStyle.height}.`);
    console.log(lElements);

    const lElementsWidth = Number(lElementsStyle.width.slice(0, lElementsStyle.width.length - 2));

    const lElementsHeight = Number(lElementsStyle.height.slice(0, lElementsStyle.height.length - 2));

    // The width of each element (integer value i.e. pixels).
    const lElementWidth = Math.floor(lElementsWidth / aNumElements);

    // Change lElements width so that it fits its elements exactly.
    lElements.style.width = `${lElementWidth * aNumElements}px`;

    console.log(`Element width: ${lElementWidth}.`);

    // Add the elements to lElements.
    for (let i = 0; i < aNumElements; ++i)
    {
        let lElement = document.createElement("div");

        lElement.setAttribute("class", "element");

        // Set lElement's height to a random proportion of lElements' height (between 1% and 100%). 
        lElement.style.height = `${Math.floor((GetRandom(1, 100) / 100) * lElementsHeight)}px`;

        // Set lElement's width.
        lElement.style.width = `${lElementWidth}px`;

        // Add lElement to lElements.
        lElements.appendChild(lElement);
    }


}

/*
* This function returns a random number between aMin and aMax (inclusive of both, i.e. [aMin, aMax]).

* Parameters:
    > aMin: the minimum value of the random number.
    > aMax: the maximum value of the random number.
*/
function GetRandom(aMin, aMax)
{
    return Math.floor(Math.random() * (aMax - aMin + 1)) + aMin;
}