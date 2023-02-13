import React from 'react';
import { Row, Col, Layout, Table } from 'antd';

import './index.scss';

const columns = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Net Sales',
    dataIndex: 'netSales',
    key: 'netSales',
  },
  {
    title: 'Expenses',
    dataIndex: 'expenses',
    key: 'expenses',
  },
  {
    title: 'Net Profit',
    dataIndex: 'netProfit',
    key: 'netProfit',
  },
];

const data = [
  {
    date: '01-30-2021',
    netSales: '80,304.50',
    expenses: '23,001.50',
    netProfit: '60,500.50',
  },
  {
    date: '01-29-2021',
    netSales: '83,304.50',
    expenses: '23,001.50',
    netProfit: '64,500.50',
  },
  {
    date: '01-28-2021',
    netSales: '83,304.50',
    expenses: '23,001.50',
    netProfit: '50,500.50',
  },
];

const ProfitAndLost = ({ onFetchCustomers, customers, loading }) => {
  // useEffect(() => {
  //   onFetchCustomers();
  // }, []);

  return (
    <Layout className='profit-and-lost-container'>
      {/* <Row justify="space-between" align="bottom" className="page-header">
        <Col>Profit and Lost</Col>
      </Row> */}
      <Row>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={data}
            loading={false}
            size='small'
          />
        </Col>
      </Row>
    </Layout>
  );
};

export default ProfitAndLost;

// function mapStateToProps(state) {
//   return {
//     customers: state.customers.customersData,
//     loading: state.customers.customersLoading,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     onFetchCustomers: (data) => dispatch(fetchCustomers(data)),
//   };
// }

// export default connect(mapStateToProps, mapDispatchToProps)(ProfitAndLost);
