# Plot Stealer
Tool to fetch data contained in images of graphs.
<img width="2047" height="1098" alt="image" src="https://github.com/user-attachments/assets/5500975c-9d5f-4d1d-a27b-1fefad9cd94f" />
Available online at https://penndraken.github.io/plot-stealer/

# Why?
If you have a diagram containing data, in an image format where the original data is hard to fetch. By using this tool, you can quickly get an estimate of what the original data was. For example, this can  be useful to get native figures in a **Typst** document, or to perform statistical analysis.


---
# How to use
- Paste an image from your clipboard containing your graph.
- Fill in the data in the input fields according to the x and y-limits

<img width="101" height="285" alt="image" src="https://github.com/user-attachments/assets/3d3bb8ee-8cc9-496c-9983-65031ac6227d" />

<img width="1315" height="76" alt="image" src="https://github.com/user-attachments/assets/8771ea97-05c7-4ba4-a1ca-94e29fb66ebc" />

<img width="667" height="74" alt="image" src="https://github.com/user-attachments/assets/d556e20d-2deb-4d6a-a403-0a2a07e1f24d" />


- Align the xaxis and yaxis visually. This is done by using the drop down menu to select guide-lines to place on the diagram. For example, by selecting xmin and then left-clicking the figure, the location of the xmin value is set.

<img width="206" height="82" alt="image" src="https://github.com/user-attachments/assets/4579e715-72ac-4887-8213-1254533c3522" />

- Now, set the editing state to "Add Points". You can now mark the points that you want to fetch by left clicking.

<img width="180" height="71" alt="image" src="https://github.com/user-attachments/assets/c5e7046c-6263-461f-a37d-351232c8ae25" />

- Finally, your points are automatically transformed to the local scale of the graph, and can be copied from the text field. They're formatted as two arrays, where the top one is the x-coordinates, and the bottom one is the y-coordinates.

<img width="1998" height="129" alt="image" src="https://github.com/user-attachments/assets/53f75920-a662-4232-88f5-d3deaf642912" />


# Limitations
Currently there is only support for plots with linear steps in the x- and y-axis.
