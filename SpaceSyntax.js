// Kyle Gonzalez 
// Space Syntax

const TERRAIN_X_SIZE = 100;
const TERRAIN_Y_SIZE = 100;
const CELL_OPTIONS = 9;
const RELIEF_SCALE = 0.02;

const NORTH = 0;
const SOUTH = 1;
const WEST = 2;
const EAST = 3;

const PENDING = -1;
const E = 0;
const L = 1;
const LINK = 1;
const CONFLICT = 2;
const R = 3;
const G = 4;
const B = 5;
const C = 6;
const M = 7;
const Y = 8;

let maps = [ // Random
    [
        [4, 4, 4], 
        [4, 1, 5],
        [5, 5, 1]
    ],
    [
        [0, 0, 0, 0, 0],
        [3, 1, 5, 2, 2],
        [0, 7, 2, 2, 2],
        [0, 2, 0, 0, 2],
        [0, 2, 2, 2, 1]
    ],
    [
        [6, 6, 7, 7],
        [1, 6, 7, 6],
        [7, 8, 7, 4],
        [0, 7, 0, 1]
    ]
];
/*let maps = [
    [
        [C, C, C],
        [C, M, M],
        [M, M, L]
    ],
    [
        [L, Y, Y],
        [Y, Y, C],
        [C, C, C]
    ]
];*/

/*let maps = [ // Earth
    [
        [B, B],
        [B, L]
    ],
    [
        [Y, Y],
        [L, Y]
    ],
    [
        [E, G, G],
        [E, E, G],
        [G, E, L]
    ]
];*/

/*let maps = [ // Mondrian
    [
        [R, R, R, R],
        [G, G, L, G]
    ],
    [
        [C, C, C, C],
        [Y, Y, L, Y]
    ],
    [
        [G, B],
        [G, L],
        [G, B],
        [G, B]
    ],
    [
        [Y, M],
        [Y, L],
        [Y, M],
        [Y, M]
    ]
];*/

/*let maps = [ // Pattern
    [
        [R, G, L],
        [G, R, G],
        [R, G, R]
    ],
    [
        [L, B, G],
        [B, G, B],
        [G, B, G]
    ],
    [
        [C, Y, C],
        [Y, C, Y],
        [L, Y, C]
    ],
    [
        [Y, M, Y],
        [M, Y, M],
        [Y, M, L]
    ]
];*/

/*let maps = [ // Crater
    [
        [R, R, R],
        [R, R, R],
        [R, R, L]
    ],
    [
        [L, E, E],
        [E, E, E],
        [E, E, E]
    ],
    [
        [E, E, E],
        [E, E, E],
        [L, E, E]
    ],
    [
        [E, E, L],
        [E, E, E],
        [E, E, E]
    ],
    [
        [E, E, E],
        [E, E, E],
        [E, E, L]
    ]
];*/

let adjacencies = [
    []
];

function generateAdjacencies(m)
{
    let adjacencies = [];

    for(let i = 0; i < m.length; ++i)
    {
        adjacencies.push([]); // Per map
        for(let j = 0; j < CELL_OPTIONS; ++j)
        {
            adjacencies[i].push([]); // Per current cell option

            adjacencies[i][j].push([]); // North
            for(let k = 0; k < CELL_OPTIONS; ++k)
            {
                adjacencies[i][j][NORTH].push(false); // Per current cell possible north adjacencies
            }
            adjacencies[i][j].push([]); // South
            for(let k = 0; k < CELL_OPTIONS; ++k)
            {
                adjacencies[i][j][SOUTH].push(false); // Per current cell possible south adjacencies
            }
            adjacencies[i][j].push([]); // West
            for(let k = 0; k < CELL_OPTIONS; ++k)
            {
                adjacencies[i][j][WEST].push(false); // Per current cell possible west adjacencies
            }
            adjacencies[i][j].push([]); // East
            for(let k = 0; k < CELL_OPTIONS; ++k)
            {
                adjacencies[i][j][EAST].push(false); // Per current cell possible east adjacencies
            }
        }

        for(let j = 0; j < m[i].length; ++j)
        {
            for(let k = 0; k < m[i][j].length; ++k)
            {
                if(j > 0) // Check north
                {
                    adjacencies[i][m[i][j][k]][NORTH][m[i][j - 1][k]] = true;
                }
                if(j < m[i].length - 1) // Check south
                {
                    adjacencies[i][m[i][j][k]][SOUTH][m[i][j + 1][k]] = true;
                }
                if(k > 0) // Check west
                {
                    adjacencies[i][m[i][j][k]][WEST][m[i][j][k - 1]] = true;
                }
                if(k < m[i][j].length - 1) // Check east
                {
                    adjacencies[i][m[i][j][k]][EAST][m[i][j][k + 1]] = true;
                }
                
            }
        }
    }

    return adjacencies;
}

function updatePendingCellsAndPossibleCellOptionsWithCurrentCellOption(pendingCells, possibleCellOptions, currentCell, currentCellOption, adjacencies, currentMap)
{
    if(currentCellOption == CONFLICT)
    {
        return;
    }
    if(currentCell[0] > 0)
    {
        pendingCells.push([currentCell[0] - 1, currentCell[1], currentMap]);
        if(currentCellOption != CONFLICT)
        {
            for(let i = 0; i < CELL_OPTIONS; ++i)
            {
                if(!adjacencies[currentMap][currentCellOption][NORTH][i])
                {
                    possibleCellOptions[currentCell[0] - 1][currentCell[1]][i] = false;
                }
            }
        }
        
    }
    if(currentCell[0] < TERRAIN_Y_SIZE - 1)
    {
        pendingCells.push([currentCell[0] + 1, currentCell[1], currentMap]);
        if(currentCellOption != CONFLICT)
        {
            for(let i = 0; i < CELL_OPTIONS; ++i)
            {
                if(!adjacencies[currentMap][currentCellOption][SOUTH][i])
                {
                    possibleCellOptions[currentCell[0] + 1][currentCell[1]][i] = false;
                }
            }
        }
    }
    if(currentCell[1] > 0)
    {
        pendingCells.push([currentCell[0], currentCell[1] - 1, currentMap]);
        if(currentCellOption != CONFLICT)
        {
            for(let i = 0; i < CELL_OPTIONS; ++i)
            {
                if(!adjacencies[currentMap][currentCellOption][WEST][i])
                {
                    possibleCellOptions[currentCell[0]][currentCell[1] - 1][i] = false;
                }
            }
        }
    }
    if(currentCell[1] < TERRAIN_X_SIZE - 1)
    {
        pendingCells.push([currentCell[0], currentCell[1] + 1, currentMap]);
        if(currentCellOption != CONFLICT)
        {
            for(let i = 0; i < CELL_OPTIONS; ++i)
            {
                if(!adjacencies[currentMap][currentCellOption][EAST][i])
                {
                    possibleCellOptions[currentCell[0]][currentCell[1] + 1][i] = false;
                }
            }
        }
    }
}

function getIndexOfLeastEntropyCell(pendingCells, possibleCellOptions)
{
    let leastEntropyCellIndex = 0;
    let leastOptions = CELL_OPTIONS;
    for(let i = 0; i < pendingCells.length; ++i)
    {
        let numOptions = 0;
        for(let j = 0; j < CELL_OPTIONS; ++j)
        {
            if(possibleCellOptions[pendingCells[i][0]][pendingCells[i][1]])
            {
                numOptions++;
            }
        }

        let jitter = Math.random() * .5 - 0.25;

        if(numOptions + jitter < leastOptions && numOptions > 0)
        {
            leastEntropyCellIndex = i;
        }
    }

    return leastEntropyCellIndex;
}

function generateTerrain(adjacencies)
{
    // adjacencies[i][j][a][k]
    // i: map
    // j: current cell's option
    // a: direction (NSWE; 0 1 2 3)
    // k: adjacent cell's possible options

    let possibleCellOptions = [];
    for(let i = 0; i < TERRAIN_Y_SIZE; ++i)
    {
        possibleCellOptions.push([]);
        for(let j = 0; j < TERRAIN_X_SIZE; ++j)
        {
            possibleCellOptions[i].push([]);
            for(let k = 0; k < CELL_OPTIONS; ++k)
            {
                possibleCellOptions[i][j].push(true); // Each option is possible at start
            }
        }
    }

    let terrain = [];

    for(let i = 0; i < TERRAIN_Y_SIZE; ++i)
    {
        terrain.push([]);
        for(let j = 0; j < TERRAIN_X_SIZE; ++j)
        {
            terrain[i].push([PENDING, -1]); // Unfilled cell, Unmapped
        }
    }
    
    let currentMap = Math.floor(Math.random() * maps.length);
    let initialCellY = Math.floor(Math.random() * maps[currentMap].length);
    let initialCellX = Math.floor(Math.random() * maps[currentMap][initialCellY].length);
    let initialCellOption = maps[currentMap][initialCellY][initialCellX]; //Math.floor(Math.random() * (CELL_OPTIONS - 3)) + 3;

    let initialPosition = [TERRAIN_Y_SIZE / 2.0, TERRAIN_X_SIZE / 2.0]; // Y, X

    terrain[initialPosition[0]][initialPosition[1]] = [initialCellOption, currentMap]; // Set initial terrain

    let pendingCells = []; // Y, X, Map
    
    updatePendingCellsAndPossibleCellOptionsWithCurrentCellOption(pendingCells, possibleCellOptions, initialPosition, initialCellOption, adjacencies, currentMap);
    
    
    while(pendingCells.length > 0)
    {
        let currentPendingCellIndex = getIndexOfLeastEntropyCell(pendingCells, possibleCellOptions); // Least entropy heuristic
        let currentPendingCell = pendingCells[currentPendingCellIndex];
        pendingCells.splice(currentPendingCellIndex, 1);
        
        if(terrain[currentPendingCell[0]][currentPendingCell[1]][0] == PENDING) // If still empty
        {
            let currentCellPossibleOptions = [];
            for(let i = 0; i < CELL_OPTIONS; ++i)
            {
                if(possibleCellOptions[currentPendingCell[0]][currentPendingCell[1]][i])
                {
                    currentCellPossibleOptions.push(i);
                }
            }

            let newCellOption;
            if(currentCellPossibleOptions.length == 0)
            {
                newCellOption = CONFLICT;
            }
            else
            {
                let newCellOptionIndex = Math.floor(Math.random() * currentCellPossibleOptions.length);
                newCellOption = currentCellPossibleOptions[newCellOptionIndex];
            }
            let currentMap;
            if(newCellOption == LINK)
            {
                currentMap = Math.floor(Math.random() * maps.length);
            }
            else
            {
                currentMap = currentPendingCell[2];
            }
            
            terrain[currentPendingCell[0]][currentPendingCell[1]] = [newCellOption, currentMap];

            updatePendingCellsAndPossibleCellOptionsWithCurrentCellOption(pendingCells, possibleCellOptions, currentPendingCell, newCellOption, adjacencies, currentMap);
        }
    }

    return terrain;
}

function getCubeVerticesAtPoint(point)
{
    let vertices = [];

    
}

window.onload = function() {

    let adjacencies = generateAdjacencies(maps);
    let terrain = generateTerrain(adjacencies);

    let vertices = [];

    for(let i = 0; i < TERRAIN_Y_SIZE; ++i)
    {
        for(let j = 0; j < TERRAIN_X_SIZE; ++j)
        {
            vertices.push(vec4(j / TERRAIN_X_SIZE - 0.5, i / TERRAIN_Y_SIZE - 0.5, (terrain[i][j][1] / maps.length) * RELIEF_SCALE, 1.0));
            switch(terrain[i][j][0])
            {
                case 0: // Empty
                    vertices.push(vec4(0.5, 0.5, 0.5, 1.0));
                    break;
                case 1: // Link
                    vertices.push(vec4(0.0, 0.0, 0.0, 1.0));
                    break;
                case 2: // Conflict
                    vertices.push(vec4(1.0, 1.0, 1.0, 1.0));
                    break;
                case 3: // Red
                    vertices.push(vec4(1.0, 0.0, 0.0, 1.0));
                    break;
                case 4: // Green
                    vertices.push(vec4(0.0, 1.0, 0.0, 1.0));
                    break;
                case 5: // Blue
                    vertices.push(vec4(0.0, 0.0, 1.0, 1.0));
                    break;
                case 6: // Cyan
                    vertices.push(vec4(0.0, 1.0, 1.0, 1.0));
                    break;
                case 7: // Magenta
                    vertices.push(vec4(1.0, 0.0, 1.0, 1.0));
                    break;
                case 8: // Yellow
                    vertices.push(vec4(1.0, 1.0, 0.0, 1.0));
                    break;
                default:
                    vertices.push(vec4(0.9, 0.9, 0.9, 1.0));
                    break;
            }
        }
    }

    let canvas = document.getElementById("gl-canvas");
	let gl = WebGLUtils.setupWebGL(canvas);
	
	if(!gl)
	{
		alert("WebGL not available");
	}
	
	let vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, document.getElementById("vertex-shader").text);
	gl.compileShader(vertexShader);
	
	if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
	{
		let info = gl.getShaderInfoLog(vertexShader);
		alert("Vertex shader did not compile: " + info);
	}
	
	let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, document.getElementById("fragment-shader").text);
	gl.compileShader(fragmentShader);
	
	if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
	{
		let info = gl.getShaderInfoLog(fragmentShader);
		alert("Fragment shader did not compile: " + info);
	}

	let program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	
	gl.linkProgram(program);
	
	if(!gl.getProgramParameter(program, gl.LINK_STATUS))
	{
		let info = gl.getProgramInfoLog(program);
		alert("Program did not link: " + info);
	}
	
	gl.useProgram(program);
	
	gl.clearColor(0.99, 0.99, 0.99, 1.0);
	
    let geometryBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, geometryBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    let vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 4 * 8, 0);
    gl.enableVertexAttribArray(vPosition);
    
    let vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 4 * 8, 4 * 4);
    gl.enableVertexAttribArray(vColor);

    let perspectiveMatrix = gl.getUniformLocation(program, "perspectiveMatrix");
    gl.uniformMatrix4fv(perspectiveMatrix, false, flatten(kPerspective(30.0, 1.0, 1.0, 20.0)));

    let modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
    
    let zTranslation = 0.0;

	let xDifference = 0.0;
	let yDifference = 0.0;
    let rollAngle = 0.0;
    
    let cameraMatrix = kTranslation(0.0, 1.0, -0.5);
    cameraMatrix = mult(kRotationX(-1.0), cameraMatrix);

	canvas.addEventListener("mousemove", function(evt){ 
		let rect = canvas.getBoundingClientRect();
		let mousePosX = evt.clientX - rect.left;
		let mousePosY = evt.clientY - rect.top;

		xDifference =  1.0 / 2.0 - mousePosX / canvas.width;
		yDifference =  1.0 / 2.0 - mousePosY / canvas.height;
	});

	document.addEventListener("keydown", function(evt){
		let charCode = evt.keyCode;
		if(charCode == 87) // W
		{
			zTranslation = 0.002;
		}
		else if(charCode == 65) // A
		{
			rollAngle += 0.1;
		}
		else if(charCode == 83) // S
		{
			zTranslation = -0.002;
		}
		else if(charCode == 68) // D
		{
			rollAngle -= 0.1;
		}
	});

	document.addEventListener("keyup", function(evt){
		let charCode = evt.keyCode;
		if(charCode == 87) // W
		{
			zTranslation = 0.0;
		}
		else if(charCode == 65) // A
		{
			rollAngle = 0.0;
		}
		else if(charCode == 83) // S
		{
			zTranslation = 0.0;
		}
		else if(charCode == 68) // D
		{
			rollAngle = 0.0;
		}
	});

	canvas.addEventListener("mousedown", function(evt){
		zTranslation = 0.0;

		xDifference = 0.0;
		yDifference = 0.0;
		rollAngle = 0.0;
	});

    render();    

    function render()
    {
        cameraMatrix = mult(kTranslation(0.0, 0.0, zTranslation), cameraMatrix);
        cameraMatrix = mult(mult(mult(kRotationZ(-rollAngle * 0.03), kRotationX(-yDifference * 0.03)), kRotationY(-xDifference * 0.03)), cameraMatrix);
        gl.uniformMatrix4fv(modelViewMatrix, false, flatten(cameraMatrix));

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, canvas.width, canvas.height);

        gl.drawArrays(gl.POINTS, 0, vertices.length / 2.0);

        requestAnimFrame(render);
    }
}