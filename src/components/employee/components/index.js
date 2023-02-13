import React from 'react';
import { Row, Layout } from 'antd';
// import './index.scss'

const Employee = () => {
  return (
    <Layout className='Employee-container'>
      <Row>Employee1</Row>
    </Layout>
  );
};

export default Employee;

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

// export default connect(mapStateToProps, mapDispatchToProps)(Employee)
