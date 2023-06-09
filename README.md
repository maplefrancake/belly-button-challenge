# belly-button-challenge
## Georgia Tech Data Analytics Bootcamp - Module 14 Challenge

We were challenged to create an interactive visualization dashboard for analyzing data of microbes growing in subject's navels. While gross in concept, the assignment itself was quite fascinating and difficult to complete. I challenged myself to separate things out into their own functions in JavaScript and make use of a few different built-in functions from Plotly to accomplish my tasks (e.g. Plotly.newPlot vs Plotly.restyle).

We needed to programmatically populate a dropdown list for users to select new subjects to analyze, instead of hardcoding each subject's id individually. There are three different items that needed to be initialized and updated with each new selection from the dropdown list of subjects. The first is the demographics card. This is simply a list of facts about the subject: ID, ethnicity, gender, etc. The second chart is a horizontal bar chart that displays the top ten microbes identified in their sample and how often they appeared in the data. The final chart is a bubble chart that displays all microbes in a sample and changes the size of each bubble depending on the count of appearances.
You can find the dashboard at [my Github page](https://maplefrancake.github.io/belly-button-challenge/index).
