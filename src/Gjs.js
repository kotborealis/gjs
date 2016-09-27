import * as Graph from './Graph';
import CanvasManager from './CanvasManager';
import * as GraphRender from './GraphRender';

export const Gjs = function(canvas_selector){
	this.graph = new Graph.Graph();

	const canvas = new CanvasManager(canvas_selector, {fullscreen: true});
	const render = new GraphRender.Render(canvas, this.graph);
}