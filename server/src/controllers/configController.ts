import { Request, Response } from 'express';
import { ConfigModel } from '../models/config';
import * as XLSX from 'xlsx';

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
    
    // Prepare worksheet data
    const worksheetData = data.map(item => ({
      '配置名称': item.name,
      '状态': item.status === 'normal' ? '正常' : item.status === 'warning' ? '预警' : '异常',
      '配送状态': item.deliveryStatus === 'delivered' ? '已送达' : 
                 item.deliveryStatus === 'delivering' ? '送达中' : '未送达',
      '升级状态': item.upgradeDeliveryStatus === 'upgraded' ? '已升级' : '未升级',
      '累计配送数': item.totalDelivery,
      '配送率': `${Math.round(item.deliveryRate)}%`,
      '升级率': `${Math.round(item.upgradeRate)}%`,
      '最后配送时间': item.lastDeliveryTime ? new Date(item.lastDeliveryTime).toLocaleString() : '无',
      '创建时间': new Date(item.createdAt).toLocaleString(),
      '更新时间': new Date(item.updatedAt).toLocaleString()
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    // Set column widths
    const colWidths = [
      { wch: 20 }, // 配置名称
      { wch: 10 }, // 状态
      { wch: 10 }, // 配送状态
      { wch: 10 }, // 升级状态
      { wch: 12 }, // 累计配送数
      { wch: 10 }, // 配送率
      { wch: 10 }, // 升级率
      { wch: 20 }, // 最后配送时间
      { wch: 20 }, // 创建时间
      { wch: 20 }  // 更新时间
    ];
    worksheet['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, '配置管理数据');

    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    
    // Set response headers with proper encoding
    const filename = `config_data_${new Date().getTime()}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(filename)}`);
    
    // Send Excel file
    res.send(excelBuffer);
  } catch (error) {
    console.error('导出数据失败:', error);
    res.status(500).json({ message: '导出数据失败' });
  }
}; 