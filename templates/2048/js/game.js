$(document).ready(function () {
    var matrix = [[0, 0, 2, 0],
        [2, 2, 2, 0],
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
        console.log(matrix);
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

    var generateNew = function(key) {
        var count = 3;
        var needGenerate = true;
        while (needGenerate && count-- > 0 ) {
            var index = parseInt(Math.random() * 4, 10);
            if(key === 37) {
                if(matrix[index][3] == 0) {
                    matrix[index][3] = 2;
                    matrixstate[index][3] = 1;
                    needGenerate = false;
                }
            }
        }
        if(needGenerate) {
            if(key === 37) {
                for(var x = 0; x < 4; x++) {
                    matrix[x][3] = 2;
                    matrixstate[x][3] = 1;
                }
            }
        }


    };

    getDivFromMatrix();


    //<div class="tile tile-2 tile-position-3-1"><div class="tile-inner">2</div></div>
    // css donghua http://www.ruanyifeng.com/blog/2014/02/css_transition_and_animation.html
    // http://jqueryui.com/switchClass/
    // http://stackoverflow.com/questions/1248542/jquery-animate-with-css-class-only-without-explicit-styles
    //$( ".tile-position-3-1" ).switchClass( "tile-position-3-1", "tile-position-1-1", 600 );
    // not working

    $(document).keyup(function (event) {
        // reset the state
        matrixstate = [[0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]];

        // 37 <- 38 ^ 39 -> 40 v
        console.log(event);
        console.log(event.which);
        if (event.which == 37) {
            for (var i = 0; i < 4; i++) {
                var curj = 0;

                matrixstate[i][curj] = 0;
                //var cstatus = matrixstate[i][curj];
                for (var j = 1; j < 4; j++) {
                    if (matrix[i][j] == 0) {
                        continue;
                    }
                    // else matrix[i][j] > 0
                    if (matrix[i][curj] == 0) {
                        matrix[i][curj] = matrix[i][j];
                        matrixstate[i][curj] = 0;

                        matrix[i][j] = 0;
                        matrixstate[i][j] = 0;
                        //curj = curj + 1;
                    } else if (matrix[i][curj] === matrix[i][j]) {
                        // merge
                        matrix[i][curj] = matrix[i][curj] * 2;
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
            generateNew(event.which);
        }
        getDivFromMatrix();

    });


});