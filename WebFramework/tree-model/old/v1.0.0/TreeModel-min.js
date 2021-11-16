(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.TreeModel=f()}})(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){var mergeSort,findInsertIndex;mergeSort=require("mergesort");findInsertIndex=require("find-insert-index");module.exports=function(){"use strict";var walkStrategies;walkStrategies={};function TreeModel(config){config=config||{};this.config=config;this.config.childrenPropertyName=config.childrenPropertyName||"children";this.config.modelComparatorFn=config.modelComparatorFn}TreeModel.prototype.parse=function(model){var i,childCount,node;if(!(model instanceof Object)){throw new TypeError("Model must be of type object.")}node=new Node(this.config,model);if(model[this.config.childrenPropertyName]instanceof Array){if(this.config.modelComparatorFn){model[this.config.childrenPropertyName]=mergeSort(this.config.modelComparatorFn,model[this.config.childrenPropertyName])}for(i=0,childCount=model[this.config.childrenPropertyName].length;i<childCount;i++){addChildToNode(node,this.parse(model[this.config.childrenPropertyName][i]))}}return node};function addChildToNode(node,child){child.parent=node;node.children.push(child);return child}function hasComparatorFunction(node){return typeof node.config.modelComparatorFn==="function"}function Node(config,model){this.config=config;this.model=model;this.children=[]}Node.prototype.isRoot=function(){return this.parent===undefined};Node.prototype.hasChildren=function(){return this.children.length>0};Node.prototype.addChild=function(child){return addChild(this,child)};Node.prototype.addChildAtIndex=function(child,index){if(hasComparatorFunction(this)){throw new Error("Cannot add child at index when using a comparator function.")}return addChild(this,child,index)};function addChild(self,child,insertIndex){var index;if(!(child instanceof Node)){throw new TypeError("Child must be of type Node.")}child.parent=self;if(!(self.model[self.config.childrenPropertyName]instanceof Array)){self.model[self.config.childrenPropertyName]=[]}if(hasComparatorFunction(self)){index=findInsertIndex(self.config.modelComparatorFn,self.model[self.config.childrenPropertyName],child.model);self.model[self.config.childrenPropertyName].splice(index,0,child.model);self.children.splice(index,0,child)}else{if(insertIndex===undefined){self.model[self.config.childrenPropertyName].push(child.model);self.children.push(child)}else{if(insertIndex<0||insertIndex>self.children.length){throw new Error("Invalid index.")}self.model[self.config.childrenPropertyName].splice(insertIndex,0,child.model);self.children.splice(index,0,child)}}return child}Node.prototype.getPath=function(){var path=[];(function addToPath(node){path.unshift(node);if(!node.isRoot()){addToPath(node.parent)}})(this);return path};function parseArgs(){var args={};if(arguments.length===1){args.fn=arguments[0]}else if(arguments.length===2){if(typeof arguments[0]==="function"){args.fn=arguments[0];args.ctx=arguments[1]}else{args.options=arguments[0];args.fn=arguments[1]}}else{args.options=arguments[0];args.fn=arguments[1];args.ctx=arguments[2]}args.options=args.options||{};if(!args.options.strategy){args.options.strategy="pre"}if(!walkStrategies[args.options.strategy]){throw new Error("Unknown tree walk strategy. Valid strategies are 'pre' [default], 'post' and 'breadth'.")}return args}Node.prototype.walk=function(){var args;args=parseArgs.apply(this,arguments);walkStrategies[args.options.strategy].call(this,args.fn,args.ctx)};walkStrategies.pre=function depthFirstPreOrder(callback,context){var i,childCount,keepGoing;keepGoing=callback.call(context,this);for(i=0,childCount=this.children.length;i<childCount;i++){if(keepGoing===false){return false}keepGoing=depthFirstPreOrder.call(this.children[i],callback,context)}return keepGoing};walkStrategies.post=function depthFirstPostOrder(callback,context){var i,childCount,keepGoing;for(i=0,childCount=this.children.length;i<childCount;i++){keepGoing=depthFirstPostOrder.call(this.children[i],callback,context);if(keepGoing===false){return false}}keepGoing=callback.call(context,this);return keepGoing};walkStrategies.breadth=function breadthFirst(callback,context){var queue=[this];(function processQueue(){var i,childCount,node;if(queue.length===0){return}node=queue.shift();for(i=0,childCount=node.children.length;i<childCount;i++){queue.push(node.children[i])}if(callback.call(context,node)!==false){processQueue()}})()};Node.prototype.all=function(){var args,all=[];args=parseArgs.apply(this,arguments);walkStrategies[args.options.strategy].call(this,function(node){if(args.fn.call(args.ctx,node)){all.push(node)}},args.ctx);return all};Node.prototype.first=function(){var args,first;args=parseArgs.apply(this,arguments);walkStrategies[args.options.strategy].call(this,function(node){if(args.fn.call(args.ctx,node)){first=node;return false}},args.ctx);return first};Node.prototype.drop=function(){var indexOfChild;if(!this.isRoot()){indexOfChild=this.parent.children.indexOf(this);this.parent.children.splice(indexOfChild,1);this.parent.model[this.config.childrenPropertyName].splice(indexOfChild,1);this.parent=undefined;delete this.parent}return this};return TreeModel}()},{"find-insert-index":2,mergesort:3}],2:[function(require,module,exports){module.exports=function(){"use strict";function findInsertIndex(comparatorFn,arr,el){var i,len;for(i=0,len=arr.length;i<len;i++){if(comparatorFn(arr[i],el)>0){break}}return i}return findInsertIndex}()},{}],3:[function(require,module,exports){module.exports=function(){"use strict";function mergeSort(comparatorFn,arr){var len=arr.length,firstHalf,secondHalf;if(len>=2){firstHalf=arr.slice(0,len/2);secondHalf=arr.slice(len/2,len);return merge(comparatorFn,mergeSort(comparatorFn,firstHalf),mergeSort(comparatorFn,secondHalf))}else{return arr.slice()}}function merge(comparatorFn,arr1,arr2){var result=[],left1=arr1.length,left2=arr2.length;while(left1>0&&left2>0){if(comparatorFn(arr1[0],arr2[0])<=0){result.push(arr1.shift());left1--}else{result.push(arr2.shift());left2--}}if(left1>0){result.push.apply(result,arr1)}else{result.push.apply(result,arr2)}return result}return mergeSort}()},{}]},{},[1])(1)});
