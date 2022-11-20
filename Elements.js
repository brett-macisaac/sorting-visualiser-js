import utils from "./utils.js";


class Elements
{
    constructor(aElements, aBtnStep, aChkStep)
    {
        this._elements = aElements;
        this._btnStep = aBtnStep;
        this._chkStep = aChkStep;

        // A stand-in value for a scroll bar that will eventually be used to determine the sleep length.
        this._sleepLength = 1;

        this._elementColours = 
        {
            default: "#",  // The elements' default colour.
            compared: "#", // The colour of the current two elements being compared.
            swapped: "#",  // The colour of the current two elements that have just been swapped.
            sorted: "#"    // If an element has been placed into its sorted position, it takes this colour.
        };
    }

    /*
    *

    * Parameters:
        > aStep: a flag that, when true, indicates that the program should wait for the user to click this._btnStep 
                 after each stage of the sorting process; otherwise, simply pause for a given period of time. 
    */
    async Sort(aSorter, aAscending)
    {
        await aSorter(this, aAscending);

        // for (let lIndexUnsortedUpper = this._elements.length - 1; lIndexUnsortedUpper > 0; --lIndexUnsortedUpper)
        // {
        //     for (let i = 1; i <= lIndexUnsortedUpper; ++i)
        //     {
        //         if (this._elements[i - 1].clientHeight > this._elements[i].clientHeight)
        //         {
        //             this.SwapElements(i - 1, i);
        //             await this.SleepOrStep();
        //         }
        //     }
        // }

    }

    async Shuffle()
    {
        for (let i = this._elements.length - 1; i > 0; --i)
        {
            const lIndexRandom = utils.GetRandom(0, i);

            this.SwapElements(i, lIndexRandom, false);
            await utils.SleepFor(this._sleepLength);
        }

    }

    async Compare(aIndex1, aCompOp, aIndex2)
    {
        // Set comparison colours.
        // await this.SleepOrStep()

        if (aCompOp === utils.CompOps.E)
        {
            return this._elements[aIndex1].clientHeight === this._elements[aIndex2].clientHeight;
        }
        else if (aCompOp === utils.CompOps.NE)
        {
            return this._elements[aIndex1].clientHeight !== this._elements[aIndex2].clientHeight;
        }
        else if (aCompOp === utils.CompOps.G)
        {
            return this._elements[aIndex1].clientHeight > this._elements[aIndex2].clientHeight;
        }
        else if (aCompOp === utils.CompOps.L)
        {
            return this._elements[aIndex1].clientHeight < this._elements[aIndex2].clientHeight;
        }
        else if (aCompOp === utils.CompOps.GE)
        {
            return this._elements[aIndex1].clientHeight >= this._elements[aIndex2].clientHeight;
        }
        else if (aCompOp === utils.CompOps.LE)
        {
            return this._elements[aIndex1].clientHeight >= this._elements[aIndex2].clientHeight;
        }
        else
        {
            console.log("The value of aCompOp doesn't correspond to a valid comparison operator.");
            return false;
        }

    }

    async SwapElements(aIndex1, aIndex2, aSleepOrStep = true)
    {
        const lHeight1 = this._elements[aIndex1].style.height;

        this._elements[aIndex1].style.height = this._elements[aIndex2].style.height;

        this._elements[aIndex2].style.height = lHeight1;

        if (aSleepOrStep)
            await this.SleepOrStep();
    }

    SleepOrStep()
    {
        if (this._chkStep.checked)
            return utils.SleepUntilClicks([this._btnStep, this._chkStep]);
        else
            return utils.SleepFor(this._sleepLength);
    }

    get length()
    {
        return this._elements.length;
    }

}

export { Elements as default };