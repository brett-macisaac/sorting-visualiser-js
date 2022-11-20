
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

    CreateElements(25);

    PopulateComboBox();
}
window.onload = init; // Call init when the browser loads the window.
//init();


// Globals (X) =========================================================================================================

/*
* Colours which define the possible colours of the elements.
*/
const gElementColours = 
{
    default: "#",  // The elements' default colour.
    compared: "#", // The colour of the current two elements being compared.
    swapped: "#",  // The colour of the current two elements that have just been swapped.
    sorted: "#"    // If an element has been placed into its sorted position, it takes this colour.
};

//const gElements = document.getElementsByClassName("element");

const gElements = new Elements(document.getElementsByClassName("element"), document.getElementById("btnStep"), 
                               document.getElementById("chkStep"));

const gChkAscending = document.getElementById("chkAscending");

const gCmbSorters = document.getElementById("cmbSorters");


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

    // console.log(`Container width: ${lElementsStyle.width}.`);
    // console.log(`Container height: ${lElementsStyle.height}.`);
    // console.log(lElements);

    const lElementsWidth = Number(lElementsStyle.width.slice(0, lElementsStyle.width.length - 2));

    const lElementsHeight = Number(lElementsStyle.height.slice(0, lElementsStyle.height.length - 2));

    // The width of each element (integer value i.e. pixels).
    const lElementWidth = Math.floor(lElementsWidth / aNumElements);

    const lPaddingSides = 2 * Number(lElementsStyle.paddingLeft.slice(0, lElementsStyle.paddingLeft.length - 2));

    // Change lElements width so that it fits its elements exactly (make sure to update the left margin to re-centre it).
    lElements.style.width = `${lElementWidth * aNumElements}px`;
    lElements.style.marginLeft = `-${(lElementWidth * aNumElements + lPaddingSides) / 2}px`;

    // console.log(`Element width: ${lElementWidth}.`);

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
    SetDisabledSortShuffleButtons(true);

    //const lElements = document.getElementsByClassName("element");

    console.log("Sorter Name: " + gCmbSorters.options[gCmbSorters.selectedIndex].text)

    await gElements.Sort(sorters[gCmbSorters.options[gCmbSorters.selectedIndex].text], gChkAscending.checked);

    // for (let lIndexUnsortedUpper = gElements.length - 1; lIndexUnsortedUpper > 0; --lIndexUnsortedUpper)
    // {
    //     for (let i = 1; i <= lIndexUnsortedUpper; ++i)
    //     {
    //         if (gElements[i - 1].clientHeight > gElements[i].clientHeight)
    //         {
    //             SwapElements(gElements[i - 1], gElements[i]);
    //             await utils.sleep(1);
    //         }
    //     }
    // }

    SetDisabledSortShuffleButtons(false);
}

/* Auxiliary of init
* Shuffles the elements.
*/
async function ShuffleElements()
{
    SetDisabledSortShuffleButtons(true);

    await gElements.Shuffle();

    // const lElements = document.getElementsByClassName("element");

    // for (let i = lElements.length - 1; i > 0; --i)
    // {
    //     const lIndexRandom = utils.GetRandom(0, i);

    //     SwapElements(lElements[i], lElements[lIndexRandom]);
    //     await utils.sleep(1);
    // }

    SetDisabledSortShuffleButtons(false);
}

/* Auxiliary of
* Swaps the heights of the given elements.
*/
function SwapElements(aElement1, aElement2)
{
    const lHeight1 = aElement1.style.height;

    aElement1.style.height = aElement2.style.height;

    aElement2.style.height = lHeight1;
}

function SetDisabledSortShuffleButtons(aDisabled)
{
    document.getElementById("btnSort").disabled = aDisabled;
    document.getElementById("btnShuffle").disabled = aDisabled;
}