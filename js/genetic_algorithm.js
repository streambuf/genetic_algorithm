function Genetic(matix_throughput, pointA, pointB) {
	this.matix_throughput = matix_throughput;
	this.population = [];
	this.pointA = pointA;
	this.pointB = pointB;
}

Genetic.prototype.findBestPath = function() {
	this.generatePopulation();
	debugger;
	//this.sortByThroughput();
	//this.crossbreeding(arr3, arr33);
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
	for (var i = 1; i < this.matix_throughput.length; ++i) {
		var arr = [];
		var count_chromosomes = Math.ceil(Math.log(i)) + 1;
		if (count_chromosomes % 2 == 1)
			count_chromosomes += 1;
		for (var j = 0; j < count_chromosomes; ++j) {
			arr.push(this.generateChromosome(i - 1));
		}
		this.population.push(arr);
	}
};

Genetic.prototype.generateChromosome = function(size) {
	var arr = []
	for (var i = 0; i < this.matix_throughput.length; ++i) {
		arr[i] = i;
	}
	arr.splice(this.pointA, 1);
	arr.splice(this.pointB - 1, 1);
	shuffle(arr);
	var res = []
	res.push(this.pointA);
	for (var i = 0; i < size; ++i) {
		res.push(arr[i]);
	}
	res.push(this.pointB);
	return res;
};

function swap(array, ind1, ind2) {
	var tmp = array[ind1];
	array[ind1] = array[int2];
	array[ind2] = tmp;
}

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


