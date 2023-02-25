import utils from "./utils.js";


class Elements
{
    constructor(aElements, aBtnStop, aBtnStep, aChkStep, aRngSpeed, aLblAccesses, aLblWrites)
    {
        this._elements = aElements;
        this._btnStop = aBtnStop;
        this._btnStep = aBtnStep;
        this._chkStep = aChkStep;
        this._rngSpeed = aRngSpeed;
        this._lblAccesses = aLblAccesses;
        this._lblWrites = aLblWrites;

        // A stand-in value for a scroll bar that will eventually be used to determine the sleep length.
        this._sleepLength = 1;

        // A flag that, when true, indicates that the current process (sort or shuffle), should stop.
        this._stopProcess = false;


        this._elementColours = 
        {
            default:  "#b9b9b9",  // The elements' default colour.
            compared: "#cc241f", // The colour of the current two elements being compared.
            swapped:  "#cf7622",  // The colour of the current two elements that have just been swapped.
            sorted:   "#36bd1b"   // If an element has been placed into its sorted position, it takes this colour.
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
        this.Reset();

        await aSorter(this, aAscending);

        this.ResetElementsColour();
    }

    async Shuffle()
    {
        for (let i = this._elements.length - 1; i > 0; --i)
        {
            if (this._stopProcess)
                break;

            const lIndexRandom = utils.GetRandom(0, i);

            this.Swap(i, lIndexRandom, false);
            await utils.SleepFor(this._sleepLength);
        }

        this.ResetElementsColour();

        this.Reset()
    }

    Stop()
    {
        this._stopProcess = true;
    }

    async Compare(aIndex1, aCompOp, aIndex2)
    {
        // Set comparison colours.
        await this.SetElementsColourTemporarily(aIndex1, aIndex2, this._elementColours.compared);

        if (aCompOp === utils.CompOps.E)
        {
            return this.GetClientHeight(aIndex1) === this.GetClientHeight(aIndex2);
        }
        else if (aCompOp === utils.CompOps.NE)
        {
            return this.GetClientHeight(aIndex1) !== this.GetClientHeight(aIndex2);
        }
        else if (aCompOp === utils.CompOps.G)
        {
            return this.GetClientHeight(aIndex1) > this.GetClientHeight(aIndex2);
        }
        else if (aCompOp === utils.CompOps.L)
        {
            return this.GetClientHeight(aIndex1) < this.GetClientHeight(aIndex2);
        }
        else if (aCompOp === utils.CompOps.GE)
        {
            return this.GetClientHeight(aIndex1) >= this.GetClientHeight(aIndex2);
        }
        else if (aCompOp === utils.CompOps.LE)
        {
            return this.GetClientHeight(aIndex1) <= this.GetClientHeight(aIndex2);
        }
        else
        {
            console.log("The value of aCompOp doesn't correspond to a valid comparison operator.");
            return false;
        }

    }

    async CompareValue(aIndex, aCompOp, aValue)
    {
        // Set comparison colours.
        await this.SetElementColourTemporarily(aIndex, this._elementColours.compared);

        if (aCompOp === utils.CompOps.E)
        {
            return this.GetClientHeight(aIndex) === aValue;
        }
        else if (aCompOp === utils.CompOps.NE)
        {
            return this.GetClientHeight(aIndex) !== aValue;
        }
        else if (aCompOp === utils.CompOps.G)
        {
            return this.GetClientHeight(aIndex) > aValue;
        }
        else if (aCompOp === utils.CompOps.L)
        {
            return this.GetClientHeight(aIndex) < aValue;
        }
        else if (aCompOp === utils.CompOps.GE)
        {
            return this.GetClientHeight(aIndex) >= aValue;
        }
        else if (aCompOp === utils.CompOps.LE)
        {
            return this.GetClientHeight(aIndex) >= aValue;
        }
        else
        {
            console.log("The value of aCompOp doesn't correspond to a valid comparison operator.");
            return false;
        }

    }

    async Swap(aIndex1, aIndex2, aSleepOrStep = true)
    {
        const lHeight1 = this.GetHeight(aIndex1);

        this.SetHeight(aIndex1, this.GetHeight(aIndex2));

        this.SetHeight(aIndex2, lHeight1);

        if (aSleepOrStep)
            await this.SetElementsColourTemporarily(aIndex1, aIndex2, this._elementColours.swapped);
    }

    async SetElementsColourTemporarily(aIndex1, aIndex2, aColour)
    {
        this.SetElementsColour(aIndex1, aIndex2, aColour);

        await this.SleepOrStep();

        this.SetElementsColour(aIndex1, aIndex2, this._elementColours.default);
    }

    async SetElementColourTemporarily(aIndex, aColour)
    {
        await this.SetElementColour(aIndex, aColour, true);

        this.SetElementColour(aIndex, this._elementColours.default);
    }

    ResetElementsColour()
    {
        this.SetElementRangeColour(0, this._elements.length - 1, this._elementColours.default);
    }

    async SetElementRangeColour(aIndexStart, aIndexEnd, aColour, aSleepOrStep = false)
    {
        for (let i = aIndexStart; i <= aIndexEnd; ++i)
            this.SetElementColour(i, aColour, false);

        if (aSleepOrStep)
            await this.SleepOrStep();
    }

    async SetElementsColour(aIndex1, aIndex2, aColour, aSleepOrStep = false)
    {
        this.SetElementColour(aIndex1, aColour);
        this.SetElementColour(aIndex2, aColour);

        if (aSleepOrStep)
            await this.SleepOrStep();
    }

    async SetElementSorted(aIndex, aSleepOrStep = false)
    {
        this.SetElementColour(aIndex, this._elementColours.sorted);

        if (aSleepOrStep)
            await this.SleepOrStep();
    }

    async SetElementColour(aIndex, aColour, aSleepOrStep = false)
    {
        this._elements[aIndex].style.background = aColour;

        if (aSleepOrStep)
            await this.SleepOrStep();
    }

    SleepOrStep()
    {
        if (this._chkStep.checked)
            return utils.SleepUntilClicks([this._btnStop, this._btnStep, this._chkStep]);
        else
            return utils.SleepFor(Number(this._rngSpeed.value));
    }

    IncrementAccesses()
    {
        let lCurrentValue = Number(this._lblAccesses.innerText);

        ++lCurrentValue;

        this._lblAccesses.innerText = lCurrentValue;
    }

    IncrementWrites()
    {
        let lCurrentValue = Number(this._lblWrites.innerText);

        ++lCurrentValue;

        this._lblWrites.innerText = lCurrentValue;
    }

    Reset()
    {
        this._lblAccesses.innerText = 0;
        this._lblWrites.innerText = 0;
        this._stopProcess = false;
    }

    GetClientHeight(aIndex)
    {
        this.IncrementAccesses();

        return this._elements[aIndex].clientHeight;
    }

    GetHeight(aIndex)
    {
        this.IncrementAccesses();

        return this._elements[aIndex].style.height;
    }

    SetHeight(aIndex, aValue)
    {
        this.IncrementWrites();

        this._elements[aIndex].style.height = aValue;
    }

    get colours()
    {
        return this._elementColours;
    }

    get length()
    {
        return this._elements.length;
    }

    get elements()
    {
        return this._elements;
    }

    get stop()
    {
        return this._stopProcess
    }

}

export { Elements as default };