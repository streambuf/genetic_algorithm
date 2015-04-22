jQuery(document).ready(function(){
    $('#canvas').attr('height', $('#canvas').css('height'));
    $('#canvas').attr('width', $('#canvas').css('width'));
    var ctx = $("#canvas")[0].getContext('2d');
    var points = [];
    var modes = Object.freeze({'BUILD': 1, 'CHOICE': 2});
    var mode = modes.BUILD;

    (function(){
        var mat = [[0,2,3,4,5,6], [2,0,5,6,2,2], [3,5,0,1,5,1], [4,6,1,0,3,2], [5,2,5,3,0,4], [6,2,1,2,4,0]];
        var genetic = new Genetic(mat, 6);
        genetic.findBestPath();
    }());


  
    $("#canvas").click(function(e){ 

        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop; 

        if (mode == modes.BUILD) {
            // draw point
            ctx.beginPath();
            ctx.arc(x, y, 10,0, 2*Math.PI);
            ctx.stroke();
        	ctx.fillStyle="black";
        	ctx.fill();
        	points.push({x:x, y:y});
        	
        	var lastPoint = points.length - 1;

            // draw lines (point to point)
        	for(var i = 0; i < lastPoint; ++i) {
        		ctx.beginPath();
        		ctx.moveTo(points[lastPoint].x,points[lastPoint].y);
        		ctx.lineTo(points[i].x,points[i].y);
        		ctx.stroke();
        		drawLabel(ctx, i, points[i], points[i], 'white');
        	}
        	drawLabel(ctx, lastPoint, points[lastPoint], points[lastPoint], 'white');
        
        } else if (mode == modes.CHOICE) {
            for (var i = 0; i < points.length; ++i) {
                if (Math.sqrt((x-points[i].x)*(x-points[i].x) + (y-points[i].y)*(y-points[i].y)) < 10) {
                    alert(11);
                }
            }
        }
   
   });
   
    $("#create_matrix").click(function(){
        mode = modes.CHOICE;
        var size = points.length;
    	var table = $('<table></table>').addClass('table table-bordered');

        row = $('<tr></tr>');
        var rowData = $('<td>' + 'Узлы' +'</td>');
        row.append(rowData);
        for (var i = 0; i < size - 1; i++) {
            var rowData = $('<td>' + i +'</td>');
            row.append(rowData);
        }
        table.append(row);

        for (var i = 1; i < size; i++) {
      		row = $('<tr></tr>');
            var rowData = $('<td>' + i +'</td>');
            row.append(rowData);
      		for (var j = 0; j < i; j++) {
                var input = '<input class="small" type="text" value="' +  randomNumberFromRange(1, 20) +'">';
      			var rowData = $('<td>' + input +'</td>');
      			row.append(rowData);
      		}
      		table.append(row);
        }

      	if ($('table').length) {
            $('table').remove();
        }
        $('#matrix_area').append(table);

        $('#find').removeClass('hidden');

	});

    $("#find").click(function(){
        var lastPoint = points.length - 1;
        var matrix = parseMatrix(lastPoint + 1);
        
        for (var i = 1; i <= lastPoint; ++i) {
            for (var j = 0; j < lastPoint; ++j) {
                if (i > j) {
                    drawLabel(ctx, matrix[i][j], points[j], points[i]);
                }
            }
        }

    });   
   
})

function parseMatrix(size){
    var matrix = []

    var k = 0;
    for (var i = 0; i < size; i++) {
        var array = []
        for (var j = 0; j < size; j++) {
            if (i > j) {
                array.push($('td > input')[k].value);
                k++;
            } else {
                array.push(0);
            }
        }
        matrix.push(array); 
    }

    for (var i = 0; i < size; ++i) {
        for (var j = 0; j < size; ++j) {
            if (i < j) {
                matrix[i][j] = matrix[j][i];
            }
        }
    }
    return matrix;
}  

function drawLabel(ctx, text, p1, p2, color, alignment, padding ){
    if (!alignment) alignment = 'center';
    if (!padding) padding = 0;
    if (!color) color = 'blue';

    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;   
    var p, pad;
    if (alignment=='center'){
        p = p1;
        pad = 1/2;
    } else {
        var left = alignment=='left';
        p = left ? p1 : p2;
        pad = padding / Math.sqrt(dx*dx+dy*dy) * (left ? 1 : -1);
    }

    ctx.save();
    ctx.textAlign = alignment;
    ctx.translate(p.x+dx*pad,p.y+dy*pad);
    ctx.rotate(Math.atan2(dy,dx));
    ctx.fillStyle = color;
    ctx.fillText(text,0,0);
    ctx.restore();
}

function randomNumberFromRange(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}