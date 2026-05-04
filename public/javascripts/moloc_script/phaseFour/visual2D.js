function visualize () {
	try {
		createBox();
		computePrintDrawBox();
	} catch ( e ) {
		alert("visualize " + e);
	}
}
		
function createBox () {
	try {
		_box = createBoxRec(_coordinationExpression.exp);
	} catch ( e ) {
		alert("createBox " + e);
	}
}

function createBoxRec (coordinationExpression) {
	var box;
	try {
		var type = coordinationExpression.type;
		switch (coordinationExpression.type) {
			case "skip" : {
				box = createSkipBox();
				break;
			}
			case "simple" : {
				box = createActivityBox(coordinationExpression.args[0].id);
				break;
			}
			case "repeat" : {
				var centerBox = createBoxRec(coordinationExpression.args[0]);
				box = createLoopBox(centerBox);
				break;
			}
			case "sequence" : {
				var headBox = createBoxRec(coordinationExpression.args[0]);
				var tailBox = createBoxRec(coordinationExpression.args[1]);
				box = createSequenceBox(headBox, tailBox);
				break;
			}
			case "choice" : {
				var basicBox = createBoxRec(coordinationExpression.args[0]);
				var leftBox = createBoxRec(coordinationExpression.args[1]);
				var rightBox = createBoxRec(coordinationExpression.args[2]);
				var conditionBox = createConditionBox(leftBox, rightBox);
				box = createSequenceBox(basicBox, conditionBox); 
				break;
			}
			case "parallel" : {
				var leftBox = createBoxRec(coordinationExpression.args[0]);
				var rightBox = createBoxRec(coordinationExpression.args[1]);
				box = createParallelBox(leftBox, rightBox);
				break;
			}
			default	: {
				break;
			}				
		}
		return box;
	} catch ( e ) {
		alert("createBoxRec " + e);
	}
}

function createSkipBox () {
    var box = {
        type   : "V",
        tag    : "skip"
    }
	return box;
}

function createActivityBox (activity) {
    var box = {
        type   : "A",
        tag    : activity,
    }
	return box;
}

function createFlowBox (flow) {
    var box = {
        type   : "F",
        tag    : flow
    }
	return box;
}

function createBeginBox () {
    var box = {
        type   : "B",
        tag    : "Begin",
    }
	return box;
}

function createEndBox () {
    var box = {
        type   : "E",
        tag    : "End"
    }
	return box;
}

function createConditionBox (leftBox, rightBox) {
    var box = {
        type   : "C",
        left   : leftBox,
        right  : rightBox
    }
	return box;
}

function createParallelBox (leftBox, rightBox) {
    var box = {
        type   : "P",
        left   : leftBox,
        right  : rightBox
    }
	return box;
}

function createLoopBox (centerBox) {
    var box = {
        type   : "L",
        center : centerBox
    }
	return box;
}

function createSequenceBox (headBox, tailBox) {
    var box = {
        type   : "S",
        head   : headBox,
        tail   : tailBox
    }
	return box;
}

function computePrintDrawBox () {
	try {
		var boxB = createBeginBox();
		var boxE = createEndBox();
		var boxS = createSequenceBox(_box, boxE);
		var boxRoot = createSequenceBox(boxB, boxS);

		computeBoxProperty(boxRoot);		
		computeBoxPosition(boxRoot, 0, 0);
		var lateralShift = -computeLateralShift(_box);
		translateBox(boxRoot, lateralShift + X_BORDER, Y_BORDER);
		drawBox(boxRoot);
	} catch ( e ) {
		alert("computePrintDrawBox " + e);
	}
}

/*
Width(B) = 4
Hook(B)  = 2
Width(L) = Width(L.c) + 2
Hook(L)  = Hook(L.c)
Width(P) = Width(P.l) + Width(P.r) + 2
Hook(P)  = Width(P.l) + 1
Width(C) = Width(C.l) + Width(C.r) + 2
Hook(C)  = Width(C.l) + 1
Width(S) = max(Hook(S.h), Hook(S.t)) + max(Width(S.h) - Hook(S.h), Width(S.t) - Hook(S.t))
Hook(S)  = max(Hook(S.h), Hook(S.t))
*/

function computeBoxProperty (box) {
	try {
		switch (box.type) {
			case "C" : 
			case "P" : {
				computeBoxProperty(box.left);
				computeBoxProperty(box.right);
				box.width = 2 * UNIT + box.left.width + box.right.width;
				box.height = 6 * UNIT + Math.max(box.left.height, box.right.height);
				box.hook = 1 * UNIT + box.left.width;
				break;
			}
			case "L" : {
				computeBoxProperty(box.center);
				box.width = 2 * UNIT + box.center.width;
				box.height = 8 * UNIT + box.center.height;
				box.hook = box.center.hook;
				break;
			}
			case "S" : {
				computeBoxProperty(box.head);
				computeBoxProperty(box.tail);
				box.width = Math.max(box.head.hook, box.tail.hook) +
						    Math.max(box.head.width - box.head.hook, 
									 box.tail.width - box.tail.hook);
				box.height = box.head.height + box.tail.height;
				box.hook = Math.max(box.head.hook, box.tail.hook);
				break;
			}
			default : {
				box.width = 4 * UNIT;
				box.height = 4 * UNIT;
				box.hook = 2 * UNIT;
				break;
			}
		}
	} catch ( e ) {
		alert("computeSizeInit " + e);
	}
}

function computeBoxPosition (box, x, y) {
    box.xCoord = x;
    box.yCoord = y;
    switch (box.type) {
        case "C" :
        case "P" : {
            var xLeft = x;
            var yLeft = y + 3 * UNIT;
            computeBoxPosition(box.left, xLeft, yLeft);
			var xRight = x + box.hook + 1 * UNIT;
            var yRight = y + 3 * UNIT;
            computeBoxPosition(box.right, xRight, yRight);
            break;
        }
        case "L" : {
            var xCenter = x + (box.hook - box.center.hook);
            var yCenter = y + 4 * UNIT;
            computeBoxPosition(box.center, xCenter, yCenter);
            break;
        }
        case "S" : {
			var xHead = x + (box.hook - box.head.hook);
            var yHead = y;
			var xTail = x + (box.hook - box.tail.hook);
            var yTail = y + box.head.height;
            computeBoxPosition(box.head, xHead, yHead);
            computeBoxPosition(box.tail, xTail, yTail);
            break;
        }
        default : {
            break;
        }
    }
}

function computeLateralShift (box) {
	var shift;
    switch (box.type) {
        case "C" :
        case "P" : {
            var shiftLeft = computeLateralShift(box.left);
            var shiftRight = computeLateralShift(box.right);
			shift = Math.min(box.xCoord, Math.min(shiftLeft, Math.min(shiftRight, 0)));
            break;
        }
        case "L" : {
            var shiftCenter = computeLateralShift(box.center);
			shift = Math.min(box.xCoord, Math.min(shiftCenter, 0));
            break;
        }
        case "S" : {
            var shiftHead = computeLateralShift(box.head);
            var shiftTail = computeLateralShift(box.tail);
			shift = Math.min(box.xCoord, Math.min(shiftHead, Math.min(shiftTail, 0)));
            break;
        }
        default : {
			shift = Math.min(box.xCoord, 0);
            break;
        }
    }
	return shift;
}

function translateBox (box, xShift, yShift) {
	box.xCoord += xShift;
	box.yCoord += yShift;
    switch (box.type) {
        case "C" :
        case "P" : {
            translateBox(box.left,  xShift, yShift);
            translateBox(box.right, xShift, yShift);
            break;
        }
        case "L" : {
            translateBox(box.center, xShift, yShift);
            break;
        }
        case "S" : {
            translateBox(box.head, xShift, yShift);
            translateBox(box.tail, xShift, yShift);
            break;
        }
        default : {
            break;
        }
    }
}

function drawBox (box) {
	var width  = box.width  + 2 * X_BORDER;
	var height = box.height + 2 * Y_BORDER;
	var s = '<svg width="' + width + '" ' + 
				'height="' + height + '">' +
			computeHTMLBox(box) +
			'</svg>';
	nodeCanvass.innerHTML = s;
}

// HTML SVG boxes

function computeHTMLBox (box) {
	var s = "";
    switch (box.type) {
        case "C" : 
		case "P" : {
            s += computeHTMLCondParBox(box);
            break;            
        }
        case "L" : {
            s += computeHTMLLoopBox(box);
            break;
        }
        case "S" : {
            s += computeHTMLSequenceBox(box);
            break;
        }
		case "B" : {
			s += computeHTMLBeginBox(box);
			break;
		}
		case "E" : {
			s += computeHTMLEndBox(box);
			break;
		}
        default : { 
			s += computeHTMLBasicBox(box);
            break;
        }
    }
	return s;	
}

function computeHTML_box (box) {
	var x = box.xCoord;
	var y = box.yCoord;
	var width = box.width;
	var height = box.height;
	var color;
	switch (box.type) {
        case "C" : 
		case "P" : {
            color = "red";
            break;            
        }
        case "L" : {
            color = "red";
            break;
        }
        case "S" : {
            color = "green";
            break;
        }
		case "B" : {
			color = "white";
			break;
		}
		case "E" : {
			color = "white";
			break;
		}
        default : { 
			color = "white";
            break;
        }
	}
    var rect = '<rect '  + 
               'x='      + x      + ' ' +
               'y='      + y      + ' ' +
               'width='  + width  + ' ' +
               'height=' + height + ' ' +
               'style="fill:white;fill-opacity:0.0;stroke-width:1;stroke:' + color + '"' +
               '/>';
    return rect;
}

function computeHTMLBasicBox (box) {
	var xHookCoord = box.xCoord + box.hook;
	var yHookCoord = box.yCoord;
	
	var xVLineUp = xHookCoord;
	var yVLineUp = yHookCoord;
	var lVLineUp = UNIT - L_ARROW;
    var vLineUp  = computeHTML_vLine(xVLineUp, yVLineUp, lVLineUp);
	
	var xDownArrow = xHookCoord;
	var yDownArrow = yVLineUp + 1 * UNIT - L_ARROW;
	var lDownArrow = L_ARROW;
	var downArrow = computeHTML_downTriangle(xDownArrow, yDownArrow, lDownArrow);
	
	var xRect = box.xCoord;
	var yRect = yVLineUp + UNIT;
	var wRect = box.width;
	var hRect = 2 * UNIT;
    var rect  = computeHTML_rect(xRect, yRect, wRect, hRect); 
	
	var xTag = box.xCoord + 0.4 * UNIT;
	var yTag = yRect + 1.4 * UNIT;
	var tag = computeHTML_text(xTag, yTag, box.tag)

	var xVLineDown = xHookCoord;
	var yVLineDown = yRect + 2 * UNIT;
	var lVLineDown = UNIT;
    var vLineDown  = computeHTML_vLine(xVLineDown, yVLineDown, lVLineDown);

    return vLineUp + downArrow + rect + tag + vLineDown;
}

function computeHTMLBeginBox (box) {
    var xHookCoord = box.xCoord + box.hook;
    var yHookCoord = box.yCoord;

	var xCircle = box.xCoord + 2 * UNIT;
	var yCircle = yHookCoord + 2 * UNIT;
	var rCircle = UNIT;
    var circle  = computeHTML_circle(xCircle, yCircle, rCircle, "white"); 

	var xVLineDown = xHookCoord;
	var yVLineDown = yHookCoord + 3 * UNIT;
	var lVLineDown = UNIT;
    var vLineDown  = computeHTML_vLine(xVLineDown, yVLineDown, lVLineDown);

    return circle + vLineDown;
}

function computeHTMLEndBox (box) {
    var xHookCoord = box.xCoord + box.hook;
    var yHookCoord = box.yCoord;
	
	var xVLineUp = xHookCoord;
	var yVLineUp = yHookCoord;
	var lVLineUp = UNIT - L_ARROW;
    var vLineUp  = computeHTML_vLine(xVLineUp, yVLineUp, lVLineUp);
	
	var xDownArrow = xHookCoord;
	var yDownArrow = yVLineUp + UNIT - L_ARROW;
	var lDownArrow = L_ARROW;
	var downArrow = computeHTML_downTriangle(xDownArrow, yDownArrow, lDownArrow);
	
	var xCircle = box.xCoord + 2 * UNIT;
	var yCircle = yHookCoord + 2 * UNIT;
	var rCircle = UNIT;
    var circle  = computeHTML_circle(xCircle, yCircle, rCircle, "white");
	
	var xInsideCircle = box.xCoord + 2 * UNIT;
	var yInsideCircle = yHookCoord + 2 * UNIT;
	var rInsideCircle = UNIT - 3;
    var insideCircle  = computeHTML_circle(xInsideCircle, yInsideCircle, rInsideCircle, "black");
	
    return vLineUp + downArrow + circle + insideCircle;
}

function computeHTMLSequenceBox (box) {
	var s = ""
	s += computeHTMLBox(box.head);
	s += computeHTMLBox(box.tail);
	return s;
}

function computeHTMLCondParBox (box) {
    var xHookCoord = box.xCoord + box.hook;
    var yHookCoord = box.yCoord;
    
    var xVLineUp = xHookCoord;
    var yVLineUp = yHookCoord;
    var lVLineUp = UNIT - L_ARROW;
    var vLineUp  = computeHTML_vLine(xVLineUp, yVLineUp, lVLineUp);
    
	var xDownArrow = xHookCoord;
	var yDownArrow = yVLineUp + UNIT - L_ARROW;
	var lDownArrow = L_ARROW;
	var downArrow = computeHTML_downTriangle(xDownArrow, yDownArrow, lDownArrow);

    var xDiamondUp = xHookCoord;
    var yDiamondUp = yVLineUp + UNIT;
    var diamondUp  = computeHTML_diamond(xDiamondUp, yDiamondUp);
	
	var xTagUp = xDiamondUp;
	var yTagUp = yDiamondUp + UNIT;
	var tagUp;
	if (box.type == "C") {
		tagUp = computeHTML_times(xTagUp, yTagUp);
	} else {
		tagUp = computeHTML_plus(xTagUp, yTagUp);
	}
    
    var xHLineUpLeft = xHookCoord - UNIT - box.left.width + box.left.hook;
    var yHLineUpLeft = yDiamondUp + UNIT;
    var lHLineUpLeft = box.left.width - box.left.hook;
    var hLineUpLeft  = computeHTML_hLine(xHLineUpLeft, yHLineUpLeft, lHLineUpLeft);

    var xHLineUpRight = xHookCoord + UNIT;
    var yHLineUpRight = yDiamondUp + UNIT;
    var lHLineUpRight = box.right.hook;
    var hLineUpRight  = computeHTML_hLine(xHLineUpRight, yHLineUpRight, lHLineUpRight);

    var xVLineUpLeft = xHLineUpLeft;
    var yVLineUpLeft = yDiamondUp + UNIT;
    var lVLineUpLeft = UNIT;
    var vLineUpLeft  = computeHTML_vLine(xVLineUpLeft, yVLineUpLeft, lVLineUpLeft);

    var xVLineUpRight = xHookCoord + UNIT + box.right.hook;
    var yVLineUpRight = yDiamondUp + UNIT;
    var lVLineUpRight = UNIT;
    var vLineUpRight  = computeHTML_vLine(xVLineUpRight, yVLineUpRight, lVLineUpRight);

    var left  = computeHTMLBox(box.left);
    var right = computeHTMLBox(box.right);  

    var leftRightHeight = Math.max(box.left.height, box.right.height);
    
    var xDiamondDown = xHookCoord;
    var yDiamondDown = yDiamondUp + 2 * UNIT + leftRightHeight
    var diamondDown  = computeHTML_diamond(xDiamondDown, yDiamondDown);

	var xTagDown = xDiamondDown;
	var yTagDown = yDiamondDown + UNIT;
	var tagDown;
	if (box.type == "C") {
		tagDown = computeHTML_times(xTagDown, yTagDown);
	} else {
		tagDown = computeHTML_plus(xTagDown, yTagDown);
	}

    var xHLineDownLeft = box.left.xCoord + box.left.hook;
    var yHLineDownLeft = yDiamondDown + UNIT;
    var lHLineDownLeft = box.left.width - box.left.hook - L_ARROW;
    var hLineDownLeft  = computeHTML_hLine(xHLineDownLeft, yHLineDownLeft, lHLineDownLeft);
	
	var xRightArrow = xHookCoord - UNIT - L_ARROW;
	var yRightArrow = yHLineDownLeft;
	var lRightArrow = L_ARROW;
	var rightArrow = computeHTML_rightTriangle(xRightArrow, yRightArrow, lRightArrow);

    var xHLineDownRight = xHookCoord + UNIT + L_ARROW;
    var yHLineDownRight = yDiamondDown + UNIT;
    var lHLineDownRight = box.right.hook - L_ARROW;
    var hLineDownRight  = computeHTML_hLine(xHLineDownRight, yHLineDownRight, lHLineDownRight);

	var xLeftArrow = xHookCoord + UNIT + L_ARROW;
	var yLeftArrow = yHLineDownRight;
	var lLeftArrow = L_ARROW;
	var leftArrow = computeHTML_leftTriangle(xLeftArrow, yLeftArrow, lLeftArrow);

    var xVLineDownLeft = xVLineUpLeft;
    var yVLineDownLeft = yDiamondDown;
    var lVLineDownLeft = UNIT;
	if (box.left.height < box.right.height) {
		yVLineDownLeft -= (box.right.height - box.left.height);
		lVLineDownLeft += (box.right.height - box.left.height);
	}
    var vLineDownLeft  = computeHTML_vLine(xVLineDownLeft, yVLineDownLeft, lVLineDownLeft);

    var xVLineDownRight = xHookCoord + UNIT + box.right.hook;
    var yVLineDownRight = yDiamondDown;
    var lVLineDownRight = UNIT;
	if (box.right.height < box.left.height) {
		yVLineDownRight -= (box.left.height - box.right.height);
		lVLineDownRight += (box.left.height - box.right.height);
	}	
    var vLinedownRight  = computeHTML_vLine(xVLineDownRight, yVLineDownRight, lVLineDownRight);

    var xVLineDown = xHookCoord;
    var yVLineDown = yDiamondDown + 2 * UNIT;
    var lVLineDown = UNIT;
    var vLineDown = computeHTML_vLine(xVLineDown, yVLineDown, lVLineDown);
    
    return vLineUp + downArrow +
           diamondUp + tagUp + hLineUpLeft + hLineUpRight + vLineUpLeft + vLineUpRight + 
           left + right + 
           diamondDown + tagDown + hLineDownLeft + rightArrow + hLineDownRight + leftArrow + 
		   vLineDownLeft + vLinedownRight +
           vLineDown;
}

function computeHTMLLoopBox (box) {
    var xHookCoord = box.xCoord + box.hook;
    var yHookCoord = box.yCoord;
    
    var xVLineUp = xHookCoord;
    var yVLineUp = yHookCoord;
    var lVLineUp = UNIT - L_ARROW;
    var vLineUp  = computeHTML_vLine(xVLineUp, yVLineUp, lVLineUp);
    
	var xDownArrowUp = xHookCoord;
	var yDownArrowUp = yVLineUp + UNIT - L_ARROW;
	var lDownArrowUp = L_ARROW;
	var downArrowUp = computeHTML_downTriangle(xDownArrowUp, yDownArrowUp, lDownArrowUp);

    var xDiamondUp = xHookCoord;
    var yDiamondUp = yVLineUp + UNIT;
    var diamondUp  = computeHTML_diamond(xDiamondUp, yDiamondUp);

	var xTagUp = xDiamondUp;
	var yTagUp = yDiamondUp + UNIT;
	var tagUp = computeHTML_times(xTagUp, yTagUp);

    var xVLineUpCenter = xHookCoord;
    var yVLineUpCenter = yDiamondUp + 2 * UNIT;
    var lVLineUpCenter = UNIT;
    var vLineUpCenter  = computeHTML_vLine(xVLineUpCenter, yVLineUpCenter, lVLineUpCenter);
    
    var xHLineUpRight = xHookCoord + UNIT + L_ARROW;
    var yHLineUpRight = yDiamondUp + UNIT;
    var lHLineUpRight = box.center.width - box.center.hook - L_ARROW;
    var hLineUpRight  = computeHTML_hLine(xHLineUpRight, yHLineUpRight, lHLineUpRight);

	var xLeftArrow = xHookCoord + UNIT + L_ARROW;
	var yLeftArrow = yHLineUpRight;
	var lLeftArrow = L_ARROW;
	var leftArrow = computeHTML_leftTriangle(xLeftArrow, yLeftArrow, lLeftArrow);

    var xVLineUpRight = xHookCoord + UNIT + box.center.width - box.center.hook;
    var yVLineUpRight = yDiamondUp + UNIT;
    var lVLineUpRight = 4 * UNIT + box.center.height;
    var vLineUpRight  = computeHTML_vLine(xVLineUpRight, yVLineUpRight, lVLineUpRight);

    var center  = computeHTMLBox(box.center);
    
	var xVLineDownCenter = xHookCoord;
    var yVLineDownCenter = yDiamondUp + 3 * UNIT + box.center.height;
    var lVLineDownCenter = UNIT - L_ARROW;
    var vLineDownCenterLeft = computeHTML_vLine(xVLineDownCenter, yVLineDownCenter, lVLineDownCenter);

	var xDownArrowDown = xHookCoord;
	var yDownArrowDown = yVLineDownCenter + UNIT - L_ARROW;
	var lDownArrowDown = L_ARROW;
	var downArrowDown = computeHTML_downTriangle(xDownArrowDown, yDownArrowDown, lDownArrowDown);

    var xDiamondDown = xHookCoord;
    var yDiamondDown = yDiamondUp + 4 * UNIT + box.center.height;
    var diamondDown  = computeHTML_diamond(xDiamondDown, yDiamondDown);

	var xTagDown = xDiamondDown;
	var yTagDown = yDiamondDown + UNIT;
	var tagDown = computeHTML_times(xTagDown, yTagDown);

    var xHLineDownRight = xHookCoord + UNIT;
    var yHLineDownRight = yDiamondDown + UNIT;
    var lHLineDownRight = box.center.width - box.center.hook;
    var hLineDownRight  = computeHTML_hLine(xHLineDownRight, yHLineDownRight, lHLineDownRight);

    var xVLineDown = xHookCoord;
    var yVLineDown = yDiamondDown + 2 * UNIT;
    var lVLineDown = UNIT;
    var vLineDown = computeHTML_vLine(xVLineDown, yVLineDown, lVLineDown);
    
    return vLineUp + downArrowUp +
           diamondUp + tagUp + vLineUpCenter + hLineUpRight + leftArrow + vLineUpRight + 
           center + 
           vLineDownCenterLeft + downArrowDown + 
		   diamondDown + tagDown + hLineDownRight +
           vLineDown;
}

// HTML SVG generic elements

function computeHTML_rect (x, y, width, height) {
    var rect = '<rect '  + 
               'x='      + x      + ' ' +
               'y='      + y      + ' ' +
               'width='  + width  + ' ' +
               'height=' + height + ' ' +
               'style="fill:white;fill-opacity:0.0;stroke-width:1;stroke:black"' +
               '/>';
    return rect;
}

function computeHTML_circle (x, y, r, color) {
    var rect = '<circle '  + 
               'cx=' + x + ' ' +
               'cy=' + y + ' ' +
               'r='  + r + ' ' +
               'style="fill:' + color + ';stroke-width:1;stroke:black"' +
               '/>';
    return rect;
}

function computeHTML_diamond (x, y) {
    var lineUpLeft = computeHTML_dLeftLine(x, y, UNIT);
    var lineUpRight = computeHTML_dRightLine(x, y, UNIT);
    var lineDownLeft = computeHTML_dRightLine(x - UNIT, y + UNIT, UNIT);
    var lineDownRight = computeHTML_dLeftLine(x + UNIT, y + UNIT, UNIT);
    return lineUpLeft + lineUpRight + lineDownLeft + lineDownRight;
}

function computeHTML_dLeftLine (x1, y1, cateto) {
    var x2 = x1 - cateto;
    var y2 = y1 + cateto;
    var line = '<line ' + 
               'x1='   + x1 + ' ' + 
               'y1='   + y1 + ' ' + 
               'x2='   + x2 + ' ' + 
               'y2='   + y2 + ' ' + 
               'style="stroke-width:1;stroke:black"' + 
               '/>';   
    return line;    
}

function computeHTML_dRightLine (x1, y1, cateto) {
    var x2 = x1 + cateto;
    var y2 = y1 + cateto;
    var line = '<line ' + 
               'x1='   + x1 + ' ' + 
               'y1='   + y1 + ' ' + 
               'x2='   + x2 + ' ' + 
               'y2='   + y2 + ' ' + 
               'style="stroke-width:1;stroke:black"' + 
               '/>';   
    return line;    
}

function computeHTML_vLine (x1, y1, length) {
    var x2 = x1;
    var y2 = y1 + length;
    var line = '<line ' + 
               'x1='   + x1 + ' ' + 
               'y1='   + y1 + ' ' + 
               'x2='   + x2 + ' ' + 
               'y2='   + y2 + ' ' + 
               'style="stroke-width:1;stroke:black"' + 
               '/>';   
    return line;
}

function computeHTML_hLine (x1, y1, length) {
    var x2 = x1 + length;
    var y2 = y1;
    var line = '<line ' + 
               'x1='   + x1 + ' ' + 
               'y1='   + y1 + ' ' + 
               'x2='   + x2 + ' ' + 
               'y2='   + y2 + ' ' + 
               'style="stroke-width:1;stroke:black"' + 
               '/>';   
    return line;
}

function computeHTML_downTriangle (x, y, length) {
	var x1 = x - length;
	var y1 = y;
	var x2 = x;
	var y2 = y + length;
	var x3 = x + length;
	var y3 = y;
	
	var triangle = '<polyline ' + 
				   'points="' + x1 + ',' + y1 + ' ' +
				                x2 + ',' + y2 + ' ' +
								x3 + ',' + y3 + '"' +
				   'style="fill:black;stroke-width:1;stroke:black"' +
				   '/>';
	return triangle;
}

function computeHTML_rightTriangle (x, y, length) {
	var x1 = x;
	var y1 = y + length;
	var x2 = x + length;
	var y2 = y;
	var x3 = x;
	var y3 = y - length;
	
	var triangle = '<polyline ' + 
				   'points="' + x1 + ',' + y1 + ' ' +
				                x2 + ',' + y2 + ' ' +
								x3 + ',' + y3 + '"' +
				   'style="fill:black;stroke-width:1;stroke:black"' +
				   '/>';
	return triangle;
}

function computeHTML_leftTriangle (x, y, length) {
	var x1 = x;
	var y1 = y + length;
	var x2 = x - length;
	var y2 = y;
	var x3 = x;
	var y3 = y - length;
	
	var triangle = '<polyline ' + 
				   'points="' + x1 + ',' + y1 + ' ' +
				                x2 + ',' + y2 + ' ' +
								x3 + ',' + y3 + '"' +
				   'style="fill:black;stroke-width:1;stroke:black"' +
				   '/>';
	return triangle;
}

function computeHTML_text (x, y, t) {
	var t = '<text ' + 
			'x=' + x + ' ' + 
			'y=' + y + ' ' + 
			'style="fill:black">' + 
			t +
			'</text>';
	return t;	
}

function computeHTML_plus (x, y) {
	var xVLine = x;
	var yVLine = y - 4;
	var lVLine = 8;
	var vLine = computeHTML_vLine(xVLine, yVLine, lVLine);
	
	var xHLine = x - 4;
	var yHLine = y;
	var lHLine = 8;
	var hLine = computeHTML_hLine(xHLine, yHLine, lHLine);
	return vLine + hLine;
}

function computeHTML_times (x, y) {
	var xDRightLine = x - 3;
	var yDRightLine = y - 3;
	var cDRightLine	= 6;
	var dRightLine = computeHTML_dRightLine (xDRightLine, yDRightLine, cDRightLine);
	
	var xDLeftLine = x + 3;
	var yDLeftLine = y - 3;
	var cDLeftLine = 6;
	var dLeftLine = computeHTML_dLeftLine (xDLeftLine, yDLeftLine, cDLeftLine);
	return dRightLine + dLeftLine;
}