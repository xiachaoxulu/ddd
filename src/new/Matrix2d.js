export default class Matrix2D {
  // 给定一个矩阵和点 算出这个点在经过该矩阵变化之后的结果
  static transformPoint(matrix, point) {
    let pt = {};
    pt.x = point.x * matrix.a + point.y * matrix.c + matrix.e;
    pt.y = point.x * matrix.b + point.y * matrix.d + matrix.f;
    return pt;
  }
  // 该点是经过矩阵变化之后的结果，算出变化之前的结果
  static invertTransformPoint(matrix, point) {
    // 先求出该矩阵的转置矩阵
    let invertMatrix = {};

    let a1 = matrix.a;
    let b1 = matrix.b;
    let c1 = matrix.c;
    let d1 = matrix.d;
    let e = matrix.e;
    let n = a1 * d1 - b1 * c1;

    invertMatrix.a = d1 / n;
    invertMatrix.b = -b1 / n;
    invertMatrix.c = -c1 / n;
    invertMatrix.d = a1 / n;
    invertMatrix.e = (c1 * matrix.f - d1 * e) / n;
    invertMatrix.f = -(a1 * matrix.f - b1 * e) / n;

    return Matrix2D.transformPoint(invertMatrix, point);
  }
}
