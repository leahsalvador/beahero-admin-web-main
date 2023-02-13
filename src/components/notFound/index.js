import React from 'react'
import './NotFound.scss'

import { Row, Result } from 'antd'

export const NotFound = () => (
  <Row
    type='flex'
    justify='center'
    align='middle'
    style={{ height: '90vh' }}
    className='sections'
  >
    <Result
      status='500'
      title='Page Not Found'
      subTitle='Sorry, this page is not available or under construction at the moment.'
      style={{}}
    />
  </Row>
)

export default NotFound
