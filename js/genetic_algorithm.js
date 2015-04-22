function Genetic(matix_throughput, size) {
	this.matix_throughput = matix_throughput;
	this.size = size;
	this.population = [];
}

Genetic.prototype.findBestPath = function() {
	this.population = this.generatePopulation();
	this.sortByThroughput();
	
	arr1 = [0, 1];
	arr11 = [0, 1];
	arr2 = [0, 1, 2];
	arr22 = [0, 4, 2];
	arr3 = [0, 2, 1, 4, 5, 3];
	arr33 = [0, 4, 1, 5, 2, 3];
	arr4 = [0, 1, 2, 3, 4];
	arr5 = [0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6];
	arr6 = [0, 7, 8, 9, 10, 11 ,6, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6];
	this.crossbreeding(arr3, arr33);
};



Genetic.prototype.crossbreeding = function(a, b) {
	var range = a.length / 2 - 1;
	x = randomNumberFromRange(2, range/2);
	y = randomNumberFromRange(range/2, range);
	if (x > y) { // swap
		x = [y, y = x][0];
	}
	exchangeElementArray(a, b, x, y);
	exchangeElementArray(a, b, 1, x - 1, true);
	exchangeElementArray(a, b, x + y, a.length - x - y - 1, true);
};

Genetic.prototype.mutation = function(a, b) {
	console.log(a);
	console.log(b);
	if (this.size < 3) return;
	new_node = randomNumberFromRange(1, this.size - 1);
	new_index = randomNumberFromRange(1, this.size - 1);
	

}

Genetic.prototype.sortByThroughput = function() {
	for (var i = this.size - 1; i > 0; --i) {
		for (var j = 0; j < i; ++j) {
			var a = this.population[j];
			var b = this.population[j+1];
			if (this.compareSumThoughput(a, b) > 0) {
				var tmp = this.population[j];
				this.population[j] = this.population[j+1];
				this.population[j+1] = tmp;
			}
		}
	}
};

Genetic.prototype.compareSumThoughput = function(a, b) {
	return this.countSumThroughput(a) - this.countSumThroughput(b);
};

Genetic.prototype.countSumThroughput = function(array) {
	var sum = 0;
	for (var i = 0; i < this.size; ++i) {
		sum += this.matix_throughput[array[i]][array[i+1]];
	}
	return sum;
};

Genetic.prototype.generatePopulation = function() {
	var arr = []
	for (var i = 0; i < this.size; ++i) {
		arr[i] = this.generateChromosome();
	}
	return arr;
};

Genetic.prototype.generateChromosome = function() {
	var arr = []
	for (var i = 0; i < this.size; ++i) {
		arr[i] = i;
	}
	shuffle(arr);
	arr.push(arr[0]);
	return arr;
};

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function randomNumberFromRange(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
};

function exchangeElementArray(a, b, x, y, reverse) {
	if (!reverse) reverse = false;
	part_a = a.splice(x, y);
	part_b = b.splice(x, y);

	if (reverse) {
		part_a.reverse();
		part_b.reverse();
	}

	console.log(part_a);
	console.log(part_b);
	a.splice.apply(a, [x, 0].concat(part_b));
	a.splice.apply(b, [x, 0].concat(part_a));
}


