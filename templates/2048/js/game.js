$(document).ready(function () {
    var matrix = [[0, 0, 0, 0],
        [0, 2, 2, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]];

    // 0 nothing, 1 new, 2 merged
    var matrixstate = [[0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]];

    //$("p").click(function () {
    //    $(this).hide();
    //});
    console.log(matrix);

    var index = parseInt(Math.random() * 16, 10);
    var i = parseInt(index / 4) + 1;
    var j = index % 4 + 1;

    console.log(i + ' : ' + j);
    matrix[i - 1][j - 1] = 2;
    matrixstate[i - 1][j - 1] = 1;
    //var add = $("<div><div class=\"tile-inner\">2</div></div>");
    //add.addClass("tile");
    //add.addClass("tile-2");
    //add.addClass("tile-position-" + j + "-" + i);
    //add.addClass("tile-new");
    //$(".tile-container").append(add);
    console.log(matrix);
    var getDivFromMatrix = function() {
        $(".tile-container").empty();
        for (var i = 0; i < 4; i++) {
            for(var j = 0; j < 4; j ++) {
                if(matrix[i][j] == 0) {
                    continue;
                }

                var add = $("<div><div class=\"tile-inner\">" + matrix[i][j] + "</div></div>");
                add.addClass("tile");
                add.addClass("tile-" + matrix[i][j]);
                add.addClass("tile-position-" + (j+1) + "-" + (i+1));
                if(matrixstate[i][j] === 1) {
                    add.addClass("tile-new");
                } else if(matrixstate[i][j] === 2) {
                    add.addClass("tile-merged");
                }
                $(".tile-container").append(add);
            }
        }
    };

    getDivFromMatrix();


    $(document).keyup(function (event) {
        // 37 <- 38 ^ 39 -> 40 v
        console.log(event);
        console.log(event.which);
        if (event.which == 37) {
            for (var i = 0; i < 4; i++) {
                curj = 0;
                var cvalue = matrix[i][curj];
                var cstatus = matrixstate[i][curj];
                for (var j = 1; j < 4; j++) {
                    if (matrix[i][j] == 0) {
                        continue;
                    }
                    // else matrix[i][j] > 0
                    if (cvalue == 0) {
                        cvalue = matrix[i][j];
                        matrix[i][curj] = cvalue;
                        matrixstate[i][curj] = 0;
                        curj = curj + 1;
                        matrix[i][j] = 0;
                        matrixstate[i][j] = 0;
                    } else if (cvalue === matrix[i][j]) {
                        // merge
                        matrix[i][curj] = cvalue * 2;
                        matrixstate[i][curj] = 2;
                        matrix[i][j] = 0;
                        matrixstate[i][j] = 0;
                        curj = curj + 1;
                    } else { // move to next
                        curj = curj + 1;
                        if (curj !== j) {
                            matrix[i][curj] = matrix[i][j];
                            matrixstate[i][curj] = matrixstate[i][j];
                            matrix[i][j] = 0;
                            matrixstate[i][j] = 0;
                        }
                    }


                }
            }
        }
        getDivFromMatrix();

    });


});