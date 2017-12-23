function upperCase(Str)
{
    
    var upCase = Str.split(" ");
        for(i = 0; i < upCase.length; i++)
        {
            upCase[i] = upCase[i].charAt(0).toUpperCase() + upCase[i].slice(1);
        }
        Str = upCase.join(" ");
        return Str;
}

function e(elementType, text, attributes, styles) {
        var newElement = document.createElement(elementType);
        newElement.textContent = text;

        //set the attributes on the tag
        for (var i = 0; i < attributes.length; i++) {
        var attr = attributes[i];
        newElement.setAttribute(attr[0], attr[1]);
        }

        //set the styles
        for (var j = 0; j < styles.length; j++) {
        var style = styles[j];
        newElement.style[style[0]] = style[1];
        }

        return newElement;
        }

        /*var a = e("a", "link to google", [['href', "http://www.google.com"]], [['color', "red"]]);
        document.body.appendChild(a);*/
