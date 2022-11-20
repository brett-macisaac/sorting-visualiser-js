import utils from "./utils.js";

async function BubbleSort(aElements, aAscending)
{
    // Determine the comparison operator to use.
    const lCompOp = aAscending ? utils.CompOps.G : utils.CompOps.L;

    for (let lIndexUnsortedUpper = aElements.length - 1; lIndexUnsortedUpper > 0; --lIndexUnsortedUpper)
    {
        for (let i = 1; i <= lIndexUnsortedUpper; ++i)
        {
            if (await aElements.Compare(i - 1, lCompOp, i))
            {
                await aElements.SwapElements(i - 1, i);
            }
        }
    }

}

const Sorters = 
{
    "Bubble Sort": BubbleSort
};

export { Sorters as default };