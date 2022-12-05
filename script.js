
import utils from "./utils.js";
import Elements from "./Elements.js";
import sorters from "./sorters.js";

/*
* This function is called when the browser loads the window.
* It performs initial actions that must be made when the web app runs.
*/
function init()
{
    document.getElementById("btnSort").onclick = SortElements;
    document.getElementById("btnShuffle").onclick = ShuffleElements;
    document.getElementById("rngElements").onchange = SetNumElements;

    CreateElements(Number(document.getElementById("rngElements").value));

    PopulateComboBox();
}
window.onload = init; // Call init when the browser loads the window.
//init();


// Globals (X) =========================================================================================================

const gElements = new Elements(document.getElementsByClassName("element"), document.getElementById("btnStep"), 
                               document.getElementById("chkStep"), document.getElementById("rngSpeed"),
                               document.querySelector("div#statAccesses > span"), 
                               document.querySelector("div#statWrites > span"));

// The original width (in px) of the elements' container object. This should be retained due to the user's ability to
// alter the number of elements, which may alter the container's width.
const gWidthElementsOriginal = window.getComputedStyle(document.getElementById("elements")).width;

const gBtnSort = document.getElementById("btnSort");

const gBtnShuffle = document.getElementById("btnShuffle");

const gChkAscending = document.getElementById("chkAscending");

const gCmbSorters = document.getElementById("cmbSorters");

const gRngNumElements = document.getElementById("rngElements");


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

    console.log(aNumElements);

    // The min and max number of elements: (lMinElements, lMaxElements].
    const lMinElements = 10;
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

    // console.log(`Container width: ${lElementsStyle.width}.`);
    // console.log(`Container height: ${lElementsStyle.height}.`);
    console.log(lElements);

    // The dimensions of the container's content (i.e. not including padding or border).
    let lElementsWidth, lElementsHeight;

    // Set the container's dimensions (see https://www.w3schools.com/cssref/css3_pr_box-sizing.php)
    if (lElementsStyle.boxSizing === 'border-box')
    {
        // The horizontal (left and right) and vertical (top and bottom) padding of the container.
        // note: left and right padding are assumed to be the same, as well as top and bottom.
        const lPaddingHorizontal = 2 * Number(lElementsStyle.paddingLeft.slice(0, lElementsStyle.paddingLeft.length - 2));
        const lPaddingVertical = 2 * Number(lElementsStyle.paddingTop.slice(0, lElementsStyle.paddingTop.length - 2));
        
        // Set container's dimensions (padding and border not included, as box-sizing isn't set to 'border-box').
        lElementsWidth = Number(lElementsStyle.width.slice(0, lElementsStyle.width.length - 2)) - lPaddingHorizontal;
        lElementsHeight = Number(lElementsStyle.height.slice(0, lElementsStyle.height.length - 2)) - lPaddingVertical;
    }
    else
    {
        // Set container's dimensions (padding and border not included, as box-sizing isn't set to 'border-box').
        lElementsWidth = Number(lElementsStyle.width.slice(0, lElementsStyle.width.length - 2));
        lElementsHeight = Number(lElementsStyle.height.slice(0, lElementsStyle.height.length - 2));
    }

    // The width of each element (integer value i.e. pixels).
    let lElementWidth = Math.floor(lElementsWidth / aNumElements);

    if (lElementWidth === 0)
        lElementWidth = 1;

    // Change lElements width so that it fits its elements exactly.
    if (lElementsStyle.boxSizing === 'border-box')
    {
        const lPaddingHorizontal = 2 * Number(lElementsStyle.paddingLeft.slice(0, lElementsStyle.paddingLeft.length - 2));

        // Because 'box-sizing: border-box' results in padding being included in the element's width, it must be added.
        lElements.style.width = `${lElementWidth * aNumElements + lPaddingHorizontal}px`;
    }
    else
    {
        lElements.style.width = `${lElementWidth * aNumElements}px`;
    }

    // Add the elements to lElements.
    for (let i = 0; i < aNumElements; ++i)
    {
        let lElementWrapper = document.createElement("div");
        lElementWrapper.setAttribute("class", "elementWrapper");
        lElementWrapper.style.width = `${lElementWidth}px`;

        let lElement = document.createElement("div");

        lElement.setAttribute("class", "element");

        // Set lElement's height to a random proportion of lElements' height (between 1% and 100%). 
        lElement.style.height = `${Math.floor((utils.GetRandom(1, 100) / 100) * lElementsHeight)}px`;

        // Set lElement's width.
        lElement.style.width = `${lElementWidth}px`;

        // Add lElement to lElements.
        lElements.appendChild(lElementWrapper).appendChild(lElement);
    }


}

function SetNumElements()
{
    // The number of elements that the user wants to create.
    const lNewNum = Number(gRngNumElements.value);

    // If the current number of elements is the same as that selected by the user, return.
    if (lNewNum === gElements.length)
        return;

    // The container that holds the elements.
    const lElements = document.getElementById("elements");

    // Remove all children of lElements.
    while(lElements.firstChild)
        lElements.removeChild(lElements.firstChild);

    // Reset the container's width.
    lElements.style.width = gWidthElementsOriginal;

    // Create the new elements according to the user's input.
    CreateElements(Number(gRngNumElements.value));

    // Note: the _elements field of gElements (of type HTMLCollection) updates itself automatically.
}

function PopulateComboBox()
{
    Object.keys(sorters).forEach(sorter =>
        {
            const lOption = document.createElement("option");

            lOption.textContent = sorter;

            gCmbSorters.appendChild(lOption);
            //gCmbSorters.appendChild(document.createElement("option").setAttribute("innerHTML", sorter));
        });
}

/* Auxiliary of init
* Begins the sorting process.
*/
async function SortElements()
{
    DisableUIForSorting(true);

    //const lElements = document.getElementsByClassName("element");

    console.log("Sorter Name: " + gCmbSorters.options[gCmbSorters.selectedIndex].text)

    await gElements.Sort(sorters[gCmbSorters.options[gCmbSorters.selectedIndex].text], gChkAscending.checked);

    DisableUIForSorting(false);
}

/* Auxiliary of init
* Shuffles the elements.
*/
async function ShuffleElements()
{
    DisableUIForSorting(true);

    await gElements.Shuffle();

    DisableUIForSorting(false);
}

function DisableUIForSorting(aDisabled)
{
    gChkAscending.disabled = aDisabled;
    gBtnSort.disabled = aDisabled;
    gBtnShuffle.disabled = aDisabled;
    gCmbSorters.disabled = aDisabled;
    gRngNumElements.disabled = aDisabled;
}