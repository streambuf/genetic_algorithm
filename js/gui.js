jQuery(document).ready(function(){
    $('#canvas').attr('height', $('#canvas').css('height'));
    $('#canvas').attr('width', $('#canvas').css('width'));
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext('2d');
    var points = [];
    var selected_points = [];
    var modes = Object.freeze({'BUILD': 1, 'CHOICE': 2});
    var mode = modes.BUILD;

 
    $("#canvas").click(function(e){ 

        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop; 

        if (mode == modes.BUILD) {
            points.push({x:x, y:y});
            redraw();
        
        } else if (mode == modes.CHOICE) {
            for (var i = 0; i < points.length; ++i) {
                if (Math.sqrt((x-points[i].x)*(x-points[i].x) + (y-points[i].y)*(y-points[i].y)) < 10) {
                    selectNode(i);
                }
            }
        }
   
   });
   
    $("#create_matrix").click(function(){
        mode = modes.CHOICE;
        drawLabels();
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

	});

    $("#find").click(function(){
        if (selected_points.length < 2) {
            alert("Не выбраны узлы для передачи пакета");
            return;
        }

        var lastPoint = points.length - 1;
        var matrix = parseMatrix(lastPoint + 1);
        
        for (var i = 1; i <= lastPoint; ++i) {
            for (var j = 0; j < lastPoint; ++j) {
                if (i > j) {
                    drawLabel(ctx, matrix[i][j], points[j], points[i]);
                }
            }
        }

        a = selected_points[0];
        b = selected_points[1];
        if (a > b) { // swap
            a = [b, b = a][0];
        }   
        var genetic = new Genetic(matrix, a, b);
        genetic.findBestPath();

    }); 

    function selectNode(index) {
        ctx.beginPath();
        ctx.arc(points[index].x, points[index].y, 10,0, 2*Math.PI, true);
        ctx.lineWidth = 2;
        ctx.strokeStyle="red";
        ctx.stroke();
        if (selected_points.length > 1) {
            ctx.beginPath();
            ctx.arc(points[selected_points[0]].x, points[selected_points[0]].y, 10,0, 2*Math.PI, true);
            ctx.lineWidth = 2;
            ctx.strokeStyle="black";
            ctx.stroke();
            selected_points[0] = selected_points[1];
            selected_points.splice(0, 1);
            
        }
        selected_points.push(index);
    }
    
    

    function redraw(x, y) {
        //clear
        ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
        // draw point
        for (var i = 0; i < points.length; ++ i) {
            var x = points[i].x;
            var y = points[i].y;

            ctx.beginPath();
            ctx.arc(x, y, 10,0, 2*Math.PI);
            ctx.stroke();
            ctx.fillStyle="black";
            ctx.fill();
            
            
            // draw lines (point to point)
            for(var j = i + 1; j < points.length; ++j) {
                ctx.beginPath();
                ctx.moveTo(points[i].x,points[i].y);
                ctx.lineTo(points[j].x,points[j].y);
                ctx.stroke();
               
            }

        }
    }

    function drawLabels() {
        for (var i = 0; i < points.length; ++ i) {
            drawLabel(ctx, i, points[i], points[i], 'white');
        }
    }  
   
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