// canvas 文档对象模型
import Element from './Element'

const doc = [
  {
    id: 1,
    ele: new Element(0, 0, 100, 100),
    children: [
      {
        id: 11,
        ele: new Element(0, 0, 20, 20)
      },
      {
        id: 12,
        ele: new Element(20, 20, 30, 30)
      }
    ]
  },
  {
    id: 2,
    ele: new Element(100, 100, 100, 100),
    children: [
      {
        id: 21,
        ele: new Element(0, 0, 20, 20)
      },
      {
        id: 22,
        ele: new Element(20, 20, 30, 30)
      }
    ]
  }
]
