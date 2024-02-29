class Plot {
    constructor(id, idContainer, scale, width, height) {
        this.scale = scale === undefined ? 1 : scale;
        this.baseSizeUnit = 20;
        this.width = width;
        this.height = height;
        this.idContainer = idContainer;
        this.id = id;
        this.context = undefined;
        this.Init(this.idContainer, this.width, this.height);
    }

    GetContext() {
        if (this.context)
            return this.context;
        let currentCanvas = document.getElementById(this.id);
        if (!currentCanvas)
            throw new Error("Не удалось найти холст для получения контекста");
        return currentCanvas.getContext("2d");
    }

    DrawLine(x1, y1, x2, y2, strokeStyle) {
        let context = this.GetContext();
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.strokeStyle = strokeStyle;
        context.stroke();
    }

    DrawTriangle(x1, y1, x2, y2, x3, y3, fillStyle) {
        let context = this.GetContext();
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(x3, y3);
        context.fillStyle = fillStyle;
        context.fill();
    }

    DrawPoint(x, y, r, inArea) {
        let centerY = this.height / 2;
        let centerX = this.width / 2;
        let context = this.GetContext();
        x = x + centerX;
        y = centerY - y;
        //x = x * this.scale / (r / R) + canvas.width / 2
        //y = -y * this.scale / (r / R) + canvas.width / 2
        context.beginPath()
        console.log("Point" + x + ":" + y);
        context.arc(x, y, this.baseSizeUnit / 4, 0, 2 * Math.PI, false)
        context.fillStyle = inArea ? "yellow" : "grey"
        context.fill()
    }

    DrawText(content, x, y, fillStyle) {
        let context = this.GetContext();
        context.fillStyle = fillStyle;
        context.fillText(content, x, y);
    }

    DrawXAxis(lineLength, isScaled) {
        if (!lineLength)
            throw new Error("Не указана длина делений по X");
        let centerY = this.height / 2;
        this.DrawLine(0, centerY, this.width, centerY);
        this.DrawTriangle(this.width, centerY
            , this.width - 2 * this.baseSizeUnit, centerY - lineLength / 2
            , this.width - 2 * this.baseSizeUnit, centerY + lineLength / 2,
            "black");

        if (isScaled) {
            // Рисование делений на оси X
            for (var i = 1; i < this.width / (this.scale * this.baseSizeUnit) - 1; i++) {
                var x = i * this.scale * this.baseSizeUnit;
                this.DrawLine(x, centerY - lineLength / 2, x, centerY + lineLength / 2);
            }
        } else {
            for (let x = 0; x < this.width - this.baseSizeUnit; x += this.baseSizeUnit)
                this.DrawLine(x, centerY - lineLength / 2, x, centerY + lineLength / 2);
        }
        this.DrawText("X", this.width - 20, centerY - 10, "black");

    }

    DrawYAxis(lineLength, isScaled) {
        if (!lineLength)
            throw new Error("Не указана длина делений по Y");
        let centerX = this.width / 2;
        this.DrawLine(centerX, 0, centerX, this.height);
        this.DrawTriangle(centerX, 0,
            centerX - lineLength / 2, 2 * this.baseSizeUnit,
            centerX + lineLength / 2, 2 * this.baseSizeUnit,
            "black");

        if (isScaled) {
            // Рисование делений на оси Y
            for (var i = 2; i < this.height / (this.scale * this.baseSizeUnit) - 1; i++) {
                var y = i * this.scale * this.baseSizeUnit;
                this.DrawLine(centerX - lineLength / 2, y, centerX + lineLength / 2, y);
            }
        } else {
            for (let y = 2 * this.baseSizeUnit; y < this.height; y += this.baseSizeUnit) {
                this.DrawLine(centerX - lineLength / 2, y, centerX + lineLength / 2, y);
            }
        }
        this.DrawText("Y", centerX + 20, 30, "black");
    }

    Init(idContainer, width, height) {
        if (!idContainer) {
            throw new Error("Не передан идентификатор контейнера для холста");
        }
        let container = document.getElementById(idContainer);
        if (!container) {
            throw new Error("Контейнер с идентификатором '" + idContainer + "' не найден");
        }
        if (!this.id) {
            throw new Error("Не указан идентификатор холста");
        }
        var oldCanvas = document.getElementById(this.id);
        if (oldCanvas) {
            console.log("Холст обновлен, старая версия холста удалена");
            oldCanvas.parentNode.removeChild(oldCanvas);
        }

        // Создаем элемент canvas
        var canvas = document.createElement("canvas");
        canvas.id = this.id;

        // Добавляем обработчик события 'click' к элементу canvas
        canvas.addEventListener('click', (event) => {
            // Получаем координаты щелчка относительно верхнего левого угла canvas
            // let x = (event.offsetX - this.height / 2) / this.baseSizeUnit;
            // let y = (this.width / 2 - event.offsetY) / this.baseSizeUnit;
            let x = (event.offsetX - this.height / 2);
            let y = (this.width / 2 - event.offsetY);

            // Выводим координаты в консоль
            console.log('Координаты щелчка: x = ' + x + ', y = ' + y, ', r=' +  this.scale * this.baseSizeUnit);
            shoot([{name: 'x', value: x}, {name: 'y', value: y}, {name: 'r', value: this.scale * this.baseSizeUnit}])
        });

        this.context = canvas.getContext("2d");
        // Устанавливаем его ширину и высоту
        canvas.width = width;
        canvas.height = height;

        // Заливаем холст белым цветом
        this.context.fillStyle = "white";
        this.context.fillRect(0, 0, width, height);

        this.DrawXAxis(this.baseSizeUnit, false);
        this.DrawYAxis(this.baseSizeUnit, false);

        // Вставляем холст в контейнер
        container.appendChild(canvas);
    }

    ChangeScale(scale) {
        if (scale <= 0)
            throw new Error("Масштаб графика больше быть больше 0");
        this.scale = scale;
        this.Init(this.idContainer, this.width, this.height);
    }

    Clear() {
        let context = this.GetContext();
        // Очищаем холст, удаляя его содержимое
        context.clearRect(0, 0, this.width, this.height);
    }

    DrawScene() {
        //this.Clear();
        //this.DrawXAxis(this.baseSizeUnit, false);
        //this.DrawYAxis(this.baseSizeUnit,false);
        this.Init(this.idContainer, this.width, this.height);

        let centerY = this.height / 2;
        let centerX = this.width / 2;
        let context = this.GetContext();
        let R = this.baseSizeUnit * this.scale;
        // Добавление меток


        //context.fillText("R", centerX + R, centerY + R / 3);

        context.fillStyle = "rgba(20, 60, 200, 0.5)"; // Голубой с прозрачностью 0.5
        context.fillRect(centerX, centerY, -R, R / 2); // Прямоуугольник


        // Треугольник
        var x1 = centerX; // Горизонтальная линия начинается в центре
        var y1 = centerY; // Вниз

        var x2 = centerX - R / 2; // Влево
        var y2 = centerY;

        var x3 = centerX;
        var y3 = centerY - R; // Вверх

        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(x3, y3);
        context.closePath();
        context.fill();

        //Четверть круга
        context.beginPath();
        context.arc(centerX, centerY, R, -Math.PI / 2, 0); // Координаты (200, 200), радиус 100, угол от 0 до Pi/2 (четверть круга)
        context.lineTo(centerX, centerY); // Соединить с центром для закрытия фигуры
        context.closePath(); // Завершить четверть круга
        context.fill();

        //отрисовка точек
        const shotRows = document.querySelectorAll('#shot_table tbody tr')
        console.log(shotRows);
        shotRows.forEach(row => {
            const cells = row.querySelectorAll('td')
            if (cells.length !== 4) return

            // Получаем ссылку на скрытое поле, содержащее координаты
            const hiddenInput = cells[1].querySelector('input[type="hidden"]');
            // Читаем значение скрытого поля
            const [x, y, r] = hiddenInput.value.trim().slice(1, -1).split(';').map(Number);

            // const [x, y, r] = cells[1].innerText.trim().slice(1, -1).split(';').map(Number);
            //if (r === shotR) drawPoint(x, y, r, cells[3].innerText === "In");
            this.DrawPoint(x * (R / r), y * (R / r), r, cells[3].innerText === "In");
        })
    }
}