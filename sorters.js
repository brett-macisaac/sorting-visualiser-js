import utils from "./utils.js";

async function BubbleSort(aElements, aAscending)
{
    // Determine the comparison operator to use.
    const lCompOp = aAscending ? utils.CompOps.G : utils.CompOps.L;

    for (let lIndexUnsortedUpper = aElements.length - 1; lIndexUnsortedUpper > 0; --lIndexUnsortedUpper)
    {
        for (let i = 1; i <= lIndexUnsortedUpper; ++i)
        {
            if (aElements.stop)
                return;

            if (await aElements.Compare(i - 1, lCompOp, i))
            {
                await aElements.Swap(i - 1, i);
            }
        }

        aElements.SetElementSorted(lIndexUnsortedUpper);
    }
    
    // The first element is guaranteed to be sorted (but its colour isn't set in the for loops).
    aElements.SetElementSorted(0);
}

async function CocktailShakerSort(aElements, aAscending)
{
    /* These two variables are the min and max indexes of the segment of aElements that is unsorted. Initially, the 
       entire array is unsorted. i.e. the unsorted segment ranges from index lIndexUnsortedLower to lIndexUnsortedUpper/
    */
    let lIndexUnsortedLower = 0; // The lowest index of the container's unsorted segment.
    let lIndexUnsortedUpper = aElements.length - 1; // The highest index of the container's unsorted segment.

    /* A flag that, when true, indicates that no swaps occurred during one iteration of the below while loop, 
       meaning that the array is sorted. 
    */
    let lNoSwaps;

    // The comparison operator that's used when going from low to high.
    const lCompOpLowToHigh = aAscending ? utils.CompOps.G : utils.CompOps.L;

    // The comparison operator that's used when going from low to high.
    const lCompOpHighToLow = aAscending ? utils.CompOps.L : utils.CompOps.G;

    /* Iterate until the unsorted segment has a size of zero. The size of the unsorted segment is 
    'lIndexUnsortedUpper - lIndexUnsortedLower + 1', meaning that if 
    lIndexUnsortedLower < lIndexUnsortedUpper, the size is 0 (or less).
    */
    while (lIndexUnsortedLower < lIndexUnsortedUpper)
    {
        // Reset the 'no swaps' flag to true; if a swap occurs, it's set to false.
        lNoSwaps = true;
        
        /* Get the highest value of the unsorted segment of the container and put it in the correct position 
        (index lIndexUnsortedUpper).
        */
        for (let i = lIndexUnsortedLower; i < lIndexUnsortedUpper; ++i) // Min to max (ascend).
        {
            if (aElements.stop)
                return;

            if (await aElements.Compare(i, lCompOpLowToHigh, i + 1, true))
            {
                await aElements.Swap(i, i + 1);
                lNoSwaps = false;
            }
            
        }
        await aElements.SetElementSorted(lIndexUnsortedUpper, true);
        --lIndexUnsortedUpper; // Decrease the size of the unsorted segment by 1.

        /* Get the lowest value of the unsorted segment of the container and put it in the correct position 
        (index lIndexUnsortedLower).
        */
        for (let i = lIndexUnsortedUpper; i > lIndexUnsortedLower; --i) // Max to min (descend).
        {
            if (aElements.stop)
                return;

            if (await aElements.Compare(i, lCompOpHighToLow, i - 1, true))
            { 
                await aElements.Swap(i, i - 1, true);
                lNoSwaps = false;
            }
            
        }
        await aElements.SetElementSorted(lIndexUnsortedLower, true);
        ++lIndexUnsortedLower; // Decrease the size of the unsorted segment by 1.
        
        // If no swaps occurred, the array is sorted; therefore, end the loop.
        if (lNoSwaps)
        { 
            await aElements.SetElementRangeColour(lIndexUnsortedLower - 1, lIndexUnsortedUpper + 1, aElements.colours.sorted, true);
            break; 
        }
        
    }

}

async function SelectionSort(aElements, aAscending)
{
    // Determine the comparison operator to use.
    const lCompOp = aAscending ? utils.CompOps.G : utils.CompOps.L;

    let lIndexElementToSwap;

    for (let lIndexUnsortedUpper = aElements.length - 1; lIndexUnsortedUpper > 0; --lIndexUnsortedUpper)
    {
        lIndexElementToSwap = 0;

        for (let i = 1; i <= lIndexUnsortedUpper; ++i)
        {
            if (aElements.stop)
                return;
            
            if (await aElements.Compare(i, lCompOp, lIndexElementToSwap))
            {
                lIndexElementToSwap = i;
            }
        }

        await aElements.Swap(lIndexElementToSwap, lIndexUnsortedUpper);

        aElements.SetElementSorted(lIndexUnsortedUpper);
    }

    // The first element is guaranteed to be sorted (but its colour isn't set in the for loops).
    aElements.SetElementSorted(0);
}  

async function InsertionSort(aElements, aAscending)
{
    // The value to insert upon each iteration of the for-loop.
    let lValueToInsert;
        
    // The number of values that are shifted in the while loop. This is only used to highlight the shifted elements.
    let lNumShifts = 0;
    
    // The operator to use in the while loop's condition.
    const lOperator = aAscending ? utils.CompOps.G : utils.CompOps.L;
    
    /* 
     * The segment of the array from index 'lIndexUnsortedMin' to 'aElements.length - 1' is the unsorted segment
       of the container. 
     * Initially, lIndexUnsortedMin is assigned the value 1, meaning that the value at index 0 is assumed to be sorted.
     * After each iteration of this for-loop, the size of the unsorted segment is reduced by 1.
    */
    for (let lIndexUnsortedMin = 1; lIndexUnsortedMin < aElements.length; ++lIndexUnsortedMin)
    {
        // The value to insert in this for-loop iteration is that at the lowest index of the array's unsorted segment.
        lValueToInsert = aElements.GetClientHeight(lIndexUnsortedMin);
        
        // Highlight the value that is to be inserted into the sorted segment.
        await aElements.SetElementColour(lIndexUnsortedMin, aElements.colours.compared, true);

        // Highlight the sorted segment.
        await aElements.SetElementRangeColour(0, lIndexUnsortedMin - 1, aElements.colours.swapped, true);

        // Remove colours.
        aElements.SetElementRangeColour(0, lIndexUnsortedMin, aElements.colours.default);

        // The index of the sublist at which lValueToInsert will be inserted.
        let lIndexOfInsert = lIndexUnsortedMin;

        for (; lIndexOfInsert > 0 && await aElements.CompareValue(lIndexOfInsert - 1, lOperator, lValueToInsert); 
             --lIndexOfInsert)
        {
            if (aElements.stop)
                return;

            aElements.SetHeight(lIndexOfInsert, aElements.GetHeight(lIndexOfInsert - 1));

            // Record the shift.
            ++lNumShifts;
        }

        aElements.SetHeight(lIndexOfInsert, `${lValueToInsert}px`);

        // Highlight the value that was inserted.
        await aElements.SetElementColour(lIndexOfInsert, aElements.colours.compared, false);
        
        // Highlight the values that were shifted up to accomodate for the value that was inserted.
        await aElements.SetElementRangeColour(lIndexOfInsert + 1, lIndexOfInsert + lNumShifts, aElements.colours.swapped, true);
        
        // Remove the highlights.
        //aElements.SetBarColour(lIndexOfInsertM1 + 1, BarColourEnum.Standard, false);
        await aElements.SetElementRangeColour(lIndexOfInsert, lIndexOfInsert + lNumShifts, aElements.colours.default, false);
        

        // Alternate form (while loop instead of for).
        // // The index below that at which lValueToInsert will be inserted ('m1' means 'minus 1').
        // let lIndexOfInsertM1 = lIndexUnsortedMin - 1;
 
        // /* Shift the elements of the sorted segment ( [0, lIndexUnsortedMin - 1] ) that are greated than 
        //    lValueToInsert one index/position up, which makes space for lValueToInsert to be inserted.  */
        // while (lIndexOfInsertM1 >= 0 && await aElements.CompareValue(lIndexOfInsertM1, lOperator, lValueToInsert))
        // {
        //     // Shift the value at index lIndexOfInsertM1 one index up.
        //     aElements.SetHeight(lIndexOfInsertM1 + 1, aElements.GetHeight(lIndexOfInsertM1));
            
        //     // Record the shift.
        //     ++lNumShifts;
            
        //     // Decrement the insertion index.
        //     --lIndexOfInsertM1;
        // }
        
        // // Insert lValueToInsert at the insertion index.
        // aElements.SetHeight(lIndexOfInsertM1 + 1, `${lValueToInsert}px`);
        
        // // Highlight the value that was inserted.
        // await aElements.SetElementColour(lIndexOfInsertM1 + 1, aElements.colours.compared, false);
        
        // // Highlight the values that were shifted up to accomodate for the value that was inserted.
        // await aElements.SetElementRangeColour(lIndexOfInsertM1 + 2, lIndexOfInsertM1 + 1 + lNumShifts, aElements.colours.swapped, true);
        
        // // Remove the highlights.
        // //aElements.SetBarColour(lIndexOfInsertM1 + 1, BarColourEnum.Standard, false);
        // await aElements.SetElementRangeColour(lIndexOfInsertM1 + 1, lIndexOfInsertM1 + 1 + lNumShifts, aElements.colours.default, false);
        
        // Clear the number of shifts.
        lNumShifts = 0;
    }

    aElements.SetElementRangeColour(0, aElements.length - 1, aElements.colours.sorted, true);
}

async function QuickSort(aElements, aAscending)
{
    const lOperator = aAscending ? utils.CompOps.G : utils.CompOps.L;

    const lColourSortIndex = "#0f5099";

    const SortValue = async (aElements, aStart, aEnd) =>
    {
        // The index of the value that is to be placed into its sorted position.
        let lIndexPivot = aEnd;

        // The index at which lIndexPivot's value will ultimately be placed.
        let lIndexOfSort = aStart;

        // Highlight the segment from aStart to aEnd.
        await aElements.SetElementRangeColour(aStart, aEnd, aElements.colours.swapped, true);

        // Highlight the value that is to be placed into its sorted position.
        await aElements.SetElementColour(lIndexPivot, aElements.colours.compared, true);

        // Remove colours.
        aElements.SetElementRangeColour(aStart, aEnd, aElements.colours.default);
        
        // Highlight the index lIndexOfSort.
        await aElements.SetElementColour(lIndexOfSort, lColourSortIndex, true);

        for (let i = aStart; i < aEnd; ++i)
        {
            if (aElements.stop)
                return;

            if (await aElements.Compare(lIndexPivot, lOperator, i))
            {
                // Swap current value with the one at lIndexOfSort.
                if (i !== lIndexOfSort)
                    await aElements.Swap(i, lIndexOfSort, true);

                aElements.SetElementColour(lIndexOfSort, aElements.colours.default);
                ++lIndexOfSort;
                await aElements.SetElementColour(lIndexOfSort, lColourSortIndex, true);
            }
            else if (i === lIndexOfSort)
            {
                await aElements.SetElementColour(lIndexOfSort, lColourSortIndex, true); 
            }
    
        }

        // Move the pivot's value into its sorted position.
        if (lIndexOfSort !== lIndexPivot)
        { await aElements.Swap(lIndexOfSort, lIndexPivot, true); }

        // Indicate that the value at lIndexOfSort is in its sorted position.
        await aElements.SetElementSorted(lIndexOfSort, true);

        // Return the index of the value sorted by this algorithm.
        return lIndexOfSort;
    }

    const SplitElements = async (aElements, aStart, aEnd) => 
    {
        if (aElements.stop) return;

        if (aStart < aEnd)
        {
            const lIndexSortedValue = await SortValue(aElements, aStart, aEnd);

            if (aElements.stop) return;

            // Highlight the lower segment.
            await aElements.SetElementRangeColour(aStart, lIndexSortedValue - 1, aElements.colours.compared, false);

            if (aElements.stop) return;

            // Highlight the upper segment.
            await aElements.SetElementRangeColour(lIndexSortedValue + 1, aEnd, aElements.colours.swapped, true);

            // Remove colours.
            aElements.SetElementRangeColour(aStart, lIndexSortedValue - 1, aElements.colours.default);
            aElements.SetElementRangeColour(lIndexSortedValue + 1, aEnd, aElements.colours.default);

            await SplitElements(aElements, aStart, lIndexSortedValue - 1);

            await SplitElements(aElements, lIndexSortedValue + 1, aEnd);
        }
        else if (aStart === aEnd)
        {
            await aElements.SetElementSorted(aStart, true);
        }

    }

    /* If await isn't used here, the user can still interact with UI elements that they shouldn't be able to. This is
       because when an 'await' is encountered within SplitElements, SplitElements is removed from the call stack, 
       meaning that QuickSort can continue, which results in QuickSort ending prematurely, which causes gElements.Sort(...)
       to return, after which DisableUIForSorting is called with a false argument, which causes the UI elements to be 
       enabled before the sorting process has completed.  */
    await SplitElements(aElements, 0, aElements.length - 1);
}

async function QuickSortRandomPivot(aElements, aAscending)
{
    const lOperator = aAscending ? utils.CompOps.G : utils.CompOps.L;

    const lColourSortIndex = "#0f5099";

    const SortValue = async (aElements, aStart, aEnd) =>
    {
        // The index of the value that is to be placed into its sorted position.
        let lIndexPivot = utils.GetRandom(aStart, aEnd);

        await aElements.Swap(lIndexPivot, aEnd, true);

        lIndexPivot = aEnd;

        // The index at which lIndexPivot's value will ultimately be placed.
        let lIndexOfSort = aStart;

        // Highlight the segment from aStart to aEnd.
        await aElements.SetElementRangeColour(aStart, aEnd, aElements.colours.swapped, true);

        // Highlight the value that is to be placed into its sorted position.
        await aElements.SetElementColour(lIndexPivot, aElements.colours.compared, true);

        // Remove colours.
        aElements.SetElementRangeColour(aStart, aEnd, aElements.colours.default);
        
        // Highlight the index lIndexOfSort.
        await aElements.SetElementColour(lIndexOfSort, lColourSortIndex, true);

        for (let i = aStart; i < aEnd; ++i)
        {   
            if (aElements.stop)
                return;

            if (await aElements.Compare(lIndexPivot, lOperator, i))
            {
                // Swap current value with the one at lIndexOfSort.
                if (i != lIndexOfSort)
                    await aElements.Swap(i, lIndexOfSort, true);

                aElements.SetElementColour(lIndexOfSort, aElements.colours.default);
                ++lIndexOfSort;
                await aElements.SetElementColour(lIndexOfSort, lColourSortIndex, true);
            }
            else if (i == lIndexOfSort)
            {
                await aElements.SetElementColour(lIndexOfSort, lColourSortIndex, true); 
            }
    
        }

        // Move the pivot's value into its sorted position.
        if (lIndexOfSort != lIndexPivot)
        { await aElements.Swap(lIndexOfSort, lIndexPivot, true); }

        // Indicate that the value at lIndexOfSort is in its sorted position.
        await aElements.SetElementSorted(lIndexOfSort, true);

        // Return the index of the value sorted by this algorithm.
        return lIndexOfSort;
    }

    const SplitElements = async (aElements, aStart, aEnd) => 
    {
        if (aElements.stop) return;

        if (aStart < aEnd)
        {
            const lIndexSortedValue = await SortValue(aElements, aStart, aEnd);

            if (aElements.stop) return;

            // Highlight the lower segment.
            await aElements.SetElementRangeColour(aStart, lIndexSortedValue - 1, aElements.colours.compared, false);

            if (aElements.stop) return;

            // Highlight the upper segment.
            await aElements.SetElementRangeColour(lIndexSortedValue + 1, aEnd, aElements.colours.swapped, true);

            // Remove colours.
            aElements.SetElementRangeColour(aStart, lIndexSortedValue - 1, aElements.colours.default);
            aElements.SetElementRangeColour(lIndexSortedValue + 1, aEnd, aElements.colours.default);

            await SplitElements(aElements, aStart, lIndexSortedValue - 1);

            await SplitElements(aElements, lIndexSortedValue + 1, aEnd);
        }
        else if (aStart === aEnd)
        {
            await aElements.SetElementSorted(aStart, true);
        }

    }

    await SplitElements(aElements, 0, aElements.length - 1);
}

async function MergeSort(aElements, aAscending)
{
    const lOperator = aAscending ? utils.CompOps.LE : utils.CompOps.GE;

    const lColourUpper = "#0f5099";
    const lColourLower = "#cc241f";
    const lColourMerged = "#5226a3";

    const Merge = async (aElements, aStart, aMid, aEnd) =>
    {
        if (aElements.stop)
            return;

        // Change the colours of the two segments.
        aElements.SetElementRangeColour(aStart, aMid, lColourLower, false);
        await aElements.SetElementRangeColour(aMid + 1, aEnd, lColourUpper, true);

        // Remove the colours.
        await aElements.SetElementRangeColour(aStart, aEnd, aElements.colours.default, true);
        
        // Create a temporary container to house the merged segment.
        const lSizeOfMerger = aEnd - aStart + 1; // Size of merged segment.
        let lMerger = Array(lSizeOfMerger); // Array to hold the merged values of lower and upper segments.

        // (a). The current indexes of the lower and upper segments, respectively.
        let lIndexLowerSegment = aStart;
        let lIndexUpperSegment = aMid + 1;

        // (b). The 'current' index of lMerger.
        let lMergerIndex = 0;
        
        // The purpose of this while loop is to populate lMerger with all elements from lower and upper segments.
        while (true) // (c).
        {
            if (aElements.stop)
                return;

            if (lIndexLowerSegment <= aMid && lIndexUpperSegment <= aEnd) // (d).
            {
                if (await aElements.Compare(lIndexLowerSegment, lOperator, lIndexUpperSegment, true)) // (e).
                {
                    lMerger[lMergerIndex++] = aElements.GetHeight(lIndexLowerSegment++);
                }
                else // (f).
                {
                    lMerger[lMergerIndex++] = aElements.GetHeight(lIndexUpperSegment++);
                }
                
            }
            else if (lIndexLowerSegment <= aMid) // (g).
            {
                lMerger[lMergerIndex++] = aElements.GetHeight(lIndexLowerSegment++);
            }
            else if (lIndexUpperSegment <= aEnd) // (h).
            {
                lMerger[lMergerIndex++] = aElements.GetHeight(lIndexUpperSegment++);
            }
            else // (i).
            {
                break;
            }
            
        }

        // Change the colours of the two segments.
        aElements.SetElementRangeColour(aStart, aMid, lColourLower, false);
        await aElements.SetElementRangeColour(aMid + 1, aEnd, lColourUpper, true);

        // Copy the values from lMerger into the appropriate indexes of aElements.
        for (let i = aStart; i <= aEnd; ++i) 
        { 
            if (aElements.stop)
                return;

            aElements.SetHeight(i, lMerger[i - aStart]);
            await aElements.SetElementColour(i, lColourMerged, true);
        }
        
        // Remove the colours.
        aElements.SetElementRangeColour(aStart, aEnd, aElements.colours.default, false);
    }

    const SplitAndMerge = async (aElements, aStart, aEnd) => 
    {
        if (aStart >= aEnd)
        { return; }
        
        // Calculate the middle index.
        let lMid = Math.floor((aStart + aEnd) / 2);

        if (aElements.stop)
            return;
        
        // Highlight the lower segment (the segment that is about to be split).
        aElements.SetElementRangeColour(aStart, lMid, lColourLower);

        // Highlight the upper segment (the segment that is about to be split).
        await aElements.SetElementRangeColour(lMid + 1, aEnd, lColourUpper, true);

        // Remove the colour on the upper segment.
        await aElements.SetElementRangeColour(lMid + 1, aEnd, aElements.colours.default, true);
        
        // Split and merge the lower half of the current segment (aStart to lMid).
        // Once this returns, said lower half will have been sorted.
        await SplitAndMerge(aElements, aStart, lMid);

        if (aElements.stop)
            return;

        // Highlight the lower segment (the segment that is about to be split).
        aElements.SetElementRangeColour(aStart, lMid, lColourLower);

        // Highlight the upper segment (the segment that is about to be split).
        await aElements.SetElementRangeColour(lMid + 1, aEnd, lColourUpper, true);

        // Remove the colour on the lower segment.
        await aElements.SetElementRangeColour(aStart, lMid, aElements.colours.default, true);
        
        // Continue to split and merge the upper half of the current segment (lMid + 1 to aEnd).
        // Once this returns, said upper half will have been sorted.
        await SplitAndMerge(aElements, lMid + 1, aEnd);
        
        // Combine the lower (aStart to lMid) and upper (lMid + 1 to aEnd) segments which, individually, are sorted.
        await Merge(aElements, aStart, lMid, aEnd);
    }

    await SplitAndMerge(aElements, 0, aElements.length - 1);

    aElements.SetElementRangeColour(0, aElements.length - 1, aElements.colours.sorted, true);
}

async function MergeSortIterative(aElements, aAscending)
{
    const lOperator = aAscending ? utils.CompOps.LE : utils.CompOps.GE;

    const lColourUpper = "#0f5099";
    const lColourLower = "#cc241f";
    const lColourMerged = "#5226a3";

    const Merge = async (aElements, aStart, aMid, aEnd) =>
    {
        if (aElements.stop) return;

        // Change the colours of the two segments.
        aElements.SetElementRangeColour(aStart, aMid, lColourLower, false);
        await aElements.SetElementRangeColour(aMid + 1, aEnd, lColourUpper, true);

        if (aElements.stop) return;

        // Remove the colours.
        await aElements.SetElementRangeColour(aStart, aEnd, aElements.colours.default, true);
        
        // Create a temporary container to house the merged segment.
        const lSizeOfMerger = aEnd - aStart + 1; // Size of merged segment.
        let lMerger = Array(lSizeOfMerger); // Array to hold the merged values of lower and upper segments.

        // (a). The current indexes of the lower and upper segments, respectively.
        let lIndexLowerSegment = aStart;
        let lIndexUpperSegment = aMid + 1;

        // (b). The 'current' index of lMerger.
        let lMergerIndex = 0;
        
        // The purpose of this while loop is to populate lMerger with all elements from lower and upper segments.
        while (true) // (c).
        {
            if (aElements.stop) return;

            if (lIndexLowerSegment <= aMid && lIndexUpperSegment <= aEnd) // (d).
            {
                if (await aElements.Compare(lIndexLowerSegment, lOperator, lIndexUpperSegment, true)) // (e).
                {
                    lMerger[lMergerIndex++] = aElements.GetHeight(lIndexLowerSegment++);
                }
                else // (f).
                {
                    lMerger[lMergerIndex++] = aElements.GetHeight(lIndexUpperSegment++);
                }
                
            }
            else if (lIndexLowerSegment <= aMid) // (g).
            {
                lMerger[lMergerIndex++] = aElements.GetHeight(lIndexLowerSegment++);
            }
            else if (lIndexUpperSegment <= aEnd) // (h).
            {
                lMerger[lMergerIndex++] = aElements.GetHeight(lIndexUpperSegment++);
            }
            else // (i).
            {
                break;
            }
            
        }

        // Change the colours of the two segments.
        aElements.SetElementRangeColour(aStart, aMid, lColourLower, false);
        await aElements.SetElementRangeColour(aMid + 1, aEnd, lColourUpper, true);

        // Copy the values from lMerger into the appropriate indexes of aElements.
        for (let i = aStart; i <= aEnd; ++i) 
        { 
            if (aElements.stop) return;

            aElements.SetHeight(i, lMerger[i - aStart]);
            await aElements.SetElementColour(i, lColourMerged, true);
        }
        
        // Remove the colours.
        aElements.SetElementRangeColour(aStart, aEnd, aElements.colours.default, false);
    }

    // (a).
    let l_segment_size; // Current size of segment to split and merge (range: 2 to l_max_segment_size).
    let l_start; // First index of segment (first index of lower half).
    let l_mid; // Middle index of segment (last index of lower half, first index of lower half).
    let l_end; // Last index of segment (last index of upper half).

    // (b). Not necessary to make these variables, but it does help with readability.
    let l_container_max_index = aElements.length - 1;
    let l_container_size = aElements.length;

    // (c). Calculate and store the maximum length of a segment.
    let l_max_segment_size = 1;
    while (l_max_segment_size < l_container_size)
    { l_max_segment_size *= 2; }

    for (l_segment_size = 2; l_segment_size <= l_max_segment_size; l_segment_size *= 2) // (d).
    {
        for (l_start = 0; l_start <= l_container_max_index - Math.floor(l_segment_size / 2); l_start += l_segment_size) // (e).
        {
            // (f). Calculate middle index of segment lStart to lEnd (max index of lower half).
            l_mid = l_start + Math.floor((l_segment_size / 2)) - 1;

            // (g). Calculate max index of segment lStart to lEnd (max index of upper half).
            let l_end_candidate = l_start + l_segment_size - 1;
            if (l_end_candidate < l_container_max_index)
            {
                l_end = l_end_candidate;
            }
            else
            {
                l_end = l_container_max_index;
            }

            // Combine the lower (lStart to lMid) and upper (lMid + 1 to lEnd) halves of the current segment.
            await Merge(aElements, l_start, l_mid, l_end);

            if (aElements.stop) return;
        }
        
    }

    aElements.SetElementRangeColour(0, aElements.length - 1, aElements.colours.sorted, true);
}

async function HeapSort(aElements, aAscending)
{
    const MaxHeapify = async (aElements, aIndexLastNode, aIndexParentNode) => 
    {
        // (a).
        let lIndexMaxValue = aIndexParentNode;

        // (b).
        let lIndexLeftChild = 2 * aIndexParentNode + 1;
        let lIndexRightChild = 2 * aIndexParentNode + 2;

        if (lIndexLeftChild <= aIndexLastNode) // (c). If valid index.
        {
            // Reassign the max index if the left child's value is higher than that of its parent.
            if (await aElements.Compare(lIndexLeftChild, utils.CompOps.G, lIndexMaxValue, true))
            {
                lIndexMaxValue = lIndexLeftChild;
            }

        }

        if (lIndexRightChild <= aIndexLastNode) // (c). If valid index.
        {
            // Reassign the max index if the right child's value is higher than that of the current max.
            if (await aElements.Compare(lIndexRightChild, utils.CompOps.G, lIndexMaxValue, true))
            {
                lIndexMaxValue = lIndexRightChild;
            }
            
        }

        if (lIndexMaxValue != aIndexParentNode) // (d).
        {
            // Swap value of current parent with that of its highest-value child (whose value is higher than its). 
            await aElements.Swap(lIndexMaxValue, aIndexParentNode, true);

            await MaxHeapify(aElements, aIndexLastNode, lIndexMaxValue); // (e).
        }

    }

    const MinHeapify = async (aElements, aIndexLastNode, aIndexParentNode) => 
    {
        // (a).
        let lIndexMinValue = aIndexParentNode;

        // (b).
        let lIndexLeftChild = 2 * aIndexParentNode + 1;
        let lIndexRightChild = 2 * aIndexParentNode + 2;

        if (lIndexLeftChild <= aIndexLastNode) // (c). If valid index.
        {
            // Reassign the max index if the left child's value is higher than that of its parent.
            if (await aElements.Compare(lIndexLeftChild, utils.CompOps.L, lIndexMinValue, true))
            {
                lIndexMinValue = lIndexLeftChild;
            }

        }

        if (lIndexRightChild <= aIndexLastNode) // (c). If valid index.
        {
            // Reassign the max index if the right child's value is higher than that of the current max.
            if (await aElements.Compare(lIndexRightChild, utils.CompOps.L, lIndexMinValue, true))
            {
                lIndexMinValue = lIndexRightChild;
            }
            
        }

        if (lIndexMinValue != aIndexParentNode) // (d).
        {
            // Swap value of current parent with that of its highest-value child (whose value is higher than its). 
            await aElements.Swap(lIndexMinValue, aIndexParentNode, true);

            await MinHeapify(aElements, aIndexLastNode, lIndexMinValue); // (e).
        }

    }


    let lIndexLowestParentNode = Math.floor((aElements.length / 2) - 1);

    for (let i = lIndexLowestParentNode; i >= 0; --i)
    {
        if (aElements.stop) return;

        aAscending ? await MaxHeapify(aElements, aElements.length - 1, i) : 
                     await MinHeapify(aElements, aElements.length - 1, i);
    }

    for (let lIndexLastNode = aElements.length - 1; lIndexLastNode >= 0;)
    {
        if (aElements.stop) return;

        await aElements.Swap(0, lIndexLastNode, true);

        if (aElements.stop) return;
        
        await aElements.SetElementSorted(lIndexLastNode, true);

        if (aElements.stop) return;

        aAscending ? await MaxHeapify(aElements, --lIndexLastNode, 0) : 
                     await MinHeapify(aElements, --lIndexLastNode, 0);     
    }

}

async function ShellSort(aElements, aAscending)
{
    // source: https://www.geeksforgeeks.org/shellsort/

    // The operator to use in the while loop's condition.
    const lOperator = aAscending ? utils.CompOps.G : utils.CompOps.L;

    let n = aElements.length;
  
    /*
    * Perform insertion sort on all sublists of aElements where each sublist is comprised of elements of aElements that
      are 'gap' indexes apart from each other.
    */
    for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap / 2))
    {
        // The maximum index (which is an index of aElements) of the current sublist.
        let lIndexMaxSubList = gap;

        /*
        * Each iteration of this for loop performs an insertion sort on one of the sublists. 
        * A sublist's size, given by lIndexMaxSubList, is increased by 1 every time it is iterated over.
        * Each successive iteration of the loop focuses on a different sublist. Each sublist is iterated over several 
          times (equal to its (final) length minus 1).
        * Each sublist mustn't contain the same element as another sublist.
        * The number of elements in a sublist is, at most, n / gap (s = n /gap); the number of sublists is n / s.
        */
        for (; lIndexMaxSubList < n; ++lIndexMaxSubList)
        {
            const lValueToInsert = aElements.GetClientHeight(lIndexMaxSubList); //= arr[i];

            // The index of the sublist at which lValueToInsert will be inserted.
            let lIndexOfInsert = lIndexMaxSubList;

            // The lowest index of the sublist.
            let lIndexMinSublist = lIndexMaxSubList % gap;

            for (; lIndexOfInsert > lIndexMinSublist && await aElements.CompareValue(lIndexOfInsert - gap, lOperator, lValueToInsert); 
                   lIndexOfInsert -= gap)
            {
                if (aElements.stop) return;

                aElements.SetHeight(lIndexOfInsert, aElements.GetHeight(lIndexOfInsert - gap));
            }

            aElements.SetHeight(lIndexOfInsert, `${lValueToInsert}px`);
        }

    }

    aElements.SetElementRangeColour(0, aElements.length - 1, aElements.colours.sorted, true);
}

const Sorters = 
{
    "Bubble Sort": BubbleSort,
    "Cocktail-Shaker Sort": CocktailShakerSort,
    "Selection Sort": SelectionSort,
    "Insertion Sort": InsertionSort,
    "Quick Sort": QuickSort,
    "Quick Sort (Random)": QuickSortRandomPivot,
    "Merge Sort": MergeSort,
    "Merge Sort (Iterative)": MergeSortIterative,
    "Heap Sort": HeapSort,
    "Shell Sort": ShellSort
};

export { Sorters as default };