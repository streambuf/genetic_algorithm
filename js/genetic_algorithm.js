function Genetic(matix_throughput, pointA, pointB) {
	this.matix_throughput = matix_throughput;
	this.population = [];
	this.pointA = pointA;
	this.pointB = pointB;
	this.mutation_probability = 10; // %
}

Genetic.prototype.findBestPath = function(callback) {
	this.generatePopulation();
	this.sortByThroughput();
	var best_path = this.getBestPath();
	var best_thoughput = this.countSumThroughput(best_path);
	for (var i = 0; i < 1000; ++i) {

		this.crossbreedingPopulatioin();
		this.sortByThroughput();
		var cur_best_path = this.getBestPath();
		var cur_thoughput = this.countSumThroughput(cur_best_path);

		if (cur_thoughput < best_thoughput) {
			best_thoughput = cur_thoughput;
			best_path = cur_best_path;
		}

		this.mutationPopulatioin();
		this.sortByThroughput();
		cur_best_path = this.getBestPath();
		cur_thoughput = this.countSumThroughput(cur_best_path);

		if (cur_thoughput < best_thoughput) {
			best_thoughput = cur_thoughput;
			best_path = cur_best_path;
		}

		console.log(this.countSumThroughput(best_path));
		
	}

	callback(best_path);
	console.log(this.countSumThroughput(best_path));
};

Genetic.prototype.compareBestPath = function(a, b) {

	if (this.countSumThroughput(a) > this.countSumThroughput(b)) {
		console.log(this.countSumThroughput(a) + ' ' + this.countSumThroughput(b));
		return true;
	}
	return false;
}


Genetic.prototype.getBestPath = function() {
	var best_path = this.population[0][0].slice(0);
	for (var i = 1; i < this.population.length; ++i) {
		var cur_path = this.population[i][0];
		if (this.countSumThroughput(best_path) > this.countSumThroughput(cur_path)) {
			best_path = cur_path.slice(0);
		}
	}
	return best_path.reverse();
};

Genetic.prototype.crossbreedingPopulatioin = function() {
	for (var i = 0; i < this.population.length; ++i) {
		for (var j = 0; j < this.population[i].length; j += 2) {
			this.crossbreeding(this.population[i][j], this.population[i][j+1]);
		}
	}
}

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

Genetic.prototype.mutationPopulatioin = function() {
	for (var i = 0; i < this.population.length; ++i) {
		for (var j = 0; j < this.population[i].length; ++j) {
			if (this.mutationProbability()) {
				this.mutation(this.population[i][j]);
			}
		}
	}
}

Genetic.prototype.mutation = function(chromosome) {
	if (chromosome.length < 3) return;
	
	var arr = []
	for (var i = 0; i < this.matix_throughput.length; ++i) {
		arr[i] = i;
	}

	arr.splice(this.pointA, 1);
	arr.splice(this.pointB - 1, 1);

	var rand = [];
	for (var i = 0; i < arr.length; ++i) {
	 	if (chromosome.indexOf(arr[i]) == -1) {
	 		rand.push(arr[i]);
	 	}  
	}

	chromosome_index = randomNumberFromRange(1, chromosome.length - 2);
	
	if (rand.length > 0) {
		var rand_index = randomNumberFromRange(0, rand.length - 1);
		chromosome[chromosome_index] = rand[rand_index];
	} else {
		var ind1 = randomNumberFromRange(1, chromosome.length - 2);
		var ind2 = randomNumberFromRange(1, chromosome.length - 2);
		swap(chromosome, ind1, ind2);
	}
}

Genetic.prototype.mutationProbability = function() {
	var random = randomNumberFromRange(1, 100);
	if (random <= this.mutation_probability) {
		return true;
	}
	return false;
}

Genetic.prototype.sortByThroughput = function() {
	for (var k = 0; k < this.population.length; ++k) {
		for (var i = this.population[k].length - 1; i > 0; --i) {
			for (var j = 0; j < i; ++j) {
				var a = this.population[k][j];
				var b = this.population[k][j+1];
				if (this.compareSumThoughput(a, b) > 0) {
					var tmp = this.population[k][j];
					this.population[k][j] = this.population[k][j+1];
					this.population[k][j+1] = tmp;
				}
			}
		}
	}
};

Genetic.prototype.compareSumThoughput = function(a, b) {
	return this.countSumThroughput(a) - this.countSumThroughput(b);
};

Genetic.prototype.countSumThroughput = function(array) {
	var sum = 0;
	for (var i = 0; i < array.length - 1; ++i) {
		sum += parseInt(this.matix_throughput[array[i]][array[i+1]]);
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
	array[ind1] = array[ind2];
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

	a.splice.apply(a, [x, 0].concat(part_b));
	a.splice.apply(b, [x, 0].concat(part_a));
}


