import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { LeftOutlined } from '@ant-design/icons'

import 'react-lazy-load-image-component/src/effects/blur.css'

import { Row, Col } from 'antd'

import './Header.scss'

import { useMediaQuery } from 'react-responsive'

import { MenuDrawer } from '../MenuDrawer'

const Header = (props) => {
  const [active, setActive] = useState(true)
  const [menuDrawerVisible, setMenuDrawerVisible] = useState(false)

  const tablet = useMediaQuery({ query: '(max-width: 768px)' })

  const listenScrollEvent = (e) => {
    window.scrollY > 150 ? setActive(false) : setActive(true)
  }

  useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent)
  })

  return (
    <Col
      className='header'
      style={{ position: 'fixed' }}
    >
      <Row
        type='flex'
        justify='center'
        // align={!tablet ? 'bottom' : 'middle'}
        className='client-header-container'
      >
        <div className='back-btn'>
          <LeftOutlined style={{ fontSize: 30, color: '#0275FD' }} onClick={() => props.history.push(props.location.state ? props.location.state + props.location.search : 'products' + props.location.search)} />
        </div>
        <Col className='logo' />
      </Row>
    </Col>
  )
}

function mapStateToProps (state) {
  return {
    // loggedIn: state.login.loggedIn,
  }
}

export default withRouter(connect(mapStateToProps, [])(Header))
