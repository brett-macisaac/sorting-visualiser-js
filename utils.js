
function SleepFor(aSleepDuration)
{
    if (typeof aSleepDuration !== 'number')
    {
        console.log("aSleepDuration must be a number.");
    } 
    else if (aSleepDuration < 0)
    {
        console.log("aSleepDuration can't be negative.");
    }

    return new Promise (resolve => setTimeout(resolve, aSleepDuration));
}

//https://www.geeksforgeeks.org/how-to-pause-and-play-a-loop-in-javascript-using-event-listeners/
function SleepUntilClick(aElement)
{
    // Wait until the button is pressed.
    return new Promise(resolve => 
        {
            // The function to call when aButton is pressed.
            const RemoveListenerAndResolve = () =>
            {
                aElement.removeEventListener('click', RemoveListenerAndResolve);
                resolve("");
            }

            // Add an event listener that results in RemoveListenerAndResolve being called when aButton is clicked.
            aElement.addEventListener('click', RemoveListenerAndResolve);
        });
}

function SleepUntilClicks(aElements)
{
    if (!(aElements instanceof Array))
    {
        console.log("aElements must be an array.");
        return;
    }
    else if (!aElements.every(e => e instanceof Element))
    {
        console.log("Every item of aElements must be a DOM element.");
        return;
    }

    // Wait until the button is pressed.
    return new Promise(resolve => 
        {
            // The function to call when aButton is pressed.
            const RemoveListenersAndResolve = () =>
            {
                // Remove all of the listeners.
                aElements.forEach(e => e.removeEventListener('click', RemoveListenersAndResolve));

                resolve("");
            }
            
            // Add an event listener to each element that results in RemoveListenerAndResolve being called.
            // This means that any of the elements can be clicked to resolve the promise.
            aElements.forEach(e => e.addEventListener('click', RemoveListenersAndResolve));
        });
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

// An 'enum' for representing comparison operators.
const CompOps = Object.freeze(
    {
        E: 0,  // Equals (===)
        NE: 1, // Not Equals (!==)
        G: 2,  // Greater (>)
        L: 3,  // Less than (<)
        GE: 4, // Greater or Equal (>=)
        LE: 5  // Less than or Equal (<=)
    });

const utils =
{
    SleepFor: SleepFor,
    SleepUntilClick: SleepUntilClick,
    SleepUntilClicks: SleepUntilClicks,
    GetRandom: GetRandom,
    CompOps: CompOps
};

// Export functions.
export { utils as default };
