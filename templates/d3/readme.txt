http://www.pkuwwt.tk/d3-tutorial-cn/about.html

当D3将数据绑定到一个元素上时，该数据并没有在DOM中出现，而是作为元素的__data__属性而存在于内存中

当D3发现一个匿名函数时，它会尝试调用这个函数，同时把当前数据d作为此函数的参数传递给它。

d3.select("body").selectAll("p")
                    .data(dataset)
                    .enter()
                    .append("p")
                    .text(function(d) { return "data : " + d; });

简单柱状图
css

div.bar {
    display: inline-block;
    width: 20px;
    height: 75px;   /* We'll override this later */
    background-color: teal;
    margin-right: 2px;
}

js

            d3.select("body").selectAll("div")
                    .data(dataset)
                    .enter()
                    .append("div")
                    .classed("bar", true)
                    .style("height", function(d) {
                        var barHeight = d * 5;  //Scale up by factor of 5
                        return barHeight + "px";
                    });

### SVG元素的样式
SVG的默认样式是黑色填充而不画线。如果你想修改样式，你需要将样式应用到元素上。常用的SVG属性有：

* fill — 一个颜色值。和CSS一样，颜色可以有几种指定方式
  * 颜色名称。比如orange
  * 十六进制数。比如#3388aa或#38a
  * RGB值。比如rgb(10,150,20)
  * RGB值加上不透明度。rgba(10,150,20,0.5)
* stroke — 也是一个颜色值，即画线时的颜色
* stroke-width — 一个数值(一般是以像素为单位)
* opacity — 0到1之间的一个数值，0表示完全透明，1表示完全不透明

直接应用
<circle cx="25" cy="25" r="22"
 fill="yellow" stroke="orange" stroke-width="5"/>

或指定一个样式类

<circle cx="25" cy="25" r="22" class="pumpkin"/>

.pumpkin {
    fill: yellow;
    stroke: orange;
    stroke-width: 5;
 }

CSS有很多好处
但是使用CSS来应用SVG样式还是会让一些人心里不舒服。因为fill，stroke和stroke-width其实都不是CSS属性(最接近的CSS属性是background-color和border)。如果你想将SVG专用的规则标记出来，你可以在选择器中加上svg关键字。

svg .pumpkin {
    /* ... */
}

SVG中没有”层”和深度的概念。将SVG视为画布就很好理解了。先画的总是被后画的给掩盖，因而后画的形状表现为最上面。

因此，如果有些形状不能被遮挡，则绘制顺序就很重要了。比如，坐标轴和散点图上的标签。坐标轴和标签总是应该出现在SVG代码的最后面，这样才能保证它们始终出现在其它元素的上面。

### 透明度
如果在可视化中出现重叠，而你又想让被遮挡的元素可见，或者你想强调一些元素而弱化其它一些，那么透明度就有用武之地了。

使用透明度有两种方法：使用带不透明度的RGB，或单独设置不透明度opacity。

你可以在任意需要颜色的地方使用rgba()，比如fill，或stroke.rgba()都接受3个0至255之间的颜色值(分别表示红绿蓝)和1个0.0至1.0的不透明度值。

<circle cx="25" cy="25" r="20" fill="rgba(128, 0, 128, 1.0)"/>
<circle cx="50" cy="25" r="20" fill="rgba(0, 0, 255, 0.75)"/>
<circle cx="75" cy="25" r="20" fill="rgba(0, 255, 0, 0.5)"/>
<circle cx="100" cy="25" r="20" fill="rgba(255, 255, 0, 0.25)"/>
<circle cx="125" cy="25" r="20" fill="rgba(255, 0, 0, 0.1)"/>

注意，在用rgba()时，fill和stroke的不透明度是独立的。下面这个例子中，圆在填充时fill的不透明度是75%，而stroke的不透明度是25%。

<circle cx="25" cy="25" r="20"
        fill="rgba(128, 0, 128, 0.75)"
        stroke="rgba(0, 255, 0, 0.25)" stroke-width="10"/>
<circle cx="75" cy="25" r="20"
        fill="rgba(0, 255, 0, 0.75)"
        stroke="rgba(0, 0, 255, 0.25)" stroke-width="10"/>
<circle cx="125" cy="25" r="20"
        fill="rgba(255, 255, 0, 0.75)"
        stroke="rgba(255, 0, 0, 0.25)" stroke-width="10"/>

如果要为整个元素设置不透明度，可以使用opacity属性。

<circle cx="25" cy="25" r="20" fill="purple"
        stroke="green" stroke-width="10"
        opacity="0.9"/>
<circle cx="65" cy="25" r="20" fill="green"
        stroke="blue" stroke-width="10"
        opacity="0.5"/>
<circle cx="105" cy="25" r="20" fill="yellow"
        stroke="red" stroke-width="10"
        opacity="0.1"/>

你也可以在使用rgba()的同时再设置元素的opacity。这时，不透明度会相乘。下面例子中的圆对于fill和stroke使用同样的RGBA值，第一个圆没有设置opacity，而后两个设置了。

<circle cx="25" cy="25" r="20"
        fill="rgba(128, 0, 128, 0.75)"
        stroke="rgba(0, 255, 0, 0.25)" stroke-width="10"/>
<circle cx="65" cy="25" r="20"
        fill="rgba(128, 0, 128, 0.75)"
        stroke="rgba(0, 255, 0, 0.25)" stroke-width="10"
        opacity="0.5"/>
<circle cx="105" cy="25" r="20"
        fill="rgba(128, 0, 128, 0.75)"
        stroke="rgba(0, 255, 0, 0.25)" stroke-width="10"
        opacity="0.2"/>

注意，第3个圆的opacity为0.2，即20%。而它的紫色填充已经有了不透明值0.75(或75%)。因此，紫色区域最终的不透明度为0.2乘以0.75，结果为0.15，或15%。


用d3绘制svg

            var w = 500;
            var h = 50;

            var svg = d3.select("body")
                    .append("svg")
                    .attr("width", w)   // <-- Here
                    .attr("height", h); // <-- and here!

            var circles = svg.selectAll("circle")
                    .data(dataset)
                    .enter()
                    .append("circle");

            circles.attr("cx", function(d, i) {
                return (i * 50) + 25;
            })
                    .attr("cy", h/2)
                    .attr("r", function(d) {
                        return d;
                    })
                    .attr("fill", "yellow")
                    .attr("stroke", "orange")
                    .attr("stroke-width", function(d) {
                        return d/2;
                    });

用d3 加 svg 绘制柱状图

            var w = 500;
            var h = 100;
            var barPadding = 1;
            var svg = d3.select("body")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);

            svg.selectAll("rect")
                    .data(dataset)
                    .enter()
                    .append("rect")
                    .attr("x", function(d, i) {
                        return i * (w / dataset.length);
                    })
                    .attr("y", function(d) {
                        return h - d * 4;  //Height minus data value
                    })
                    .attr("width", w / dataset.length - barPadding)
                    .attr("height", function(d, i) {
                        return d * 4;
                    })
                    .attr("fill", function(d) {
                        return "rgb(0, 0, " + (d * 10) + ")";
                    });

            // 绘制标签
            svg.selectAll("text")
                    .data(dataset)
                    .enter()
                    .append("text")
                    .text(function(d) {
                        return d;
                    })
                    .attr("x", function(d, i) {
                        return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
                    })
                    .attr("y", function(d) {
                        return h - (d * 4) + 14;
                    })
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "11px")
                    .attr("fill", "white")
                    .attr("text-anchor", "middle");

散点图

            var dataset = [
                [ 5,     20 ],
                [ 480,   90 ],
                [ 250,   50 ],
                [ 100,   33 ],
                [ 330,   95 ],
                [ 410,   12 ],
                [ 475,   44 ],
                [ 25,    67 ],
                [ 85,    21 ],
                [ 220,   88 ]
            ];

            var w = 500;
            var h = 100;
            var svg = d3.select("body")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);

            svg.selectAll("circle")
                    .data(dataset)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d) {
                        return d[0];
                    })
                    .attr("cy", function(d) {
                        return d[1];
                    })
                    .attr("r", function(d) {
                        return Math.sqrt(h - d[1]);
                    });

            svg.selectAll("text")
                    .data(dataset)
                    .enter()
                    .append("text")
                    .text(function(d) {
                        return d[0] + "," + d[1];
                    })
                    .attr("x", function(d) {
                        return d[0];
                    })
                    .attr("y", function(d) {
                        return d[1];
                    })
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "11px")
                    .attr("fill", "red");

尺度
“尺度是将输入域映射为输出范围的函数”，这是Mike Bostock对D3尺度的定义。

数据集中的值很有可能不会精确对应于可视化中的像元。因此，尺度提供了一种方便的方式，将数据值映射为基于可视化目的的新值。

D3尺度是可以让用户定义参数的函数。一旦生成一个尺度，你可以调用此尺度函数，传入一个数据值，然后它会返回一个缩放后的值。你可以任意定义和使用尺度。

将尺度想像成最终图像中的图形会让人感觉更容易理解，比如表示数值渐进变化的刻度线。但不要被误导了。这些刻度线只不过是坐标轴的一部分，它们本质上只不过是尺度的图形表达。一个尺度是一种数学关系，与图形输出并没有直接关系。我建议读者，将尺度与坐标轴视为两种不同但相关的元素。

这里，我们只讨论线性尺度，因为这也是最常用和最易于理解的类型。一旦你理解了线性尺度，其它尺度只是小菜一碟罢了。


### 输入和输出范围
var dataset = [ 100, 200, 300, 400, 500 ];

尺度的输入范围是输入数据值的可能范围。以上面的苹果数据为例，输入范围可以是100和500之间(即数据集的最小和最大值)，也可以是0到500。

尺度的输出范围是输出数据的可能范围，为了方便显示，通常是以像元为单位。输出范围的确定完全取决于你，即信息可视化的设计者。如果你觉得最短的苹果柱子应该是10个像元高度，最高为350像元，则你可以将输出范围设置为10到350。

<svg width="505" height="115">
<text x="220" y="15" font-style="italic">Input domain</text>
<line x1="5" y1="30" x2="500" y2="30" stroke="gray" stroke-width="1"></line>
<circle cx="5" cy="30" r="3" fill="#008"></circle>
<text x="8" y="48">100</text>
<circle cx="255" cy="30" r="3" fill="#008"></circle>
<text x="258" y="48">300</text>
<circle cx="500" cy="30" r="3" fill="#008"></circle>
<text x="473" y="48">500</text>
<line x1="5" y1="90" x2="500" y2="90" stroke="gray" stroke-width="1"></line>
<circle cx="5" cy="90" r="3" fill="#008"></circle>
<text x="8" y="84">10</text>
<circle cx="255" cy="90" r="3" fill="#008"></circle>
<text x="258" y="84">180</text>
<circle cx="500" cy="90" r="3" fill="#008"></circle>
<text x="473" y="84">350</text>
<text x="220" y="110" font-style="italic">Output range</text>
</svg>

在线性尺度下，D3完全可以帮你处理归一化过程，你不用再担心那些数学问题。输入值首先会被归一化，然后再缩放到输出范围中。

var scale = d3.scale.linear()
              .domain([100, 500])
              .range([10, 350]);
scale(100);  //Returns 10
scale(300);  //Returns 180
scale(500);  //Returns 350

下面，我们将用动态尺度函数来修改我们的散点图可视化。

首先创建尺度函数
            var xScale = d3.scale.linear()
                    .domain([0, d3.max(dataset, function(d) { return d[0]; })])
                    .range([0, w]);
            var yScale = d3.scale.linear()
                    .domain([0, d3.max(dataset, function(d) { return d[1]; })])
                    .range([0, h]);

然后使用之：circle和text的都要修改

                    .attr("cx", function(d) {
                        return xScale(d[0]);
                    })
                    .attr("cy", function(d) {
                        return yScale(d[1]);
                    })

                    .attr("x", function(d) {
                        return xScale(d[0]);
                    })
                    .attr("y", function(d) {
                        return yScale(d[1]);
                    })

### 改善散点图
你可能早就注意到了，小的y值趋于图表的顶部，大的y值趋于图表的底部。以前，我们需要使用简单的数学计算来将y坐标倒过来，但现在，通过尺度函数，实现这一点更为简便了。具体的做法仅仅是将yScale的参数颠倒一下，从

.range([h, 0]);

有些元素可能会被裁剪掉了。因此，需要引入一个padding变量：

var padding = 20;

x.range([padding,  w - padding * 2]);
y.range([h - padding, padding]);

还有一件事需要考虑一下。之前，我们的circle半径是y值的平方根，我们同样也可以为其定制一个尺度函数。

var rScale = d3.scale.linear()
               .domain([0, d3.max(dataset, function(d) { return d[1]; })])
               .range([2, 5]);

然后，设置半径的代码变成

.attr("r", function(d) {
    return rScale(d[1]);
});

现在，我还可以透露一件事：我们已经可以很容易地修改SVG的大小了，不管你怎么改，里面的内容都会相应地进行缩放。比如，将h从100变为300

### 其它方法
d3.scale.linear()还有其它一些好用的方法，值得在这里提一下

* nice(): 此函数告诉尺度函数将(range()函数指定)输入范围的边界映射至最近的”取整”的值上。D3的wiki中给出了一个例子，对于输入范围 [0.20147987687960267, 0.996679553296417]，它的输出将是[0.2,1]。注意，第1个数是0.2而不是0，因为2是第1个非零有效值。这个功能是很有用的，因为类似于0.20147987687960267是很难读的。
* rangeRound(): 用rangeRound()来替换range()，则尺度函数所有的输出将会映射至最近的”取整”值。如果你想让图形的坐标与像元精确对齐，以避免模糊边界导致的走样，则此功能很有用。
* clamp(): 一个线性尺度函数默认允许返回输出范围之外的值。比如，如果给定一个输入范围之外的输入值，尺度函数的返回值就会跑到输出范围之外。通过对尺度函数调用.clamp(true)，会强制所有的输出值都位于指定的输出范围之内。这表示，超过范围的输入值会被映射到输出范围的(最近的)端点上。

### 其它尺度
除了linear尺度之外(前面的内容)，D3还内置了其它一些尺度：

* identity: 1:1尺度，主要用于像素值
* sqrt: 平方根尺度
* pow: 幂次尺度(利于健身?)
* log: 对数尺度
* quantize: 输出为离散值的线性尺度，用于将数据归类的情况
* quantile: 类似于quantize，不同的是输入也是离散值
* ordinal: 有序尺度，输出为非数值的值(比如类别名称)。适合比较苹果和桔子哟。

### 坐标轴
与尺度函数很类似，D3的坐标轴实际上也是函数，它的参数是用户定义的。不同的是，调用坐标轴函数之后，它并没有返回一个值，而是得到一个坐标轴的图形元素，包括线，标签和刻度。

var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .ticks(5);  // 刻度的大致个数

最后，为了真正地生成坐标轴，并将其插入到SVG中(包括轴上面的线和标签)，我们必须执行这个xAxis函数。我会将这句代码置于脚本的最后，在其它元素之后生成坐标轴，这样坐标轴才不至于被其它元素所覆盖。

svg.append("g")
    .call(xAxis);

美观

svg.append("g")
    .attr("class", "axis")  //Assign "axis" class
    .attr("transform", "translate(0," + (h - padding) + ")") // 放在底部
    .call(xAxis);

css：
.axis path,
.axis line {
    fill: none;
    stroke: black;
    shape-rendering: crispEdges;
}

.axis text {
    font-family: sans-serif;
    font-size: 11px;
}

y轴类似
            var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(5);
            svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + padding + ",0)")
                    .call(yAxis);

如果需要对刻度特殊展示，可以这样
var formatAsPercentage = d3.format(".1%");
xAxis.tickFormat(formatAsPercentage);

动画
http://alignedleft.com/tutorials/d3/transitions

http://alignedleft.com/projects/2014/easy-as-pi/
非常棒的演示

主人的网站
http://alignedleft.com/resources


d3 wiki
https://github.com/mbostock/d3/wiki/Tutorials

免费书
http://chimera.labs.oreilly.com/books/1230000000345/
http://chimera.labs.oreilly.com/books/1230000000345/index.html

https://www.dashingd3js.com/table-of-contents

mbostock的作品
http://bl.ocks.org/mbostock

有趣的网页
https://ruby-china.org/topics/16216
放弃raphael
http://www.wendyshijia.com/
raphael的网页

OUR D3.JS 数据可视化专题站
http://www.ourd3js.com/wordpress/
很多中文资料


【 D3.js 入门系列 】 入门总结
http://www.ourd3js.com/wordpress/?p=396

### 选择元素和绑定数据

在 D3 中，用于选择元素的函数有两个：

* d3.select()：是选择所有指定元素的第一个
* d3.selectAll()：是选择指定元素的全部
这两个函数返回的结果称为选择集。

D3 中是通过以下两个函数来绑定数据的：

* datum()：绑定一个数据到选择集上
* data()：绑定一个数组到选择集上，数组的各项值分别与选择集的各元素绑定

### 做一个简单的图表！

svg.selectAll("rect")   //选择svg内所有的矩形
    .data(dataset)  //绑定数组
    .enter()        //指定选择集的enter部分
    .append("rect") //添加足够数量的矩形元素
这段代码添加了与 dataset 数组的长度相同数量的矩形
当有数据，而没有足够图形元素的时候，使用此方法可以添加足够的元素。

var width = 300;  //画布的宽度
var height = 300;   //画布的高度

var svg = d3.select("body")     //选择文档中的body元素
    .append("svg")          //添加一个svg元素
    .attr("width", width)       //设定宽度
    .attr("height", height);    //设定高度

var rectHeight = 25;   //每个矩形所占的像素高度(包括空白)

svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x",20)
    .attr("y",function(d,i){
         return i * rectHeight;
    })
    .attr("width",function(d){
         return d;
    })
    .attr("height",rectHeight-2)
    .attr("fill","steelblue");


修改方法
style
append
insert
remove

动画方法
transition()
duration()
ease()
delay()

### 理解 update, enter, exit 的使用
http://www.ourd3js.com/wordpress/?p=149

	svg.selectAll("rect")
           .data(dataset)
           .enter()
           .append("rect")

当所选择的 数量比绑定的数据 dataset 的数量少的时候，就会用到以上代码，但之前并没有深究是原因。这一节就详细说说当被选择元素和数据数量不一致时该如何处理。

1. update()

当对应的元素正好满足时 （ 绑定数据数量 = 对应元素 ）

实际上并不存在这样一个函数，只是为了要与之后的 enter() 和 exit() 一起说明才认为有这样一个函数。当对应元素正好满足时，后面直接跟 text ，style 等操作即可。

2. enter()

当对应的元素不足时 （ 绑定数据数量 > 对应元素 ）

当对应的元素不足时，要添加元素，使之与绑定数据的数量相等。后面跟 append 函数添加元素。

3. exit()

当对应的元素过多时 （ 绑定数据数量 < 对应元素 ）

当对应的元素过多时，通常要删除元素，使之与绑定数据的数量相等。后面跟 remove 函数删除元素。

实例

<body>
		<p>AAAAAAAAA</p>
		<p>BBBBBBBBB</p>
		<p>CCCCCCCCC</p>

<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script>

		var dataset = [ 10 , 20 , 30 , 40 , 50 ];

		var update = d3.select("body").selectAll("p").data(dataset);
		var enter  = update;

		update.text(function(d,i){
				return "update " + d;
			});

		enter.enter()
			 .append("p")
			 .text(function(d,i){
				return "enter " + d;
			});

</script>
</body>

exit

		var dataset = [ 10 , 20 ];

		var update = d3.select("body").selectAll("p").data(dataset);
		var exit  = update;

		update.text(function(d,i){
				return "update " + d;
			});

		exit.exit()
			 .text(function(d,i){
				return "exit";
			});

元素可以监听事件

常用的鼠标事件（event）有：

click  ： 鼠标单击某元素时，相当于 mousedown 和 mouseup 组合在一起
mouseover  ： 鼠标移到某元素上
mouseout  ： 鼠标从某元素移开
mousemove ： 鼠标被移动
mousedown : 鼠标按钮被按下
mouseup : 鼠标按钮被松开
dblclick  ：  鼠标双击

svg.selectAll("rect")
		   .data(dataset)
		   .enter()
		   .append("rect")
		   .attr("x", function(d,i){
				return 30 + xScale(i);
		   } )
		   .attr("y",function(d,i){
				return 50 + 500 - yScale(d) ;
		   })
		   .attr("width", function(d,i){
				return xScale.rangeBand();
		   })
		   .attr("height",yScale)
		   .attr("fill","red")
		   .on("click",function(d,i){
				d3.select(this)
				  .attr("fill","green");
		   })
		   .on("mouseover",function(d,i){
				d3.select(this)
				  .attr("fill","yellow");
		   })
		   .on("mouseout",function(d,i){
				d3.select(this)
				  .transition()
		          .duration(500)
				  .attr("fill","red");
		   });


### 常见可视化图形（ Layout ）

https://github.com/mbostock/d3/wiki/Layouts

Layout 是 D3 中 “制作常见图形的函数”，用 Layout 可以轻松地对输入数据进行转换，使得它能容易地适应可视化图形使用的需要。

D3 中共有12组 Layout 函数，这些函数不是为了在绘制中布局什么，而是对输入的数据进行转换，转换成容易进行可视化的数据。将数据绘制成图形时，需要其他的代码。我们可以简单地把 Layout 理解为“常见图形的数据转换函数”，比如饼状图等等。

http://www.ourd3js.com/wordpress/?p=163

### 饼状图的制作

Layout 的作用只是转换数据，将不适合图形化的数据转化成适合图形化的数据。

var dataset = [ 30 , 10 , 43 , 55 , 13 ];
var pie = d3.layout.pie();

5个整数被转换成了5个 Object ，每个存有起始角度和结束角度，以及原整数，这就是 Layout 的作用，将不适合图形化的数据转换成适合图形化的数据

实现，见:
* gallary/simple/pie.html

http://www.cnblogs.com/jenry/archive/2010/12/11/1903397.html
http://tutorials.jenkov.com/svg/svg-transformation.html
http://www.w3cplus.com/html5/svg-transformations.html
http://sarasoueidan.com/blog/svg-transformations/
svg 坐标变换

path
https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths

rect round tow conners
http://stackoverflow.com/questions/12115691/svg-d3-js-rounded-corner-on-one-corner-of-a-rectangle
using path。。。
http://bl.ocks.org/mbostock/3468167

### 力学图的制作
http://www.ourd3js.com/wordpress/?p=196



















svg资源
http://www.w3school.com.cn/svg/svg_examples.asp
https://developer.mozilla.org/zh-CN/docs/Web/SVG

深入svg
svg箭头
http://www.waylau.com/svg-marker-arrow/
https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/marker

text居中
https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor

svg shadow
http://www.w3schools.com/svg/svg_feoffset.asp
http://tutorials.jenkov.com/svg/filters.html
http://stackoverflow.com/questions/6088409/svg-drop-shadow-using-css3

http://demosthenes.info/blog/598/boxshadow-property-vs-dropshadow-filter-a-complete-comparison
http://demosthenes.info/blog/600/Creating-a-True-Cross-Browser-Drop-Shadow-Effect-With-CSS-amp-SVG





svg工具
https://github.com/duopixel/Method-Draw
http://editor.method.ac/

svg framework javascript
http://webdesignmoo.com/2014/10-useful-jquery-svg-libraries/
除了d3，下面几个star也很多

https://github.com/DmitryBaranovskiy/raphael/

https://github.com/adobe-webplatform/Snap.svg

https://github.com/paperjs/paper.js

https://github.com/kangax/fabric.js/

https://github.com/wout/svg.js

https://github.com/camoconnell/lazy-line-painter/
