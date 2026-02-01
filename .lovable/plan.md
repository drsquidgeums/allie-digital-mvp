

# Plan: Add Date Details to Task List Items

## The Issue
When tasks are added and displayed in the To Do list, there's no date or time information shown. The `TaskList` component only displays:
- Task text
- Points
- Color tag
- Delete button

Meanwhile, the `TaskCard` component (used elsewhere) does show the time but not the full date.

## What Will Change

### TaskList.tsx Enhancement
Add a date/time display to each task item showing when it was created. The format will be user-friendly:
- **Today**: Shows "Today at 2:30 PM"
- **Yesterday**: Shows "Yesterday at 10:15 AM"  
- **This week**: Shows "Mon at 3:45 PM"
- **Older**: Shows "15 Jan at 9:00 AM"

### Visual Layout
```text
Before:
+--------------------------------------------------+
| [✓]  Buy groceries              10 pts  [🏷️] [🗑️] |
+--------------------------------------------------+

After:
+--------------------------------------------------+
| [✓]  Buy groceries              10 pts  [🏷️] [🗑️] |
|      Today at 2:30 PM                            |
+--------------------------------------------------+
```

## Technical Details

### File to Modify
**src/components/dashboard/TaskList.tsx**

1. Create a helper function to format the date in a friendly way using `date-fns` (already installed)
2. Add a new line below the task text showing the formatted creation date
3. Style it with muted colors to keep the task text as the primary focus

### Implementation Approach
- Import `format`, `isToday`, `isYesterday`, `isThisWeek` from `date-fns`
- Add a `formatTaskDate()` function that returns contextual date strings
- Add a small text element below or beside the task text showing the date
- Use consistent styling with the rest of the interface (muted-foreground, text-xs)

### Optional Enhancement
Could also update `TaskCard.tsx` to show the full date instead of just the time, for consistency across both components.

