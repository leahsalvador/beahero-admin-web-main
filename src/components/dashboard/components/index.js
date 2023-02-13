import React from 'react';
import { Row, Layout } from 'antd';
import './index.scss';

const Dashboard = () => {
  return (
    <Layout className='dashboard-container'>
      <Row>Home</Row>
    </Layout>
  );
};

export default Dashboard;

// function mapStateToProps(state) {
//     return {
//         // myPermissions: state.myPermissions.myPermissions,
//     }
// }

// function mapDispatchToProps(dispatch) {
//     return {
//         // onLoadCompany: (data) => dispatch(loadCompany(data))
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
