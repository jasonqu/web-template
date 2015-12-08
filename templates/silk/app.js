$(document).ready(function () {
    var config = {
        rectCount: 0,
        lineCount: 0,
        rectMap: {},
        lineMap: {},
        level: 0
    };

    var currentText = "";

    /**
     * rect包含一下内容
     * id rect+number
     * name
     * level
     * x y
     * width height
     * children
     */
    var template = $("#template").html();
    var compiled = _.template(template, {variable: 'data'});
    var xml = $("#xmlresult").html();
    var xmlCompiled = _.template(xml, {variable: 'data'});

    function htmlEncode(value) {
        //create a in-memory div, set it's inner text(which jQuery automatically encodes)
        //then grab the encoded contents back out.  The div never exists on the page.
        return $('<div/>').text(value).html();
    }


    function getTree() {
        var tree = [
            {
                text: "Aggregate",
                selectable: false,
                nodes: [
                    {text: "max", category: "Aggregate"},
                    {text: "min", category: "Aggregate"}
                ]
            },
            {
                text: "Compare",
                selectable: false,
                nodes: [
                    {text: "levenshteinDistance", category: "Compare"},
                    {text: "jaroWinkler", category: "Compare"}
                ]
            },
            {
                text: "TransformInput",
                selectable: false,
                nodes: [
                    {text: "lowerCase", category: "TransformInput"},
                    {text: "upperCase", category: "TransformInput"},
                    {text: "replace", category: "TransformInput"}
                ]
            },
            {id: "1", text: "Input", category: "Input"}
        ];
        return tree;
    }

    var currentCategory = "";
    $('#treeBtns').treeview({data: getTree()})
        .on('nodeSelected', function (event, data) {
            var id = "rect" + config.rectCount;
            console.log("data : " + data);
            console.log(data);
            if (config.level === 0) {
                var root = {
                    id: id,
                    x: 50,
                    y: 400,
                    level: 0,
                    name: data.text,
                    category: data.category,
                    children: []
                };
                $('#graph').append(compiled(root));
                config.level++;


                config.rectMap[id] = root;
                config.rectCount++;
                config.root = root;

                $("#svgcont").html($("#svgcont").html());
            } else {
                //if(config.)
                currentText = data.text;
                currentCategory = data.category;
                // http://stackoverflow.com/questions/1801499/how-to-change-options-of-select-with-jquery
                // http://stackoverflow.com/questions/5533192/how-to-get-object-length
                var $el = $("#parent");
                $el.empty(); // remove old options
                $.each(config.rectMap, function (key, value) {
                    var len = value.children.length || 0;
                    // console.log(value.id + " level & children" + value.children)

                    if (value.level < 4 && len < 2 && value.name !== "Input") {
                        $el.append($("<option></option>")
                            .data('category', value.category)
                            .data("level", value.level)
                            .attr("value", value.id)
                            .text(value.name + " - " + value.id + " - " + value.level));
                    }
                });
                $('#myModal2').modal('show');
            }
        });


    var datasources = {};
    $('#savedatasource').click(function () {
        $.each($("#formdatasource").serializeArray(), function (i, field) {
            datasources[field.name] = field.value || "";
        });
        console.log(datasources);
        $('#myModal').modal('hide');
    });

    $('#savetreenode').click(function () {
        //console.log($('#parent').val())
        var parent = config.rectMap[$('#parent').val()]

        var deltay = 0;
        if (parent.level === 0) {
            deltay = 200;
        } else if (parent.level === 1) {
            deltay = 100;
        } else if (parent.level === 2) {
            deltay = 50;
        } else if (parent.level === 3) {
            deltay = 25;
        }

        console.log("parent length " + parent.children.length)
        if (parent.children.length === 0) {
            deltay = -deltay;
        }


        var id = "rect" + config.rectCount;

        var child = {
            id: id,
            x: (parent.x + 200),
            y: (parent.y + deltay),
            name: currentText,
            parent: parent,
            path: $('#inputpath').val(),
            threshold: $('#threshold').val(),
            category: currentCategory,
            level: (parent.level + 1),
            children: []
        };


        if (parent.level === config.level) {
            config.level++;
        }

        parent.children.push(child);
        config.rectCount++;
        console.log("add rect " + id);
        config.rectMap[id] = child;
        $('#graph').append(compiled(child));
        $('#graph').append(
            $('<line/>')
                .attr("x1", child.parent.x + 150)
                .attr("y1", child.parent.y + 15)
                .attr("x2", child.x)
                .attr("y2", child.y + 15)
                .attr("style", "stroke:rgb(99,99,99);stroke-width:2")
        );

        $("#svgcont").html($("#svgcont").html());

        $('#myModal2').modal('hide');
        //$("#svgcont").html($("#svgcont").html());
    });


    // http://stackoverflow.com/questions/3191179/generate-xml-document-in-memory-with-javascript
    // Simple helper function creates a new element from a name, so you don't have to add the brackets etc.
    $.createElement = function (name) {
        return $('<' + name + ' />');
    };
    // JQ plugin appends a new element created from 'name' to each matched element.
    $.fn.appendNewElement = function (name) {
        this.each(function (i) {
            $(this).append('<' + name + ' />');
        });
        return this;
    };

    function createXml(myroot) {
        var $newNode = $.createElement(myroot.category);
        if (myroot.category === "Aggregate") {
            $newNode.attr("type", myroot.name);
        } else if (myroot.category === "Compare") {
            $newNode.attr("metric", myroot.name)
                .attr("threshold", myroot.threshold);
        } else if (myroot.category === "TransformInput") {
            $newNode.attr("function", myroot.name);
        } else if (myroot.category === "Input") {
            $newNode.attr("path", myroot.path);
        }

        // $link.append($newNode);
        for (var i = 0; i < myroot.children.length; i++) {
            $newNode.append(createXml(myroot.children[i]))
        }
        return $newNode;
    }

    $('#preview').click(function () {
        // http://stackoverflow.com/questions/1219860/html-encoding-in-javascript-jquery
        // http://stackoverflow.com/questions/8067291/run-template-in-template-recursion-within-underscore-js-template-engine
        var $root = $('<XMLDocument />');

        $root.append(
            // one method of adding a basic structure
            $('<DataSources />').append(
                $('<DataSource />')
                    .attr("id", datasources.SourceId)
                    .attr("type", "sparqlEndpoint")
                    .append(
                    $('<Param />')
                        .attr("value", datasources.SourceEndpointURI)
                        .attr("name", "endpointURI")
                )
            ).append(
                $('<DataSource />')
                    .attr("id", datasources.TargetId)
                    .attr("type", "sparqlEndpoint")
                    .append(
                    $('<Param />')
                        .attr("value", datasources.TargetEndpointURI)
                        .attr("name", "endpointURI")
                )
            )
        );

        var $linkroot = $('<root />');
        $linkroot.append(
            $('<Interlinks />').append(
                $('<Interlink />').attr("id", "drugsTODO")
                    .append(
                    $('<LinkType />').text('owl:sameAsTODO')
                ).append(
                    $('<SourceDataset />')
                        .attr("dataSource", datasources.SourceId)
                        .attr("var", "a")
                        .append(
                        $('<RestrictTo />').text(datasources.SourceRestrictTo)
                    )
                ).append(
                    $('<TargetDataset />')
                        .attr("dataSource", datasources.TargetId)
                        .attr("var", "b")
                        .append(
                        $('<RestrictTo />').text(datasources.TargetRestrictTo)
                    )
                )
                    .append(createXml(config.root))
                    .append($('<Filter />').attr("limit", "1TODO"))
            )
        );

        // https://github.com/vkiryukhin/vkBeautify
        $('#codepreview').html(htmlEncode(xmlCompiled({ds: $root.html(), il: $linkroot.html()})));

    });
});

