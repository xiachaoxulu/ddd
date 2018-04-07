export default class Matrix2D {
  /**
   * 生成一个3*3矩阵
   */
  static create() {
    return new Float32Array(9)
  }
  /**
   * 初始化矩阵
   * @param {*} 初始化前的dest
   */
  static identity(dest) {
    dest[0] = 1
    dest[1] = 0
    dest[2] = 0
    dest[3] = 0
    dest[4] = 1
    dest[5] = 0
    dest[6] = 0
    dest[7] = 0
    dest[8] = 1
    return dest
  }
  /**
   * 矩阵相乘
   * @param {*} mat1 原始矩阵 在左
   * @param {*} mat2 乘数矩阵 在右
   * @return dest 结果
   */
  static multiply(mat1, mat2) {
    let dest = new Float32Array(9)
    let a = mat1[0],
      b = mat1[1],
      c = mat1[2],
      d = mat1[3],
      e = mat1[4],
      f = mat1[5],
      g = mat1[6],
      h = mat1[7],
      i = mat1[8],
      A = mat2[0],
      B = mat2[1],
      C = mat2[2],
      D = mat2[3],
      E = mat2[4],
      F = mat2[5],
      G = mat2[6],
      H = mat2[7],
      I = mat2[8]
    dest[0] = A * a + B * d + C * g
    dest[1] = A * b + B * e + C * h
    dest[2] = A * c + B * f + C * i
    dest[3] = D * a + E * d + F * g
    dest[4] = D * b + E * e + F * h
    dest[5] = D * c + E * f + F * i
    dest[6] = G * a + H * d + I * g
    dest[7] = G * b + H * e + I * h
    dest[8] = G * c + H * f + I * i
    return dest
  }
  /**
   * 缩放矩阵
   * @param {*} mat 原始矩阵
   * @param {*} vec
   * @return dest 结果
   */
  static scale(mat, vec) {
    let dest = new Float32Array(9)
    dest[0] = mat[0] * vec[0]
    dest[1] = mat[1]
    dest[2] = mat[2]
    dest[3] = mat[3]
    dest[4] = mat[4] * vec[1]
    dest[5] = mat[5]
    dest[6] = mat[6]
    dest[7] = mat[7]
    dest[8] = mat[8]
    return dest
  }
  /**
   * 平移矩阵
   * @param {*} mat 原始矩阵
   * @param {*} vec
   * @return dest 结果
   */

  static translate(mat, vec) {
    let dest = new Float32Array(9)
    dest[0] = mat[0]
    dest[1] = mat[1]
    dest[2] = mat[2] + vec[0]
    dest[3] = mat[3]
    dest[4] = mat[4] + vec[1]
    dest[5] = mat[5]
    dest[6] = mat[6]
    dest[7] = mat[7]
    dest[8] = mat[8]
    return dest
  }
  /**
   * 旋转矩阵
   * @param {*} mat 原始矩阵
   * @param {*} angle 角度
   * @return dest 结果
   */

  static rotate(mat, angle) {
    let dest = new Float32Array(9)
    dest[0] = mat[0] * Math.cos(Math.PI / 180 * angle)
    dest[1] = -mat[1] * Math.sin(Math.PI / 180 * angle)
    dest[2] = mat[2]
    dest[3] = mat[3] * Math.sin(Math.PI / 180 * angle)
    dest[4] = mat[4] * Math.cos(Math.PI / 180 * angle)
    dest[5] = mat[5]
    dest[6] = mat[6]
    dest[7] = mat[7]
    dest[8] = mat[8]
    return dest
  }
}
