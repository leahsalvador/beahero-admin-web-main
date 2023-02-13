import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Row, Col } from 'antd'
import Icon from '@ant-design/icons'
import './Footer.scss'
const archive = () => <img src='/icons/arrow.svg' />

const socialMedia = [
  {
    icon: 'facebook',
    link: 'https://www.facebook.com/yourteamAIS/'
  },
  {
    icon: archive,
    link:
      'https://www.linkedin.com/authwall?trk=bf&trkInfo=AQFAhK73g-rrjwAAAXEq8E5gRLMWXPj8tkhV1NIyi3u1l17IoUorF0SU2MV3f6uSDNGeR6eKENxjrzSrBZU46JDTYWL5fbor0nfqYo-4Py30XXnNKK2TRKYqfST-P7kazP40Kzk=&originalReferer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Fadvantage-insurance-solutions-teamais'
  },
  {
    icon: 'facebook',
    link: 'https://www.instagram.com/yourteam_ais/'
  },
  {
    icon: 'facebook',
    link: 'https://twitter.com/yourteam_ais'
  },
  {
    icon: 'facebook',
    link:
      'https://www.youtube.com/channel/UC9kp_tfn_izh0Ml5YMKGNUA?view_as=subscriber%5C'
  },
  {
    icon: 'facebook',
    link: 'https://www.pinterest.ph/yourteam_ais/'
  }
]

const otherNavigations = [
  {
    label: 'PIF',
    link: '/pif'
  },
  {
    label: 'Privacy',
    link: '/privacy'
  },
  {
    label: 'CCPA',
    link: 'https://www.caprivacy.org/'
  },
  {
    label: 'Site Map',
    link: '/site-map'
  },
  {
    label: 'Feedback',
    link: '/feedback'
  }
]

function Footer(props) {
  return (
    <div className='footer'>
      <Row
        className='footer-container'
        type='flex'
        align='center'
        gutter={[20, 10]}
      >
        <Col align='center' span={24}>
          © 2021 All Rights Reserved.
        </Col>
      </Row>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    // loggedIn: state.login.loggedIn,
  }
}

export default withRouter(connect(mapStateToProps, [])(Footer))
