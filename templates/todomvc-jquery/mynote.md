##

init

		<section id="todoapp">
			<header id="header">
				<h1>todos</h1>
				<input id="new-todo" placeholder="What needs to be done?" autofocus>
			</header>
			<section id="main">
				<input id="toggle-all" type="checkbox">
				<label for="toggle-all">Mark all as complete</label>
				<ul id="todo-list"></ul>
			</section>
			<footer id="footer"></footer>
		</section>





### underscore
http://www.css88.com/doc/underscore/#
https://github.com/jashkenas/underscore
http://garann.github.io/template-chooser/

http://stackoverflow.com/questions/4778881/how-to-use-underscore-js-as-a-template-engine
a good example

var compiled = _.template("hello: <%= name %>");
compiled({name: 'moe'});
=> "hello: moe"

var template = _.template("<b><%- value %></b>");
template({value: '<script>'});
=> "<b>&lt;script&gt;</b>"

var compiled = _.template("<% print('Hello ' + epithet); %>");
compiled({epithet: "stooge"});
=> "Hello stooge"

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

var template = _.template("Hello {{ name }}!");
template({name: "Mustache"});
=> "Hello Mustache!"

_.template("Using 'with': <%= data.answer %>", {variable: 'data'})({answer: 'no'});
=> "Using 'with': no"

<script>
  JST.project = <%= _.template(jstText).source %>;
</script>

### handlebarsjs

http://handlebarsjs.com/
