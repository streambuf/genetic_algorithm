Генетический алгоритм
===================
Выбранная предметная область – кратчайший путь пакета в сети 
Оцениваются пропускные способности каналов связи (по матрице времени передачи между двумя узлами) и с помощью генетического алгоритма выбирается лучший путь.

Алгоритм
------------
Алгоритм отбора: все существующие хромосомы сортируются по времени передачи пакета и всё. Плохие не отбрасываются, т.к. иногда плохие хромосомы могут дать хорошее потомство. Да и размер популяции в моем алгоритме слишком, чтобы можно было уничтожать плохие хромосомы.

Было применено частично отображаемое скрещивание: для двух родительских хромосом   случайным образом находим две точки разрыва. Первая и последняя позиции в операции не участвуют, т.к. узлы отправления и доставки менять нельзя. Вначале производим обмен частей находящихся между точками разрыва. Затем расставляем оставшиеся позиции от  соответствующих хромосом слева направо.

Алгоритм мутации: если путь не содержит всех узлов, то генерируем случайный узел, который он еще не содержит и заменяем на случайный узел хромосомы. Иначе меняем два случайных узла местами. Мутация применяется к хромосоме с определенной вероятностью. (5-10%).

Использование
------------
Для запуска программы необходимо открыть Index.html с помощью браузера. 

С помощью мышки занести в поле канваса необходимое количество узлов сети.

Для задания времени передачи одного пакета между узлами, необходимо нажать кнопку "Создать матрицу пропускных способностей узлов".

Для каждой пары узлов сгенерируется рандомное время передачи пакета. Но эти значения можно изменять.

Нажав кнопку "Начать поиск", увидим наилучший маршрут для передачи пакета.

Скриншоты
--------------------------
![Alt text](https://github.com/streambuf/genetic_algorithm/blob/master/screenshots/1.JPG?raw=true "")
![Alt text](https://github.com/streambuf/genetic_algorithm/blob/master/screenshots/2.JPG?raw=true "")