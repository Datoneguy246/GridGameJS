/*
This script was edited from Carlos Delgado, 2019.
https://ourcodeworld.com
*/

let htmlCode = 
"<link href='https://fonts.googleapis.com/css2?family=Raleway:wght@300&display=swap' rel='stylesheet'>" +
"<style>body{margin: 0px;padding: 0px;text-align: right;font-family: 'Raleway', sans-serif;color: #FF9F1C;width: 400px;}</style>" +
"<canvas id='gameDisplay'></canvas>" +
"<p style='margin-top: 3px;'>Made with <strong>GridGame.js</strong></p>";

// Start file download.
document.getElementById("download").addEventListener("click", function(){
    // Generate download of hello.txt file with some content
    let playerScript = readTextFile("js/player.js");
    let code = document.getElementById("code").value;

    var text = htmlCode + "<textarea id='code' style='display: none;'>" + code + "</textarea>" + "<script>" + playerScript + "</script>" + "<script>window.onload = function(){ Run(); };</script>";
    var filename = "GridGame.html";
    
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}, false);

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    var allText;
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return allText;
}