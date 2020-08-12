let BUILD = true;

class Color{
    constructor(r, g, b)
    {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

class Object{
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y
        this.w = w;
        this.h = h;
        this.color = new Color(0, 0, 0);
    }
}

//Class that displays grid
class Display{
    constructor(FR)
    {
        this.FR = FR;
        this.Grid = true;
        this.TBF = (1 / FR) * 1000;
        this.background = 'rgb(255, 255, 255)';
        this.grid = [
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','','']
        ];
    }

    Draw()
    {
        let canvas = document.getElementById('gameDisplay');
        canvas.width = 400;
        canvas.height = 400;
        let drawer = canvas.getContext('2d');

        // Draw Grid
        let x;
        let y;
        for(x = 0; x < 8; x++)
        {
            for(y = 0; y < 8; y++)
            {
                drawer.beginPath();
                drawer.rect(x * 50, y * 50, 50, 50);
                if(this.grid[x][y] == '')
                {
                    drawer.fillStyle = this.background;
                }
                else
                {
                    drawer.fillStyle = this.grid[x][y];
                }

                if(this.Grid && !BUILD)
                {
                    drawer.lineWidth = 3;
                    drawer.stroke();
                }
            
                drawer.fill();
                this.grid[x][y] = '';
            }
        }
    }

    ToggleGrid()
    {
        this.Grid = !this.Grid;

        let buttonText = this.Grid == true ? "Grid: On" : "Grid: Off";
        document.getElementById('gridToggle').innerHTML = buttonText; 
    }
}
display = new Display(30);
setInterval(function() { display.Draw(); }, display.TBF);

// User functions
let isRunning = false;
let button;

function Run()
{
    let code = document.getElementById('code').value;
    if(BUILD)
    {
        let commentless = code.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
        if(commentless.includes('display'))
        {
            Log("Cannot access 'display' property");
            return;
        }
        if(commentless.includes('document'))
        {
            Log("Cannot access 'document' property");
            return;
        }

        //Add update function
        if(commentless.includes('function Update()'))
        {
            let index = 0;
            for(let c = 0; c < code.length - 7; c++)
            {
                if(code.slice(c, c + 8) == 'Update()')
                {
                    index = c + 9;
                }
            }
            code = 'setInterval(Update, display.TBF);' + code;
        }
        console.log(code);
        let f = new Function(code);
        return (f());
    }else{
        button = document.getElementById('runButton');
    }

    if(!isRunning)
    {
        button.innerHTML = 'Stop';
        isRunning = true;
        let commentless = code.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
        if(commentless.includes('display'))
        {
            Log("Cannot access 'display' property");
            return;
        }
        if(commentless.includes('document'))
        {
            Log("Cannot access 'document' property");
            return;
        }

        //Add update function
        if(commentless.includes('function Update()'))
        {
            let index = 0;
            for(let c = 0; c < code.length - 7; c++)
            {
                if(code.slice(c, c + 8) == 'Update()')
                {
                    index = c + 9;
                }
            }
            code = code.slice(0, index) + "if(!isRunning){ clearInterval(updating); }" + code.slice(index);
            code = 'let updating = setInterval(Update, display.TBF);' + code;
        }
        let f = new Function(code);
        return (f());
    }else{
        display.grid = [
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','','']
        ];
        button.innerHTML = 'Run';
        display.background = 'rgb(255, 255, 255)';
        isRunning = false;
        sessionStorage.clear();
    }
}

function Log(msg)
{
    if(!BUILD)
    {
        let console = document.getElementById('console');
        var p = document.createElement('p');
        var txt = document.createTextNode(msg);
        p.appendChild(txt);
        console.appendChild(p);
    }else{
        console.log(msg);
    }
}

function SetBackground(color)
{
    display.background = 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';
}

let curKeycode = 0;
function isPressing(key)
{
    var index = 0;
    var keycode = key.charCodeAt(index);
    if(keycode == curKeycode)
    {
        curKeycode = 0;
        return true;
    }
}

document.addEventListener('keypress', function(event) {
    curKeycode = event.keyCode;
});

//Object functions (not done in class for simpler syntax. sorry)
function DrawObject(object)
{
    for(let x = object.x; x < object.x + object.w; x++)
    {
        for(let y = object.y; y < object.y + object.h; y++)
        {
            if(x > 7)
            {
                x = 7;
                object.x = 7;
            }
            
            if(x < 0)
            {
                x = 0;
                object.x = 0;
            }

            if(y > 7)
            {
                y = 7;
                object.y = 7;
            }
                
            if(y < 0)
            {
                y = 0;
                object.y = 0;
            }

            display.grid[x][y] = 'rgb(' + object.color.r + ', ' + object.color.g + ', ' + object.color.b + ')';
        }
    }
}