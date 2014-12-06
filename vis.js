d3.json("contagion.json", function(error, graph) {

	var minStep = 0
	var maxStep = graph.nodesByStep.length - 1;
	
	function listWidget(selector, data) {
	
		var _data = data;
		
		var list = d3.select(selector).append("ul")
			.attr("class", ".ui-widget");
		
		this.render = function() {
			var nodes = list.selectAll("li").data(_data.nodes);
			nodes.enter().append("li")
			nodes
				.attr("class", function(d) { return d.state; })
				.html(function(d) { return d.name + ": "; })
			  .append("span")
				.attr("class", "state")
				.text(function(d) { return d.state; });
		}
	}
	
	var width = 500,
		height = 500;
	
	function forceGraph(selector,data) {

		var _data = data;

		svg = d3.select(selector)
		  .append('svg')
			.attr("width", width)
			.attr("height", height);

		this.data = function(value) {
		  if(!arguments.length) {
			 // accessor
			 return _data;
		  }
		  _data = value;
		  return this; // setter, returns the forceGraph object
		}
		
		function tick() {
			svg.selectAll(".link")
				.attr("x1", function (d) { return d.source.x; })
				.attr("y1", function (d) { return d.source.y; })
				.attr("x2", function (d) { return d.target.x; })
				.attr("y2", function (d) { return d.target.y; });
			
			svg.selectAll(".node")
				.attr("cx", function (d) { return d.x; })
				.attr("cy", function (d) { return d.y; });
		};
		
		var force = d3.layout.force()
			.charge(-200)
			.linkDistance(120)
			.size([width, height])
			.on("tick", tick);
		
		d3.timer(force.resume);
		
		this.render = function() {
		
			var linkData = _data.links;
			var nodeData = _data.nodes;
			
			force
				.links(linkData)
				.nodes(nodeData);

			var links = svg.selectAll(".link").data(linkData);
			var nodes = svg.selectAll(".node").data(nodeData, function(d) {return d.id;})
			
			links.enter().append("line")
				.attr("class", "link")
			links
				.style("stroke-width", function (d) { return d.value; });
			links.exit().remove();
				
			nodes.enter().append("circle")
				.attr("id", function(d) {return "node-" + d.id; })
				.attr("r", 8);
			nodes
				.attr("class", function (d) { return "node " + d.state; })
				.call(force.drag);				
			nodes.exit().remove();
			
			force.start();
		}
	}

	var data = {nodes: graph.nodesByStep[0], links: graph.links};
	
	l = new listWidget("#list-root", data);
	l.render();
	
	g = new forceGraph("#graph-root", data);
	g.render();
	
	function updateNodes(step) {
		var newNodes = graph.nodesByStep[step];
		for (i=0; i<data.nodes.length; i++) {
			data.nodes[i].state = newNodes[i].state;
		}
		l.render();
		g.render();
	}
	
	$(function() {

		function switchToPlay() {
			$( "#play" ).button( "option", {
				label: "play",
				icons: {
					primary: "ui-icon-play"
				}
			});
		}

		$("#back").button({
			text: false,
			icons: {
				primary: "ui-icon-carat-1-w"
			}
		})
		.click(switchToPlay);
		$("#next").button({
			text: false,
			icons: {
				primary: "ui-icon-carat-1-e"
			}
		})
		.click(switchToPlay);
		
		$( "#beginning" ).button({
			text: false,
			icons: {
				primary: "ui-icon-seek-start"
			}
		})
		.click(switchToPlay);
		
		$( "#play" ).button({
			text: false,
			icons: {
				primary: "ui-icon-play"
			}
		})
		.click(function() {
			var options;
			if ( $( this ).text() === "play" ) {
				options = {
					label: "pause",
					icons: {
						primary: "ui-icon-pause"
					}
				};
			} else {
				options = {
					label: "play",
					icons: {
						primary: "ui-icon-play"
					}
				};
			}
			$( this ).button( "option", options );
		});
		
		$( "#end" ).button({
			text: false,
			icons: {
				primary: "ui-icon-seek-end"
			}
		})
		.click(switchToPlay);

		var timer;
		var s = $( "#slider" ).slider({
			value: 0,
			min: minStep,
			max: maxStep,
			step: 1,
			slide: function( event, ui ) {
				clearInterval(timer);
				switchToPlay();
			},
			change: function( event, ui ) {
				//updateList(ui.value);
				//updateGraph(ui.value);
				updateNodes(ui.value);
				$( "#step-counter" ).text( ($( "#slider" ).slider( "value" ) + 1) + "/" + (maxStep + 1) );
			}
		});
		$( "#step-counter" ).text( ($( "#slider" ).slider( "value" ) + 1) + "/" + (maxStep + 1) );
		
		function advance() {
			var v = s.slider("value");
			if (v < maxStep) {
				s.slider("value", v + 1);
			};
		}
		
		$('#play').click(function() {
			if ( $( this ).text() != "play" ) {
				advance();
				timer = setInterval(function() {
					advance();
				}, 500);
			} else {
				clearInterval(timer);
			}
		});
		
		$('#stop').click(function() {
			clearInterval(timer);
			s.slider("value", 0);
		});
		
		$('#beginning').click(function() {
			clearInterval(timer);
			s.slider("value", 0);
		});
		
		$('#end').click(function() {
			clearInterval(timer);
			s.slider("value", maxStep);
		});
		
		$('#back').click(function() {
			clearInterval(timer);
			var v = s.slider("value");
			if (v > minStep) {
				s.slider("value", v - 1);
			};
		});
		
		$('#next').click(function() {
			clearInterval(timer);
			advance();
		});
		
	});
});