export const betsExamples = {
  listBetsResponse: {
    value: {
      data: [
        {
          id: 31,
          tokenSnapshotId: 33,
          duration: 259200,
          betType: 'liquidity',
          status: 'approved',
          wageringStyle: 'individual',
          transactionHash:
            '0x136e6d103cea28f8e0b60048f4f69f4834e228459dc7642a855a8f79b0b84eee',
          originatorId: 1,
          index: 23,
          value: '0',
          auxiliaryValue: 0,
          option: 'Liquidity',
          startDate: '2024-02-26T03:00:00.000Z',
          createdAt: '2024-02-25T18:09:38.740Z',
          updatedAt: '2024-02-25T18:09:49.313Z',
        },
        {
          id: 30,
          tokenSnapshotId: 32,
          duration: 950400,
          betType: 'volume',
          status: 'approved',
          wageringStyle: 'group',
          transactionHash:
            '0x98446f7221492782144d5022c50a5d72446e56b762f9f709d39b8131858cd6d4',
          originatorId: 1,
          index: 20,
          value: '10',
          auxiliaryValue: 10,
          option: 'less',
          startDate: '2024-02-26T00:00:00.000Z',
          createdAt: '2024-02-25T17:29:01.899Z',
          updatedAt: '2024-02-25T17:29:24.991Z',
        },
      ],
      pageCount: 2,
      page: 2,
      pageSize: 5,
      total: 7,
    },
  },
  invalidQueryParamsListBetsResponse: {
    value: {
      issues: [
        {
          code: 'invalid_type',
          expected: 'number',
          received: 'nan',
          path: ['page'],
          message: 'Expected number, received nan',
        },
        {
          code: 'invalid_type',
          expected: 'number',
          received: 'nan',
          path: ['pageSize'],
          message: 'Expected number, received nan',
        },
        {
          received: 'DESCS',
          code: 'invalid_enum_value',
          options: ['ASC', 'DESC'],
          path: ['order', 'index'],
          message:
            "Invalid enum value. Expected 'ASC' | 'DESC', received 'DESCS'",
        },
      ],
      name: 'ZodError',
    },
  },
  betsSummaryResponse: {
    value: {
      activeBets: {
        data: [
          {
            count: '1',
            month: '2023-03',
          },
          {
            count: '1',
            month: '2023-04',
          },
          {
            count: '1',
            month: '2023-05',
          },
          {
            count: '1',
            month: '2023-06',
          },
          {
            count: '1',
            month: '2023-07',
          },
          {
            count: '1',
            month: '2023-08',
          },
          {
            count: '1',
            month: '2023-09',
          },
          {
            count: '1',
            month: '2023-10',
          },
          {
            count: '1',
            month: '2023-11',
          },
          {
            count: '1',
            month: '2023-12',
          },
          {
            count: '2',
            month: '2024-01',
          },
          {
            count: '1',
            month: '2024-02',
          },
        ],
        total: 13,
      },
      valueLocked: {
        data: [
          {
            totalValue: '10',
            month: '2023-03',
          },
          {
            totalValue: '89',
            month: '2023-04',
          },
          {
            totalValue: '138',
            month: '2023-05',
          },
          {
            totalValue: '175',
            month: '2023-06',
          },
          {
            totalValue: '210',
            month: '2023-07',
          },
          {
            totalValue: '35',
            month: '2023-08',
          },
          {
            totalValue: '70',
            month: '2023-09',
          },
          {
            totalValue: '120',
            month: '2023-10',
          },
          {
            totalValue: '80',
            month: '2023-11',
          },
          {
            totalValue: '180',
            month: '2023-12',
          },
          {
            totalValue: '130',
            month: '2024-01',
          },
          {
            totalValue: '10',
            month: '2024-02',
          },
        ],
        total: 1247,
      },
    },
  },
  invalidQueryParamsBetsSummaryResponse: {
    value: {
      issues: [
        {
          code: 'invalid_string',
          validation: {
            startsWith: '0x',
          },
          message: 'Invalid input: must start with "0x"',
          path: ['wallet'],
        },
      ],
      name: 'ZodError',
    },
  },
};
