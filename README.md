# Button State UI Widget for the NodeRed Dashboard
This is a simple widget for the NodeRed dashboard that displays many buttons that can be clicked to set a value, this value is then shown on the button's background color.

## Example interface
![Example](./img/example.png)

# Sending to input
To open the dialog send any message. If the response is "yes" it will output to the "yes" output, if no it will output to the "no" output. Additionally one can add the following to override the node properties:
```
{
    "options": {
        "icon": "",
        "title": "",
        "description": "",
        "timeoutSec": 10,

        //Change the colors (HTML colors)
        "iconColor": "",
        "textColor": "",
        "backgroundColor" ""
    }
    "payload": {}
}
```

# Output from the node
Will be the message sent on the input.
The top output is if the user clicked "yes" and the bottom is if the user clicked "no"