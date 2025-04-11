import { Request, Response } from 'express';
import { ConfigModel } from '../models/config';

export const getConfigList = async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = 10, search = '' } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    
    const [data, total] = await Promise.all([
      ConfigModel.find(query)
        .skip(skip)
        .limit(Number(pageSize))
        .lean(),
      ConfigModel.countDocuments(query)
    ]);

    const statistics = await ConfigModel.aggregate([
      {
        $group: {
          _id: null,
          totalConfigs: { $sum: 1 },
          normalConfigs: {
            $sum: {
              $cond: [{ $eq: ['$status', 'normal'] }, 1, 0]
            }
          },
          warningConfigs: {
            $sum: {
              $cond: [{ $eq: ['$status', 'warning'] }, 1, 0]
            }
          },
          errorConfigs: {
            $sum: {
              $cond: [{ $eq: ['$status', 'error'] }, 1, 0]
            }
          },
          deliveryCount: { $sum: '$totalDelivery' },
          deliveryRate: { $avg: '$deliveryRate' },
          upgradeRate: { $avg: '$upgradeRate' }
        }
      }
    ]);

    const monthlyChanges = await ConfigModel.aggregate([
      {
        $group: {
          _id: null,
          configs: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', new Date(new Date().setMonth(new Date().getMonth() - 1))] },
                1,
                0
              ]
            }
          },
          delivery: {
            $sum: {
              $cond: [
                { $gte: ['$lastDeliveryTime', new Date(new Date().setMonth(new Date().getMonth() - 1))] },
                1,
                0
              ]
            }
          },
          upgrade: {
            $sum: {
              $cond: [
                { $eq: ['$upgradeDeliveryStatus', 'upgraded'] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    res.json({
      data,
      total,
      statistics: {
        ...statistics[0],
        monthlyChange: monthlyChanges[0]
      }
    });
  } catch (error) {
    res.status(500).json({ message: '获取配置数据失败' });
  }
};

export const getGovernanceData = async (req: Request, res: Response) => {
  try {
    const data = await ConfigModel.aggregate([
      {
        $group: {
          _id: null,
          normal: {
            $sum: {
              $cond: [{ $eq: ['$status', 'normal'] }, 1, 0]
            }
          },
          warning: {
            $sum: {
              $cond: [{ $eq: ['$status', 'warning'] }, 1, 0]
            }
          },
          error: {
            $sum: {
              $cond: [{ $eq: ['$status', 'error'] }, 1, 0]
            }
          },
          others: {
            $sum: {
              $cond: [
                {
                  $not: [
                    {
                      $in: [
                        '$status',
                        ['normal', 'warning', 'error']
                      ]
                    }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    res.json(data[0] || { normal: 0, warning: 0, error: 0, others: 0 });
  } catch (error) {
    res.status(500).json({ message: '获取治理数据失败' });
  }
};

export const getDeliveryData = async (req: Request, res: Response) => {
  try {
    const data = await ConfigModel.aggregate([
      {
        $group: {
          _id: null,
          delivered: {
            $sum: {
              $cond: [{ $eq: ['$deliveryStatus', 'delivered'] }, 1, 0]
            }
          },
          delivering: {
            $sum: {
              $cond: [{ $eq: ['$deliveryStatus', 'delivering'] }, 1, 0]
            }
          },
          undelivered: {
            $sum: {
              $cond: [{ $eq: ['$deliveryStatus', 'undelivered'] }, 1, 0]
            }
          },
          others: {
            $sum: {
              $cond: [
                {
                  $not: [
                    {
                      $in: [
                        '$deliveryStatus',
                        ['delivered', 'delivering', 'undelivered']
                      ]
                    }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    res.json(data[0] || { delivered: 0, delivering: 0, undelivered: 0, others: 0 });
  } catch (error) {
    res.status(500).json({ message: '获取配送数据失败' });
  }
};

export const exportConfigData = async (req: Request, res: Response) => {
  try {
    const { search = '' } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    
    const data = await ConfigModel.find(query).lean();
    
    // 这里需要实现导出Excel的逻辑
    // 可以使用 xlsx 库来生成 Excel 文件
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=config_data_${Date.now()}.xlsx`);
    
    // 发送Excel文件
    // res.send(excelBuffer);
  } catch (error) {
    res.status(500).json({ message: '导出数据失败' });
  }
}; 