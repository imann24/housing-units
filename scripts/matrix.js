/*
 * Author: Florian Block, Smith College, 2015
 * Description: Custom matrix class for transofmrations
 */

function Matrix(m, n) {
    this.m = m;
    this.n = n;
    this.data = [];
    for (var i = 0; i < n; i++) {
        var row = [];
        for (var j = 0; j < m; j++) {
            row.push(0);
        }
        this.data.push(row);
    }
}

Matrix.getRotation = function(a) {
    var rotation = new Matrix(3, 3);
    rotation.set(0, 0, Math.cos(a));
    rotation.set(1, 0, -Math.sin(a));
    rotation.set(0, 1, Math.sin(a));
    rotation.set(1, 1, Math.cos(a));
    rotation.set(2, 2, 1);
    return rotation;
}

Matrix.getRotationAt = function(a, x, y) {
    return Matrix.getTranslate(x, y).multiply(
            Matrix.getRotation(a).multiply (
                Matrix.getTranslate(-x, -y)));
}

Matrix.getScale = function(sx, sy) {
    var scale = new Matrix(3, 3);
    scale.set(0, 0, sx);
    scale.set(1, 1, sy);
    scale.set(2, 2, 1);
    return scale;
}

Matrix.getScaleAt = function(sx, sy, x, y) {
    return Matrix.getTranslate(x, y).multiply(
            Matrix.getScale(sx, sy).multiply (
                Matrix.getTranslate(-x, -y)));
}

Matrix.getTranslate = function(x, y) {
    var translate = new Matrix(3, 3);
    translate.set(0, 0, 1);
    translate.set(1, 1, 1);
    translate.set(2, 2, 1);
    translate.set(2, 0, x);
    translate.set(2, 1, y);
    return translate;
}

Matrix.fromPoint = function(p) {
    var point = new Matrix(1, 3);
    point.set(0, 0, p.x);
    point.set(0, 1, p.y);
    point.set(0, 2, 1);
    return point;
}

Matrix.prototype.set = function(m, n, value) {
    this.data[n][m] = value;
}

Matrix.prototype.get = function(m, n) {
    return this.data[n][m];
}

Matrix.prototype.getM = function() {
    return this.m;
}

Matrix.prototype.getN = function() {
    return this.n;
}

Matrix.prototype.multiply = function(matrix) {
    var isParamPoint = false;
    if (matrix instanceof Point) {
        isParamPoint = true;
        matrix = Matrix.fromPoint(matrix);
    }
    if (this.getM() != matrix.getN()) {
        throw "Matrix can't be multiplied";
    } else {
        var result = new Matrix(matrix.getM(), this.getN());
        for (var m = 0; m < result.getM(); m++) {
            for (var n = 0; n < result.getN(); n++) {
                var dotProduct = 0;
                for (var i = 0; i < this.getM(); i++) {
                    dotProduct += this.get(i, n) * matrix.get(m, i);
                }
                result.set(m, n, dotProduct);
            }
        }
        if (isParamPoint) {
            return new Point(result.get(0, 0), result.get(0, 1));
        } else {
            return result;
        }
    }
}

Matrix.prototype.toString = function() {
    var maxDigits = 0;
    for (var n = 0; n < this.data.length; n++) {
        for (var m = 0; m < this.data[n].length; m++) {
            var digits = Math.round(this.data[n][m]).toString().length;
            maxDigits = Math.max(maxDigits, digits);
        }
        returnString += outputLine + "\n";
    }

    var returnString = "";
    var brackets = " _";
    while (brackets.length < this.m * (maxDigits + 2) + (this.m - 1) + 2) {
        brackets += " ";
    }
    brackets += "_ \n";
    returnString += brackets;
    for (var n = 0; n < this.data.length; n++) {
        var outputLine = n < this.data.length - 1 ? "| " : "|_";
        for (var m = 0; m < this.data[n].length; m++) {
            var alignedValue = (Math.round(this.data[n][m] * 10) / 10)
                    .toString();
            if (!alignedValue.includes(".")) {
                alignedValue += ".0";
            }
            while (alignedValue.length < maxDigits + 2) {
                alignedValue = " " + alignedValue;
            }
            outputLine += alignedValue + (m < this.m - 1 ? " " : "");
        }
        returnString += outputLine +
                (n < this.data.length - 1 ? " |\n" : "_|\n");
    }
    return returnString;
}

Matrix.prototype.setGraphicsTransformation = function(g) {
    g.transform(
        this.get(0, 0),
        this.get(0, 1),
        this.get(1, 0),
        this.get(1, 1),
        this.get(2, 0),
        this.get(2, 1)
        );
}

Matrix.prototype.getScale = function() {
    return this.get(0, 0);
}

Matrix.prototype.getTranslation = function() {
    return new Point(this.get(2, 0), this.get(2, 1));
}

Matrix.prototype.getInverse = function() {
    var returnMatrix = new Matrix(this.m, this.n);
    var a11 = this.get(0, 0);
    var a12 = this.get(1, 0);
    var a13 = this.get(2, 0);
    var a21 = this.get(0, 1);
    var a22 = this.get(1, 1);
    var a23 = this.get(2, 1);
    var a31 = this.get(0, 2);
    var a32 = this.get(1, 2);
    var a33 = this.get(2, 2);
    var d = this.getDeterminant();

    var m00 = new Matrix(2, 2);
    m00.set(0, 0, a22);
    m00.set(1, 0, a23);
    m00.set(0, 1, a32);
    m00.set(1, 1, a33);

    var m10 = new Matrix(2, 2);
    m10.set(0, 0, a13);
    m10.set(1, 0, a12);
    m10.set(0, 1, a33);
    m10.set(1, 1, a32);

    var m20 = new Matrix(2, 2);
    m20.set(0, 0, a12);
    m20.set(1, 0, a13);
    m20.set(0, 1, a22);
    m20.set(1, 1, a23);

    var m01 = new Matrix(2, 2);
    m01.set(0, 0, a23);
    m01.set(1, 0, a21);
    m01.set(0, 1, a33);
    m01.set(1, 1, a31);

    var m11 = new Matrix(2, 2);
    m11.set(0, 0, a11);
    m11.set(1, 0, a13);
    m11.set(0, 1, a31);
    m11.set(1, 1, a33);

    var m21 = new Matrix(2, 2);
    m21.set(0, 0, a13);
    m21.set(1, 0, a11);
    m21.set(0, 1, a23);
    m21.set(1, 1, a21);

    var m02 = new Matrix(2, 2);
    m02.set(0, 0, a21);
    m02.set(1, 0, a22);
    m02.set(0, 1, a31);
    m02.set(1, 1, a32);

    var m12 = new Matrix(2, 2);
    m12.set(0, 0, a12);
    m12.set(1, 0, a11);
    m12.set(0, 1, a32);
    m12.set(1, 1, a31);

    var m22 = new Matrix(2, 2);
    m22.set(0, 0, a11);
    m22.set(1, 0, a12);
    m22.set(0, 1, a21);
    m22.set(1, 1, a22);

    returnMatrix.set(0, 0, m00.getDeterminant() / d);
    returnMatrix.set(1, 0, m10.getDeterminant() / d);
    returnMatrix.set(2, 0, m20.getDeterminant() / d);
    returnMatrix.set(0, 1, m01.getDeterminant() / d);
    returnMatrix.set(1, 1, m11.getDeterminant() / d);
    returnMatrix.set(2, 1, m21.getDeterminant() / d);
    returnMatrix.set(0, 2, m02.getDeterminant() / d);
    returnMatrix.set(1, 2, m12.getDeterminant() / d);
    returnMatrix.set(2, 2, m22.getDeterminant() / d);

    return returnMatrix;
}

Matrix.prototype.getDeterminant = function() {
    if (this.m == 2) {
        var a = this.get(0, 0);
        var b = this.get(1, 0);
        var c = this.get(0, 1);
        var d = this.get(1, 1);
        return a * d - b * c;
    } else if (this.m == 3) {
        var a = this.get(0, 0);
        var b = this.get(1, 0);
        var c = this.get(2, 0);
        var d = this.get(0, 1);
        var e = this.get(1, 1);
        var f = this.get(2, 1);
        var g = this.get(0, 2);
        var h = this.get(1, 2);
        var i = this.get(2, 2);
        return a * e * i + b * f * g + c * d * h - c * e * g - b * d * i -
                a * f * h;
    }
}
